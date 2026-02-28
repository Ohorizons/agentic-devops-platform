# Open Horizons Backstage — Deployment and Customization Guide

Platform: Backstage (Open Source)
Target: `backstage.20.62.35.83.sslip.io`
Auth: GitHub OAuth (Backstage auth provider)
Branding: Microsoft 4-color palette with white-first UI
Version: 1.0
Author: Paula Silva - Microsoft Latam GBB

---

## 1. Architecture Overview

Backstage in Open Horizons runs on AKS and is customized through React and TypeScript source code that is compiled into the container image.

Unlike YAML-only customization models, this setup requires code edits for major UI changes (theme, sign-in, homepage, sidebar), followed by image build and Helm rollout.

### Deployment Architecture

| Component | Technology | Details |
|-----------|-----------|---------|
| Frontend | React + TypeScript | Custom theme, custom sign-in, custom homepage, sidebar |
| Backend | Node.js | Backstage backend and plugin runtime |
| Authentication | GitHub OAuth | GitHub provider via Backstage auth backend |
| Database | PostgreSQL | Catalog and backend persistence |
| Container | Docker | Built from Backstage source (`packages/backend/Dockerfile`) |
| Orchestration | AKS | Kubernetes deployment in namespace `backstage` |
| Ingress | NGINX | Public host `backstage.20.62.35.83.sslip.io` |

---

## 2. Customization Files

Main customization files in this repository:

| File | Purpose | Key Features |
|------|---------|-------------|
| `backstage/packages/app/src/theme.ts` | Microsoft visual theme | Blue-first palette, white nav/sidebar, page themes |
| `backstage/packages/app/src/components/SignInPage/CustomSignInPage.tsx` | Pre-login page | GitHub OAuth button, Microsoft branding, animated cards |
| `backstage/packages/app/src/components/HomePage/HomePage.tsx` | Post-login homepage | Hero, Three Horizons, Quick Access, templates, activity |
| `backstage/packages/app/src/components/Root/Root.tsx` | Sidebar and global shell styling | Navigation items, top color bar, consistent sidebar styling |
| `backstage/packages/app/src/App.tsx` | App wiring | Theme provider, SignInPage override, route registration |
| `deploy/helm/backstage-aks-values.yaml` | AKS runtime config | Image tag, auth provider settings, backend/CSP/catalog config |

### Theme Details (`theme.ts`)

Current active theme exports:

- `microsoftLightTheme`
- `microsoftDarkTheme`

Key values currently used:

| Element | Value |
|---------|-------|
| Primary Color | `#0078D4` |
| Secondary Color | `#00B7C3` |
| Accent Selection | `#00A4EF` |
| Navigation Background | `#FFFFFF` |
| Navigation Text | `#666666` |
| Navigation Hover | `#F5F5F5` |

Note: The current sidebar in production is white (`#FFFFFF`) by design.

### Sign-In Page (`CustomSignInPage.tsx`)

- Uses `githubAuthApiRef`.
- Calls GitHub sign-in flow.
- Resolves Backstage identity and sets app identity.
- Uses Microsoft 4-color visual signature and white background.

### Homepage (`HomePage.tsx`)

After login, users land on `/home` with:

- Hero banner and portal branding
- Search entry
- Three Horizons cards
- Quick access cards
- Template highlights
- Activity list

---

## 3. Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Build frontend/backend |
| Yarn | Classic (v1) | Dependencies and scripts |
| Docker | 24+ | Build and push image |
| kubectl | 1.28+ | AKS operations |
| Helm | 3.x | Release updates |
| Azure CLI | 2.50+ | ACR authentication |
| ACR | Existing registry | Image storage |
| GitHub OAuth App | Configured | Sign-in provider |

### GitHub OAuth App Setup

1. Go to GitHub Developer Settings and create OAuth App.
2. Homepage URL: `http://backstage.20.62.35.83.sslip.io`
3. Callback URL: `http://backstage.20.62.35.83.sslip.io/api/auth/github/handler/frame`
4. Save Client ID and Client Secret.
5. Ensure Kubernetes secret values used by Helm map to:
   - `GITHUB_APP_CLIENT_ID`
   - `GITHUB_APP_CLIENT_SECRET`
   - `GITHUB_APP_ID`
   - `GITHUB_APP_PRIVATE_KEY`

Important: callback URL must match exactly.

---

## 4. Step-by-Step Deployment

### Step 1 - Prepare/Update Customization Code

Edit or verify:

- `backstage/packages/app/src/theme.ts`
- `backstage/packages/app/src/components/SignInPage/CustomSignInPage.tsx`
- `backstage/packages/app/src/components/HomePage/HomePage.tsx`
- `backstage/packages/app/src/components/Root/Root.tsx`
- `backstage/packages/app/src/App.tsx`

### Step 2 - Build Validation

Run from `backstage/`:

```bash
yarn tsc
yarn build:backend
```

### Step 3 - Build and Push Image

```bash
docker build -f packages/backend/Dockerfile --platform linux/amd64 \
  -t acrbackstagedemo.azurecr.io/backstage/open-horizons:v1.48.3-r15 .

az acr login --name acrbackstagedemo

docker push acrbackstagedemo.azurecr.io/backstage/open-horizons:v1.48.3-r15
```

### Step 4 - Update Helm Values

In `deploy/helm/backstage-aks-values.yaml`, confirm:

- `backstage.image.tag: "v1.48.3-r15"`
- `auth.providers.github.development` is configured with secret-backed env vars
- `backend.auth.keys` is set (`BACKEND_AUTH_KEY`)

### Step 5 - Deploy to AKS

From repo root:

```bash
helm upgrade --install paulasilvatech-backstage backstage/backstage \
  -n backstage \
  -f deploy/helm/backstage-aks-values.yaml \
  --wait --timeout 10m
```

### Step 6 - Verify Rollout

```bash
kubectl get pods -n backstage
kubectl get deploy paulasilvatech-backstage -n backstage \
  -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'

curl -I -s http://backstage.20.62.35.83.sslip.io | head -n 1
curl -I -s "http://backstage.20.62.35.83.sslip.io/api/auth/github/start?env=development" | head -n 3
```

Expected:

- Root returns `200`
- Auth start returns `302`

---

## 5. Sidebar Navigation Reference

Current sidebar items in `Root.tsx`:

| Item | Route |
|------|-------|
| Search | `/search` |
| Home | `/home` |
| Catalog | `/catalog` |
| APIs | `/api-docs` |
| Docs | `/docs` |
| Create | `/create` |
| Learning | `/learning` |
| Copilot | `/copilot-metrics` |
| Status | `/platform-status` |
| Graph | `/catalog-graph` |
| Notifications | `/notifications` |
| Settings | `/settings` |

---

## 6. Verification and Troubleshooting

### Post-Deploy Verification

1. Open `http://backstage.20.62.35.83.sslip.io`
2. Confirm Microsoft-branded custom sign-in page.
3. Sign in with GitHub.
4. Confirm post-login landing and sidebar routes.
5. Open `/catalog` and `/api-docs`.
6. Confirm no unauthorized requests in browser network tab.

### Common Issues

| Issue | Cause | Solution |
|------|------|----------|
| GitHub login fails | OAuth callback mismatch | Fix OAuth callback URL exactly |
| 401 on catalog/api pages | Invalid identity token flow | Verify `CustomSignInPage.tsx` identity handling and redeploy |
| Theme not applied | Theme not wired in `App.tsx` | Check `themes` config and providers |
| Sidebar inconsistent | Root wrapper/styles missing | Re-apply `Root.tsx` global/sidebar styles |
| Image not updated | Old tag in Helm values | Update `backstage.image.tag` and run Helm upgrade |
| ACR push auth error | Missing ACR login | Run `az acr login --name acrbackstagedemo` |

### Rollback

```bash
kubectl rollout undo deployment/paulasilvatech-backstage -n backstage
```

---

## 7. Branding Reference

| Element | Value |
|---------|-------|
| Background | `#FFFFFF` |
| Microsoft Red | `#F25022` |
| Microsoft Green | `#7FBA00` |
| Microsoft Blue | `#00A4EF` |
| Microsoft Yellow | `#FFB900` |
| Primary Brand Blue | `#0078D4` |
| Font Stack | system UI stack (see theme implementation) |
| Favicon | Local app favicon (Microsoft-themed) |

---

## 8. Sources

- Backstage homepage docs: https://backstage.io/docs/getting-started/homepage/
- Backstage theming docs: https://backstage.io/docs/getting-started/app-custom-theme/
- Backstage GitHub auth provider: https://backstage.io/docs/auth/github/provider/
