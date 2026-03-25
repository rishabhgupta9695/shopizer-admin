# 03 — Project Structure

## Top-Level Layout

```
shopizer-admin/
├── src/
│   ├── app/
│   │   ├── @core/          # Core utilities, mock data services
│   │   ├── @theme/         # UI shell: header, footer, styles, pipes, layouts
│   │   ├── pages/          # All feature modules (lazy-loaded)
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   ├── i18n/           # Translation JSON files (en, fr, ...)
│   │   ├── env.js          # Runtime env config (Docker)
│   │   └── env.template.js # Template for Docker injection
│   └── environments/
│       ├── environment.ts       # Dev config
│       └── environment.prod.ts  # Prod config
├── conf/                   # Nginx gzip config
├── docker/                 # Docker build files
├── e2e/                    # End-to-end tests
├── docs/                   # ← You are here
├── angular.json
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## `src/app/` Deep Dive

### `@core/`

Infrastructure-level code. Not business logic.

```
@core/
├── core.module.ts       # Registers all core providers
├── utils/
│   ├── layout.service.ts   # Sidebar/layout state
│   └── state.service.ts    # Theme/layout state
├── data/                # Abstract data service interfaces
└── mock/                # Mock implementations of data services (dashboard charts)
```

> The mock services power the home dashboard charts. They are not connected to the real API.

---

### `@theme/`

Everything visual that wraps the app.

```
@theme/
├── theme.module.ts
├── layouts/
│   └── sample/          # Main app shell layout (sidebar + header + content)
├── components/
│   ├── header/          # Top navigation bar
│   ├── footer/          # Footer
│   ├── error/           # Error display component
│   ├── image-browser/   # Reusable image picker
│   ├── search-input/    # Search bar component
│   └── tiny-mce/        # TinyMCE rich text editor wrapper
├── pipes/               # capitalize, plural, round, timing, number-with-commas
└── styles/              # Global SCSS, theme variants (default, dark, cosmic, corporate)
```

---

### `pages/`

All feature modules. Each is **lazy-loaded** via the router.

```
pages/
├── auth/                # Login, register, forgot/reset password
├── home/                # Dashboard
├── catalogue/           # Products, categories, brands, options, types
├── orders/              # Order list, order details, invoice
├── customers/           # Customer list and management
├── user-management/     # Admin users, profiles, passwords
├── store-management/    # Store config, branding, retailer management
├── content/             # CMS pages, content boxes, images
├── shipping/            # Shipping methods, origin, packages, rules
├── payment/             # Payment method configuration
├── tax-management/      # Tax classes and rates
├── custom-component/    # Reusable store autocomplete widget
└── shared/              # Cross-cutting concerns (see below)
```

---

### `pages/shared/`

The most important folder to understand early on.

```
shared/
├── services/
│   ├── crud.service.ts          # Base HTTP wrapper (GET/POST/PUT/DELETE)
│   ├── config.service.ts        # Languages, countries, currencies, zones
│   ├── user.service.ts          # User CRUD
│   ├── security.service.ts      # Role/permission helpers
│   ├── storage.service.ts       # localStorage abstraction
│   ├── listing.service.ts       # Paginated list helper
│   ├── country.service.ts       # Country data
│   ├── error.service.ts         # Error state broadcasting
│   └── connection-status.service.ts
├── guards/
│   ├── auth.guard.ts                          # Requires valid JWT
│   ├── admin.guard.ts                         # Requires admin role
│   ├── superuser-admin.guard.ts
│   ├── superuser-admin-retail.guard.ts
│   ├── superuser-admin-retail-store.guard.ts
│   ├── superadmin-store-retail-catalogue.guard.ts
│   ├── super-admin-catalogue.guard.ts
│   ├── retail-admin.guard.ts
│   ├── marketplace.guard.ts
│   ├── orders.guard.ts
│   ├── store.guard.ts
│   └── exit.guard.ts                          # Unsaved changes warning
├── interceptors/
│   ├── auth.interceptor.ts      # Attaches Bearer token to every request
│   └── globalError.interceptor.ts
├── models/                      # Shared TypeScript interfaces/classes
├── components/                  # Shared UI components (paginator, dialogs, etc.)
└── validation/                  # Custom form validators
```

---

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Feature module folder | `kebab-case/` |
| Component files | `feature-name.component.ts/.html/.scss` |
| Service files | `feature-name.service.ts` |
| Guard files | `role-description.guard.ts` |
| Model files | `model-name.ts` |
| List views | `list.component.ts` or `feature-list.component.ts` |
| Form/add views | `add.component.ts` or `feature-form.component.ts` |
