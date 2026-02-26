# Three Horizons Accelerator - Platform Services

> **Version:** 4.0.0
> **Last Updated:** December 2025
> **Audience:** Platform Engineers, Developers

## Overview

This directory contains configuration for platform-level services that run on top of the infrastructure layer.

## Structure

```text
platform/
└── README.md
```

## Backstage

Backstage provides the Internal Developer Portal (IDP). Configuration is managed via Helm values and ArgoCD.

- Authentication providers
- Catalog locations and Golden Path templates
- Plugin configuration
- TechDocs integration

## 📚 Related Documentation

| Document | Description |
|----------|-------------|
| [Architecture Guide](../docs/guides/ARCHITECTURE_GUIDE.md) | Platform architecture and Backstage role |
| [Golden Paths](../golden-paths/README.md) | Available Golden Path templates for Backstage |
| [Administrator Guide](../docs/guides/ADMINISTRATOR_GUIDE.md) | Portal administration procedures |

---

**Document Version:** 2.0.0
**Last Updated:** December 2025
**Maintainer:** Platform Engineering Team
