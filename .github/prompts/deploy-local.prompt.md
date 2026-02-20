---
mode: agent
tools:
  - search/codebase
  - execute/runInTerminal
  - read/problems
description: Deploy the Three Horizons platform as a local demo on kind (Kubernetes in Docker)
---

# Deploy Local Demo

Deploy the Three Horizons Accelerator as a local demonstration environment using kind.

## Context
- The local demo runs on a **kind** cluster (1 control-plane + 2 workers)
- No Azure subscription or Terraform required
- All components are installed via Helm and kubectl
- Agents, Golden Paths, and prompts work identically to Azure AKS

## Steps

### 1. Validate prerequisites
```bash
for tool in docker kind kubectl helm jq yq; do command -v $tool && echo "✓ $tool" || echo "✗ $tool missing"; done
docker info >/dev/null 2>&1 && echo "✓ Docker running" || echo "✗ Docker not running"
```

### 2. Add Helm repositories
```bash
helm repo add jetstack https://charts.jetstack.io
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
helm repo update
```

### 3. Deploy the platform
```bash
make -C local up
```

### 4. Validate
```bash
make -C local validate
```

### 5. Access services
- ArgoCD: `make -C local argocd` → https://localhost:8443
- Grafana: `make -C local grafana` → http://localhost:3000 (admin/admin)
- Prometheus: `make -C local prometheus` → http://localhost:9090

## Teardown
```bash
make -C local down
```
