import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { z } from 'zod';
import client from 'prom-client';

const { Pool } = pg;

const PORT = Number(process.env.PORT || 8080);
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

if (!DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!JWT_SECRET) throw new Error('JWT_SECRET is required');

const pool = new Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: FRONTEND_ORIGIN === '*' ? true : FRONTEND_ORIGIN,
    credentials: true,
  }),
);

// Prometheus metrics
client.collectDefaultMetrics();
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const route = req.route?.path ? String(req.route.path) : req.path;
    httpRequestDurationMs
      .labels(req.method, route, String(res.statusCode))
      .observe(Date.now() - start);
  });
  next();
});

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const header = req.get('Authorization') || '';
  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/auth/signup', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(1),
    phone_number: z.string().optional().nullable(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { email, password, full_name, phone_number } = parsed.data;
  const password_hash = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO public.users (email, password_hash, full_name, phone_number)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, phone_number`,
      [email, password_hash, full_name, phone_number ?? null],
    );
    const user = userResult.rows[0];
    await client.query(
      `INSERT INTO public.profiles (id, full_name, phone_number, email, monthly_report_enabled)
       VALUES ($1, $2, $3, $4, false)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.full_name, user.phone_number, user.email],
    );
    await client.query('COMMIT');

    const token = signToken({ sub: user.id, email: user.email });
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (e) {
    await client.query('ROLLBACK');
    const msg = String(e?.message || '');
    if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/auth/login', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { email, password } = parsed.data;
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM public.users WHERE email = $1',
    [email],
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const { rows } = await pool.query(
    'SELECT id, email, full_name, phone_number FROM public.users WHERE id = $1',
    [userId],
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, phone_number: user.phone_number } });
});

app.get('/profiles/me', authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const { rows } = await pool.query('SELECT * FROM public.profiles WHERE id = $1', [userId]);
  return res.json(rows[0] ?? null);
});

// Generic table CRUD helpers (scoped by user_id)
function crudRoutes({ table, orderBy }) {
  app.get(`/${table}`, authMiddleware, async (req, res) => {
    const userId = req.user.sub;
    const q = `SELECT * FROM public.${table} WHERE user_id = $1 ORDER BY ${orderBy}`;
    const { rows } = await pool.query(q, [userId]);
    return res.json(rows);
  });

  app.post(`/${table}`, authMiddleware, async (req, res) => {
    const userId = req.user.sub;
    const payload = req.body || {};
    const keys = Object.keys(payload);
    const cols = ['user_id', ...keys];
    const vals = [userId, ...keys.map((k) => payload[k])];
    const params = cols.map((_, i) => `$${i + 1}`).join(',');

    const sql = `INSERT INTO public.${table} (${cols.join(',')}) VALUES (${params}) RETURNING *`;
    const { rows } = await pool.query(sql, vals);
    return res.status(201).json(rows[0]);
  });

  app.patch(`/${table}/:id`, authMiddleware, async (req, res) => {
    const userId = req.user.sub;
    const id = req.params.id;
    const payload = req.body || {};
    const keys = Object.keys(payload);
    if (keys.length === 0) return res.status(400).json({ error: 'No updates' });

    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const vals = [...keys.map((k) => payload[k]), id, userId];
    const sql = `UPDATE public.${table} SET ${sets} WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2} RETURNING *`;
    const { rows } = await pool.query(sql, vals);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  });

  app.delete(`/${table}/:id`, authMiddleware, async (req, res) => {
    const userId = req.user.sub;
    const id = req.params.id;
    const { rowCount } = await pool.query(
      `DELETE FROM public.${table} WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    if (!rowCount) return res.status(404).json({ error: 'Not found' });
    return res.status(204).end();
  });
}

crudRoutes({ table: 'reminders', orderBy: 'due_date ASC' });
crudRoutes({ table: 'policies', orderBy: 'due_date ASC' });
crudRoutes({ table: 'subscriptions', orderBy: 'billing_date ASC' });
crudRoutes({ table: 'investments', orderBy: 'created_at DESC' });
crudRoutes({ table: 'sip_investments', orderBy: 'created_at DESC' });
crudRoutes({ table: 'savings_goals', orderBy: 'created_at DESC' });
crudRoutes({ table: 'finnotes', orderBy: 'created_at DESC' });
crudRoutes({ table: 'appointments', orderBy: 'created_at DESC' });
crudRoutes({ table: 'bug_reports', orderBy: 'created_at DESC' });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

