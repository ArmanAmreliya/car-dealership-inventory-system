# DealerFlow — Car Dealership Management System

A full-stack car dealership inventory management application built with Node.js/TypeScript (Express + Prisma) on the backend and React 19 + Vite on the frontend.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Local Setup](#local-setup)
- [Running Tests](#running-tests)
- [Test Report](#test-report)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

---

## Project Overview

DealerFlow allows a car dealership to:

- Register and authenticate users (JWT-based)
- Manage a vehicle fleet (CRUD)
- Track inventory stock levels
- Process vehicle purchases
- Restock inventory (admin only)
- Role-based access control: `user` and `admin` roles with separate UI and API-level enforcement

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 22 + TypeScript 5.6 |
| Framework | Express 4 |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| API Docs | Swagger UI (`/api/docs`) |
| Testing | Jest + Supertest |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 5 |
| Language | TypeScript 5.7 (strict) |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Notifications | Sonner |
| Animations | Framer Motion |
| Testing | Vitest + Testing Library |

---

## API Endpoints

All protected endpoints require `Authorization: Bearer <token>` header.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register a new user |
| POST | `/api/v1/auth/login` | Public | Login and receive JWT |

### Vehicles
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/vehicles` | User | List all vehicles (filterable) |
| POST | `/api/v1/vehicles` | User | Create a new vehicle |
| GET | `/api/v1/vehicles/search` | User | Search vehicles by make/model/year/price |
| GET | `/api/v1/vehicles/:id` | User | Get a single vehicle |
| PUT | `/api/v1/vehicles/:id` | User | Update a vehicle |
| DELETE | `/api/v1/vehicles/:id` | **Admin** | Delete a vehicle |
| POST | `/api/v1/vehicles/:id/purchase` | User | Purchase a vehicle (decreases stock) |
| POST | `/api/v1/vehicles/:id/restock` | **Admin** | Restock a vehicle (increases stock) |

### Inventory
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/inventory` | User | Full inventory status with totals |
| PATCH | `/api/v1/inventory/:id` | **Admin** | Set absolute stock quantity |
| POST | `/api/v1/inventory/:id/restock` | **Admin** | Add quantity to current stock |

Full interactive API documentation available at `http://localhost:3000/api/docs` when the backend is running.

---

## Local Setup

### Prerequisites

- Node.js >= 22
- pnpm >= 9 (`npm install -g pnpm`)
- PostgreSQL database (local or cloud e.g. Railway, Supabase, Render)

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dealer-flow
```

---

### 2. Backend setup

```bash
cd backend
pnpm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key-minimum-32-chars"
PORT=3000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run database migrations:

```bash
pnpm db:migrate
```

Start the development server:

```bash
pnpm dev
```

Backend runs at `http://localhost:3000`
API docs at `http://localhost:3000/api/docs`

---

### 3. Frontend setup

```bash
cd ../frontend
pnpm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start the development server:

```bash
pnpm dev
```

Frontend runs at `http://localhost:5173`

---

### 4. Default admin account

After running migrations, create an admin user directly in the database or via the register endpoint, then update the role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or use Prisma Studio:

```bash
cd backend
pnpm db:studio
```

---

## Running Tests

### Backend

```bash
cd backend

# All tests
pnpm test

# Unit tests only
pnpm jest --config jest.unit.config.ts

# Integration tests only
pnpm jest --config jest.integration.config.ts

# With coverage report
pnpm test:coverage

# Specific test file
pnpm jest --testPathPattern="search-vehicle"
```

### Frontend

```bash
cd frontend

# Single run
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm coverage
```

---

## Test Report

### Backend — 99 tests across 18 suites

```
Test Suites: 11 passed (7 fail due to VIN uniqueness on shared DB — see note)
Tests:       83 passed, 16 failed
Time:        ~96s
```

**Passing test suites:**
- `auth.service.unit.test.ts` — JWT, bcrypt, register/login logic
- `login.integration.test.ts` — POST /auth/login full HTTP cycle
- `register.integration.test.ts` — POST /auth/register validation + conflict
- `vehicle.service.unit.test.ts` — list() with and without filters
- `vehicle.service.delete.unit.test.ts` — delete not-found, delete success
- `vehicle.service.get-by-id.unit.test.ts` — getById not-found, invalid ID
- `vehicle.service.update.unit.test.ts` — update not-found, update success
- `vehicle.repository.unit.test.ts` — in-memory repository CRUD
- `inventory.service.unit.test.ts` — getStatus, updateStock, restock
- `purchase.service.unit.test.ts` — purchase happy path, not available, not found
- `search-vehicle.integration.test.ts` — 12 tests covering GET /v1/vehicles/search
- `health.integration.test.ts` — health check
- `create-vehicle.integration.test.ts` — POST /v1/vehicles full validation suite

**Known failing suites (pre-existing issue):**

7 integration test suites fail when the full suite runs against the shared PostgreSQL database because tests use hardcoded VINs. When VINs already exist from a previous test run, Prisma throws `Unique constraint failed on vin`. Each suite passes individually. Fix: use `afterEach` to clean seed data, or use a dedicated test database.

```bash
# These all pass when run individually:
pnpm jest --testPathPattern="search-vehicle"   # 12/12 pass
pnpm jest --testPathPattern="create-vehicle"   # 8/8 pass
pnpm jest --testPathPattern="delete-vehicle"   # runs cleanly
```

### Coverage summary (backend)

```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   85.55 |    68.34 |   81.81 |   86.86
common/errors/AppError.ts     |     100 |      100 |     100 |     100
common/validation/schemas.ts  |     100 |      100 |     100 |     100
domain/auth (all files)       |   96.38 |    95.65 |     100 |   96.29
domain/purchase (all files)   |   97.14 |      100 |     100 |   97.05
domain/vehicle/vehicle.service|     100 |       80 |     100 |     100
middleware/authenticate.ts    |     100 |      100 |     100 |     100
middleware/requireAdmin.ts    |     100 |      100 |     100 |     100
lib/jwt.ts                    |     100 |      100 |     100 |     100
```

---

## Screenshots

### Landing Page

![Landing Page](https://raw.githubusercontent.com/ArmanAmreliya/car-dealership-inventory-system/ba53d06b1c110d72499cbd4b10ed2c48379c72a7/Langing-Page.png)

### Vehicle Management

![Vehicle Page](https://raw.githubusercontent.com/ArmanAmreliya/car-dealership-inventory-system/ba53d06b1c110d72499cbd4b10ed2c48379c72a7/Vehicle-Page.png)

### Inventory Management

![Inventory Page](https://raw.githubusercontent.com/ArmanAmreliya/car-dealership-inventory-system/ba53d06b1c110d72499cbd4b10ed2c48379c72a7/Inventory-Page.png)

### Purchase Workflow

![Purchases Page](https://raw.githubusercontent.com/ArmanAmreliya/car-dealership-inventory-system/ba53d06b1c110d72499cbd4b10ed2c48379c72a7/Purchases-Page.png)

---

## My AI Usage

### Tools used

**Kiro (Agentic AI IDE)** — primary tool used throughout the entire project.

---

### How I used AI

#### 1. Architecture guidance and learning

I used Kiro as a senior engineer mentor to understand the existing codebase from scratch. Before writing any code, I asked it to explain every file, every pattern, and every architectural decision — from the Vite entry point to the React rendering lifecycle, routing guards, TanStack Query cache invalidation, and the Express middleware chain.

#### 2. Debugging with explanation

Every time I encountered an error, I shared the file and error with Kiro and asked it to explain what went wrong before suggesting a fix. Examples:

- Hook called inside JSX instead of at the top of the component — Kiro explained the Rules of Hooks violation and why React tracks hook call order
- Pasting backend service code into a frontend service file — Kiro identified the fundamental layer confusion (DB logic vs HTTP logic) and explained the correct mental model
- Wrong import path (`../hooks/` instead of `../../../hooks/`) — Kiro walked me through relative path resolution

#### 3. Feature implementation guidance (TDD approach)

For each new feature (restock, role-based delete, purchase via URL param), Kiro:
1. Read all relevant files first before suggesting anything
2. Explained the full data flow from HTTP request to database and back
3. Asked me to write the code myself, only stepping in when I was stuck
4. Reviewed my code like a PR, pointing out specific bugs with explanations

#### 4. Test writing

For `GET /v1/vehicles/search`, Kiro wrote the integration tests following the TDD Red-Green-Refactor pattern, explaining each test case and why it covers a specific contract boundary (auth guard, filter correctness, empty result handling, response shape validation).

#### 5. Swagger documentation

Kiro audited the existing Swagger config against the actual registered routes and identified missing endpoints (`/v1/vehicles/{id}/purchase`, `/v1/vehicles/search`) and missing fields (`category`, `stockQuantity`, `imageUrl`) then rewrote the full spec.

---

### Reflection on AI impact

AI fundamentally changed how I approached this codebase. Instead of guessing at patterns, I could ask "why does this file exist?" and get a precise answer grounded in the actual code — not generic documentation.

The most valuable thing was not having AI write code for me, but having it explain code I didn't write. Understanding why `ProtectedRoute` returns `null` during `isLoading`, why the tsconfig is split into two files, or why the frontend service uses `apiClient.post` while the backend service uses `vehicleRepository.update` — these are the things that take weeks to learn by reading code alone.

Where AI saved the most time: catching layer confusion (backend code in frontend file), import path errors, and JSX syntax mistakes that are easy to make when you're learning a new codebase.

Where I had to think independently: deciding whether to add `restock` to the inventory or vehicles router, understanding the read-modify-write pattern for stock addition, and figuring out why `POST /api/v1/inventory/:id/restock` returned 404 (server running old compiled `dist/` code).

---

*Co-authored with Kiro AI (Amazon)*
