# 🛡️ Polisafe — Complete Self-hosted IAM · OAuth 2.0 · OpenID Connect

> **Identity that pays *you* — not the other way around.**

![Polisafe main dashboard](https://polisafe.elegantys.net/ps-dashboard.png)

Polisafe is a **complete, self-hosted Identity and Access Management (IAM) platform**: an **OAuth 2.0 / OpenID Connect provider**, a **multi-tenant RBAC (roles–permissions–scopes) engine**, a **management REST API**, an **Angular admin console**, a **brandable login / consent / register UI**, plus **official SDKs for NestJS and Next.js**, an **MCP server for AI agents**, and drop-in examples for **`oidc-client-ts`** SPAs — all in a single NestJS codebase, with **no per-user fees, no per-API-call commissions, no seat licenses and no lock-in** to a third-party identity cloud.

- ⚡ **Live public instance:** <https://polisafe.elegantys.net> (API prefix `/api/v5/security`)
- 🗄️ **OIDC discovery:** <https://polisafe.elegantys.net/api/v5/security/polisafe/.well-known/openid-configuration>
- 🖥️ **Admin console:** <https://polisafe.elegantys.net/app>
- 📜 **Swagger / OpenAPI:** `{APP_PREFIX}/docs` (JSON: `{APP_PREFIX}/docs-json`)

---

## 📑 Table of contents

1. [Why Polisafe? The pitch](#-why-polisafe-the-pitch)
2. [Project description](#-project-description)
   - [What it is](#what-it-is)
   - [Components inside the box](#components-inside-the-box)
   - [Tech stack](#tech-stack)
   - [Repository layout](#repository-layout)
   - [The Polisafe ecosystem (sibling projects)](#the-polisafe-ecosystem-sibling-projects)
   - [Feature list](#feature-list)
3. [Concepts & architecture](#-concepts--architecture)
4. [Public sandbox — try it now](#-public-sandbox--try-it-now)
5. [Quick start — exercise the OAuth flows](#-quick-start--exercise-the-oauth-flows)
6. [Self-hosting installation](#-self-hosting-installation)
   - [Requirements](#requirements)
   - [1. Clone & configure](#1-clone--configure)
   - [2. Environment variables](#2-environment-variables)
   - [3. Install, migrate, run](#3-install-migrate-run)
   - [4. Docker (recommended)](#4-docker-recommended)
   - [5. After first boot](#5-after-first-boot)
7. [API reference](#-api-reference)
   - [Conventions](#conventions)
   - [OAuth 2.0 / OpenID Connect endpoints](#oauth-20--openid-connect-endpoints)
   - [Users (admin)](#-users-admin--prefixpolizeiadminuser)
   - [Roles (admin)](#-roles-admin--prefixpolizeiadminroles)
   - [Permissions (admin)](#-permissions-admin--prefixpolizeiadminpermissions)
   - [Scopes / tenants (admin)](#-scopes--tenants-admin--prefixpolizeiadminscope)
   - [Invitations (admin)](#-invitations-admin--prefixpolizeiadmininvitation)
   - [OAuth clients & OAuth scopes (admin)](#-oauth-clients--oauth-scopes-admin)
   - [Dashboard (admin)](#-dashboard-admin--prefixpolizeiadmindashboard)
   - [Profile / self-service](#-profile--self-service--prefixpolizeiprofile)
   - [Machine-to-machine IO API](#machine-to-machine-io-api)
   - [Legacy micro API](#-legacy-micro-api--prefixpolizeimicro)
   - [Uploads](#-uploads--prefixpolizeiupload)
   - [Status codes & error format](#status-codes--error-format)
8. [NestJS SDK — @elegantys/polisafe](#-nestjs-sdk--elegantyspolisafe)
   - [Installation](#installation)
   - [Register in the root module](#register-in-the-root-module)
   - [Protecting routes](#protecting-routes--decorators--guards)
   - [Real-world consumer pattern](#real-world-consumer-pattern)
9. [Next.js SDK — @elegantys/polisafe-next](#-nextjs-sdk--elegantyspolisafe-next)
10. [SPA integration with oidc-client-ts](#-spa-integration-with-oidc-client-ts)
    - [Compatibility notes for OIDC clients](#compatibility-notes-for-oidc-clients)
11. [mcp-polizei — run your IAM with AI agents](#-mcp-polizei--run-your-iam-with-ai-agents)
    - [Install & run](#install--run)
    - [Configuration](#configuration-env--environment)
    - [Wire it to a client](#wire-it-to-a-client)
    - [Tool catalog (55 tools)](#tool-catalog-55-tools)
    - [Resources (3)](#resources-3)
    - [Operations notes](#operations-notes)
12. [Troubleshooting](#-troubleshooting)
13. [Production checklist & known limitations](#-production-checklist--known-limitations)
14. [Appendix: full environment variables](#appendix-full-environment-variables)
15. [Further reading](#-further-reading)

---

## ✨ Why Polisafe? The pitch

Commercial "identity-as-a-service" platforms are convenient — until you read the invoice. They charge **per monthly-active-user**, **per authentication**, **per seat** or a **percentage of your revenue**, and your user directory lives in *their* cloud under *their* terms. Polisafe is the full stack replacement you can run on **your own server for free**:

| | Polisafe (self-hosted) | Commercial IdP SaaS |
|---|---|---|
| **License cost** | **$0 — free forever** | Per-MAU / per-seat / % of revenue |
| **User data** | Your PostgreSQL, your servers | Their cloud, their terms |
| **Tenants / businesses** | **Unlimited**, hierarchical | Usually paid tiers |
| **Tokens / API calls** | Unlimited | Metered |
| **Code** | Open — extend anything | Black box |
| **Protocols** | OAuth 2.0 + OIDC + PKCE + JWKS + RBAC | The same — but rented |
| **Support model** | Community + your own engineers | Support contracts |

You keep the **same standards your engineers already know**: `authorization_code` + PKCE, `client_credentials`, `password`, rotating `refresh_token`, discovery documents, RS256 per-tenant JWKS, consent screens, logout — deployed with one `docker compose up` and consumed through ready-made SDKs.

> **The promise:** one deployable server that replaces Auth0/Okta/Clerk/Firebase-Auth *and* the admin panel you would otherwise build to manage users, roles, permissions and tenants — with **no per-login tax and no vendor hostage-taking**.

---

## 🧬 Project description

### What it is

This repository (the **Polisafe IAM server**, npm package name `polizei`) is the **authorization server** of the Polisafe ecosystem. A single NestJS application implements **both** sides of an IAM product:

1. **The protocol side (`src/polisafe-iam`)** — a full OAuth 2.0 / OpenID Connect server:
   - authorization endpoint (code + implicit) with **mandatory PKCE**,
   - token endpoint supporting `authorization_code`, `password`, `client_credentials` and rotating `refresh_token`,
   - revocation (RFC 7009), end-session (logout), userinfo,
   - per-tenant **RS256 key pairs** served as JWKS,
   - OIDC discovery (`/.well-known/openid-configuration`),
   - browser pages for login, consent, registration, recovery, activation, invitation and external-provider callbacks (Google/GitHub/custom),
   - magic-link passwordless login via webhook delivery.

2. **The management side (`src/polizei-engine`)** — the IAM administration API and engine:
   - **users**, **roles**, **permissions**, **scopes/tenants** (a hierarchy of businesses), **invitations**, **OAuth clients** and **OAuth scopes** CRUD,
   - self-service **profile** endpoints (my profile, my permissions, my tenants, change password, own-business creation, per-app tenant settings),
   - runtime **authorization decision API** for other microservices (`polizei/io/authorization`),
   - an **analytics dashboard** API (auth/users/RBAC/invitations/geo/risk widgets),
   - **first-boot bootstrap** that seeds the root tenant, the admin user and the default OAuth client,
   - an audit-trail table for every relevant security event.

3. **The presentation side** — two UIs are served by the same process:
   - an **Angular admin console** (`ui/app`, mounted at `/app`) that talks to the management API and authenticates itself with `oidc-client-ts`,
   - a **marketing/developer landing** (`ui/landing`, mounted at `/`) shown at <https://polisafe.elegantys.net>.

The server also contains the **in-repo SDK wiring** (`src/polisafe-sdk`) used by its own management controllers — the *same* SDK that is published separately as `@elegantys/polisafe` so external NestJS services can reuse the identical guards and decorators.

### Components inside the box

| Component | Where | What you get |
|---|---|---|
| OAuth 2.0 / OIDC provider | `src/polisafe-iam` | Full protocol endpoints, tokens, keys, discovery |
| RBAC engine | `src/polizei-engine` | Users, roles, permissions, scopes, invitations, audit |
| Management REST API | `src/polizei-engine/controllers` | Admin + profile + IO + micro + upload + dashboard APIs |
| SDK (in-repo) | `src/polisafe-sdk` | `@Permission`, `@Scope`, `@UserToken`, JWKS strategies, machine token |
| Admin console | `ui/app` | Angular SPA (users, roles, permissions, tenants, clients, dashboard) |
| Landing | `ui/landing` | Public marketing + docs site |
| OAuth pages | `public/*.hbs` | Server-rendered login/consent/register/recover/activation/invitation |
| Bootstrap | `src/polizei-engine/services/creator.service.ts` | Seeds root tenant, admin, permissions, scopes, default client |
| Swagger | `main.ts` | Interactive docs at `{APP_PREFIX}/docs` |
| Cache | `src/app.module.ts` | Keyv in-memory + Redis layers |

### Tech stack

| Layer | Technology |
|---|---|
| Runtime | **Node.js ≥ 18** |
| Framework | **NestJS 10** (TypeScript, Express platform) |
| ORM / DB | **Sequelize 6** + `sequelize-typescript` on **PostgreSQL 14+** (schemas `security`, `oauth`) |
| Auth | `passport` + `passport-jwt` + **`jwks-rsa`** (RS256 per-tenant keys), `@nestjs/jwt`, bcrypt password hashing |
| Cache | `@nestjs/cache-manager` + **Keyv** (in-memory) + **KeyvRedis** (optional Redis) |
| API docs | `@nestjs/swagger` (OpenAPI) |
| Frontends | Angular (compiled in `ui/app`), React (compiled in `ui/landing`), Handlebars (`public/`) |
| Mapping | `@automapper` |
| Events / HTTP | `@nestjs/event-emitter`, `@nestjs/axios` |
| Container | Docker (node:18-alpine), docker compose |

### Repository layout

```
polizei/                        # repository root (this IAM server)
├── src/
│   ├── main.ts                         # bootstrap: prefix, CORS, cookies, static, hbs, Swagger
│   ├── app.module.ts                   # root module: DB, cache/Redis, SDK registration
│   ├── polisafe-iam/                   # OAuth2/OIDC server
│   │   ├── controllers/                #   oauth.controller.ts, openid.controller.ts
│   │   ├── dto/                        #   AuthRequestDto, TokenDto, RevokeDto, LogoutDto…
│   │   ├── services/                   #   auth, openid, key (RSA), client, auth-code, providers…
│   │   ├── models/                     #   OAuth persistence models (clients, keys, scopes, codes, tokens)
│   │   │                               #   (schema: oauth)
│   │   └── guards/  grants/  pipes/    #   basic-auth, cookie, consent origin; grant handlers
│   ├── polizei-engine/                 # RBAC engine + management API
│   │   ├── controllers/                #   admin (user/roles/permissions/scope/invitation/oauth…),
│   │   │                               #   profile, dashboard, io, micro, upload, ui
│   │   ├── models/                     #   RBAC persistence models (schema: security)
│   │   ├── services/                   #   user, role, permission, scope, invitation, dashboard,
│   │   │                               #   creator (bootstrap), auth, iam-model bridge…
│   │   └── dto/                        #   register, change-password, user-update, session…
│   ├── polisafe-sdk/                   # in-repo SDK (same as @elegantys/polisafe)
│   │   ├── polisafe-sdk.module.ts      #   register(options)
│   │   ├── decorators/                 #   @Permission, @Scope, @UserToken, @MapTenant
│   │   ├── guards/ auth-flow/          #   JwtAuthGuard, TenantGuard, PrivilegesGuard, ScopesGuard
│   │   └── services/                   #   jwt-strategy, jwt-cookie-strategy, machine token service
│   ├── backbone/                       # optional event-bus integration (not wired by default)
│   ├── redis-connectivity.service.ts
│   └── request-context.ts / request-interceptor.ts
├── ui/
│   ├── app/                            # Angular admin console (served at /app)
│   └── landing/                        # Marketing landing (served at /)
├── public/                             # hbs/html pages: login, consent, register, recover…
├── database/
│   └── migrations/                     # Sequelize migrations (schema init)
├── docs/                               # io-api.md, dashboard-api.md (spec notes)
├── scripts/schemas.ts                  # `npm run migrate` — creates SCHEMAS (security,oauth)
├── docker-compose.yml                  # Redis (cache) for local dev
├── Dockerfile                          # node:18-alpine multi-stage build
└── .env                                # local configuration (never commit real secrets)
```

### The Polisafe ecosystem (sibling projects)

Polisafe is a family of repositories that live side by side in the same workspace:

| Repo | Package / binary | Role |
|---|---|---|
| **This repository (IAM server)** | `polizei` | The IAM **server** documented here |
| **`polisafe`** | `polizei` | Deployment twin of the server (same codebase, separate git remote, built `dist/`) |
| **`sdk-polisafe`** | `@elegantys/polisafe` | Official **NestJS SDK** (guards, decorators, JWKS verification, machine tokens) |
| **`sdk-polisafe-next`** | `@elegantys/polisafe-next` | Official **Next.js 15+ App Router SDK** |
| **`mcp-polizei`** | `mcp-polizei` | **MCP server** that exposes the admin/RBAC API as 55 tools for AI agents |

```
                          ┌──────────────────────────────────────┐
                          │        Polisafe IAM server           │
                          │  OAuth2/OIDC + RBAC + admin UI       │
                          └───────┬───────────────┬──────────────┘
                                  │ OIDC + JWKS   │ REST admin API
              ┌───────────────────┼───────────────┼────────────────────┐
              ▼                   ▼               ▼                    ▼
   oidc-client-ts          @elegantys/      @elegantys/           mcp-polizei
   (any SPA: Angular,      polisafe         polisafe-next         (AI agents /
    React, Vue…)           (NestJS APIs)    (Next.js APIs)         LLM tools)
```

### Feature list

**Identity & protocol**
- OAuth 2.0 grants: `authorization_code` (+PKCE S256/plain), `implicit` (`response_type=token`), `password`, `client_credentials`, `refresh_token` **with rotation**.
- OpenID Connect: discovery, userinfo, RS256 `id_token`, per-tenant JWKS, end-session.
- RFC 7009 token revocation; single-use authorization codes (TTL configurable); audit logging of token events.
- Public vs confidential clients; per-client scopes allow-list, token TTL (`meta.access_token_expire`), audiences and permission-inclusion flags.

**Users & access**
- Users, roles, permissions (one permission per API route path + HTTP verb), role↔user and permission↔role relations.
- Multi-tenant **hierarchical scopes** (unlimited children per business); tenant-boundary enforcement on every admin call.
- Invitations (email + role), self-registration, email/account activation, password recovery, change password.
- Magic-link login and **social providers** (Google, GitHub, custom OAuth/OIDC) with PKCE state cookies.

**Admin & developer**
- Full management REST API + Swagger; Angular admin console; analytics dashboard (auth/users/RBAC/invitations/geo/risk).
- Machine-to-machine `polizei/io/authorization` endpoint for runtime permission checks between services.
- Brandable server-rendered login/consent pages and per-tenant UI settings (`get-scope-settings` / `set-scope-settings`).
- File upload API for profile pictures (10 MB, common image/document formats).
- MCP server so AI assistants can administer users/roles/permissions/tenants/clients.

---

---

## 🧱 Concepts & architecture

### Terminology

| Term | Meaning |
|---|---|
| **Scope / tenant / business** | Organizational container. Scopes form a **tree**: a root scope with unlimited child scopes, each child able to have children. Users, roles, permissions, invitations and OAuth clients always belong to a scope (`idScope` points to the parent scope). |
| **User** | Person or service account: `username`, `fullname`, `profile` (JSON: `email`, `phone`, `picture`, …), `state` (`1` active), bcrypt-hashed `password`. Belongs to many scopes and roles via join tables. |
| **Role** | Named group of permissions **inside one scope** (e.g. `Polizei Admin`). |
| **Permission** | Atomic unit of authorization. `name` = the protected route path (e.g. `/v1/users`), `settings.type` = HTTP verb (`GET`, `POST`, …), `settings.folder` = UI grouping, `idScope` = owner scope. |
| **OAuth client** | A registered application: `clientId` (public identifier), secret (compared to stored `clientSecretHash`), `type` (`public`/`confidential`), `grants[]`, `redirectUris[]`, `postLogoutRedirectUris[]`, allow-listed `scopes`, `tenant`, `meta` (per-client TTL, audiences, permission inclusion). |
| **Access token** | RS256 JWT signed with the **active RSA signing key of the tenant**. |
| **Refresh token** | Opaque random string persisted server-side; **rotated on each use** and revocable. |
| **id_token** | OIDC JWT: `iss`, `sub`, `aud` (= clientId) + claims requested via scopes. |
| **Session cookie** | `a-<clientId>` httpOnly cookie used by the browser login/consent flow on the authorization server. |
| **Tenant context** | Protected management APIs resolve the *active* tenant from the `X-Tenant` header (must be a member of the token `tenants` claim); otherwise the first tenant of the claim is used. |

### How permissions are checked

Polisafe supports three enforcement levels, configured at server boot through `PolisafeSdkModule.register(...)` (see [NestJS SDK](#-nestjs-sdk--elegantyspolisafe)):

| Mode | `permissionCheck` | `checkProviderPermissions` | Behaviour |
|---|---|---|---|
| **Auth only** (default) | `false` | – | JWT signature + tenant boundary only. Fine-grained permission check skipped (fast, useful while wiring routes). |
| **Local (token)** | `true` | `false` | Guard reads the `permissions` claim embedded in the access token and matches `{name, type}` against the route path + HTTP method. Requires `meta.access_token_include_permissions: true` on the client. |
| **Remote (provider)** | `true` | `true` | Guard asks Polisafe `POST {PREFIX}/polizei/io/authorization` with `{url, method, sub}` using a machine token. Always up-to-date; adds one HTTP round-trip. |

A *permission match* means: a permission exists whose `name` equals the route (the path or an explicit `@Permission('name')`) **and** whose `type` equals the HTTP method (`settings.type`).

### First-boot bootstrap (auto-seed)

`CreatorService` (`src/polizei-engine/services/creator.service.ts`) runs once on the first boot:

1. Creates the **root scope** `Polizei` (`id = 1` in a fresh DB) with default UI settings.
2. Creates the role **`Polizei Admin`** and the user **`admin` / `admin`** (⚠️ change it immediately) inside the root scope with all permissions.
3. Reads the Swagger document and creates **one permission per API route** (`name` = full path incl. `APP_PREFIX`, `settings.type` = HTTP verb, `settings.folder` = `Polisafe/<tag>`).
4. Seeds the **base OAuth scopes**: `openid profile email address phone offline_access groups security:io:authorization security:io:tenants`.
5. Creates the **default OAuth client** (`Default`, `type: public`, grants `authorization_code client_credentials password refresh_token`, redirect `{PLS_PUBLIC_URL}/app/callback`, post-logout `{PLS_PUBLIC_URL}/app/logout`) linked to all base scopes.
6. Writes the runtime UI config to `ui/app/assets/config/prod.json` (oauth client_id, authority, URIs, service URL) and cleans `dev.json`.
7. Records the installation as an internal audit entry (`state = 20`, description `clientId:clientSecret:scopeId`) — if it exists, no re-seed happens.

To force a fresh seed after wiping the database, remove that installation marker and restart the server.

---

## 🚀 Public sandbox — try it now

The instance at **https://polisafe.elegantys.net** runs with **`APP_PREFIX=/api/v5/security`**.

| Surface | URL |
|---|---|
| Landing | <https://polisafe.elegantys.net> |
| Admin console | <https://polisafe.elegantys.net/app> |
| OIDC discovery | <https://polisafe.elegantys.net/api/v5/security/polisafe/.well-known/openid-configuration> |
| Swagger / OpenAPI | `https://polisafe.elegantys.net/api/v5/security/docs` (JSON at `…/docs-json`) |
| Preview images | <https://polisafe.elegantys.net/ps-dashboard.png> · <https://polisafe.elegantys.net/ps-map.png> |

```bash
curl -s https://polisafe.elegantys.net/api/v5/security/polisafe/.well-known/openid-configuration
```

```json
{
  "issuer": "https://polisafe.elegantys.net",
  "authorization_endpoint": "https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/auth",
  "token_endpoint": "https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/token",
  "userinfo_endpoint": "https://polisafe.elegantys.net/api/v5/security/polisafe/openid/userinfo",
  "revocation_endpoint": "https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/revoke",
  "end_session_endpoint": "https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/logout",
  "jwks_uri": "https://polisafe.elegantys.net/api/v5/security/polisafe/openid/:tenant/certs",
  "grant_types_supported": ["authorization_code", "refresh_token", "password", "client_credentials"],
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "response_modes_supported": ["query"]
}
```

![Polisafe map / geo analytics](https://polisafe.elegantys.net/ps-map.png)

> **Note on `jwks_uri`:** it is advertised with a literal `:tenant` segment. Keys are per tenant and live at `GET {PREFIX}/polisafe/openid/<tenantId>/certs`. If you consume discovery with a strict OIDC client, provide that concrete URL (see [SPA integration](#-spa-integration-with-oidc-client-ts)).

---

## 🧪 Quick start — exercise the OAuth flows

> Examples target the sandbox prefix `https://polisafe.elegantys.net/api/v5/security`; for a local instance use `http://localhost:3000/api/v4/security` (or whatever `APP_PREFIX` you configured). The **shared sandbox is a demo**: admin CRUD examples are best run on your own instance (first-boot user `admin` / `admin`).

### 1) Login a user (`password` grant)

```bash
curl -s -X POST https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=admin&password=ADMIN_PASSWORD&scope=openid profile"
```

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkYzE0…",
  "expires_in": 900,
  "token_type": "Bearer",
  "scope": "openid profile",
  "id_token": "eyJhbGciOiJSUzI1NiIs…",
  "refresh_token": "6f8b3c2a9e1d…"
}
```

### 2) Query the current user

```bash
curl -s https://polisafe.elegantys.net/api/v5/security/polizei/profile/user?includePermissions=true \
  -H "Authorization: Bearer $ACCESS_TOKEN" -H "X-Tenant: 1"
```

### 3) Machine-to-machine (`client_credentials`)

```bash
curl -s -X POST https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&scope=security:io:authorization security:io:tenants"
```

### 4) Browser login (`authorization_code` + PKCE)

Open (PKCE is mandatory):

```
https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/auth?response_type=code&client_id=CLIENT_ID&redirect_uri=https%3A%2F%2Fapp.example%2Fcallback&scope=openid%20profile&state=xyz&code_challenge=<S256_BASE64URL_OF_VERIFIER>&code_challenge_method=S256
```

Polisafe renders **login → consent**, then redirects to `https://app.example/callback?code=…&state=xyz`. Exchange the code (public client: no secret needed):

```bash
curl -s -X POST https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&client_id=CLIENT_ID&redirect_uri=https%3A%2F%2Fapp.example%2Fcallback&code=AUTH_CODE&code_verifier=PKCE_VERIFIER"
```

### 5) Refresh / revoke / userinfo / logout

```bash
# Refresh (rotates the refresh token)
curl -s -X POST https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=REFRESH_TOKEN"

# Revoke (RFC 7009)
curl -s -X POST https://polisafe.elegantys.net/api/v5/security/polisafe/oauth/revoke \
  -u "CLIENT_ID:CLIENT_SECRET" -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=TOKEN&token_type_hint=refresh_token"      # → { "ok": true }

# Userinfo
curl -s https://polisafe.elegantys.net/api/v5/security/polisafe/openid/userinfo \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# End session (all three params required) — browser redirect
# …/polisafe/oauth/logout?id_token_hint=ID_TOKEN&client_id=CLIENT_ID&post_logout_redirect_uri=URI&state=STATE
```

---

---

## 🔧 Self-hosting installation

### Requirements

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| PostgreSQL | ≥ 14 (schemas `security` + `oauth`) |
| Redis | optional, recommended for caching |
| Docker | optional (20+ / Compose v2) |

### 1. Clone & configure

```bash
git clone <your-polisafe-repository-url>
cd polizei
cp .env .env.local        # adjust values (never commit real secrets)
```

### 2. Environment variables

The complete reference lives in the [Appendix](#appendix-full-environment-variables). Minimum viable set:

```env
NODE_ENV=development
PORT=3000
APP_PREFIX=/api/v5/security
PLS_PUBLIC_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_DIALECT=postgres
DB_NAME=polisafe
SCHEMAS=security,oauth

PLS_JWT_ACCESS_EXPIRES_IN=15m
PSL_JWT_REFRESH_EXPIRES_IN=1h
PLS_ORIGIN_COOKIE_SECRET=change-me-64-chars-random
```

### 3. Install, migrate, run

```bash
npm install

# Creates the PostgreSQL schemas declared in SCHEMAS (security, oauth)
npm run migrate

# Development (watch mode) — http://localhost:3000
npm run start:dev

# Production
npm run build
npm run start:prod
```

Verify:

- Swagger UI: `http://localhost:3000/api/v5/security/docs`
- Discovery: `http://localhost:3000/api/v5/security/polisafe/.well-known/openid-configuration`
- Landing: `http://localhost:3000/`
- Admin console: `http://localhost:3000/app`

### 4. Docker (recommended)

```bash
docker build -t polisafe:0.1.7 .
docker run -d --name polisafe -p 3000:3000 --env-file .env polisafe:0.1.7
```

The image removes `.env` during the build (inject config at runtime) and runs `npm run start:prod`. For schema init on boot use the package script: `npm run docker:start` (= `npm run migrate && npm run start:prod`).

The compose file in the repo runs **Redis** (cache) only. A full-stack template (PostgreSQL + Redis + service):

```yaml
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: change-me-strong
      POSTGRES_DB: polisafe
    volumes: [ pgdata:/var/lib/postgresql/data ]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes: [ redis-data:/data ]
    command: redis-server --appendonly yes

  polizei:
    build: .
    ports: ["5404:3000"]
    environment:
      NODE_ENV: production
      PORT: 3000
      APP_PREFIX: /api/v5/security
      PLS_PUBLIC_URL: https://id.your-domain.com   # external HTTPS origin = OIDC issuer
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASS: change-me-strong
      DB_DIALECT: postgres
      DB_NAME: polisafe
      SCHEMAS: security,oauth
      REDIS_URL: redis://redis:6379
      PLS_ORIGIN_COOKIE_SECRET: <64-random-chars>
    depends_on:
      db: { condition: service_healthy }
    command: sh -c "npm run migrate && npm run start:prod"

volumes:
  pgdata:
  redis-data:
```

```bash
docker compose up -d --build
```

Behind Traefik/Caddy/nginx, proxy your domain to container port `3000`. `PLS_PUBLIC_URL` must equal the external HTTPS origin (it becomes the `issuer`, cookie domain and UI base).

### 5. After first boot

1. Log in to the admin console (`/app`) with **`admin` / `admin`**.
2. **Change that password immediately** (`POST {PREFIX}/polizei/profile/password`).
3. Create your tenants, roles/permissions and OAuth clients — through the console, the [management API](#-api-reference), the [MCP server](#-mcp-polizei--run-your-iam-with-ai-agents), or the [SDKs](#-nestjs-sdk--elegantyspolisafe).

---

---

# 📡 API reference

> Everything below is served under the global prefix:
>
> ```
> BASE = {PLS_PUBLIC_URL}{APP_PREFIX}
> e.g.  https://polisafe.elegantys.net/api/v5/security      (public sandbox)
>       http://localhost:3000/api/v4/security               (repo default dev)
> ```

## Conventions

**Authentication**
- **User/Admin APIs** → `Authorization: Bearer <access_token>` (user or machine token depending on the route) + optional `X-Tenant: <scopeId>`.
- **OAuth token/revoke** → HTTP Basic with the client (`Authorization: Basic base64(client_id:client_secret)`), or body `credentials_basic: {client_id, client_secret}` for public/edge cases.
- **IO API** (`polizei/io/*`) → Bearer **client** token whose `scope` contains `security:io:*`.
- **Micro API** (`polizei/micro/*`) → legacy `apiKey` (header or body).

**Tenant resolution (user tokens)**

1. If the request sends `X-Tenant`, that value is used **only if it belongs to the token's `tenants` claim**; otherwise `401 Tenant boundaries out of scope`.
2. If no header is sent, the **first** tenant in the `tenants` claim is used.
3. Admin "scoped" endpoints also take an explicit target (`id`, `idScope`, `tenant`) which must be inside the active tenant's subtree.

**Bodies & responses**

- Admin CRUD bodies are flexible JSON (`Record<string, any>`) validated by services, not by DTO pipes (typed DTOs exist for register / profile update / password / IO authorization). The examples below show the canonical fields used by the services and by the embedded admin console.
- Errors follow HTTP status codes with a JSON `{ statusCode, message, error }` (Nest default) or RFC-style `{ error, error_description }` (token endpoint).

## OAuth 2.0 / OpenID Connect endpoints

### Discovery

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `{PREFIX}/polisafe/.well-known/openid-configuration` | – | OIDC discovery document |

See the sandbox section above for the exact JSON.

### Authorization

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `{PREFIX}/polisafe/oauth/auth` | optional `a-<clientId>` cookie | Authorization endpoint. Renders login → consent → redirects with `?code=…&state=…` (code) or `#access_token=…` (implicit). |
| `POST` | `{PREFIX}/polisafe/oauth/auth` | – | (stub; `form_post` response mode not implemented) |
| `POST` | `{PREFIX}/polisafe/oauth/auth/login` | origin cookie | Browser login form action; sets session cookie or fires magic link. |
| `POST` | `{PREFIX}/polisafe/oauth/auth/consent` | session cookie | Records user consent → creates the authorization code. |
| `GET` | `{PREFIX}/polisafe/oauth/register` | – | Registration page (rendered; disabled unless the client config enables it). |
| `GET` | `{PREFIX}/polisafe/oauth/recover` | – | Password recovery page. |
| `GET` | `{PREFIX}/polisafe/oauth/provider?provider=google` | – | Start external-provider login (Google/GitHub/custom). |
| `GET` | `{PREFIX}/polisafe/oauth/callback` | – | External-provider callback. |
| `GET` | `{PREFIX}/polisafe/oauth/callback-magic` | – | Magic-link callback. |
| `GET` | `{PREFIX}/polisafe/oauth/logout` | session cookie | End session, redirect to `post_logout_redirect_uri`. |

**`GET /auth` query parameters** (OIDC `AuthRequestDto`):

| Param | Required | Notes |
|---|---|---|
| `response_type` | yes | `code` or `token` |
| `client_id` | yes | Registered client |
| `redirect_uri` | yes | Must match a registered redirect URI |
| `scope` | no | Space-separated, must be within client's allow-list |
| `state` | recommended | Echoed back on redirect (CSRF) |
| `code_challenge` | yes | **PKCE is mandatory** |
| `code_challenge_method` | yes | `S256` (or `plain`) |
| `nonce`, `prompt`, `display`, `max_age`, `login_hint`, `ui_locales`, `id_token_hint`, `acr_values` | no | Standard OIDC hints (parsed; `nonce` is not yet echoed in the id_token) |

Browser flow in one line (code + PKCE):

```
GET {PREFIX}/polisafe/oauth/auth?response_type=code&client_id=…&redirect_uri=…&scope=openid%20profile&state=xyz&code_challenge=…&code_challenge_method=S256
```

After the user logs in (server-rendered page) and approves consent (only the first time per user+client+scope), the server redirects:

```
https://app.example/callback?code=<AUTH_CODE>&state=xyz
```

**`POST /auth/consent`** (called by the consent page) body:

```json
{
  "clientId": "…",
  "redirectUri": "https://app.example/callback",
  "scope": "openid profile",
  "codeChallenge": "…",
  "codeChallengeMethod": "S256",
  "state": "xyz",
  "decision": "allow"
}
```

### Token endpoint

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `{PREFIX}/polisafe/oauth/token` | HTTP Basic (client) | Exchanges credentials/code/refresh token for tokens. |

`Content-Type: application/x-www-form-urlencoded`. Supported `grant_type` values and their fields:

| grant_type | Required body fields | Optional | Notes |
|---|---|---|---|
| `authorization_code` | `code`, `client_id`, `redirect_uri`, `code_verifier` | `credentials_basic` | PKCE verified (S256/plain); code is single-use. Public clients skip the secret. |
| `password` | `username`, `password` | `scope`, `credentials_basic` | Client Basic required; returns `access_token` + `refresh_token` + `id_token` (when `openid` scope). |
| `client_credentials` | (client Basic) | `scope` | Machine token: `sub == client_id`. No refresh/id token. |
| `refresh_token` | `refresh_token` | `client_id` (public) | **Rotates**: old refresh token is revoked, a new pair is issued. |
| `token` (legacy alias) | – | – | Legacy alias accepted by the pipe. |

Success response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkYzE0…",
  "expires_in": 900,
  "token_type": "Bearer",
  "scope": "openid profile",
  "id_token": "eyJhbGciOiJSUzI1NiIs…",
  "refresh_token": "6f8b3c2a9e1d…"
}
```

Error response (RFC 6749 style):

```json
{ "error": "invalid_grant", "error_description": "…" }
```

**Full examples**

`password`:

```bash
curl -s -X POST {PREFIX}/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=alice&password=s3cret&scope=openid profile"
```

`client_credentials`:

```bash
curl -s -X POST {PREFIX}/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&scope=security:io:authorization security:io:tenants"
```

`refresh_token`:

```bash
curl -s -X POST {PREFIX}/polisafe/oauth/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=REFRESH_TOKEN"
```

### Revocation & introspection

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `{PREFIX}/polisafe/oauth/revoke` | HTTP Basic client | RFC 7009 revoke an access or refresh token. |
| `POST` | `{PREFIX}/polisafe/openid/instrospect` | – | ⚠️ stub (returns empty); the discovery advertises a slightly different path. Not usable yet. |

Revoke body (`application/x-www-form-urlencoded`): `token`, `token_type_hint` (`access_token` | `refresh_token`), optional `client_id`. Response `{ "ok": true }`.

### UserInfo

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `{PREFIX}/polisafe/openid/userinfo` | Bearer token + `openid` scope | OIDC claims of the caller. |

```bash
curl -s {PREFIX}/polisafe/openid/userinfo -H "Authorization: Bearer $ACCESS_TOKEN"
```

Response shape (per requested scope):

```json
{
  "sub": "42",
  "iss": "https://id.your-domain.com",
  "aud": "…",
  "preferred_username": "alice",
  "name": "Alice Example",
  "email": "alice@example.com",
  "email_verified": true,
  "tenants": [1, 14],
  "roles": [1],
  "permissions": [ { "name": "/v1/invoices", "type": "POST" } ]
}
```

### JWKS

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `{PREFIX}/polisafe/openid/:tenant/certs` | – | JWKS (RS256 public keys) of one tenant. |

```bash
curl -s {PREFIX}/polisafe/openid/1/certs
```

```json
{
  "keys": [
    { "alg": "RS256", "kty": "RSA", "use": "sig", "kid": "5dc14…", "n": "…", "e": "AQAB", "x5c": ["…"] }
  ]
}
```

### Logout (end session)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `{PREFIX}/polisafe/oauth/logout` | session cookie | Validates `id_token_hint` + client + `post_logout_redirect_uri`, revokes the access token, clears the `a-<clientId>` cookie, redirects. |

Query parameters (all required): `id_token_hint`, `client_id`, `post_logout_redirect_uri` (+ optional `state`).

---

---

## 👥 Users (admin) — `{PREFIX}/polizei/admin/user`

Class-level guard: `@Permission()` → `Authorization: Bearer` (user token) + `X-Tenant` when needed.

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | `id` (scope), `offset`, `search`, `limit` (default 50) | Users of a scope (paginated, optional LIKE on username/fullname). |
| `POST` | `/create` | JSON user (below) | Create a user inside `idScope`. |
| `POST` | `/update` | JSON user | Update user (by `id`); `profile` merges. |
| `POST` | `/delete` | `{ "id": 42 }` | Delete a user. |
| `POST` | `/add-roles` | `{ "id", "roles": [1,2], "context": true }` | Assign roles (**replaces** current set). `context: true` scopes assignment to the active tenant. |
| `POST` | `/delete-user-scope` | `{ "idScope", "username" }` | Remove a user from a scope. |

**Create** — canonical body:

```json
{
  "idScope": 1,
  "username": "alice",
  "password": "S3cure!Pass",
  "fullname": "Alice Example",
  "state": 1,
  "profile": { "email": "alice@example.com", "phone": "+1 555 0100", "picture": "…" }
}
```

**List** — `GET {PREFIX}/polizei/admin/user/list?id=1&search=ali&limit=50`. Response: array of

```json
[
  {
    "id": 2,
    "username": "alice",
    "fullname": "Alice Example",
    "profile": { "email": "alice@example.com" },
    "state": 1,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

## 🎭 Roles (admin) — `{PREFIX}/polizei/admin/roles`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | `id` (scope) | Roles of a scope/tenant. |
| `GET` | `/list-assign` | `id` (scope) | Roles the token may assign (used by invitation/profile flows). |
| `POST` | `/create` | `{ "idScope", "name", "description" }` | Create a role in a scope. |
| `POST` | `/update` | `{ "id", "name", "description" }` | Update a role. |
| `POST` | `/delete` | `{ "id" }` | Delete a role. |
| `GET` | `/list-permissions` | `id` (role) | Permissions currently granted to the role. |
| `POST` | `/add-permissions` | `{ "id": 5, "permissions": [12,13] }` | Assign permissions (**replaces** current set). |

Example:

```bash
# Create
curl -s -X POST {PREFIX}/polizei/admin/roles/create -H "Authorization: Bearer $T" -H "X-Tenant: 1" \
  -H "Content-Type: application/json" \
  -d '{"idScope":1,"name":"Billing Admin","description":"Manages invoices"}'

# Grant permissions
curl -s -X POST {PREFIX}/polizei/admin/roles/add-permissions -H "Authorization: Bearer $T" -H "X-Tenant: 1" \
  -H "Content-Type: application/json" -d '{"id":5,"permissions":[12,13,14]}'
```

## 🔑 Permissions (admin) — `{PREFIX}/polizei/admin/permissions`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | `id?` (scope) | Flattened permission list of the token tenant (or a scope). |
| `POST` | `/create` | `{ "name", "description", "idScope", "settings"? }` | Create a permission (`name` = resource path, e.g. `/v1/invoices`). |
| `POST` | `/update` | `{ "id", "name", "description", "settings"? }` | Update a permission. |
| `POST` | `/delete` | `{ "id" }` or `{ "ids": [] }` or `{ "children": [...] }` | Delete one, many, or a group node. |
| `POST` | `/import` | `{ "idScope": 0, "items": [ …permissions ] }` | Bulk import permissions into a scope (`idScope: 0` → token tenant). |

A permission row (what `list` returns):

```json
{
  "id": 101,
  "name": "/api/v5/security/polizei/admin/user/list",
  "description": "List users",
  "idScope": 1,
  "settings": { "folder": "Polisafe/User", "type": "GET" }
}
```

> On a fresh install every API route is auto-registered as a permission (see *First-boot bootstrap*), so admin roles already cover the whole management API. For your own business APIs, register permissions for each path + verb you protect, then attach them to roles.

## 🏢 Scopes / tenants (admin) — `{PREFIX}/polizei/admin/scope`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | `id` (parent scope) | Child scopes of a parent (business tree). |
| `GET` | `/list-all` | – | Full tree of the **active** tenant (`X-Tenant` context). |
| `POST` | `/create` | `{ "idScope", "name", "description", "settings"? }` | Create a child scope/tenant. |
| `POST` | `/update` | `{ "id", "name", "description", "settings"? }` | Update a scope. |
| `POST` | `/delete` | `{ "id" }` | Delete a scope. |
| `GET` | `/review` | – | Review/config of the token tenant. |
| `POST` | `/add-user` | `{ "username", "idScope" }` (`idScope: 0` → token tenant) | Add an existing user to a scope. |

Example — create a customer tenant and add a user:

```bash
curl -s -X POST {PREFIX}/polizei/admin/scope/create -H "Authorization: Bearer $T" -H "X-Tenant: 1" \
  -H "Content-Type: application/json" \
  -d '{"idScope":1,"name":"Acme GmbH","description":"A customer business"}'

curl -s -X POST {PREFIX}/polizei/admin/scope/add-user -H "Authorization: Bearer $T" -H "X-Tenant: 1" \
  -H "Content-Type: application/json" -d '{"username":"alice","idScope":14}'
```

## 💌 Invitations (admin) — `{PREFIX}/polizei/admin/invitation`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | – | Invitations of the token tenant. |
| `POST` | `/create` | `{ "username"?, "email", "roles": [..], "meta"? }` | Create an invitation (author taken from token, scope forced to token tenant). |
| `POST` | `/delete` | `{ "id" }` | Delete an invitation. |
| `GET` | `/list-roles` | – | Roles assignable to invitations. |
| `GET` | `/list-users` | `offset`, `limit` | Tenant users (for role assignment in invitations). |
| `POST` | `/reject-user` | `{ "idScope", "id"? | "username"? }` | Remove a user from a scope (reject an invitation). |
| `POST` | `/add-roles` | `{ "id" (user), "roles": [] }` | Assign roles to an invited user. |

## 🧩 OAuth clients & OAuth scopes (admin)

### Clients — `{PREFIX}/polizei/admin/oauth/clients`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | `id` (tenant) | Clients of a tenant. |
| `POST` | `/create` | JSON client (below) | Create a client. `tenant` field maps via `@MapTenant`. |
| `POST` | `/update` | `{ "id" (uuid), … }` | Update a client (by internal UUID). |
| `POST` | `/delete` | `{ "id" (uuid) }` | Delete a client. |
| `GET` | `/list-scopes` | `id` (tenant) | OAuth scopes available for clients of the tenant. |

Client object shape (creation returns the generated `clientId` + `clientSecret` once):

```json
{
  "tenant": 1,
  "name": "My Web App",
  "type": "public",
  "grants": ["authorization_code", "client_credentials", "refresh_token"],
  "redirectUris": ["https://app.example/callback"],
  "postLogoutRedirectUris": ["https://app.example/logout"],
  "scopes": [1, 2, 3],
  "meta": {
    "access_token_expire": "15m",
    "access_token_include_permissions": true,
    "openid_include_permissions": false,
    "audiences": ["https://api.example.com"]
  }
}
```

| Field | Meaning |
|---|---|
| `type` | `public` (SPA/mobile) or `confidential` (backend) |
| `grants` | `authorization_code`, `implicit`, `password`, `client_credentials`, `refresh_token` |
| `scopes` | ids of the OAuth scopes the client may request (allow-list) |
| `meta.access_token_expire` | per-client access-token TTL (default `PLS_JWT_ACCESS_EXPIRES_IN`) |
| `meta.access_token_include_permissions` | embed `roles` + `permissions` claims in access tokens |
| `meta.openid_include_permissions` | embed `permissions` in id_tokens |
| `meta.audiences` | `aud` claim override for access tokens |

### OAuth scopes — `{PREFIX}/polizei/admin/oauth/scopes`

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/list` | – | OAuth scopes of the token tenant. |
| `POST` | `/create` | `{ "name", "description", "displayName"? }` | Create an OAuth scope (e.g. `read:users`). |
| `POST` | `/update` | `{ "id", "name", "description" }` | Update. |
| `POST` | `/delete` | `{ "id" }` | Delete. |

---

---

## 📊 Dashboard (admin) — `{PREFIX}/polizei/admin/dashboard`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Bearer + `X-Tenant` | Aggregated security analytics of the active tenant. |

Query parameters (all optional):

| Param | Values | Default |
|---|---|---|
| `granularity` | `hour` `day` `week` `month` | `day` |
| `section` | `auth` `users` `rbac` `invitations` `geo` `risk` | all sections |
| `scopeIds` | comma-separated scope ids | all user scopes |
| `from` / `to` | ISO dates | last 30 days / now |

Response: `meta` (applied params) + one array of widgets per section. Widgets share `{ id, title, type, granularity, updatedAt, data }` with types `statCard`, `donut`, `line/area/bar`, `gauge`, `ranking`, `heatmap`, `table`, `funnel`, `map`. Full contract: [`docs/dashboard-api.md`](docs/dashboard-api.md).

```bash
curl -s "{PREFIX}/polizei/admin/dashboard?section=users&granularity=day" \
  -H "Authorization: Bearer $T" -H "X-Tenant: 1"
```

## 👤 Profile / self-service — `{PREFIX}/polizei/profile`

These routes operate on the **authenticated user** and do not require `X-Tenant` (but accept it).

| Method | Path | Body / Query | Description |
|---|---|---|---|
| `GET` | `/user` | `includePermissions` (bool), `createDefaultScope` (bool) | Own profile + scopes (+ optionally permissions). |
| `POST` | `/update` | `{ "fullname", "profile": { email, phone, picture, address } }` | Update own profile (`profile` merges). |
| `POST` | `/password` | `{ "currentPassword", "newPassword", "confirmPassword" }` | Change own password. |
| `GET` | `/permissions` | – | Flat permission list across own roles. |
| `GET` | `/scopes` | – | Scopes (tenants) the user belongs to. |
| `GET` | `/search-user` | `username` | Search users by username (iLike). |
| `POST` | `/save-scope` | `{ "id"?, "name", "description", "users": [{id}] }` | Create an own scope (business) or update it (owner). |
| `POST` | `/delete-scope` | `{ "id", "force"? }` | Delete an own scope (`force` only as owner). |
| `GET` | `/get-scope-settings` | `app`, `id`? (tenant) | Tenant settings of an app (defaults to active tenant). |
| `POST` | `/set-scope-settings` | `{ "app", "settings": [{key, value}], "id"? }` | Replace an app's settings for a tenant. |

Examples:

```bash
# Who am I?
curl -s {PREFIX}/polizei/profile/user?includePermissions=true -H "Authorization: Bearer $T"

# Change password
curl -s -X POST {PREFIX}/polizei/profile/password -H "Authorization: Bearer $T" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old","newPassword":"NewS3cure!","confirmPassword":"NewS3cure!"}'

# App settings (e.g. branding for app "polisafe-mywebapp")
curl -s "{PREFIX}/polizei/profile/get-scope-settings?app=polisafe-mywebapp" -H "Authorization: Bearer $T"
```

## Machine-to-machine IO API

Consumed by other services to ask Polisafe about permissions/users. Requires a **client token** with scope claims.

| Method | Path | Required scope | Body / Query | Description |
|---|---|---|---|---|
| `POST` | `/authorization` | `security:io:authorization` | `{ "url", "method"?, "sub" }` | Runtime authorization: can `sub` perform `method` on `url` inside the client's tenant? Writes an audit trace. 200 = allowed, 404/403 = denied. |
| `GET` | `/tenants` | `security:io:tenants` | – | Tenant tree of the client's tenant. |

```bash
# Runtime check
curl -s -X POST {PREFIX}/polizei/io/authorization \
  -H "Authorization: Bearer $CLIENT_TOKEN" -H "Content-Type: application/json" \
  -d '{"url":"/v1/invoices","method":"POST","sub":42}'
```

> `url` must equal a permission `name` and `method` its `settings.type`. This is the endpoint used by the SDK in **remote** mode and by the `@Permission()` guard of external NestJS services.

## 🧪 Legacy micro API — `{PREFIX}/polizei/micro`

Action-style endpoints guarded by an **API key** (`@ApiPermission()`; header `apiKey` or body `apiKey`). Mostly superseded by the IO API and the SDK. Routes: `authorization`, `scopes`, `users-scope`, `users-search`, `scope`, `auth-scope`, `get-user-token`, `get-user-payload`, `add-user-scope`, `create-user`, `add-user-role(s)`, `remove-user-roles`, `list-user-roles`, `delete-user-scope`, `scope-owner`, `scopes-ids`, `edit-scope` — all `POST`.

Example:

```bash
curl -s -X POST {PREFIX}/polizei/micro/authorization \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"sk_…","username":"alice","url":"/v1/invoices"}'
```

## 📤 Uploads — `{PREFIX}/polizei/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/file` | `@Permission()` (Bearer) | Multipart `file` field; ≤10 MB; `jpeg/jpg/png/gif/pdf/doc/docx/txt`; saved to `FILES_HUB` (default `./uploads`). |
| `POST` | `/file/:customName` | public (no guard) | Upload with a custom filename. |
| `GET` | `/file/:filename` | public | Stream the file (inline). |
| `DELETE` | `/file/:filename` | `@Permission()` | Delete the file. |

## Status codes & error format

| Code | Meaning |
|---|---|
| `200` | OK (also returned for many `POST` actions) |
| `400` | Bad request / invalid token request (`invalid_request`, `invalid_scope`, …) |
| `401` | Unauthenticated — missing/invalid token, wrong client secret, tenant out of scope |
| `403` | Authenticated but not authorized (permission denied) |
| `404` | Not found / IO authorization denied |
| `406` | `@UserToken`/`@MapTenant` contract violations (`Not Acceptable`) |
| `409` | Conflict (project already created, duplicate) |
| `5xx` | Server error |

Admin/engine errors are Nest defaults `{ statusCode, message, error }`; token endpoint errors are RFC-style `{ error, error_description }`; MCP tool errors map 400→`InvalidParams`, 401/403/404→`InvalidRequest`, others→`InternalError`.

---

---

# 🔌 NestJS SDK — `@elegantys/polisafe`

Official NestJS integration (`sdk-polisafe`, published as `@elegantys/polisafe`). It verifies tokens against the **per-tenant JWKS** of your Polisafe server, resolves the active tenant, enforces permissions (locally from token claims or remotely via the IO API) and manages a **machine token** for `client_credentials`.

## Installation

```bash
npm install @elegantys/polisafe
# or, from a local checkout of the SDK (npm supports any path):
npm install ./path/to/sdk-polisafe
```

> NestJS ≥ 10. Peer dependencies (`@nestjs/common`, `@nestjs/jwt`, `@nestjs/axios`, `@nestjs/schedule`, `passport`, `passport-jwt`, `jwks-rsa`, …) auto-install with npm ≥ 7.

## Register in the root module

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PolisafeSdkModule } from '@elegantys/polisafe';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PolisafeSdkModule.register({
      serviceUrl: process.env.POLIZEI_SERVICE_URL ?? '',   // https://polisafe.elegantys.net/api/v5/security
      issuer: process.env.POLIZEI_ISSUER ?? '',            // https://polisafe.elegantys.net
      client_id: process.env.POLIZEI_CLIENT_ID,            // confidential client for machine token
      client_secret: process.env.POLIZEI_CLIENT_SECRET,
      scope: process.env.POLIZEI_SCOPE ?? 'security:io:authorization security:io:tenants',
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      permissionCheck: process.env.POLIZEI_PERMISSION_CHECK !== 'false',
      logging: process.env.POLIZEI_LOGGING === 'true',
      checkProviderPermissions: true,   // true → Polisafe decides via IO API; false → token permissions claim
    }),
  ],
})
export class AppModule {}
```

`.env` of the consuming service (the de-facto convention used by production consumers):

```env
POLIZEI_SERVICE_URL=https://polisafe.elegantys.net/api/v5/security
POLIZEI_ISSUER=https://polisafe.elegantys.net
POLIZEI_CLIENT_ID=…
POLIZEI_CLIENT_SECRET=…
POLIZEI_SCOPE=security:io:authorization security:io:tenants
POLIZEI_MODE=production
POLIZEI_PERMISSION_CHECK=true
POLIZEI_LOGGING=true
```

### Options (`ConfigPolizei`)

| Option | Default | Meaning |
|---|---|---|
| `serviceUrl` | – (required) | Polisafe base incl. prefix — used for JWKS, token endpoint, IO API |
| `issuer` | – (required) | Expected `iss` claim of tokens |
| `client_id` / `client_secret` | – | Confidential client used for the machine token (`client_credentials`) |
| `scope` | – | Scopes of the machine token |
| `mode` | `development` | `production` / `development` (verbosity) |
| `permissionCheck` | `true` | `false` disables permission enforcement entirely (dev only) |
| `checkProviderPermissions` | `true` | `true` = remote IO check · `false` = token `permissions` claim |
| `logging` | `false` | Extra logs |
| `audience` | – | Accepted but not enforced today |

⚠️ `register()` is **synchronous** — options must be resolvable at import time (there is **no** `registerAsync`).

## Protecting routes — decorators & guards

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Permission, Scope, UserToken, TokenInfo, MapTenant, TokenPayload } from '@elegantys/polisafe';

@Controller('orders')
@Permission()                                // class-level: authenticate + tenant + authorize every route
export class OrdersController {

  @Get()
  @Permission('orders:read')                 // method-level permission name (additive)
  list(@UserToken() user: TokenPayload) {
    return { userId: user.sub, tenant: user.tenant, items: [] };
  }

  @Post()
  @Permission('orders:create')
  create(@Body() body: unknown, @TokenInfo() token: TokenPayload) {
    return { createdBy: token.id, username: token.preferred_username, isClient: token.is_client };
  }

  // Scope + token-type guard: only machine (client) tokens holding the OAuth scope may call it
  @Get('internal')
  @Scope('security:io:tenants', 'client')
  internal(@UserToken() root: TokenPayload) {
    return { service: root.client_id };
  }
}
```

### Decorators

| Decorator | Effect |
|---|---|
| `@Permission(name?)` | Metadata + `JwtAuthGuard` + `TenantGuard` + `PrivilegesGuard`. Without a name the guard uses the request route path as the permission name. |
| `@Scope(scopes, tokenType?)` | OAuth-scope guard; `tokenType` ∈ `user` / `client` / `all`. Checks every space-separated scope against the token's `scope` claim **and** the token kind. |
| `@UserToken()` / `@TokenInfo()` | Inject the validated payload (`req.user`) enriched with `id = Number(sub)`, `username = preferred_username`, `is_client = sub === client_id`. Throws `406` when missing. |
| `@MapTenant(field)` | Reads `query`/`body[field]` and allows it only when it belongs to `user.tenants` (else `406`). |

### Guards

| Guard | Purpose |
|---|---|
| `JwtAuthGuard` | Passport `'jwt-header'`: Bearer token → per-tenant JWKS → RS256 + issuer verification. Throws `401` on failure. |
| `JwtAuthCookieGuard` | Passport `'jwt-cookie'`: reads cookie `a-<client_id>` (client_id from query/body). **Does not throw** when absent (leaves `req.user` undefined). |
| `TenantGuard` | Resolves `user.tenant` from `X-Tenant` (must be in `tenants`) or the first tenant. |
| `PrivilegesGuard` | Local or remote permission decision for `@Permission`. |
| `ScopesGuard` | OAuth scope + token-kind decision for `@Scope`. |

You may also compose raw guards yourself:

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtAuthCookieGuard, TenantGuard, PrivilegesGuard } from '@elegantys/polisafe';

@UseGuards(JwtAuthGuard)                       // authenticate only
@Controller('me')
export class MeController { … }
```

Cookie-session auth additionally needs `cookie-parser` mounted in your host app and a `client_id`/`clientId` present in the request (query or body) so the strategy can find the `a-<client_id>` cookie.

### Machine token & remote authorization

`PolizeiSdkService` (provided by the module) obtains a `client_credentials` token at boot (`POST {serviceUrl}/polisafe/oauth/token`, HTTP Basic) and refreshes it every minute (or when < 120 s remain). In **remote** mode, `PrivilegesGuard` calls:

```http
POST {serviceUrl}/polizei/io/authorization
Authorization: Bearer <machine-token>
Content-Type: application/json

{ "url": "<permissionName-or-route-path>", "method": "GET", "sub": "<user.sub>" }
```

`200` → allowed; any error → `403 Forbidden`.

### TokenPayload shape (available on `req.user`)

```ts
interface TokenPayload {
  sub: string;  iss: string;  aud: string | string[];
  exp: number;  iat: number;  jti?: string;
  client_id?: string;
  name?; given_name?; family_name?; preferred_username?; picture?; email?; email_verified?;
  roles?: string[]; permissions?: { name: string; type: string }[];
  tid?: string; tenant?: string; tenants?: string[];
  id: number;         // injected alias: Number(sub)
  is_client?: boolean; // injected alias: sub === client_id
  // user.tenant is added by TenantGuard
}
```

## Real-world consumer pattern

```ts
// Example: a controller in a service that consumes Polisafe permissions
import { Controller, Get } from '@nestjs/common';
import { Permission, UserToken, TokenPayload } from '@elegantys/polisafe';

@Controller('driving')
@Permission()
export class DrivingController {
  @Get()
  @Permission('driving:read')
  findAll(@UserToken() user: TokenPayload) {
    return this.drivingService.findAll(this.resolveTenant(user));
  }

  private resolveTenant(user: TokenPayload): string {
    return user.tenant ?? user.tid ?? (user.tenants && user.tenants[0]) ?? '';
  }
}
```

> Register matching permissions on the Polisafe side (`name` = `driving:read` etc., `settings.type` = HTTP verb) and attach them to the roles of the users that should pass. In **local** mode the client must have `meta.access_token_include_permissions: true` so the claims are embedded.

---

# ⚡ Next.js SDK — `@elegantys/polisafe-next`

Sibling SDK for **Next.js 15+ App Router** (`sdk-polisafe-next/`, ESM). Same IAM contract, Next-flavoured API:

```bash
npm install @elegantys/polisafe-next
```

**Core (framework-agnostic):** `configurePolisafe(options)` / `getPolisafe()` · `PolisafeClient` (`verifyToken`, `authenticate`, `checkPrivilege`, `checkScope`, `getMachineToken`) · helpers `verifyPolisafeToken`, `checkScopes`/`hasScopes`, `resolveTenant` · full OIDC/PKCE helpers (`buildAuthorizationUrl`, `exchangeCode`, `refreshToken`, `revokeToken`, `logoutUrl`, `generatePkce`) · `PolisafeError` · serverless-friendly `MachineTokenManager` (lazy renewal, no cron).

**Next adapters:**

```ts
// middleware.ts
import { createPolisafeMiddleware } from '@elegantys/polisafe-next/middleware';

export default createPolisafeMiddleware({
  serviceUrl: process.env.POLIZEI_SERVICE_URL!,
  issuer: process.env.POLIZEI_ISSUER!,
  protect: ['/dashboard/**'],              // or per-route { permission / scope / tokenType }
});
export const config = { matcher: ['/((?!_next|api|static).*)'] };
```

```ts
// app/api/invoices/route.ts
import { withPolisafe } from '@elegantys/polisafe-next/route-handler';
import { polisafe } from '@/lib/polisafe';

export const GET = withPolisafe(async (req) => {
  const session = await polisafe.authenticate(req);
  return Response.json({ user: session.user.sub });
}, { permission: 'invoices:read' });
```

```tsx
// app/dashboard/page.tsx (Server Component)
import { requirePolisafeSession } from '@elegantys/polisafe-next/server';
export default async function Dashboard() {
  const session = await requirePolisafeSession();
  return <div>Hello {session.user.preferred_username}</div>;
}
```

**Migration quick-map from the Nest SDK:** `PolisafeSdkModule.register()` → `configurePolisafe()` · `@Permission('x')` → `withPolisafe(handler, { permission: 'x' })` or middleware rules · `JwtAuthGuard` → `client.authenticate(request)` · cookie `a-<client_id>` → `setSessionCookie` / `clearSessionCookie`.

---

---

# 🌐 SPA integration with `oidc-client-ts`

Connect any browser SPA (Angular, React, Vue, …) with the **authorization-code + PKCE** flow. `oidc-client-ts` is the same library used by the Polisafe admin console itself.

```bash
npm install oidc-client-ts
```

## Settings

```ts
// oidc.ts
import { UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

const oauth = {
  // IMPORTANT: authority must include the "/polisafe" path segment — the discovery
  // metadata is fetched from {authority}/.well-known/openid-configuration
  authority: 'https://polisafe.elegantys.net/api/v5/security/polisafe', // sandbox
  // authority: 'http://localhost:3000/api/v4/security/polisafe',       // local dev
  client_id: '<clientId created via /polizei/admin/oauth/clients>',
  redirect_uri: 'https://my-spa.example/callback',
  silent_redirect_uri: 'https://my-spa.example/core/oauth2/silent-refresh-callback.html',
  post_logout_redirect_uri: 'https://my-spa.example/logout',
  scope: 'openid profile',
};

const settings: UserManagerSettings = {
  ...oauth,
  response_type: 'code',                     // authorization_code + PKCE (S256)
  automaticSilentRenew: true,                // renews before access-token expiry
  silentRequestTimeoutInSeconds: 30,
  accessTokenExpiringNotificationTimeInSeconds: 60,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(settings);
```

## Service wrapper (login / callback / logout / accessors)

```ts
// auth.service.ts
import { userManager, oauth } from './oidc';
import type { User } from 'oidc-client-ts';

export async function login() {
  await userManager.signinRedirect();                     // → Polisafe login/consent pages
}

export async function completeLogin(): Promise<User> {    // call on /callback
  const user = await userManager.signinRedirectCallback();
  return user;                                            // { access_token, id_token, refresh_token, profile, expires_at }
}

export async function logout() {
  await userManager.signoutRedirect({
    extraQueryParams: { client_id: oauth.client_id },     // required by Polisafe end-session
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const user = await userManager.getUser();
  if (!user || user.expired) return undefined;
  return user.access_token;
}
```

## Routing (Angular example)

```ts
// app.routes.ts
{ path: 'callback', component: CallbackComponent },   // ngOnInit → completeLogin()
{ path: 'sso',      component: SsoComponent },        // click → login()
{ path: 'logout',   redirectTo: '/' },
```

```ts
// callback.component.ts
async ngOnInit() {
  try {
    const user = await completeLogin();
    this.router.navigate(['/dashboard']);
  } catch (e) { /* handle error */ }
}
```

## Silent renew page (static asset)

`public/core/oauth2/silent-refresh-callback.html` — served by your own SPA host (the Polisafe console ships an equivalent file at `/app/core/oauth2/silent-refresh-callback.html`):

```html
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><title>Silent Renew Callback</title></head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/oidc-client-ts@latest/dist/browser/oidc-client-ts.js"></script>
    <script>
      // Best practice: create the UserManager with the SAME settings as the app
      // (authority, client_id, redirect_uri, scope, userStore) — a bare
      // `new oidc.UserManager()` only works when the app stores state with defaults.
      new oidc.UserManager().signinSilentCallback().catch((error) => {
        console.error('Silent renew error:', error);
      });
    </script>
  </body>
</html>
```

## Attach the token to API calls

```ts
// http.ts
export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    // Multi-tenant: switch business context with the current tenant id
    // headers.set('X-Tenant', currentTenantId);
  }
  const res = await fetch(`https://api.example.com${path}`, { ...init, headers });
  if (res.status === 401) return login();   // or trigger a refresh and retry once
  return res.json();
}
```

Or use an Angular HTTP interceptor / axios interceptor with the same three headers: `Authorization: Bearer`, optional `X-Tenant`, and a `401 → /sso` redirect.

## Listening to session events

```ts
userManager.events.addUserLoaded((user) => console.log('user loaded', user.profile));
userManager.events.addUserUnloaded(() => console.log('signed out'));
userManager.events.addSilentRenewError((error) => {
  // token could not be renewed silently → sign the user out and force a new login
  userManager.removeUser();
  login();
});
userManager.events.addAccessTokenExpiring(() => {
  /* automaticSilentRenew usually handles this; you can also refresh manually */
});
```

## Compatibility notes for OIDC clients

1. **Per-tenant JWKS** — discovery advertises `jwks_uri` containing a literal `:tenant`. Real keys: `GET {PREFIX}/polisafe/openid/<tenantId>/certs`. If your client auto-validates id_token signatures from discovery, override with the concrete tenant URL (e.g. `metadataSeed`/`signingKeys` in oidc-client-ts).
2. **`nonce`** — Polisafe accepts `nonce` on the authorization request but does **not** yet echo it in the id_token. Strict clients that require a nonce round-trip need relaxed nonce validation.
3. Discovery advertises `response_types_supported: ["code"]` (implicit `token` is handled by the endpoint but not advertised).
4. **Logout** requires `id_token_hint`, `client_id` and `post_logout_redirect_uri` (validated against the client's registered URIs) — pass `client_id` in `extraQueryParams` when calling `signoutRedirect`.
5. **Refresh tokens rotate** — treat them as single-use; store the latest one after every refresh.
6. Introspection is a stub (not usable yet).
7. In dev, the prefix in `authority` is `/api/v4/security/polisafe` unless you changed `APP_PREFIX`; the versioned prefix is part of the OIDC paths.

---

---

# 🤖 mcp-polizei — run your IAM with AI agents

[`mcp-polizei`](../mcp-polizei) is a standalone **Model Context Protocol (MCP) server** that exposes the whole Polisafe admin/RBAC surface as **55 tools + 3 resources** — so Claude, Cursor, opencode, or any MCP client can create users/roles/permissions/tenants/invitations/OAuth clients and answer questions about your identity setup.

- **Identity:** it authenticates to Polisafe with the OAuth **password grant** (`POST {PLS_PUBLIC_URL}{APP_PREFIX}/polisafe/oauth/token`, HTTP Basic client auth), caches and auto-renews the token, and on any tool `401` refreshes once and retries.
- **Tenant context:** the process keeps one in-memory active tenant sent as `X-Tenant` on every request; `/polizei/admin/*` calls refuse to run until a tenant is selected.
- **Transports:** stdio (default) or stateless **Streamable HTTP** (`PLS_MCP_TRANSPORT=http`), optional Bearer protection.

## Install & run

```bash
# inside the mcp-polizei repository checkout
npm install && npm run build
npm run start                     # stdio (default)
```

Development: `npm run dev` (tsx watch) · Type-check: `npm run typecheck`.

## Configuration (`.env` / environment)

| Variable | Default | Meaning |
|---|---|---|
| `PLS_PUBLIC_URL` | `http://localhost:3000` | Polisafe origin (sandbox: `https://polisafe.elegantys.net`) |
| `APP_PREFIX` | `''` | API prefix (e.g. `/api/v5/security`) |
| `PLS_MCP_CLIENT_ID` | – required | OAuth client with the **password** grant |
| `PLS_MCP_CLIENT_SECRET` | – required | its secret |
| `PLS_MCP_ADMIN_USER` | – required | Admin user the MCP acts as |
| `PLS_MCP_ADMIN_PASS` | – required | its password |
| `PLS_MCP_SCOPE` | `openid profile` | token scopes |
| `PLS_MCP_TOKEN_MIN_TTL` | `120` | renew token when fewer seconds remain |
| `PLS_MCP_TRANSPORT` | `stdio` | `stdio` \| `http` |
| `PLS_MCP_HTTP_PORT` / `PLS_MCP_HTTP_HOST` | `3100` / `0.0.0.0` | HTTP bind |
| `PLS_MCP_HTTP_AUTH_TOKEN` | `''` | optional Bearer token protecting the HTTP endpoint |

Example `.env` against the sandbox or your own instance:

```env
PLS_PUBLIC_URL=https://polisafe.elegantys.net
APP_PREFIX=/api/v5/security
PLS_MCP_CLIENT_ID=…
PLS_MCP_CLIENT_SECRET=…
PLS_MCP_ADMIN_USER=admin
PLS_MCP_ADMIN_PASS=…
PLS_MCP_SCOPE=openid profile
PLS_MCP_TRANSPORT=stdio
```

## Wire it to a client

**Claude Desktop / Cursor (stdio):** point `command`/`args` at the built `mcp-polizei` server of your checkout.

```json
{
  "mcpServers": {
    "mcp-polizei": {
      "command": "node",
      "args": ["<path-to-your-checkout>/mcp-polizei/dist/index.js"],
      "env": {
        "PLS_PUBLIC_URL": "https://polisafe.elegantys.net",
        "APP_PREFIX": "/api/v5/security",
        "PLS_MCP_CLIENT_ID": "…",
        "PLS_MCP_CLIENT_SECRET": "…",
        "PLS_MCP_ADMIN_USER": "admin",
        "PLS_MCP_ADMIN_PASS": "…",
        "PLS_MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

**opencode (stdio, env indirection):**

```jsonc
// ~/.config/opencode/opencode.jsonc
{
  "mcp": {
    "mcp-polizei": {
      "type": "local",
      "command": ["node", "<path-to-your-checkout>/mcp-polizei/dist/index.js"],
      "enabled": true,
      "environment": {
        "PLS_PUBLIC_URL": "http://localhost:3000",
        "APP_PREFIX": "/api/v4/security",
        "PLS_MCP_CLIENT_ID": "{env:PLS_MCP_CLIENT_ID}",
        "PLS_MCP_CLIENT_SECRET": "{env:PLS_MCP_CLIENT_SECRET}",
        "PLS_MCP_ADMIN_USER": "{env:PLS_MCP_ADMIN_USER}",
        "PLS_MCP_ADMIN_PASS": "{env:PLS_MCP_ADMIN_PASS}",
        "PLS_MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

**Remote — MCP over HTTP (any Streamable HTTP client):**

1. Run the server with the HTTP transport enabled (choose a port; optionally protect it with a Bearer token):

```bash
PLS_PUBLIC_URL=https://polisafe.elegantys.net \
APP_PREFIX=/api/v5/security \
PLS_MCP_CLIENT_ID="…" \
PLS_MCP_CLIENT_SECRET="…" \
PLS_MCP_ADMIN_USER="admin" \
PLS_MCP_ADMIN_PASS="…" \
PLS_MCP_TRANSPORT=http \
PLS_MCP_HTTP_HOST=0.0.0.0 \
PLS_MCP_HTTP_PORT=3100 \
PLS_MCP_HTTP_AUTH_TOKEN="misecreto" \
npm run start
```

Health check: `GET http://localhost:3100/health` → `{"ok":true}`.

2. Connect a remote MCP client with `url` + optional `headers`. Claude Desktop / Cursor accept a remote server block like this:

```json
{
  "mcpServers": {
    "mcp-polizei": {
      "url": "http://localhost:3100/",
      "headers": {
        "Authorization": "Bearer misecreto"
      }
    }
  }
}
```

opencode uses its own schema:

```jsonc
{
  "mcp": {
    "mcp-polizei": {
      "type": "remote",
      "url": "http://localhost:3100/",
      "enabled": true,
      "headers": { "Authorization": "Bearer misecreto" }
    }
  }
}
```

3. Verify the protocol with raw JSON-RPC:

```bash
curl -s -X POST http://localhost:3100/ \
  -H "Authorization: Bearer misecreto" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

CORS is wide open; protect the endpoint with the Bearer token and/or a reverse proxy (TLS recommended).

## First-use protocol (tell your agent)

1. `list_available_tenants` → tenants the admin token can access;
2. `set_tenant { name }` → set the active tenant (optionally with `id` when names repeat);
3. then call any admin tool — `list_users`, `create_user`, `create_role`, `assign_role_permissions`, `create_invitation`, `create_oauth_client`, …

> `list_tenants` lists the **tree of the active tenant** (X-Tenant context) — do not confuse it with `list_available_tenants` (token-level, for `set_tenant`).

## Tool catalog (55 tools)

Every tool returns JSON text. Most create/update/delete tools accept an optional `extra` object that is merged into the request body (`{...body, ...extra}`) so any model field can be passed.

### Tenants / session (3)
| Tool | Description | Input |
|---|---|---|
| `list_available_tenants` | Tenants the token may select (`set_tenant`) | – |
| `set_tenant` | Set the session's active tenant (sent as `X-Tenant`) | `name` (req), `id?` |
| `get_active_tenant` | Current active tenant or null | – |

### Users (6)
| Tool | Description | Input |
|---|---|---|
| `list_users` | Users of a scope (paginated, optional search) | `id` (req), `offset?`, `search?`, `limit?` (50) |
| `create_user` | Create a user and add to a scope | `idScope` (req), `username` (req), `password?`, `fullname?`, `state?` (0/1), `profile?`, `extra?` |
| `update_user` | Update a user (`profile` merges) | `id` (req), `username?`, `password?`, `fullname?`, `state?`, `profile?`, `extra?` |
| `delete_user` | Delete a user | `id` (req) |
| `assign_user_roles` | Assign roles (**replaces** current set) | `id` (req), `roles[]` (req), `context?` |
| `remove_user_from_scope` | Remove user from a scope | `id` (req), `idScope` (req) |

### Roles (7)
`list_roles` (`id`) · `list_assignable_roles` (`id`) · `create_role` (`idScope`, `name`, `description?`) · `update_role` (`id`, `name?`, `description?`) · `delete_role` (`id`) · `list_role_permissions` (`id`) · `assign_role_permissions` (`id`, `permissions[]` — replaces current).

### Permissions (5)
`list_permissions` (`id?`) · `create_permission` (`name`, `description?`, `idScope?`) · `update_permission` (`id`, `name?`, `description?`) · `delete_permission` (`id` | `ids[]` | `children`) · `import_permissions` (`idScope?`, `items[]`).

### Scopes / tenants (7)
`list_child_scopes` (`id`) · `list_tenants` – · `create_scope` (`idScope`, `name`, `description?`, `settings?`) · `update_scope` (`id`, `name?`, `description?`, `settings?`) · `delete_scope` (`id`) · `get_scope_review` – · `add_user_to_scope` (`username`, `idScope?` 0 = token tenant).

### Invitations (7)
`list_invitations` – · `create_invitation` (`username?`, `email?`, `roles[]?`, `meta?`) · `delete_invitation` (`id`) · `list_invitation_roles` – · `list_invitation_users` (`offset?`, `limit?`) · `reject_invitation_user` (`idScope`, `id?`\|`username?`) · `assign_invitation_roles` (`id`, `roles[]`).

### OAuth clients (5)
`list_oauth_clients` (`id` tenant) · `create_oauth_client` (`tenant?`, `name?`, `grants[]?`, `type?`, `redirectUris[]?`, `postLogoutRedirectUris[]?`, `scopes[]?`, `meta?`, booleans `accessTokenIncludePermissions`/`openidIncludePermissions`) · `update_oauth_client` (**internal UUID `id`** required) · `delete_oauth_client` (UUID `id`) · `list_oauth_client_scopes` (`id`).

> The API generates `clientId` on create (a sent `clientId` is ignored); update/delete identify the client by its internal UUID — list first.

### OAuth scopes (4)
`list_oauth_scopes` – · `create_oauth_scope` (`name`, `description?`) · `update_oauth_scope` (`id`, `name?`, `description?`) · `delete_oauth_scope` (`id`).

### Profile / system (11)
`get_my_profile` (`includePermissions?`, `createDefaultScope?`) · `get_my_permissions` – · `get_my_scopes` – · `search_users` (`username`) · `update_my_profile` (`fullname?`, `profile?`) · `change_my_password` (`currentPassword`, `newPassword`) · `save_scope` (`id?`, `name?`, `description?`, `users[]?`) · `delete_scope_own` (`id`, `force?`) · `get_tenant_settings` (`app`) · `set_tenant_settings` (`app`, `settings[]`) · `get_dashboard` –.

## Resources (3)

| URI | Contents |
|---|---|
| `polizei://openapi` | Swagger/OpenAPI JSON of the server (`{base}/docs-json`) |
| `polizei://oidc/discovery` | OIDC discovery document (pretty-printed) |
| `polizei://token/claims` | Decoded payload of the current MCP access token |

## Operations notes

- **One process = one admin identity.** Token, renewal and active tenant live in memory per process; in HTTP mode all connected clients share that one identity and tenant. For isolation, run separate containers per identity.
- `/polizei/admin/*` requires an active tenant (a helpful error lists the available tenants when none is set); `/polizei/profile/*` does not.
- Errors: 400 → `InvalidParams`, 401/403/404 → `InvalidRequest`, others → `InternalError`; network failures → `InternalError`.
- For remote deployments, see `deploy.md` in `mcp-polizei` (Docker multi-stage build + Caddy with automatic TLS + Bearer auth).

---

## 🧰 Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `401 Unauthorized` at `/oauth/token` | Wrong `client_id`/`client_secret` in HTTP Basic, or grant not enabled for the client (`grants[]`) |
| `401 Tenant boundaries out of scope` | `X-Tenant` value not in the token `tenants` claim — send a valid tenant or omit the header (first tenant is used) |
| `/oauth/auth` redirects `invalid_request` | Missing `code_challenge` / `code_challenge_method` — **PKCE is mandatory** |
| `403 Forbidden` on an admin route | Permission enforcement active but role lacks permission for path+verb; grant via `/roles/add-permissions`, or disable `PLS_PERMISSION_CHECK` in dev |
| Remote checks fail with `Authorization: Bearer undefined` | Machine token not obtained: check `client_id`/`client_secret`/`scope` passed to `PolisafeSdkModule.register` |
| OIDC client cannot fetch keys | Discovery `jwks_uri` has literal `:tenant`; point the client at `…/polisafe/openid/<tenantId>/certs` |
| Silent renew fails | `silent_redirect_uri` must be registered **and** served; create the UserManager with full settings in the silent page |
| Admin console shows wrong URLs after env change | The console config (`ui/app/assets/config/prod.json`) is rewritten on server boot by `CreatorService.syncUiConfig` — restart the server |
| `TypeError: Cannot read properties of undefined (reading 'split')` in ScopesGuard | Token has no `scope` claim — request the route with a scope or fix the token |
| Schema objects missing at boot | Run `npm run migrate` first (`SCHEMAS=security,oauth`); remember the Docker image removes `.env` |
| Tokens "expire immediately" | Very short `PLS_JWT_ACCESS_EXPIRES_IN` or client `meta.access_token_expire` |

---

## 🔒 Production checklist & known limitations

**Before going live**

- [ ] `NODE_ENV=production`; HTTPS everywhere; `PLS_PUBLIC_URL` = external HTTPS origin.
- [ ] Strong random `PLS_ORIGIN_COOKIE_SECRET` (≥ 32 bytes).
- [ ] **Change the seeded `admin`/`admin` password immediately**; use dedicated clients per app.
- [ ] Rotate the per-tenant signing keys periodically and keep private keys out of database backups.
- [ ] Decide enforcement mode (`PLS_PERMISSION_CHECK=remote` recommended) before exposing admin APIs.
- [ ] Put `/polizei/upload` and `/polizei/micro` behind authorization rules as intended (upload has two public routes by design).
- [ ] Use Redis in clustered deployments; in-memory cache is per-process.
- [ ] Restrict CORS (`app.enableCors()` is wide open by default) at the proxy or in code.

**Known limitations (v0.1.7)**

- Introspection endpoint is a stub; `POST /oauth/auth` (form_post) is a stub.
- Discovery `jwks_uri` advertises a literal `:tenant`; real keys are per-tenant.
- id_token does not echo `nonce` yet.
- Permissions are seeded per API route (path = name, verb = `settings.type`); custom business permissions must be registered manually.
- Some legacy pieces exist but are not wired by default (backbone endpoints, engine-legacy HS256 guards/controllers superseded by the SDK, cookie `JwtAuthCookieGuard` never throws by design).
- `audience` is accepted by the SDK but not enforced; `@Permission(name, config)`'s second argument is unused.
- Sequelize `synchronize`/`autoLoadModels` are enabled regardless of `NODE_ENV` — review before hardening.

---

## 📖 Further reading

- [`docs/io-api.md`](docs/io-api.md) — full IO + OpenID endpoint spec
- [`docs/dashboard-api.md`](docs/dashboard-api.md) — dashboard widget contract
- Live Swagger: `{PREFIX}/docs` (OpenAPI JSON: `{PREFIX}/docs-json`)
- Admin console OAuth config reference: `ui/app/assets/config/prod.json`
- SDK repos: `sdk-polisafe/` (NestJS) · `sdk-polisafe-next/` (Next.js) · `mcp-polizei/` (MCP)
- Public instance: <https://polisafe.elegantys.net>

---

## Appendix: full environment variables

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `production`/`development` (error verbosity, secure cookies) |
| `PORT` | `3000` | HTTP port |
| `APP_PREFIX` | `/api/v4/security` (repo), `/api/v5/security` (sandbox) | Global route prefix |
| `PLS_PUBLIC_URL` | `http://localhost:3000` | Public origin / OIDC issuer |
| `DB_HOST` `DB_PORT` `DB_USER` `DB_PASS` `DB_DIALECT` `DB_NAME` | localhost 5432 postgres – postgres `polisafe` | PostgreSQL connection |
| `SCHEMAS` | `security,oauth` | Schemas ensured by `npm run migrate` |
| `PLS_JWT_ACCESS_EXPIRES_IN` | `15m` | Access-token lifetime |
| `PSL_JWT_REFRESH_EXPIRES_IN` | `1h` | Refresh-token lifetime (PSL_ prefix is intentional) |
| `PLS_CODE_EXPIRE` | `10` | Authorization-code TTL (minutes) |
| `PLS_ORIGIN_COOKIE_SECRET` | – | HMAC secret for origin/consent cookies |
| `PLS_PERMISSION_CHECK` | – | `token` / `remote` — enables fine-grained enforcement |
| `REDIS_URL` | `redis://localhost:6379` | Redis for caching |
| `REDIS_CONNECT_TIMEOUT` | `1000` | Redis connect timeout (ms) |
| `IAM_USER_CACHE_TTL` / `IAM_SETTINGS_CACHE_TTL` / `KEY_ACTIVE_CACHE_TTL` | – | Cache TTLs (ms) |
| `PLS_UI_OAUTH_SCOPE` | `openid profile` | Console default OAuth scope |
| `PLS_UI_MODE` / `PLS_UI_IA_CHAT` / `PLS_UI_LANDING` | – | Embedded UI behaviour (`landing` serves marketing at `/`) |
| `PLS_UI_LICENSE` `PLS_UI_LICENSE_TYPE` `PLS_UI_LICENSE_URL` | – | Optional license-app config for the UI |
| `FILES_HUB` | `./uploads` | Upload destination |
| `MAILER_SERVICE_URL` / `POLIZEI_SERVICE_KEY` | – | Transactional email integration (magic links, recovery) |
| `BASE_ROL_KEY` | – | Base registration role key filter |
| `BACKBONE_SUBSCRIBE` `BACKBONE_PUBLISH` `BACKBONE_ENDPOINT` `BACKBONE_NAME` | – | Optional backbone event-bus integration |

---

*Polisafe — the identity layer your product deserves: complete, standards-based, self-hosted, commission-free.*

