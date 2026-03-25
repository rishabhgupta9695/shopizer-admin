# 02 — Local Setup

## Prerequisites

| Tool | Required Version |
|------|-----------------|
| Node.js | v12.22.7 (exact — use nvm) |
| npm | bundled with Node |
| Angular CLI | 13.3.x |

### Install nvm and the correct Node version

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use the required Node version
nvm install 12.22.7
nvm use 12.22.7

# Verify
node -v   # should print v12.22.7
```

### Install Angular CLI

```bash
npm install -g @angular/cli@13.3.x
```

---

## Clone and Install

```bash
git clone <repo-url>
cd shopizer-admin

# Install dependencies (legacy flag required due to peer dep conflicts)
npm install --legacy-peer-deps
```

---

## Configure the Backend URL

The API URL is set in two places depending on how you run the app:

### For local dev (`ng serve`)

Edit `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  mode: 'STANDARD',           // STANDARD | MARKETPLACE | BTB
  apiUrl: 'http://localhost:8080/api',
  shippingApi: 'http://localhost:9090/shipping/api/v1',
  googleApiKey: '',
  client: {
    language: {
      default: 'en',
      array: ['fr', 'en'],
    },
  }
};
```

### For Docker

Pass the URL as an environment variable at runtime:

```bash
docker run \
  -e "APP_BASE_URL=http://localhost:8080/api" \
  -it --rm -p 4200:80 \
  shopizerecomm/shopizer-admin
```

The template `src/assets/env.template.js` is used by the Docker entrypoint to inject the URL at container start.

---

## Run Locally

```bash
ng serve -o
# Opens http://localhost:4200 automatically
```

### Proxy (optional)

A `proxy.conf.json` is included. To use it:

```bash
ng serve --proxy-config proxy.conf.json -o
```

---

## Build for Production

```bash
ng build
# Output goes to dist/
```

The build script uses extra memory to handle the large dependency tree:

```bash
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod
```

---

## Run Tests

```bash
ng test                  # unit tests (Karma + Jasmine)
ng e2e                   # end-to-end tests (Protractor)
npm run test:coverage    # unit tests with coverage report
```

---

## Linting

```bash
npm run lint             # TypeScript lint (ESLint)
npm run lint:styles      # SCSS lint (Stylelint)
npm run lint:ci          # Both (used in CI)
npm run lint:fix         # Auto-fix TS lint issues
```

---

## Setup Flow Diagram

```
Clone repo
    │
    ▼
nvm use 12.22.7
    │
    ▼
npm install --legacy-peer-deps
    │
    ▼
Edit environment.ts  ──► point apiUrl to your backend
    │
    ▼
ng serve -o
    │
    ▼
http://localhost:4200  ──► Login with admin@shopizer.com / password
```
