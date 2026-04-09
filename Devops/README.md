## DevOps folder

This folder contains everything requested for Docker Desktop local services, Kubernetes deployment, GitHub Actions CI/CD, and Prometheus monitoring (Prometheus + Alertmanager + Grafana).

### What’s included

- `docker-compose.yml`: local backend + postgres + prometheus + alertmanager + grafana
- `docker/`: Dockerfiles for backend and frontend
- `scripts/`: helper scripts for local Kubernetes on Docker Desktop
- `k8s/`: Kubernetes manifests:
  - Namespace
  - ConfigMap + Secret
  - Postgres StatefulSet + Service
  - Backend Deployment + Service + HPA
  - Frontend Deployment + Service
  - Prometheus + Alertmanager + Grafana (simple manifests)
- `monitoring/`: Prometheus rules and Alertmanager config used by Docker Compose

### Docker Desktop Kubernetes (local) usage

Docker Desktop Kubernetes can run images built on your machine, so the manifests use:

- `devops-project-backend:local`
- `devops-project-frontend:local`

Run:

```powershell
.\Devops\scripts\k8s-local.ps1
```

Then port-forward (pick what you need):

```powershell
kubectl -n devops-project port-forward svc/frontend 8081:80
kubectl -n devops-project port-forward svc/backend 8080:8080
kubectl -n devops-project port-forward svc/prometheus 9090:9090
kubectl -n devops-project port-forward svc/grafana 3000:3000
kubectl -n devops-project port-forward svc/alertmanager 9093:9093
```


