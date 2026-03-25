# 07 — API and Services

## Backend API

The app talks to the Shopizer Java backend. The base URL is configured in `environment.ts`:

```ts
apiUrl: 'http://localhost:8080/api'
```

All API calls are prefixed with this URL. Example: `GET /v1/products` becomes `GET http://localhost:8080/api/v1/products`.

---

## CrudService — The Base HTTP Layer

`pages/shared/services/crud.service.ts` is the single HTTP wrapper used by all feature services. Never call `HttpClient` directly in a component — always go through a service that extends or uses `CrudService`.

```ts
// Available methods
crudService.get(endpoint, params?)
crudService.post(endpoint, body)
crudService.put(endpoint, body)
crudService.delete(endpoint)
crudService.getByUri(fullUrl)
```

All methods return `Observable<any>`.

---

## Feature Services

Each module has its own service that wraps `CrudService` with domain-specific methods:

| Service | Location | Responsibility |
|---------|----------|---------------|
| `AuthService` | `pages/auth/services/` | Login, logout, token refresh |
| `TokenService` | `pages/auth/services/` | Read/write JWT from localStorage |
| `UserService` | `pages/shared/services/` | Admin user CRUD |
| `SecurityService` | `pages/shared/services/` | Role checks, group management |
| `ConfigService` | `pages/shared/services/` | Languages, countries, currencies, zones |
| `StorageService` | `pages/shared/services/` | localStorage abstraction |
| `ListingService` | `pages/shared/services/` | Paginated list helper |
| `CountryService` | `pages/shared/services/` | Country/zone data |
| `ErrorService` | `pages/shared/services/` | Broadcast error state to components |
| `ManufactureService` | `pages/shared/services/` | Brand/manufacturer API |
| `StoreService` | `pages/store-management/services/` | Store CRUD |
| `CustomerService` | `pages/customers/services/` | Customer CRUD |
| `OrdersService` | `pages/orders/services/` | Order list and details |
| `PaymentService` | `pages/payment/services/` | Payment module config |
| `TaxService` | `pages/tax-management/services/` | Tax class and rate CRUD |
| `ShippingSharedService` | `pages/shipping/services/` | Shipping config and methods |

---

## HTTP Interceptors

### AuthInterceptor

**File:** `pages/shared/interceptors/auth.interceptor.ts`

- Runs on every outgoing request
- Reads JWT from `TokenService`
- Adds `Authorization: Bearer <token>` header
- On `401` response → calls `authService.logout()`

### GlobalErrorInterceptor

**File:** `pages/shared/interceptors/globalError.interceptor.ts`

- Catches HTTP errors globally
- Broadcasts errors via `ErrorService`
- Prevents every component from needing its own error handling

---

## ConfigService — Common Lookups

`ConfigService` is used heavily across the app for dropdown data:

```ts
// Get languages supported by a store
configService.getListOfSupportedLanguages(storeCode)

// Get all countries
configService.getListOfCountries()

// Get provinces/zones for a country
configService.getListOfZonesProvincesByCountry(countryCode)

// Get supported currencies
configService.getListOfSupportedCurrency()

// Get weight/size measurement units
configService.getWeightAndSizes()

// Get user groups (for role assignment)
configService.getListOfGroups()
```

---

## Key API Endpoints (Reference)

| Action | Method | Endpoint |
|--------|--------|----------|
| Login | POST | `/v1/login` |
| Get store languages | GET | `/v1/store/languages?store=<code>` |
| Get countries | GET | `/v1/country` |
| Get zones | GET | `/v1/zones?code=<countryCode>` |
| Get currencies | GET | `/v1/currency` |
| Get user groups | GET | `/v1/sec/private/groups` |
| Get measures | GET | `/v1/measures` |
| Get site config | GET | `/v1/config` |

> For the full API reference, see the Shopizer backend Swagger docs at `http://localhost:8080/swagger-ui.html` when the backend is running.

---

## Environment-Driven Configuration

The `env.js` file in `src/assets/` allows runtime configuration without rebuilding (used in Docker):

```js
// src/assets/env.js
(function(window) {
  window.__env = window.__env || {};
  window.__env.apiUrl = 'http://localhost:8080/api';
}(this));
```

This is loaded in `index.html` before the Angular bundle, so the app can read `window.__env.apiUrl` at startup.
