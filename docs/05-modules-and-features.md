# 05 — Modules and Features

## Home (`/pages/home`)

The dashboard landing page. Displays summary charts and stats powered by the `@core/mock` services (chart data is currently mocked, not live from the API).

**Key files:** `home.component.ts`, `home.module.ts`

---

## Auth (`/auth`)

Handles all unauthenticated flows. Not lazy-loaded inside PagesModule — it's a top-level route.

| Route | Component | Purpose |
|-------|-----------|---------|
| `/auth/login` | `LoginComponent` | Username + password login |
| `/auth/register` | `RegisterComponent` | New merchant registration |
| `/auth/forgot-password` | `ForgotComponent` | Request password reset email |
| `/auth/reset-password` | `ResetComponent` | Set new password via token |

**Key service:** `auth.service.ts` — calls `/v1/login`, handles token storage and logout.

---

## Catalogue (`/pages/catalogue`)

The largest module. Manages the product catalog.

### Sub-modules

| Sub-module | Routes | Purpose |
|------------|--------|---------|
| **Categories** | `/catalogue/categories/*` | Category tree, create/edit categories, hierarchy view |
| **Products** | `/catalogue/products/*` | Product list, create/edit products, images, pricing, inventory, discounts, attributes |
| **Options** | `/catalogue/options/*` | Product options (e.g. Size, Color), option values, option sets, variations |
| **Brands** | `/catalogue/brands/*` | Manufacturer/brand list and creation |
| **Product Types** | `/catalogue/types/*` | Product type definitions |
| **Product Groups** | `/catalogue/products-groups/*` | Grouping products for display |

### Product creation flow

```
Products List
    │
    ▼
Create Product (product-form)
    ├── Basic info (name, description, SKU)
    ├── Pricing (price, special price)
    ├── Images (products-images)
    ├── Inventory (inventory)
    ├── Attributes (attribute)
    ├── Category assignment (product-to-category)
    └── Discounts (product-discount)
```

**Guard:** `SuperadminStoreRetailCatalogueGuard` — only users with catalogue access can enter this module.

---

## Orders (`/pages/orders`)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/orders` | `OrderListComponent` | Paginated order list with filters |
| `/orders/:id` | `OrderDetailsComponent` | Full order detail, status update |
| Order invoice | `OrderInvoiceComponent` | Printable invoice |
| Order history | `OrderHistoryComponent` | Status change history |
| Order transaction | `OrderTransactionComponent` | Payment transaction details |

**Guard:** `OrdersGuard` — only roles with order access can view.

---

## Customers (`/pages/customer`)

| Route | Purpose |
|-------|---------|
| `/customer/list` | List all customers |
| `/customer/add` | Create/edit a customer |
| `/customer/set-credentials/:id` | Reset customer password |

---

## User Management (`/pages/user-management`)

Manages admin users (not customers).

| Route | Purpose |
|-------|---------|
| `/user-management/profile` | Current user's profile |
| `/user-management/users` | List all admin users (admin only) |
| `/user-management/create-user` | Create new admin user (admin only) |
| `/user-management/user/:id` | Edit user details |
| `/user-management/change-password` | Change own password |

---

## Store Management (`/pages/store-management`)

| Route | Purpose |
|-------|---------|
| `/store-management/store` | Edit current store details and branding |
| `/store-management/stores-list` | List all stores (admin only) |
| `/store-management/create-store` | Create a new store (superadmin/retail admin) |

Store details include: name, address, currency, languages, social networks, logo/banner upload.

---

## Content Management (`/pages/content`)

| Route | Purpose |
|-------|---------|
| `/content/pages/list` | CMS static pages list |
| `/content/pages/add` | Create/edit a CMS page (rich text editor) |
| `/content/boxes/list` | Content boxes (banners, widgets) |
| `/content/boxes/add` | Create/edit a content box |
| `/content/images/list` | Manage uploaded images |

Uses **Summernote** and **TinyMCE** for rich text editing.

---

## Shipping (`/pages/shipping`)

| Route | Purpose |
|-------|---------|
| `/shipping/config` | General shipping configuration |
| `/shipping/methods` | Enable/configure shipping providers (UPS, Canada Post, Shiprocket, etc.) |
| `/shipping/origin` | Set the shipping origin address |
| `/shipping/packaging` | Define package sizes |

Supported providers are defined as JSON config files in `pages/shipping/services/` (e.g. `ups.json`, `canadapost.json`, `storepickup.json`).

---

## Payment (`/pages/payment`)

| Route | Purpose |
|-------|---------|
| `/payment/methods` | List available payment modules |
| `/payment/configure/:module` | Configure a specific payment provider |

Supported providers: Stripe, PayPal, Braintree, Paytm, Beanstream, Money Order. Each has a JSON config schema in `pages/payment/services/`.

---

## Tax Management (`/pages/tax-management`)

| Route | Purpose |
|-------|---------|
| `/tax-management/classes-list` | Tax class list (e.g. "Standard", "Reduced") |
| `/tax-management/rate-list` | Tax rate list (rate per country/zone) |
| Add/edit forms for both |  |
