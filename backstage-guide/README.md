# Open Horizons — Backstage Custom Homepage Deployment

This directory contains the deployment configuration and React components for the Open Horizons Backstage custom homepage with GitHub-only authentication.

## Overview

The Open Horizons homepage provides a modern landing page for your Backstage instance with:
- **GitHub OAuth authentication** (only auth provider)
- **Hero section** with platform branding
- **Quick access links** to common features
- **Software catalog search** for discovering components
- **Featured templates** for scaffolding new services
- **Recently updated components** display
- **Documentation links** organized by category
- **Resource library** with guides and references

## Files Included

| File | Purpose |
|------|---------|
| `app-config.homepage.yaml` | Main Backstage configuration with auth, catalog, and plugin settings |
| `HomePage.tsx` | React component implementing the homepage UI |
| `README.md` | This file |

## Prerequisites

- Backstage instance (v1.10+)
- Node.js 18+ and npm/yarn
- GitHub OAuth application credentials
- Environment variables configured

## GitHub OAuth Setup

### Step 1: Create GitHub OAuth Application

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application Name:** `Open Horizons`
   - **Homepage URL:** `https://your-backstage-domain.com`
   - **Authorization callback URL:** `https://your-backstage-domain.com/auth/github/handler/frame`
4. Click **Register application**
5. Note the **Client ID** and generate a **Client Secret**

### Step 2: Set Environment Variables

Create a `.env` file or configure environment variables:

```bash
# GitHub OAuth Credentials
export GITHUB_CLIENT_ID="your-client-id"
export GITHUB_CLIENT_SECRET="your-client-secret"
export GITHUB_URL="https://github.com"  # GitHub Enterprise: use your domain
export GITHUB_ORG="your-organization"

# Backstage Configuration
export BACKSTAGE_BASE_URL="https://your-backstage-domain.com"
export BACKEND_SECRET="your-backend-secret-key"

# Optional: GitHub Enterprise
export GITHUB_ENTERPRISE_URL="https://github.enterprise.com"
export GITHUB_HOST="github.enterprise.com"
```

## Installation

### 1. Install Homepage Plugin (if not already installed)

```bash
cd packages/app
yarn add @backstage/plugin-home
yarn add @backstage/plugin-search-react
```

### 2. Copy Configuration File

```bash
# Copy the configuration to your Backstage app directory
cp app-config.homepage.yaml /path/to/backstage/app-config.yaml

# Or append to existing config
cat app-config.homepage.yaml >> /path/to/backstage/app-config.yaml
```

### 3. Copy HomePage Component

```bash
# Create the plugins/home directory if it doesn't exist
mkdir -p packages/app/src/plugins/home

# Copy the component
cp HomePage.tsx packages/app/src/plugins/home/HomePage.tsx
```

### 4. Register the Homepage Component

In `packages/app/src/App.tsx`, add the homepage route:

```tsx
import { OpenHorizonsHomePage } from './plugins/home/HomePage';

const routes = (
  <Routes>
    <Route path="/" element={<OpenHorizonsHomePage />} />
    {/* ... other routes ... */}
  </Routes>
);
```

### 5. Update Frontend Configuration

In `packages/app/src/App.tsx`, configure the sign-in page:

```tsx
const signInPage = featureFlags.isEnabled('github-auth') ? 'github' : 'guest';
```

## Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t open-horizons-backstage .

# Run with environment variables
docker run -d \
  -e GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID}" \
  -e GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET}" \
  -e GITHUB_ORG="${GITHUB_ORG}" \
  -e BACKSTAGE_BASE_URL="${BACKSTAGE_BASE_URL}" \
  -e BACKEND_SECRET="${BACKEND_SECRET}" \
  -p 7007:7007 \
  open-horizons-backstage
```

### Kubernetes Deployment

Create a ConfigMap for the configuration:

```bash
kubectl create configmap backstage-homepage-config \
  --from-file=app-config.homepage.yaml=app-config.homepage.yaml
```

Create a Secret for sensitive data:

```bash
kubectl create secret generic backstage-homepage-secrets \
  --from-literal=github-client-id="${GITHUB_CLIENT_ID}" \
  --from-literal=github-client-secret="${GITHUB_CLIENT_SECRET}" \
  --from-literal=backend-secret="${BACKEND_SECRET}"
```

Create a Deployment manifest (`deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backstage-homepage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backstage-homepage
  template:
    metadata:
      labels:
        app: backstage-homepage
    spec:
      containers:
      - name: backstage
        image: open-horizons-backstage:latest
        ports:
        - containerPort: 7007
        env:
        - name: GITHUB_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: backstage-homepage-secrets
              key: github-client-id
        - name: GITHUB_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: backstage-homepage-secrets
              key: github-client-secret
        - name: BACKSTAGE_BASE_URL
          value: "https://your-backstage-domain.com"
        - name: GITHUB_ORG
          value: "your-organization"
        - name: BACKEND_SECRET
          valueFrom:
            secretKeyRef:
              name: backstage-homepage-secrets
              key: backend-secret
        volumeMounts:
        - name: config
          mountPath: /app/app-config.yaml
          subPath: app-config.yaml
      volumes:
      - name: config
        configMap:
          name: backstage-homepage-config
```

Apply the deployment:

```bash
kubectl apply -f deployment.yaml
kubectl expose deployment backstage-homepage --type=LoadBalancer --port=7007
```

## Configuration

### Key Configuration Options

#### GitHub Authentication
```yaml
auth:
  providers:
    github:
      production:
        clientId: ${GITHUB_CLIENT_ID}
        clientSecret: ${GITHUB_CLIENT_SECRET}
```

#### Catalog Provider
```yaml
catalog:
  providers:
    github:
      organization: ${GITHUB_ORG}
      catalogPath: /catalog-info.yaml
      filters:
        branch: main
        repository: '^(open-horizons|platform-.*)'
```

#### Homepage Settings
```yaml
homepage:
  enabled: true
  defaultPath: /
  searchBar:
    enabled: true
  quickAccessLinks:
    enabled: true
  starredEntities:
    enabled: true
```

## Troubleshooting

### Authentication Issues

**Problem:** "GitHub OAuth failed"
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly
- Check the callback URL matches exactly in GitHub OAuth settings
- Ensure GitHub OAuth app is active and not revoked

**Problem:** "Unauthorized access"
- Check that your GitHub user is in the organization specified by `GITHUB_ORG`
- Verify the GitHub OAuth app has required permissions

### Catalog Not Loading

**Problem:** Components not appearing in catalog
- Verify `catalog-info.yaml` files exist in your repositories
- Check the `catalogPath` matches your actual file location
- Ensure the repositories match the `repository` filter pattern
- Check backend logs for catalog provider errors

### Styling Issues

**Problem:** Homepage styling not applied correctly
- Ensure Material-UI dependencies are installed
- Check browser console for CSS errors
- Verify theme configuration in Backstage app config

## Development

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

### Extending the Homepage

To customize the homepage:

1. Edit `HomePage.tsx` to modify the UI
2. Add new quick access links in the configuration
3. Customize colors and styling by modifying Material-UI theme
4. Add new sections by extending the component

Example custom link:

```tsx
{
  title: 'My Custom Link',
  description: 'Description of custom feature',
  url: '/custom-page',
  icon: <CustomIcon />,
}
```

## Security Considerations

- **GitHub Secrets:** Never commit `.env` or secret files to version control
- **CORS:** Configure CORS properly for your domain
- **Backend Secret:** Use a strong, unique backend secret in production
- **HTTPS:** Always use HTTPS in production
- **GitHub Enterprise:** If using GitHub Enterprise, update `GITHUB_ENTERPRISE_URL`

## Support & Documentation

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage Plugin Home](https://github.com/backstage/backstage/tree/master/plugins/home)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## License

Open Horizons is licensed under the Apache License 2.0. See LICENSE file for details.
