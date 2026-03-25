# 06 — Auth and Roles

## How Authentication Works

The app uses **JWT (JSON Web Token)** Bearer authentication.

### Login sequence

1. User submits credentials on `/auth/login`
2. `AuthService` POSTs to `/v1/login`
3. Backend returns a token + user metadata
4. `TokenService` saves the token to `localStorage`
5. Roles and store info are also saved to `localStorage`
6. User is redirected to `/pages/home`

### Token storage

```
localStorage keys:
  token           → JWT string
  roles           → JSON object (see role structure below)
  merchantStore   → current store code
  supportedLanguages → array of language codes
```

### Token injection

`AuthInterceptor` (`pages/shared/interceptors/auth.interceptor.ts`) runs on every outgoing HTTP request:

```
Every HTTP request
      │
      ▼
AuthInterceptor.intercept()
      │
      ├── Reads token from TokenService
      ├── Clones request
      └── Sets header: Authorization: Bearer <token>
```

If the response returns `401`, `AuthService.logout()` is called automatically.

---

## Role Structure

After login, roles are stored in localStorage as:

```json
{
  "isSuperadmin": false,
  "isAdmin": true,
  "isAdminRetail": false,
  "isAdminCatalogue": false,
  "isAdminStore": false,
  "isAdminOrder": false,
  "isAdminContent": false,
  "isCustomer": false,
  "canAccessToOrder": true
}
```

---

## Role Definitions

| Role | Description |
|------|-------------|
| `isSuperadmin` | Full access to everything. Can manage all stores, global categories (in MARKETPLACE mode), create retailers. |
| `isAdmin` | Store-level admin. Can manage users, stores, catalogue, orders. |
| `isAdminRetail` | Retail store admin. Can manage their own store's catalogue and orders. |
| `isAdminCatalogue` | Catalogue-only access. Can manage products, categories, options. |
| `isAdminStore` | Store configuration access only. |
| `isAdminOrder` | Order management access only. |
| `isAdminContent` | Content management access only. |
| `isCustomer` | Customer account (not an admin role — limited access). |

---

## Route Guards

Guards live in `pages/shared/guards/`. Each guard checks `localStorage` roles and returns `true` (allow) or redirects to home/login.

| Guard | Allows |
|-------|--------|
| `AuthGuard` | Any authenticated user (valid token) |
| `AdminGuard` | `isAdmin` |
| `SuperuserAdminGuard` | `isSuperadmin` OR `isAdmin` |
| `SuperuserAdminRetailGuard` | `isSuperadmin` OR `isAdmin` OR `isAdminRetail` |
| `SuperuserAdminRetailStoreGuard` | Above + `isAdminStore` |
| `SuperadminStoreRetailCatalogueGuard` | Above + `isAdminCatalogue` |
| `SuperAdminCatalogueGuard` | `isSuperadmin` + `isAdminCatalogue` |
| `RetailAdminGuard` | `isAdminRetail` |
| `MarketplaceGuard` | Checks `environment.mode === 'MARKETPLACE'` + role |
| `OrdersGuard` | `canAccessToOrder` flag |
| `StoreGuard` | `isAdminStore` |
| `ExitGuard` | Warns user about unsaved form changes on navigation |

---

## Menu Visibility vs Route Guards

There are **two layers** of access control:

1. **Menu visibility** — controlled by guard functions in `pages-menu.ts`. These hide/show sidebar items based on roles. They run client-side only.

2. **Route guards** — `canActivate` on routes in routing modules. These actually block navigation. Even if someone manually types a URL, the guard will redirect them.

> Always rely on route guards for real security. Menu visibility is just UX.

---

## Logout

`AuthService.logout()` clears localStorage and navigates to `/auth/login`:

```ts
logout() {
  localStorage.clear();
  this.router.navigate(['auth']);
}
```
