const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";

const TOKEN_KEY = "app_token";

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string | null;
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const base = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const res = await fetch(`${base}${path}`, { ...init, headers });
  if (res.status === 204) return { ok: true as const, data: null };

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return { ok: true as const, data };
}

export const api = {
  async signup(payload: { email: string; password: string; full_name: string; phone_number?: string | null }) {
    const { data } = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
    setToken(data.token);
    return data as { token: string; user: { id: string; email: string } };
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });
    setToken(data.token);
    return data as { token: string; user: { id: string; email: string } };
  },
  async me() {
    const { data } = await apiFetch("/auth/me");
    return data.user as AuthUser;
  },
  async signOut() {
    setToken(null);
  },
  async getProfile() {
    const { data } = await apiFetch("/profiles/me");
    return data as any;
  },
  table: {
    async list(table: string) {
      const { data } = await apiFetch(`/${table}`);
      return data;
    },
    async insert(table: string, payload: any) {
      const { data } = await apiFetch(`/${table}`, { method: "POST", body: JSON.stringify(payload) });
      return data;
    },
    async update(table: string, id: string, payload: any) {
      const { data } = await apiFetch(`/${table}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
      return data;
    },
    async remove(table: string, id: string) {
      await apiFetch(`/${table}/${id}`, { method: "DELETE" });
      return true;
    },
  },
};

