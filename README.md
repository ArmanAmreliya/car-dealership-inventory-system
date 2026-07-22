# DealerFlow

A premium automotive dealership management platform with a React + Vite frontend and a Node.js + Express + Prisma backend.

## Live Demo

- Frontend: https://dealer-flow-weld.vercel.app/
- Backend API: https://car-dealership-inventory-system-420s.onrender.com
- API Docs: https://car-dealership-inventory-system-420s.onrender.com/api/docs

## Project Snapshot

DealerFlow helps dealerships manage:
- vehicle inventory and stock updates
- purchase workflow and availability checks
- JWT-based authentication and protected routes
- premium landing page experience for automotive buyers

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query
- Backend: Node.js 22, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, Zod
- Deployment: Vercel (frontend), Render (backend)

## Key Features

- Vehicle CRUD and search/filtering
- Inventory tracking with stock health metrics
- Purchase flow with inventory validation
- Secure auth and role-based protected API access
- Production-ready landing experience for dealership browsing

## Environment Essentials

### Backend

Required variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`

### Frontend

Required variables:
- `VITE_API_BASE_URL`
- `VITE_APP_TITLE`

## Run Locally

Backend:

```bash
cd backend
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

## Notes

- Frontend is deployed on Vercel with SPA routing support.
- Backend is deployed on Render and serves the API and Swagger docs.
- The repo is structured for clean separation between frontend, backend, and Prisma schema.

## My AI Usage

I used GitHub Copilot as a development assistant throughout the project to help with:
- scaffolding API and frontend structure
- drafting test cases and validation logic
- debugging deployment/runtime issues
- refining UI copy and component organization
- improving README and project documentation

All generated suggestions were manually reviewed, adapted to the existing architecture, and validated through the project’s test and build workflows before being kept.

## Testing

Backend:

```bash
cd backend
npm test
```

Frontend verification:

```bash
cd frontend
pnpm lint
pnpm build
```

## Architecture

Frontend
- React
- TypeScript
- Tailwind CSS

Backend
- Express
- Prisma
- PostgreSQL
- JWT

## Project Structure

```text
frontend/
backend/
prisma/
PROMPTS.md
README.md
```

## API Endpoints

Key API areas covered by the project:

- Authentication: `POST /api/auth/register`, `POST /api/auth/login`
- Vehicles: `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/search`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`
- Inventory: `GET /api/inventory`, `PATCH /api/inventory/:id`
- Purchases: `POST /api/purchases`
- Docs: `GET /api/docs`

## Screenshot
![DealerFlow UI Preview](./Screenshot%202026-07-23%20003743.png)
