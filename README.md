# DealerFlow — Car Dealership Inventory Management System

A production-ready REST API for managing car dealership inventory, built with **Test-Driven Development** and **Clean Architecture** principles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 LTS |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Validation | Zod |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Testing | Jest + Supertest |
| API Docs | Swagger UI (OpenAPI 3.0) |
| Logging | morgan |
| ORM | Prisma (future DB integration) |

---

## Project Structure

```
backend/
├── src/
│   ├── app/               # Express app factory
│   ├── common/
│   │   ├── errors/        # AppError class
│   │   └── validation/    # Zod schemas
│   ├── config/            # env, swagger spec
│   ├── domain/
│   │   ├── auth/          # Register / Login
│   │   ├── vehicle/       # Vehicle CRUD
│   │   ├── inventory/     # Stock management
│   │   └── purchase/      # Purchase workflow
│   ├── infrastructure/    # Prisma client
│   ├── lib/               # JWT helpers
│   ├── middleware/        # authenticate, validate, errorHandler, httpLogger
│   └── routes/            # Central route registry
├── tests/
│   ├── unit/              # Jest unit tests (mocked dependencies)
│   └── <domain>/          # Integration tests (real app, supertest)
└── .github/workflows/     # CI pipeline
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10

### Install

```bash
cd backend
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `NODE_ENV` | `development` | Environment |
| `JWT_SECRET` | — | **Required** — sign/verify JWTs |
| `DATABASE_URL` | — | Prisma connection string |

### Run (development)

```bash
npm run dev
```

### Run (production)

```bash
npm run build
npm start
```

---

## API Reference

Interactive Swagger UI: **`GET /api/docs`**

Raw OpenAPI JSON: **`GET /api/docs.json`**

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register a new user |
| POST | `/api/v1/auth/login` | — | Login, receive JWT |

### Vehicles

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/vehicles` | ✓ | Create a vehicle |
| GET | `/api/v1/vehicles` | ✓ | List vehicles (filterable) |
| GET | `/api/v1/vehicles/:id` | ✓ | Get vehicle by ID |
| PUT | `/api/v1/vehicles/:id` | ✓ | Update a vehicle |
| DELETE | `/api/v1/vehicles/:id` | ✓ | Delete a vehicle |

**List query params:** `make`, `model`, `year`, `availability`, `minPrice`, `maxPrice`

### Inventory

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/inventory` | ✓ | Aggregate stock status |
| PATCH | `/api/v1/inventory/:id` | ✓ | Update stock quantity (`{ stockQuantity: 0\|1 }`) |

### Purchases

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/purchases` | ✓ | Purchase a vehicle |

Purchasing a vehicle:
- Returns `409` if the vehicle is already sold
- Automatically reduces `stockQuantity` to 0
- Returns a `PurchaseRecord` with a unique `purchaseId`

---

## Testing

```bash
# All tests
npm test

# Unit tests only
npx jest --config jest.unit.config.ts

# Integration tests only
npx jest --config jest.integration.config.ts

# With coverage
npm run test:coverage
```

Coverage threshold: **80%** on all metrics.

---

## Architecture Notes

- **Repository pattern** — `IVehicleRepository` is the domain boundary; services never touch HTTP
- **Shared repository instance** — `VehicleRepository` is created once in `routes/index.ts` and injected into vehicle, inventory, and purchase routers so in-memory state is consistent
- **Zod validation** — runs as Express middleware before controllers; controllers receive validated, typed data
- **AppError** — operational errors (400/404/409) propagate through `next(err)` to the central `errorHandler`
- **No premature abstractions** — persistence is in-memory until a real database is needed; Prisma client is wired for auth as the first real data store

---

## CI Pipeline

GitHub Actions workflow at `.github/workflows/ci.yml`:

1. Install dependencies
2. ESLint
3. Prettier format check
4. TypeScript type-check (`tsc --noEmit`)
5. Unit tests
6. Integration tests
7. Coverage report (informational)
8. Production build
