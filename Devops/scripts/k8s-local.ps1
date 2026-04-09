$ErrorActionPreference = "Stop"

Write-Host "Building local images for Docker Desktop..." -ForegroundColor Cyan
docker build -f Devops/docker/backend.Dockerfile -t devops-project-backend:local .
docker build -f Devops/docker/frontend.Dockerfile -t devops-project-frontend:local .

Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan
kubectl apply -f Devops/k8s/namespace.yaml
kubectl apply -f Devops/k8s/configmap.yaml
kubectl apply -f Devops/k8s/secret.yaml
kubectl apply -f Devops/k8s/postgres.yaml
kubectl apply -f Devops/k8s/backend.yaml
kubectl apply -f Devops/k8s/backend-hpa.yaml
kubectl apply -f Devops/k8s/frontend.yaml
kubectl apply -f Devops/k8s/monitoring.yaml

Write-Host "Waiting for pods..." -ForegroundColor Cyan
kubectl -n devops-project rollout status deploy/backend
kubectl -n devops-project rollout status deploy/frontend

Write-Host "Done. Suggested port-forwards:" -ForegroundColor Green
Write-Host "  kubectl -n devops-project port-forward svc/frontend 8081:80"
Write-Host "  kubectl -n devops-project port-forward svc/backend 8080:8080"
Write-Host "  kubectl -n devops-project port-forward svc/prometheus 9090:9090"
Write-Host "  kubectl -n devops-project port-forward svc/grafana 3000:3000"
Write-Host "  kubectl -n devops-project port-forward svc/alertmanager 9093:9093"

