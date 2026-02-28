# Open Horizons — Backstage Accelerator — Agent Ecosystem

| Field | Value |
|-------|-------|
| **Repository** | `open-horizons-backstage` |
| **Portal Technology** | Backstage (upstream open-source) |
| **Cluster** | Azure AKS only |
| **Date** | February 26, 2026 |
| **Version** | 1.0 |
| **Author** | paulasilva@microsoft.com |
| **Total Agents** | 15 |

---

## 1. Repository Scope

This repository contains the **Backstage upstream** accelerator. Everything here is specific to:

- **Static plugins** — installed via `yarn add`, wired in TypeScript/React code
- **Custom Docker images** — built from source, pushed to Azure Container Registry
- **EntityPage.tsx composition** — frontend tabs defined in React code
- **app-config.yaml management** — configuration baked into the Docker image
- **AKS deployment only** — no ARO, no OpenShift, no Operator

**What is NOT in this repository:**
- Red Hat Developer Hub (RHDH) — see `three-horizons-rhdh` repository
- Dynamic plugins, Helm values, ConfigMaps, Operator CR, RBAC CSV, OpenShift Routes

---

## 2. Agent Inventory (15 Agents)

### Group 1: Foundation (7 agents — technology-agnostic)

| Agent | Responsibility | Completes Task Solo |
|-------|---------------|---------------------|
| `architect` | Solution design, WAF, ADRs, Mermaid diagrams | ✅ |
| `terraform` | Azure IaC — write, validate, plan .tf files | ✅ |
| `security` | Compliance, vulnerabilities, Zero Trust, OWASP | ✅ |
| `reviewer` | Code quality, SOLID, Clean Code, PR review | ✅ |
| `test` | TDD, unit/integration/e2e, coverage analysis | ✅ |
| `docs` | Technical writing, READMEs, ADRs, Mermaid | ✅ |
| `sre` | Observability, SLOs, incident response | ✅ |

### Group 2: Delivery (3 agents)

| Agent | Responsibility | Completes Task Solo |
|-------|---------------|---------------------|
| `devops` | GitHub Actions, ArgoCD, K8s, Helm | ✅ |
| `deploy` | Deployment orchestrator (12-step sequence) | ✅ (via handoffs) |
| `onboarding` | New user guidance, prerequisites, first deploy | ✅ |

### Group 3: Azure Infrastructure (1 agent)

| Agent | Responsibility | Completes Task Solo |
|-------|---------------|---------------------|
| `azure-portal-deploy` | Provision AKS, Key Vault, PostgreSQL, ACR | ✅ |

### Group 4: Portal Expert (1 agent)

| Agent | Responsibility | Completes Task Solo |
|-------|---------------|---------------------|
| `backstage-expert` | Deploy Backstage, static plugins, EntityPage, app-config, custom image | ✅ |

### Group 5: Portal Services (3 agents)

| Agent | Responsibility | Completes Task Solo |
|-------|---------------|---------------------|
| `template-engineer` | Software Templates v1beta3, Codespaces, devcontainer | ✅ |
| `github-integration` | GitHub App, OAuth, org discovery, GHAS, Actions | ✅ |
| `ado-integration` | ADO PAT, pipelines, boards, Copilot | ✅ |

---

## 3. Backstage-Specific Technical Stack

### Plugin Lifecycle (Static)
```
1. yarn add @backstage/plugin-xxx
2. Edit packages/app/src/components/catalog/EntityPage.tsx
3. Edit packages/backend/src/index.ts
4. Edit app-config.yaml
5. docker build -f packages/backend/Dockerfile .
6. docker push <acr>.azurecr.io/backstage:latest
7. kubectl rollout restart deployment/backstage -n backstage
```

### Configuration Files
| File | Purpose | Update Method |
|------|---------|--------------|
| `app-config.yaml` | Base configuration | Edit file → rebuild image |
| `app-config.production.yaml` | Production overrides | Edit file → rebuild image |
| `app-config.local.yaml` | Local development | Edit file (gitignored) |
| `EntityPage.tsx` | Frontend tab composition | Edit React code → rebuild image |
| `backend/index.ts` | Backend plugin registration | Edit TypeScript → rebuild image |
| `Dockerfile` | Custom image definition | Edit → rebuild image |

### Auth Configuration
```typescript
// packages/backend/src/index.ts — CODE CHANGE REQUIRED
import { createBackend } from '@backstage/backend-defaults';
const backend = createBackend();
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.start();
```
```yaml
# app-config.yaml — plus config
auth:
  providers:
    github:
      production:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
```

### Template Registration
```yaml
# app-config.yaml
catalog:
  locations:
    - type: url
      target: https://github.com/my-org/templates/blob/main/template.yaml
      rules:
        - allow: [Template]
```

### Deployment Architecture
```
Azure AKS Cluster
├── Namespace: backstage
│   ├── Deployment: backstage (custom image from ACR)
│   ├── Service: backstage-backend
│   ├── Ingress + cert-manager TLS
│   └── SecretProviderClass (Key Vault CSI)
├── Azure Container Registry (ACR) — custom image
├── Azure Key Vault — secrets
└── Azure PostgreSQL Flexible Server — database
```

---

## 4. Handoff Matrix

| Source Agent | Hands Off To |
|-------------|-------------|
| `architect` | `terraform`, `security` |
| `terraform` | `security`, `devops` |
| `security` | `devops` |
| `reviewer` | `security` |
| `test` | `reviewer` |
| `docs` | `architect` |
| `sre` | `devops`, `security` |
| `devops` | `security`, `platform` |
| `deploy` | `security`, `terraform`, `sre`, `backstage-expert`, `azure-portal-deploy`, `github-integration`, `ado-integration` |
| `onboarding` | `architect`, `terraform`, `deploy` |
| `azure-portal-deploy` | `backstage-expert`, `terraform`, `security` |
| `backstage-expert` | `azure-portal-deploy`, `github-integration`, `ado-integration`, `deploy`, `security` |
| `github-integration` | `backstage-expert`, `security` |
| `ado-integration` | `backstage-expert` |
| `template-engineer` | `backstage-expert`, `github-integration`, `ado-integration`, `security`, `devops` |

---

## 5. Task Ownership — "Who Do I Call?"

| User Request | Call This Agent |
|-------------|----------------|
| "Design a new architecture" | `architect` |
| "Write Terraform for AKS" | `terraform` |
| "Review my code" | `reviewer` |
| "Write tests for this module" | `test` |
| "Set up CI/CD pipeline" | `devops` |
| "Deploy the platform" | `deploy` |
| "I am new, help me start" | `onboarding` |
| "Check why pods are crashing" | `sre` |
| "Scan for vulnerabilities" | `security` |
| "Update the README" | `docs` |
| "Create a Golden Path template" | `template-engineer` |
| "Set up Backstage on AKS" | `backstage-expert` |
| "Provision AKS cluster" | `azure-portal-deploy` |
| "Configure GitHub App for Backstage" | `github-integration` |
| "Connect ADO to Backstage" | `ado-integration` |
| "Install Kubernetes plugin" | `backstage-expert` |
| "Add a tab to the entity page" | `backstage-expert` |
| "Configure GitHub OAuth" | `backstage-expert` + `github-integration` |

---

## 6. Deployment Sequence

```
Step 1:  onboarding      → Prerequisites + .tfvars
Step 2:  deploy           → Choose deployment option (A/B/C/D)
Step 3:  azure-portal-deploy → Provision AKS + Key Vault + PostgreSQL + ACR
Step 4:  terraform        → terraform plan + apply
Step 5:  security         → Review deployment config
Step 6:  backstage-expert → Build custom Docker image
Step 7:  backstage-expert → Push to ACR
Step 8:  backstage-expert → Helm install backstage/backstage on AKS
Step 9:  github-integration → Create GitHub App + configure OAuth
Step 10: backstage-expert → Configure app-config with auth + catalog
Step 11: template-engineer → Create + register Golden Path templates
Step 12: sre              → Verify platform health
Step 13: deploy           → Summary: Portal URL + credentials + template count
```

---

## 7. Boundary Summary

### Destructive Actions — NEVER Allowed
- `terraform destroy`
- Delete K8s production resources
- Delete catalog entities
- Delete repos
- Grant IAM access
- Disable security controls
- Merge code / auto-approve PRs
- Expose secrets
- Deploy outside Central US / East US
- Deploy to ARO (use RHDH repo)
- Disable auth in production

### Ask First Actions
- `terraform plan` / `terraform apply`
- Create GitHub App
- Create ADO PAT
- Restart pods
- Register entities in catalog
