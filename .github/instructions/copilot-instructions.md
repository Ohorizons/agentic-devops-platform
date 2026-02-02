---
description: 'Main GitHub Copilot instructions for Three Horizons Accelerator - project overview, technology stack, code standards, and common tasks'
---

# GitHub Copilot Instructions for Three Horizons Accelerator

## Project Overview

This is the Three Horizons Accelerator v4.0.0 - an enterprise-grade platform accelerator for Azure with AI capabilities. The platform is organized into three horizons:

- **H1 Foundation**: Core infrastructure (AKS/ARO, networking, security, databases)
- **H2 Enhancement**: Platform services (ArgoCD, RHDH, observability, Golden Paths)
- **H3 Innovation**: AI capabilities (AI Foundry, agents, MLOps)

## Technology Stack

- **Infrastructure**: Terraform for Azure (AKS, ARO, networking, databases)
- **Container Platform**: Azure Kubernetes Service (AKS) or Azure Red Hat OpenShift (ARO)
- **GitOps**: ArgoCD for continuous deployment
- **IDP**: Red Hat Developer Hub (Backstage-based)
- **Observability**: Prometheus, Grafana, Alertmanager, Loki
- **AI**: Azure AI Foundry, OpenAI models

## Code Standards

### Terraform
- Use Terraform 1.5+
- Always specify provider versions
- Use modules for reusable components
- Tag all resources with: environment, project, owner, cost-center
- Use Workload Identity (never service principal secrets)
- Enable private endpoints for all PaaS services

### Kubernetes
- Use Kustomize for environment overlays
- Always set resource limits and requests
- Run containers as non-root
- Configure liveness and readiness probes
- Apply network policies
- Use standard Kubernetes labels (app.kubernetes.io/*)

### ARO (Azure Red Hat OpenShift)
- Use `oc` CLI for OpenShift-specific operations
- Install operators via OLM (Operator Lifecycle Manager)
- Use OpenShift Routes instead of Ingress
- Configure OAuth with Entra ID
- Deploy RHDH using Red Hat RHDH Operator
- Use OpenShift GitOps Operator for ArgoCD
- Apply appropriate Security Context Constraints (SCCs)

### Python
- Use Python 3.11+
- Use FastAPI for APIs
- Use Pydantic for validation
- Use structlog for logging
- Follow PEP 8 style guidelines

### Shell Scripts
- Use bash with strict mode (set -euo pipefail)
- Include usage instructions
- Validate inputs
- Use meaningful variable names

## File Locations

| Component | Location |
|-----------|----------|
| Terraform modules | `terraform/modules/` |
| Environment configs | `terraform/environments/` |
| Kubernetes manifests | `deploy/kubernetes/` |
| Helm values | `deploy/helm/` |
| Golden Path templates | `golden-paths/` |
| Agent specifications | `agents/` |
| Skills (CLI references) | `.github/skills/` |
| Automation scripts | `scripts/` |
| Documentation | `docs/` |

## Skills

Skills provide CLI reference documentation for Copilot context. Available skills:

| Skill | Purpose |
|-------|---------|
| `azure-cli` | Azure CLI commands for resource management |
| `terraform-cli` | Terraform CLI for infrastructure as code |
| `kubectl-cli` | Kubernetes kubectl commands |
| `argocd-cli` | ArgoCD GitOps operations |
| `oc-cli` | OpenShift CLI commands |
| `helm-cli` | Helm package management |
| `github-cli` | GitHub CLI operations |
| `validation-scripts` | Reusable validation patterns |
| `aro-deployment` | ARO cluster deployment |
| `openshift-operations` | OpenShift operations |
| `prerequisites` | CLI tool requirements |

## Agent-Skills-MCP Integration

The accelerator uses a hierarchical implicit integration pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                      Agent (e.g., aro.agent.md)                 │
│  skills: [aro-deployment, openshift-operations, azure-cli]     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ references
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Skills (e.g., aro-deployment)                 │
│  - CLI commands and patterns documented                         │
│  - Related Scripts section                                      │
│  - MCP server suggestions                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ discovered via
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MCP Servers (.vscode/mcp.json)             │
│  - Loaded dynamically via tool_search_tool_regex                │
│  - Provide actual tool execution                                │
└─────────────────────────────────────────────────────────────────┘
```

### Instructions (Auto-loaded by file pattern)

Instructions in `.github/instructions/` use `applyTo` patterns:

| Instruction | Files |
|-------------|-------|
| terraform.instructions.md | `**/*.tf` |
| kubernetes.instructions.md | `**/*.yaml` |
| python.instructions.md | `**/*.py` |
| shell.instructions.md | `**/*.sh` |
| aro.instructions.md | `**/aro/**/*.yaml` |

### How Components Work Together

1. **Agents** declare `skills:` in frontmatter → Copilot loads skill docs
2. **Skills** document CLI patterns + reference scripts → Copilot has context
3. **MCP servers** are discovered via `tool_search_tool_regex` → actual execution
4. **Instructions** auto-apply by `applyTo` file patterns → coding standards

### Key Patterns

- Agents DON'T need to explicitly reference MCP servers (implicit via skills)
- Agents DON'T need to reference instructions (auto-applied by file pattern)
- Skills SHOULD document which scripts to use for common tasks
- Skills SHOULD note which MCP servers provide relevant tools

## Security Requirements

1. **Authentication**: Always use Workload Identity or Managed Identity
2. **Secrets**: Store in Azure Key Vault, never in code
3. **Network**: Use private endpoints, configure NSGs
4. **Scanning**: Run security scans in CI/CD (Trivy, tfsec, gitleaks)
5. **RBAC**: Follow least privilege principle

## Naming Conventions

- Resources: `{project}-{environment}-{resource}-{region}`
- Terraform: snake_case for variables, resources
- Kubernetes: kebab-case for names, labels
- Files: kebab-case for filenames

## Common Tasks

### Creating a new module
```bash
./scripts/create-module.sh <module-name>
```

### Deploying infrastructure
```bash
cd terraform
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply
```

### Running validation
```bash
./scripts/validate-deployment.sh --environment dev
```

## Agent System

The platform uses 30 AI agents in a flat structure at `.github/agents/`. Agents are organized by horizon:

| Horizon | Agents | Purpose |
|---------|--------|---------|
| H1 Foundation | 8 | Core infrastructure (AKS/ARO, networking, security) |
| H2 Enhancement | 5 | Platform services (GitOps, RHDH, observability) |
| H3 Innovation | 4 | AI capabilities (AI Foundry, MLOps, multi-agent) |
| Cross-Cutting | 7 | Shared concerns (validation, migration, rollback) |
| Specialized | 6 | Domain-specific (deployment, terraform, GitHub) |

When generating code for agents:
- Follow the agent specification format with YAML frontmatter
- Required fields: `name`, `description`, `skills`
- Include clear inputs, outputs, and steps
- Reference existing modules and scripts

## Golden Paths

When creating or modifying Golden Path templates:
- Follow Backstage template format
- Include skeleton files
- Add comprehensive documentation
- Test scaffolding locally before registering
