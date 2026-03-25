# 04 — Architecture Diagrams

## 1. Application Bootstrap Flow

```
main.ts
  └── bootstrapModule(AppModule)
        ├── AppRoutingModule  (root routes)
        ├── CoreModule        (@core providers)
        ├── ThemeModule       (@theme UI shell)
        └── AppComponent
              └── <router-outlet>
                    ├── /auth  ──► AuthModule (lazy)
                    └── /pages ──► PagesModule (lazy, guarded by AuthGuard)
                                    └── <router-outlet>
                                          ├── home          ──► HomeModule
                                          ├── catalogue     ──► CatalogueModule
                                          ├── orders        ──► OrdersModule
                                          ├── customers     ──► CustomersModule
                                          ├── user-management
                                          ├── store-management
                                          ├── content
                                          ├── shipping
                                          ├── payment
                                          └── tax-management
```

---

## 2. Authentication Flow

```
User visits any /pages/* route
        │
        ▼
  AuthGuard.canActivate()
        │
        ├── Token exists in localStorage?
        │         │
        │        YES ──► Allow navigation
        │         │
        │        NO  ──► router.navigate(['auth'])
        │
        ▼
  /auth/login
        │
        ▼
  LoginComponent
  POST /v1/login  { username, password }
        │
        ▼
  Backend returns { token, roles, merchantStore }
        │
        ▼
  TokenService.saveToken(token)
  localStorage: token, roles, merchantStore
        │
        ▼
  router.navigate(['/pages/home'])
        │
        ▼
  Every subsequent HTTP request:
  AuthInterceptor adds header:
  Authorization: Bearer <token>
```

---

## 3. HTTP Request Lifecycle

```
Component calls a Service method
        │
        ▼
  CrudService.get() / post() / put() / delete()
        │
        ▼
  Angular HttpClient
        │
        ▼
  AuthInterceptor
  ├── Reads token from TokenService
  └── Clones request + adds Authorization header
        │
        ▼
  GlobalErrorInterceptor
  └── Catches HTTP errors, broadcasts via ErrorService
        │
        ▼
  Backend API (http://localhost:8080/api)
        │
        ▼
  Response flows back through interceptors
        │
        ▼
  Component receives Observable result
```

---

## 4. Component Tree (Main Shell)

```
AppComponent
  └── SampleLayout  (@theme/layouts/sample)
        ├── NbSidebarComponent
        │     └── PagesMenu (pages-menu.ts)
        │           └── Menu items filtered by role guards
        ├── HeaderComponent  (@theme/components/header)
        │     ├── Store selector (autocomplete)
        │     └── User actions (profile, logout)
        └── <router-outlet>
              └── Active page component
```

---

## 5. Feature Module Internal Structure

Every feature module follows this consistent pattern:

```
feature-name/
  ├── feature-name.module.ts          # NgModule declaration
  ├── feature-name-routing.module.ts  # Child routes
  ├── feature-name.component.ts       # Shell/wrapper component
  ├── feature-list/                   # List view
  │     ├── list.component.ts
  │     ├── list.component.html
  │     └── list.component.scss
  ├── feature-form/                   # Create/Edit form
  │     ├── add.component.ts (or form.component.ts)
  │     ├── add.component.html
  │     └── add.component.scss
  └── services/
        └── feature.service.ts        # API calls for this feature
```

---

## 6. Role-Based Menu Visibility

```
User logs in
      │
      ▼
Roles stored in localStorage as JSON:
{
  isSuperadmin: bool,
  isAdmin: bool,
  isAdminRetail: bool,
  isAdminCatalogue: bool,
  isAdminStore: bool,
  isAdminOrder: bool,
  isAdminContent: bool,
  isCustomer: bool,
  canAccessToOrder: bool
}
      │
      ▼
pages-menu.ts reads roles from localStorage
      │
      ▼
Each MenuItem has optional `guards: [fn, fn, ...]`
Guards are functions that return true/false
      │
      ▼
PagesComponent evaluates guards at render time
      │
      ├── Guard passes ──► Menu item shown
      └── Guard fails  ──► Menu item hidden
```

---

## 7. Data Flow in a Typical List Page

```
Component ngOnInit()
      │
      ▼
Calls FeatureService.getList(params)
      │
      ▼
CrudService.get('/v1/endpoint', params)
      │
      ▼
HTTP GET → Backend
      │
      ▼
Response: { data: [...], totalPages, totalCount }
      │
      ▼
Component stores data in local property
      │
      ▼
Template renders ng2-smart-table or PrimeNG table
      │
      ▼
User clicks Edit/Delete
      │
      ├── Edit  ──► router.navigate to form route with :id param
      └── Delete ──► Confirmation dialog ──► DELETE /v1/endpoint/:id
```
