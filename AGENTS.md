# Three Horizons Accelerator - Agent Playbook

## Overview

This repository uses GitHub Copilot custom agents for DevOps automation. Each agent is specialized for specific tasks following the "one agent, one job" principle.

## Available Agents

| Agent | Purpose | Tools | Invoke With |
|-------|---------|-------|-------------|
| `@architect` | Solution design, WAF review | read, search | Architecture questions |
| `@platform` | RHDH, Golden Paths, IDP | read, search, edit, execute | Platform configuration |
| `@terraform` | Azure IaC management | read, search, edit, execute | Terraform tasks |
| `@devops` | CI/CD, K8s, ArgoCD | read, search, edit, execute | Pipeline tasks |
| `@security` | Compliance, vulnerabilities | read, search | Security review |
| `@sre` | Operations, SLOs, incidents | read, search, execute | Troubleshooting |
| `@reviewer` | Code review, best practices | read, search | PR review |

## Agent Capabilities

### @architect
Solution Architecture specialist for system design and technical decisions.
- Design cloud-native architectures
- Create architecture diagrams (Mermaid)
- Document design decisions (ADRs)
- Reference Azure Well-Architected Framework
- Evaluate technology trade-offs

### @platform
Platform Engineering specialist for Internal Developer Platforms.
- Create and maintain Backstage/RHDH templates
- Manage software catalog
- Configure developer experience tooling
- Implement Golden Path standards

### @terraform
Azure Terraform IaC specialist for infrastructure provisioning.
- Create and maintain Terraform modules
- Provision Azure resources
- Run security scans (tfsec, checkov)
- Manage state and backends

### @devops
DevOps specialist for CI/CD and Kubernetes operations.
- Create and optimize GitHub Actions workflows
- Deploy with ArgoCD
- Manage Kubernetes workloads
- Configure Helm charts

### @security
Security specialist for compliance and vulnerability management.
- Review code for security issues
- Check Defender for Cloud status
- Audit RBAC configurations
- Generate compliance reports

### @sre
Site Reliability Engineering specialist for operations.
- Monitor cluster and application health
- Troubleshoot production issues
- Analyze logs and metrics
- Track SLO/error budgets

### @reviewer
Code Review specialist for quality and best practices.
- Analyze code for quality issues
- Perform security reviews
- Check Terraform best practices
- Review Kubernetes manifests

## Workflow Patterns

### New Feature Implementation
1. `@architect` - Design and plan
2. `@terraform` - Infrastructure changes
3. `@devops` - CI/CD and deployment
4. `@reviewer` - Code review
5. `@security` - Security review
6. `@sre` - Monitoring setup

### Infrastructure Change
1. `@architect` - Review impact
2. `@terraform` - Create/modify modules
3. `@security` - Compliance check
4. `@reviewer` - Code review

### Incident Response
1. `@sre` - Initial triage
2. `@devops` - Implement fix
3. `@security` - If security-related
4. `@reviewer` - Review fix

### Golden Path Creation
1. `@architect` - Design template structure
2. `@platform` - Create Backstage template
3. `@devops` - Configure CI/CD
4. `@security` - Security baseline
5. `@reviewer` - Review template

## Commands Reference

### Build & Test
```bash
# Terraform validation
terraform init && terraform validate
terraform fmt -check -recursive

# Deployment validation
./scripts/validate-deployment.sh --environment dev
```

### Security Scanning
```bash
# IaC security
tfsec .
checkov -d .

# Secrets detection
gitleaks detect

# Container scanning
trivy image <image>
```

### Kubernetes
```bash
# Check cluster health
kubectl get nodes
kubectl get pods -A | grep -v Running

# ArgoCD status
argocd app list
argocd app get <app-name>
```

### Monitoring
```bash
# Check Prometheus targets
curl -s http://prometheus:9090/api/v1/targets | jq '.data.activeTargets | length'

# Check Alertmanager
curl -s http://alertmanager:9093/api/v1/alerts | jq '.data'
```

## Agent Selection Guide

| Task Type | Recommended Agent |
|-----------|-------------------|
| "Design a solution for..." | `@architect` |
| "Create Terraform for..." | `@terraform` |
| "Deploy/configure..." | `@devops` |
| "Review this code..." | `@reviewer` |
| "Check security of..." | `@security` |
| "Troubleshoot/debug..." | `@sre` |
| "Setup Golden Path..." | `@platform` |

## Skills Reference

Agents use skills from `.github/skills/` for specialized CLI operations:

| Skill | Description | Used By |
|-------|-------------|---------|
| terraform-cli | Terraform operations | @terraform, @devops |
| kubectl-cli | Kubernetes operations | @devops, @sre, @platform |
| azure-cli | Azure CLI operations | @terraform, @devops, @security |
| argocd-cli | ArgoCD operations | @devops |
| helm-cli | Helm operations | @devops, @sre |
| github-cli | GitHub operations | @devops, @reviewer |
| validation-scripts | Validation scripts | All agents |
| observability-stack | Prometheus/Grafana | @sre |
| rhdh-portal | RHDH operations | @platform |

## Best Practices

1. **Be specific**: Provide context, file paths, and expected outcomes
2. **One task at a time**: Don't combine unrelated requests
3. **Provide examples**: Reference existing patterns in the codebase
4. **Validate outputs**: Always review agent suggestions before applying
5. **Use handoffs**: Let agents hand off to specialists when needed

## Agent Boundaries

All agents follow three-tier boundaries:

- ✅ **ALWAYS**: Safe autonomous actions
- ⚠️ **ASK FIRST**: Actions requiring human approval
- 🚫 **NEVER**: Forbidden actions

See individual agent files in `.github/agents/` for specific boundaries.

## Directory Structure

```
.github/
├── agents/                    # Agent definitions
│   ├── architect.agent.md
│   ├── platform.agent.md
│   ├── terraform.agent.md
│   ├── devops.agent.md
│   ├── security.agent.md
│   ├── sre.agent.md
│   └── reviewer.agent.md
├── skills/                    # CLI operation skills
│   ├── terraform-cli/
│   ├── kubectl-cli/
│   ├── azure-cli/
│   └── ...
├── prompts/                   # Reusable prompts
│   ├── create-service.prompt.md
│   ├── generate-tests.prompt.md
│   └── review-code.prompt.md
├── instructions/              # Code standards
│   ├── terraform.instructions.md
│   ├── kubernetes.instructions.md
│   └── python.instructions.md
└── copilot-instructions.md    # Global instructions
```

## Related Documentation

- [MCP Servers Usage](mcp-servers/USAGE.md)
- [Golden Paths](golden-paths/)
- [Terraform Modules](terraform/modules/)
- [Deployment Scripts](scripts/)
