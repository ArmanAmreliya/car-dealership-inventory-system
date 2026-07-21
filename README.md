# DealerFlow — Car Dealership Inventory Management System

A full-stack, production-ready dealership management platform built with a clean **Node.js / Express** backend and a **React 19 / Vite** frontend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [Environment Variables](#environment-variables)
9. [API Reference](#api-reference)
10. [Running Tests](#running-tests)
11. [Production Build](#production-build)
12. [Architecture Notes](#architecture-notes)

---

## Project Overview

DealerFlow lets dealership staff:

- **Manage vehicles** — create, update, search, and delete vehicle records (VIN, make, model, year, price)
- **Track inventory** — view real-time stock levels and update quantities
- **Process purchases** — execute vehicle purchase transactions with automatic stock adjustment
- **Monitor health** — dashboard overview with key inventory metrics

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 LTS |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Database | PostgreSQL 16 (via Prisma ORM) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Validation | Zod |
| API Docs | Swagger UI (OpenAPI 3.0) at `/api/docs` |
| Logging | morgan |
| Testing | Jest + Supertest |

### Frontend

| Layer | Technology |
|---|---|
| UI Library | React 19 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v3 |
| Notifications | Sonner |

---

## Repository Structure

```
car-dealership-inventory-system/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── app/              # Express app factory
│   │   ├── common/           # AppError, Zod schemas
│   │   ├── config/           # env config, Swagger spec
│   │   ├── domain/
│   │   │   ├── auth/         # Register / Login
│   │   │   ├── vehicle/      # Vehicle CRUD
│   │   │   ├── inventory/    # Stock management
│   │   │   └── purchase/     # Purchase workflow
│   │   ├── infrastructure/   # Prisma client
│   │   ├── lib/              # JWT helpers
│   │   ├── middleware/       # authenticate, validate, errorHandler
│   │   └── routes/           # Central route registry
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── docker/
│   │   └── docker-compose.yml
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── api/              # Axios client, API service layer
    │   ├── app/              # App root, providers, router
    │   ├── components/       # Shared UI components
    │   │   ├── accessibility/
    │   │   ├── feedback/
    │   │   ├── navigation/
    │   │   └── search/
    │   ├── contexts/         # AuthContext, ThemeContext
    │   ├── features/         # Domain feature modules
    │   │   ├── auth/
    │   │   ├── vehicles/
    │   │   ├── inventory/
    │   │   ├── purchases/
    │   │   └── dashboard/
    │   ├── hooks/            # Shared utility hooks
    │   ├── layouts/          # DashboardLayout, AuthLayout
    │   ├── lib/              # env, storage, query-client, theme
    │   ├── pages/            # Route-level page components
    │   ├── routes/           # AppRoutes, paths
    │   ├── styles/           # globals.css
    │   ├── types/            # Global TypeScript types
    │   └── utils/            # Formatters, search helpers
    ├── .env.example
    └── package.json
```

---

## Prerequisites

| Tool | Minimum version | Install |
|---|---|---|
| Node.js | 22 LTS | https://nodejs.org |
| pnpm | 9 | `npm install -g pnpm` |
| PostgreSQL | 16 | https://postgresql.org or Docker |
| Docker (optional) | 24 | https://docker.com |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd car-dealership-inventory-system

# 2. Start PostgreSQL via Docker (or use an existing instance)
cd backend/docker
docker compose up -d
cd ../..

# 3. Configure and start the backend
cd backend
cp .env.example .env        # edit .env — set JWT_SECRET at minimum
pnpm install
pnpm db:generate            # generate Prisma client
pnpm db:migrate             # run database migrations
pnpm dev                    # starts on http://localhost:3000

# 4. In a new terminal — configure and start the frontend
cd frontend
cp .env.example .env        # edit if backend URL differs
pnpm install
pnpm dev                    # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.  
API documentation: **http://localhost:3000/api/docs**

---

## Backend Setup

### Install dependencies

```bash
cd backend
pnpm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dealerflow
JWT_SECRET=your-strong-secret-here          # required — minimum 32 characters
JWT_EXPIRES_IN=7d                            # optional — default 7d
```

### Database

```bash
# Start PostgreSQL (Docker)
cd docker && docker compose up -d && cd ..

# Apply migrations and generate Prisma client
pnpm db:migrate
pnpm db:generate
```

### Start development server

```bash
pnpm dev
# API available at http://localhost:3000
# Swagger UI at  http://localhost:3000/api/docs
```

---

## Frontend Setup

### Install dependencies

```bash
cd frontend
pnpm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env` if the backend URL is not the default:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=DealerFlow
VITE_ENABLE_ANALYTICS=false
```

### Start development server

```bash
pnpm dev
# App available at http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment (`development` \| `production` \| `test`) |
| `PORT` | No | `3000` | HTTP server port |
| `DATABASE_URL` | **Yes** | — | Prisma PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs — use a random 32+ char string |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry duration (e.g. `1h`, `7d`, `30d`) |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:3000/api` | Backend API base URL (no trailing slash) |
| `VITE_APP_TITLE` | No | `DealerFlow` | Browser tab / branding display name |
| `VITE_ENABLE_ANALYTICS` | No | `false` | Enable analytics integration (`true` \| `false`) |

---

## API Reference

Interactive docs: **`GET /api/docs`** (Swagger UI)  
Raw OpenAPI JSON: **`GET /api/docs.json`**

### Authentication

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | — | `{ name, email, password }` | Register new user — returns `{ user, token }` |
| `POST` | `/api/v1/auth/login` | — | `{ email, password }` | Login — returns `{ user, token }` |

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Vehicles

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/vehicles` | ✓ | Create vehicle |
| `GET` | `/api/v1/vehicles` | ✓ | List vehicles (filterable) |
| `GET` | `/api/v1/vehicles/:id` | ✓ | Get single vehicle |
| `PUT` | `/api/v1/vehicles/:id` | ✓ | Update vehicle |
| `DELETE` | `/api/v1/vehicles/:id` | ✓ | Delete vehicle |

**List query parameters:** `make` · `model` · `year` · `availability` · `minPrice` · `maxPrice`

### Inventory

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/inventory` | ✓ | Inventory list with aggregate totals |
| `PATCH` | `/api/v1/inventory/:id` | ✓ | Update stock quantity `{ stockQuantity: number }` |

### Purchases

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/purchases` | ✓ | `{ vehicleId }` | Execute purchase — returns `409` if unavailable |

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Returns `{ status: "ok" }` |

---

## Running Tests

```bash
cd backend

# All tests
pnpm test

# Unit tests only
pnpm exec jest --config jest.unit.config.ts

# Integration tests only
pnpm exec jest --config jest.integration.config.ts

# With coverage report
pnpm test:coverage
```

Coverage threshold: **80 %** on all metrics.

---

## Production Build

### Backend

```bash
cd backend
pnpm build          # compiles TypeScript → dist/
pnpm start          # runs dist/server.js
```

### Frontend

```bash
cd frontend
pnpm build          # type-checks then compiles → dist/
pnpm preview        # local preview of the production bundle
```

The frontend build outputs a static bundle to `frontend/dist/`. Deploy this directory to any static host (Vercel, Netlify, S3 + CloudFront, Nginx, etc.) and point `VITE_API_BASE_URL` to the production API.

---

## Architecture Notes

### Backend

- **Layered architecture** — Routes → Controller → Service → Repository. Services never import Express types.
- **Repository pattern** — `VehicleRepository` is the single persistence boundary; swapping storage requires only a repository change.
- **Zod middleware** — request bodies are validated before reaching controllers; controllers receive fully-typed data.
- **AppError** — operational errors (4xx) propagate via `next(err)` to the central `errorHandler` middleware, keeping controllers free of HTTP concern.
- **Prisma ORM** — schema-first database access with auto-generated TypeScript types. Migrations are tracked under `prisma/migrations/`.

### Frontend

- **Feature-sliced modules** — each domain (`vehicles`, `inventory`, `purchases`) owns its components, hooks, services, types, and validation.
- **TanStack Query** — all server state lives in the query cache; mutations invalidate related queries per the rules in `PLAN.md`.
- **Single Axios instance** — JWT injection and 401 redirect are handled globally in `src/api/axios-client.ts`.
- **Zod + React Hook Form** — client-side validation mirrors backend constraints; schemas live in `features/<domain>/validation/`.
- **ThemeContext** — light / dark / system preference stored in `localStorage` and applied via the Tailwind `dark` class on `<html>`.
