# 01 — Project Overview

## What is shopizer-admin?

`shopizer-admin` is the **Angular-based administration dashboard** for the Shopizer e-commerce platform. It lets store administrators manage every aspect of their online store — products, orders, customers, shipping, taxes, payments, and content — through a clean web UI.

It communicates exclusively with the **Shopizer backend REST API** (Java/Spring Boot) and has no direct database access.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 11 |
| UI Component Library | Nebular (`@nebular/theme` v6) |
| Styling | SCSS + Bootstrap 4 |
| State / HTTP | RxJS + Angular HttpClient |
| Tables | ng2-smart-table |
| Rich Text Editor | Summernote / TinyMCE |
| Charts | ngx-echarts, ngx-charts |
| i18n | @ngx-translate |
| Auth | JWT (Bearer token) |
| Build Tool | Angular CLI 11 |
| Containerisation | Docker + Nginx |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (SPA)                     │
│                                                     │
│   ┌─────────────┐      ┌──────────────────────┐    │
│   │  @theme      │      │  @core               │    │
│   │  (UI shell,  │      │  (mock data,         │    │
│   │   header,    │      │   layout utils)      │    │
│   │   footer,    │      └──────────────────────┘    │
│   │   styles)    │                                   │
│   └─────────────┘                                   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │              pages/                         │   │
│   │  auth │ home │ catalogue │ orders │ ...     │   │
│   │  (Feature Modules — lazy loaded)            │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │         pages/shared/                       │   │
│   │  services │ guards │ interceptors │ models  │   │
│   └─────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST / JSON)
                       │ Bearer JWT token
                       ▼
          ┌────────────────────────┐
          │  Shopizer Backend API  │
          │  http://localhost:8080 │
          └────────────────────────┘
```

---

## Operation Modes

The app supports three modes, configured in `src/environments/environment.ts`:

| Mode | Description |
|------|-------------|
| `STANDARD` | Single store or simple multi-store setup |
| `MARKETPLACE` | Categories and options are global (superadmin-managed) |
| `BTB` | Business-to-business variant |

The mode affects which menu items are visible and which role guards are applied.

---

## Default Credentials (local dev)

```
URL:      http://localhost:4200
Username: admin@shopizer.com
Password: password
```
