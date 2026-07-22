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

## Screenshot

![DealerFlow UI Preview](./Screenshot%202026-07-23%20003743.png)

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
