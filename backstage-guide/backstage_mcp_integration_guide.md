# Backstage + MCP Integration Guide

| Field | Value |
|-------|-------|
| **Focus** | Backstage (upstream) only |
| **Backstage Version** | v1.48.0 (latest stable, February 2026) |
| **MCP Plugin** | `@backstage/plugin-mcp-actions-backend` |
| **MCP Introduced** | v1.40.0 (Actions Registry + MCP Actions Backend) |
| **Auth Evolution** | v1.40 Static Token → v1.43 Dynamic Client Registration → v1.48 Client ID Metadata Documents |
| **Date** | February 27, 2026 |
| **Author** | paulasilva@microsoft.com |

---

## 1. What Is MCP in the Context of Backstage?

MCP (Model Context Protocol) is a standardized protocol that connects AI models and applications (MCP clients) to external systems and tools (MCP servers). In Backstage, this means exposing portal capabilities — catalog queries, template scaffolding, RBAC management — as tools that AI assistants can discover and invoke programmatically.

The vision described in the official Backstage RFC (Issue #30218): instead of clicking through the UI, developers can ask their copilot things like "Do we have a microservice template in C#?" or "Who owns the Order Management System?" and get instant, accurate answers powered by the Backstage catalog.

**Key insight from Gökhan Gökalp's DevEx Series:** When copilots access Backstage's internal knowledge, developers no longer waste time digging through documentation or pinging teammates. Copilots evolve from coding assistants into organizational memory.

---

## 2. Architecture Overview

### How It Works

```
AI Client (VS Code with GitHub Copilot/GitHub Copilot CLI/Azure AI Foundry)
    │
    │  HTTP request (Streamable HTTP or SSE)
    │  Authorization: Bearer ${MCP_TOKEN}
    │
    ▼
Backstage Backend (port 7007)
    │
    ├─ /api/mcp-actions/v1  ← MCP endpoint
    │   │
    │   ├─ Actions Registry Service
    │   │   ├─ catalog actions (query entities, get metadata)
    │   │   ├─ scaffolder actions (list templates, execute)
    │   │   ├─ rbac actions (query permissions)
    │   │   └─ custom plugin actions
    │   │
    │   └─ MCP Actions Backend Plugin
    │       ├─ Maps actions → MCP tools
    │       ├─ Handles authentication
    │       └─ Supports SSE + Streamable HTTP
    │
    └─ Standard Backstage Backend
        ├─ Catalog Backend
        ├─ Scaffolder Backend
        ├─ Auth Backend
        └─ Custom Plugins
```

### Two Integration Patterns

**Pattern 1: Native Actions (recommended)**
Plugins with well-defined domain logic expose MCP actions directly from their backend. The plugin registers actions in the Actions Registry, and the MCP backend automatically discovers and surfaces them.

**Pattern 2: Bridge Plugins**
For core functionality that doesn't naturally expose actions (catalog, RBAC), dedicated bridge plugins use the discovery service and plugin-to-plugin communication to wrap REST APIs with MCP actions. Examples: `catalog-mcp-backend`, `scaffolder-mcp-backend`, `rbac-mcp-backend`.

---

## 3. Version History & Evolution

| Version | Release | MCP Feature |
|---------|---------|-------------|
| v1.40.0 | Sep 2025 | Actions Registry + `mcp-actions-backend` plugin introduced (experimental) |
| v1.43.0 | Dec 2025 | Dynamic Client Registration (experimental) — no static token needed for VS Code/Copilot CLI |
| v1.48.0 | Feb 2026 | Client ID Metadata Documents (MCP spec 2025-11-25) + Refresh Token Support |

### v1.48.0 Highlights (Current)

**Client ID Metadata Documents:** The latest MCP specification (November 2025) introduced a new authorization method replacing Dynamic Client Registration. Enabled via `auth.experimentalClientIdMetadataDocuments.enabled` flag.

**Refresh Token Support:** Clients can request the `offline_access` scope to receive refresh tokens, avoiding re-authentication every hour. Enabled via `auth.experimentalRefreshToken.enabled`.

**Azure Database Microsoft Entra Auth:** Added `connection.type: azure` for passwordless auth with Azure PostgreSQL — directly relevant for our AKS deployment.

---

## 4. Installation Guide (Backstage Upstream)

### Step 1: Install the Plugin

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-mcp-actions-backend
```

### Step 2: Register in Backend

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins ...

// MCP Actions Backend
backend.add(import('@backstage/plugin-mcp-actions-backend'));

backend.start();
```

### Step 3: Configure Plugin Sources

```yaml
# app-config.yaml
backend:
  actions:
    pluginSources:
      - 'catalog'           # Expose catalog actions as MCP tools
      - 'scaffolder'        # Expose scaffolder actions as MCP tools
      - 'my-custom-plugin'  # Any custom plugin with registered actions
```

### Step 4: Configure Authentication

**Option A: Static Token (simplest, temporary workaround)**

```yaml
# app-config.yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${MCP_TOKEN}
          subject: mcp-clients
        accessRestrictions:
          - plugin: mcp-actions
          - plugin: catalog
```

**Option B: Dynamic Client Registration (v1.43+, experimental)**

```yaml
# app-config.yaml
auth:
  experimentalDynamicClientRegistration:
    enabled: true
    allowedRedirectUriPatterns:
      - 'vscode://*'
```

When adding the MCP server to a client like VS Code Copilot or Copilot CLI, a popup opens in Backstage requiring approval — powered by the auth plugin. Requires `@backstage/plugin-auth` (new frontend system only).

**Option C: Client ID Metadata Documents (v1.48+, experimental)**

```yaml
# app-config.yaml
auth:
  experimentalClientIdMetadataDocuments:
    enabled: true
  experimentalRefreshToken:
    enabled: true
```

This is the latest MCP spec authorization method. Replaces Dynamic Client Registration long-term.

### Step 5: Build and Deploy

```bash
# Standard Backstage static plugin flow
docker build -f packages/backend/Dockerfile .
docker push <acr>.azurecr.io/backstage:latest
kubectl rollout restart deployment/backstage -n backstage
```

---

## 5. MCP Endpoint Details

| Property | Value |
|----------|-------|
| **Streamable HTTP** | `http://localhost:7007/api/mcp-actions/v1` |
| **SSE (deprecated)** | `http://localhost:7007/api/mcp-actions/sse` |
| **Production URL** | `https://<backstage-host>/api/mcp-actions/v1` |
| **Auth Header** | `Authorization: Bearer ${MCP_TOKEN}` |
| **Protocol** | MCP spec 2025-11-25 |

---

## 6. AI Client Configuration

### VS Code with GitHub Copilot

```json
{
  "mcpServers": {
    "backstage-actions": {
      "url": "https://<backstage-host>/api/mcp-actions/v1",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

---

## 7. Available MCP Tools

### Built-in (from catalog plugin)

| Tool | Description | Use Case |
|------|-------------|----------|
| `catalog:query` | Query entities by kind, type, owner, tags | "Show me all APIs owned by team-backend" |
| `catalog:get` | Get full entity metadata | "What is the Order Service?" |
| `catalog:list` | List entities with filters | "List all production services" |

### From Scaffolder Plugin

| Tool | Description | Use Case |
|------|-------------|----------|
| `scaffolder:list-templates` | List available templates | "Do we have a C# microservice template?" |
| `scaffolder:execute` | Run a template | "Create a new Node.js service called payments" |
| `scaffolder:get-actions` | List scaffolder actions | "What actions are available?" |

### Community Bridge Plugins

| Plugin | Source | Tools |
|--------|--------|-------|
| `catalog-mcp-backend` | TeraSky OSS | Advanced catalog queries with filters |
| `scaffolder-mcp-backend` | Community | Template operations |
| `rbac-mcp-backend` | Community | Permission management |
| `@backstage-community/plugin-mcp-chat-backend` | NPM | Multi-provider AI chat inside Backstage UI |
| `@mexl/backstage-plugin-mcp-frontend` | GitHub | MCP entity visualization in catalog |

---

## 8. Community Alternatives

### iocanel/backstage-mcp (Quarkus-based)

The original community implementation by Ioannis Canellos, built with Quarkus before the official plugin existed. Inspired the official RFC #29349. This was a proof-of-concept that demonstrated the value of MCP + Backstage integration.

- **Source:** https://github.com/iocanel/backstage-mcp
- **Language:** Java/Quarkus
- **Status:** Precursor to the official plugin. The official `@backstage/plugin-mcp-actions-backend` is now the recommended approach.

### MCP Chat Plugin

The `@backstage-community/plugin-mcp-chat-backend` adds conversational AI capabilities directly inside the Backstage UI. Supports OpenAI, Claude, Gemini, Ollama, and LiteLLM as providers. Can connect to multiple MCP servers simultaneously (STDIO, Streamable HTTP).

### Roadie MCP Server

Roadie (managed Backstage) offers four MCP servers: Catalog, API Docs, Scaffolder Templates, and Tech Insights. Works with VS Code Copilot, GitHub Copilot CLI, and Azure AI Foundry agents.

---

## 9. Error Handling

MCP tools should use Backstage's error types for proper error surfacing:

```typescript
import { NotFoundError, NotAllowedError } from '@backstage/errors';

action: async ({ input }) => {
  const resource = await getResource(input.id);

  if (!resource) {
    throw new NotFoundError(`Resource ${input.id} not found`);
  }

  if (!hasPermission(user, resource)) {
    throw new NotAllowedError(
      `user does not have sufficient permissions for ${resource}`,
    );
  }

  // ... action logic
};
```

Unknown errors return generic 500 via the MCP SDK's default handler.

---

## 10. Writing Custom MCP Actions

To expose your own plugin's functionality as MCP tools, register actions in the Actions Registry:

```typescript
// my-plugin-backend/src/actions.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { actionsRegistryExtensionPoint } from '@backstage/plugin-catalog-node';

export const myPluginMcpActions = createBackendModule({
  pluginId: 'my-plugin',
  moduleId: 'mcp-actions',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryExtensionPoint,
      },
      async init({ actionsRegistry }) {
        actionsRegistry.addActions({
          'my-plugin:do-something': {
            description: 'Does something useful',
            schema: z.object({
              name: z.string().describe('The name parameter'),
            }),
            action: async ({ input }) => {
              // Your logic here
              return { result: `Done: ${input.name}` };
            },
          },
        });
      },
    });
  },
});
```

These actions are automatically discovered by `mcp-actions-backend` and exposed as MCP tools.

---

## 11. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Token exposure | Store `MCP_TOKEN` in Azure Key Vault, mount via CSI |
| Permission scope | Use `accessRestrictions` to limit token to specific plugins |
| Action safety | MCP tools inherit Backstage's permission framework |
| Network exposure | MCP endpoint behind Ingress with TLS, not exposed publicly |
| Audit | Backstage audit log captures MCP tool invocations |
| Auth evolution | Move from static tokens → Client ID Metadata Documents (v1.48+) |

---

## 12. Impact on Backstage Agent Ecosystem

### backstage-expert Agent Updates

The `backstage-expert` agent needs to know how to:

1. **Install** `@backstage/plugin-mcp-actions-backend` (yarn add + code change + rebuild)
2. **Configure** plugin sources, auth method, and access restrictions
3. **Test** MCP endpoint connectivity from AI clients
4. **Troubleshoot** auth failures, missing actions, and transport issues

### New Capabilities Unlocked

| Before MCP | After MCP |
|-----------|----------|
| Developer opens Backstage UI → clicks Catalog → searches | Developer asks Copilot "Who owns payments service?" |
| Developer navigates Create → picks template → fills form | Developer says "Create a new Node.js service called analytics" |
| Developer checks TechDocs page for API specs | Developer asks "What endpoints does the Orders API expose?" |
| Platform team checks RBAC in admin UI | AI assistant queries "What permissions does team-frontend have?" |

---

## 13. References

| Source | URL | Type |
|--------|-----|------|
| Official Plugin (npm) | https://www.npmjs.com/package/@backstage/plugin-mcp-actions-backend | Official |
| Official Plugin (GitHub) | https://github.com/backstage/backstage/tree/master/plugins/mcp-actions-backend | Official |
| RFC: Distributed Actions with MCP | https://github.com/backstage/backstage/issues/30218 | Official |
| Feature Request (origin) | https://github.com/backstage/backstage/issues/29349 | Official |
| Release Notes v1.48.0 | https://backstage.io/docs/releases/v1.48.0 | Official |
| Release Notes v1.40.0 (MCP intro) | https://backstage.io/docs/releases/v1.40.0 | Official |
| Gökhan Gökalp DevEx Series 02 | https://gokhan-gokalp.com/devex-series-02-from-catalog-to-copilots-boosting-backstage-with-mcp-server/ | Community |
| iocanel/backstage-mcp (Quarkus) | https://github.com/iocanel/backstage-mcp | Community |
| Backstage as Ultimate MCP Server | https://vrabbi.cloud/post/backstage-as-the-ultimate-mcp-server/ | Community |
| MCP Chat Plugin (npm) | https://www.npmjs.com/package/@backstage-community/plugin-mcp-chat-backend | Community |
| MCP Frontend Plugin | https://github.com/automationpi/backstage-plugin-mcp-frontend | Community |
| TeraSky Catalog MCP | https://terasky-oss.github.io/backstage-plugins/plugins/catalog-mcp/overview/ | Community |
