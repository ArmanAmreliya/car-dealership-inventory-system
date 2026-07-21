# DealerFlow Frontend Implementation Plan (PLAN.md)

## Document Purpose

This document provides a comprehensive, production-ready blueprint for implementing the **DealerFlow Frontend**. It is designed to serve as an authoritative, self-contained reference for developers, ensuring that every user interface component, state management slice, form validation schema, and routing structure perfectly aligns with the existing, fully implemented backend.

The backend is complete and serves as the ultimate source of truth. The frontend architecture outlined here avoids duplication of backend business logic, enforces type safety, provides robust error handling, and delivers an exceptional, accessible user experience.

---

# 1. Project Overview

### Project Purpose
DealerFlow is an enterprise-grade Car Dealership Inventory System created for managing vehicle stock, tracking inventory availability, handling purchases, and offering analytical oversight to dealership operators and staff.

### Business Domain
Automotive Dealership Management & Inventory Procurement:
- Track core vehicle metadata (VIN, Make, Model, Year, Price).
- Manage inventory availability and stock quantities.
- Process vehicle purchase transactions.
- Present inventory status summaries from the API.

### Goals
1. Provide a modern, responsive, high-performance web interface for dealership personnel.
2. Establish secure integration with the existing Node.js/Express REST API.
3. Keep frontend logic aligned with the backend contract and avoid duplicating business rules.
4. Support authenticated user flows and protected routes.
5. Maintain modular architecture, type safety, and straightforward error handling.

### Frontend Responsibilities
- User authentication (login, registration, token storage, session persistence).
- Navigation and route guarding for authenticated views.
- UI presentation and server-state handling with React Query.
- API communication through a single Axios layer.
- Client-side validation that matches the current backend schema constraints without inventing unsupported fields.

### Backend Responsibilities (Source of Truth)
- Primary data storage, relational integrity, and migrations (PostgreSQL + Prisma ORM).
- Password hashing (bcrypt) and JWT signing/verification.
- Validation of required vehicle and auth fields.
- Purchase execution and availability updates.
- Error classification and HTTP response formatting.

---

# 2. Backend Overview

The existing backend is built on a clean, layered TypeScript architecture using Express, Prisma, and PostgreSQL.

### Core Tech Stack
- **Runtime & Framework**: Node.js, Express (TypeScript)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: JSON Web Tokens (JWT) using `jsonwebtoken` with bcrypt hashing
- **Validation**: Zod schema validation middleware
- **Documentation**: Swagger UI served at `/api/docs` and OpenAPI JSON at `/api/docs.json`
- **Error Handling**: Operational errors wrapped in `AppError` class and caught by global middleware

### Backend Modules & Endpoints Summary
1. **Health Check**:
   - `GET /api/health` -> `{ status: "ok" }`
2. **Authentication**:
   - `POST /api/v1/auth/register` -> Accepts `{ name, email, password }`, returns `{ user, token }`
   - `POST /api/v1/auth/login` -> Accepts `{ email, password }`, returns `{ user, token }`
3. **Vehicle CRUD**:
   - `POST /api/v1/vehicles` -> Create vehicle (requires auth)
   - `GET /api/v1/vehicles` -> List vehicles with optional filters (`make`, `model`, `year`, `availability`, `minPrice`, `maxPrice`)
   - `GET /api/v1/vehicles/:id` -> Get one vehicle by UUID
   - `PUT /api/v1/vehicles/:id` -> Update vehicle fields
   - `DELETE /api/v1/vehicles/:id` -> Delete a vehicle by UUID
4. **Inventory Management**:
   - `GET /api/v1/inventory` -> Inventory summary and item list
   - `PATCH /api/v1/inventory/:id` -> Update stock quantity (`{ stockQuantity: number }`)
5. **Purchase Workflow**:
   - `POST /api/v1/purchases` -> Process a vehicle purchase (`{ vehicleId: string }`)
   - There is no dedicated purchase history or analytics endpoint in the current backend.

### Backend Data Schemas (Prisma Models)

```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  role      String     @default("user")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  purchases Purchase[]
}

model Vehicle {
  id        String     @id @default(uuid())
  vin       String     @unique
  make      String
  model     String
  year      Int
  price     Float
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  inventory Inventory?
  purchases Purchase[]
}

model Inventory {
  id        String   @id @default(uuid())
  vehicleId String   @unique
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  quantity  Int      @default(0)
  available Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Purchase {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Restrict)
  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Restrict)
  quantity    Int      @default(1)
  purchasedAt DateTime @default(now())
}
```

### Type Generation from Swagger / OpenAPI
- Use the backend OpenAPI document at `/api/docs.json` as the source of truth for frontend contracts.
- Generate TypeScript types from that spec instead of maintaining DTOs manually.
- Recommended tools: `openapi-typescript` or `orval`.
- Place generated files under `src/types/generated` or `src/api/generated` and regenerate them whenever the backend changes.
- Review generated diffs before implementing new frontend features to prevent drift.

> [!IMPORTANT]
> **CRITICAL RULE**: The frontend must **NOT** duplicate backend business logic or invent endpoints that the API does not expose. The frontend should consume the backend contract and reflect returned states.

---

# 3. API Integration Strategy

### Base URL & Versioning
- **Base URL**: Configured via environment variable (`VITE_API_BASE_URL`).
- **Default Development Base URL**: `http://localhost:3000/api`
- **Versioning Strategy**: API routes strictly use the `/v1` prefix (e.g., `/api/v1/vehicles`).

### Environment Variables
Environment variables are declared in `.env` and `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=DealerFlow
VITE_ENABLE_ANALYTICS=false
```

### Axios Instance Configuration
A centralized Axios client is instantiated in `src/api/axiosClient.ts`.

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Flow & Interceptors
1. **Request Interceptor**: Automatically attaches the JWT token from storage to the `Authorization` header as a Bearer token.
2. **Response Interceptor**: Intercepts HTTP response errors. If a `401 Unauthorized` status is received, it clears the authentication token/user state and redirects the user to `/login`.

```typescript
// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('dealerflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dealerflow_token');
      localStorage.removeItem('dealerflow_user');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);
```

### Token Storage Strategy
- **Token Key**: `dealerflow_token` stored in `localStorage` for session persistence across browser tabs.
- **User Object Key**: `dealerflow_user` cached in `localStorage` for instant initial rendering while verifying token authenticity.

---

# 4. Frontend Tech Stack

| Technology | Purpose | Selection Justification |
| :--- | :--- | :--- |
| **React 18** | UI Library | Component-based, declartive UI rendering with full Concurrent React features support. |
| **TypeScript 5+** | Programming Language | Ensures end-to-end type safety matching backend DTOs and database models. |
| **Vite** | Build Tool & Dev Server | Ultra-fast HMR (Hot Module Replacement), optimized ES build pipeline. |
| **React Router v6** | Client-Side Routing | Declarative nested routing, protected route guards, navigation hooks (`useNavigate`, `useLocation`). |
| **TanStack Query v5** | Server State Management | Automatic cache management, background refetching, query invalidation, loading/error states. |
| **Axios** | HTTP Client | Interceptors, request cancellation, structured error object handling, timeout management. |
| **Tailwind CSS v3** | Styling Framework | Utility-first CSS for rapid, responsive design customization without bundle bloat. |
| **shadcn/ui** | Component System | Accessible, unstyled headless primitives (Radix UI) styled with Tailwind CSS. Fully customizable code ownership. |
| **React Hook Form** | Form Management | High-performance, un-controlled form inputs minimizing re-renders. |
| **Zod** | Client Validation | Type-safe schema validation matching backend Zod contracts. |
| **Sonner** | Toast Notifications | Modern, accessible toast notification stack for immediate feedback. |
| **Lucide Icons** | Visual Iconography | Comprehensive, crisp, light-weight SVG icons for UI dashboard elements. |

---

# 5. Design System

The frontend should follow a small, consistent design system so new screens feel cohesive.

- **Color palette**: neutral surfaces, primary brand accent, success, warning, and danger states.
- **Typography**: one sans-serif stack with clear hierarchy for page titles, section headings, body text, and captions.
- **Spacing scale**: use a consistent 4px-based scale (`4, 8, 12, 16, 24, 32`).
- **Border radius**: use rounded corners for cards and inputs with a small, medium, and large scale.
- **Shadows**: subtle elevation for cards and dialogs; avoid heavy shadows.
- **Icons**: prefer a single icon set such as Lucide and keep icon usage consistent across the app.
- **Dark mode strategy**: support a theme toggle by using CSS variables for surface, text, border, and accent colors.
- **Responsive breakpoints**: mobile first with `sm`, `md`, and `lg` breakpoints matching Tailwind conventions.

# 6. Folder Structure

```
src/
├── app/                  # Application wrappers, providers, global layout entry
│   ├── App.tsx
│   ├── main.tsx
│   └── providers.tsx     # Combined QueryClient, Router, and Auth providers
├── api/                  # Axios setup, API client instance, global interceptors
│   └── axiosClient.ts
├── assets/               # Static assets (images, branding, SVGs, logos)
├── components/           # Generic shared UI primitives (shadcn/ui & custom)
│   ├── ui/               # Button, Dialog, Input, Table, Badge, Card, etc.
│   ├── feedback/         # Toast, Loader, Skeleton, EmptyState, ErrorState
│   ├── navigation/       # Navbar, Sidebar, Header, Breadcrumbs
│   └── guard/            # ProtectedRoute, RoleGuard
├── contexts/             # React Contexts (AuthContext, ThemeContext)
│   └── AuthContext.tsx
├── features/             # Feature-sliced modules (domain specific logic)
│   ├── auth/             # Login, Register forms & hooks
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── vehicles/         # Vehicle management feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── inventory/        # Stock management feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── purchases/        # Purchase workflow feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── dashboard/        # Analytics & metrics feature
│       ├── components/
│       └── hooks/
├── hooks/                # Application-wide utility hooks (useDebounce, useMediaQuery)
├── layouts/              # Main layout templates (DashboardLayout, AuthLayout)
│   ├── DashboardLayout.tsx
│   └── AuthLayout.tsx
├── pages/                # Route level page views (thin components assembling features)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── VehiclesListPage.tsx
│   ├── VehicleDetailPage.tsx
│   ├── VehicleCreatePage.tsx
│   ├── VehicleEditPage.tsx
│   ├── InventoryPage.tsx
│   ├── PurchasesPage.tsx
│   └── NotFoundPage.tsx
├── routes/               # Route definition configuration & lazy loading maps
│   ├── AppRoutes.tsx
│   └── paths.ts
├── styles/               # Global CSS, Tailwind directives, font definitions
│   └── globals.css
├── types/                # Global API DTO types and domain entities
│   └── api.ts
└── utils/                # Helper utilities (currency formatting, date formatting, error extraction)
    ├── formatters.ts
    └── error.ts
```

### Folder Responsibilities Explained
- `app/`: Houses root initializers and top-level context providers (`QueryClientProvider`, `AuthProvider`).
- `api/`: Centralized HTTP infrastructure for backend interactions.
- `components/`: UI design system components independent of domain business logic.
- `features/`: Self-contained feature modules grouped by domain (vehicles, inventory, purchases, auth).
- `layouts/`: Page containers handling shell elements (Sidebar, Top Navigation, Footer).
- `pages/`: Page routing endpoints. They fetch minimal initial props and wire feature components together.
- `routes/`: Centralized route paths enum and route mapping config.
- `types/`: Shared TypeScript definitions mirroring backend payloads.

---

# 6. Data Flow

Use a single vertical data flow so future frontend work stays predictable:

```text
Page
 ↓
Feature Hook
 ↓
Service
 ↓
Axios Client
 ↓
Backend API
 ↓
React Query Cache
 ↓
UI
```

Components should stay focused on rendering; hooks manage data fetching and mutations; services keep API contracts centralized.

# 7. Application Architecture

DealerFlow implements a clean, layered architecture separating user interface presentation from network communications and backend operations.

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│   (Pages, Layouts, UI Components, React Hook Form)     │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┘
│                       Feature Layer                     │
│    (Custom React Hooks, TanStack Queries & Mutations)   │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┘
│                         API Layer                       │
│    (Axios Client, Endpoint Services, DTO Converters)    │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP / REST (JSON)
┌────────────────────────────▼────────────────────────────┘
│                     Backend System                      │
│     (Node.js, Express, Prisma, PostgreSQL Database)     │
└─────────────────────────────────────────────────────────┘
```

### Separation of Concerns
1. **Presentation Layer**: Handles user interaction, form inputs, local component states, rendering feedback, and accessibility attributes. Components do not call Axios directly.
2. **Feature Layer**: Encapsulates server state caching, background query refetching, optimistic UI updates, and side effects using TanStack Query hooks (`useQuery`, `useMutation`).
3. **API Layer**: Declares API request contracts (`vehicleService.ts`, `authService.ts`). Transforms API error responses into typed application errors.
4. **Backend System**: Executes all transaction logic, database operations, security validations, and data persistence.

---

# 7. Routing Plan

All application routes are defined declaratively in `src/routes/AppRoutes.tsx`.

| Path | Purpose | Access | Backend APIs Used |
| :--- | :--- | :--- | :--- |
| `/login` | User authentication | Public | `POST /api/v1/auth/login` |
| `/register` | User registration | Public | `POST /api/v1/auth/register` |
| `/` | Root redirect | Protected | Redirects to `/dashboard` |
| `/dashboard` | Inventory overview | Protected | `GET /api/v1/inventory`, `GET /api/v1/vehicles` |
| `/vehicles` | Vehicle catalog | Protected | `GET /api/v1/vehicles` |
| `/vehicles/new` | Create vehicle form | Protected | `POST /api/v1/vehicles` |
| `/vehicles/:id` | Vehicle details and purchase action | Protected | `GET /api/v1/vehicles/:id`, `POST /api/v1/purchases` |
| `/vehicles/:id/edit` | Edit vehicle form | Protected | `GET /api/v1/vehicles/:id`, `PUT /api/v1/vehicles/:id` |
| `/inventory` | Inventory stock management | Protected | `GET /api/v1/inventory`, `PATCH /api/v1/inventory/:id` |
| `/404` | Not found fallback page | Public | None |
| `*` | Catch-all wildcard | Public | Redirects to `/404` |

---

# 8. Authentication Flow

The authentication lifecycle relies on JWT tokens issued by the backend upon successful login or registration.

```
┌──────────────┐      Credentials      ┌──────────────────┐
│              ├──────────────────────►│  POST /v1/auth/  │
│  User Login  │                       │  login/register  │
│              │◄──────────────────────┤                  │
└──────────────┘      { user, token }  └────────┬─────────┘
                                                │
                                                ▼
                                    ┌──────────────────────┐
                                    │ Store token & user   │
                                    │ in localStorage      │
                                    └───────────┬──────────┘
                                                │
                                                ▼
                                    ┌──────────────────────┐
                                    │  Set AuthContext     │
                                    │  isAuthenticated=true│
                                    └───────────┬──────────┘
                                                │
                                                ▼
                                    ┌──────────────────────┐
                                    │ Redirect to          │
                                    │ /dashboard           │
                                    └──────────────────────┘
```

### Detailed Token Lifecycle Steps
1. **User Submission**: User submits credentials on `/login` or `/register`.
2. **Backend Issuance**: Backend validates credentials and returns `{ user: UserDTO, token: string }`.
3. **Storage & Context Hydration**:
   - Save `token` to `localStorage.setItem('dealerflow_token', token)`.
   - Save `user` object to `localStorage.setItem('dealerflow_user', JSON.stringify(user))`.
   - Update `AuthContext` state (`user`, `token`, `isAuthenticated: true`).
4. **Header Injection**: All subsequent outgoing Axios requests automatically receive `Authorization: Bearer <token>`.
5. **Protected Route Access**: `ProtectedRoute` checks `AuthContext.isAuthenticated`. If false, redirects to `/login` with `from` location state saved for post-login redirect.
6. **Logout Flow**:
   - Clears `localStorage` items (`dealerflow_token`, `dealerflow_user`).
   - Resets `AuthContext`.
   - Purges TanStack Query client cache (`queryClient.clear()`).
   - Navigates to `/login`.
7. **Token Expiration / Unauthorized handling**:
   - Axios response interceptor catches `401 Unauthorized`.
   - Displays toast error: `"Session expired. Please log in again."`
   - Executes logout cleanup flow and redirects to `/login`.

---

# 9. Feature Breakdown

### 1. Authentication Feature (`features/auth`)
- **Purpose**: Authenticate users, register new accounts, and manage session persistence.
- **Pages**: `LoginPage.tsx`, `RegisterPage.tsx`
- **Components**: `LoginForm.tsx`, `RegisterForm.tsx`
- **Hooks**: `useLogin()`, `useRegister()`, `useAuth()`
- **API Calls**: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
- **Forms & Validation**:
  - Login: email and password.
  - Register: name, email, and password.
- **States**: loading, error, and success states with toast feedback and redirect to `/dashboard`.

### 2. Vehicle Management Feature (`features/vehicles`)
- **Purpose**: List, create, edit, and delete vehicles through the API.
- **Pages**: `VehiclesListPage.tsx`, `VehicleDetailPage.tsx`, `VehicleCreatePage.tsx`, `VehicleEditPage.tsx`
- **Components**: `VehicleTable.tsx`, `VehicleForm.tsx`, `DeleteVehicleDialog.tsx`
- **Hooks**: `useVehicles(filters)`, `useVehicle(id)`, `useCreateVehicle()`, `useUpdateVehicle()`, `useDeleteVehicle()`
- **API Calls**: `GET /api/v1/vehicles`, `GET /api/v1/vehicles/:id`, `POST /api/v1/vehicles`, `PUT /api/v1/vehicles/:id`, `DELETE /api/v1/vehicles/:id`
- **Forms & Validation**: keep the form aligned with the current backend contract: make, model, year, price, and vin.
- **States**: loading, empty, error, and success states with query invalidation after mutations.

### 3. Inventory Management Feature (`features/inventory`)
- **Purpose**: Show inventory summaries and update stock quantities through the API.
- **Pages**: `InventoryPage.tsx`
- **Components**: `InventorySummaryCards.tsx`, `InventoryTable.tsx`, `StockUpdateModal.tsx`
- **Hooks**: `useInventoryStatus()`, `useUpdateStock()`
- **API Calls**: `GET /api/v1/inventory`, `PATCH /api/v1/inventory/:id`
- **Forms & Validation**: `stockQuantity` must be a non-negative integer.
- **States**: loading, empty, error, and success states with fresh data after stock updates.

### 4. Purchase Workflow Feature (`features/purchases`)
- **Purpose**: Confirm a purchase from the vehicle detail view and show the purchase receipt returned by the API.
- **Pages**: vehicle detail view plus an optional purchase confirmation modal.
- **Components**: `PurchaseConfirmModal.tsx`, `PurchaseReceiptCard.tsx`
- **Hooks**: `useExecutePurchase()`
- **API Calls**: `POST /api/v1/purchases`
- **States**: loading, error, and success states, including conflict handling when the vehicle is no longer available.

### 5. Dashboard Feature (`features/dashboard`)
- **Purpose**: Provide a simple overview of inventory and vehicle status.
- **Pages**: `DashboardPage.tsx`
- **Components**: `StatCard.tsx`, `InventorySummaryPanel.tsx`, `QuickActionGrid.tsx`
- **Hooks**: combine inventory and vehicle queries for a summary page.
- **API Calls**: `GET /api/v1/inventory`, `GET /api/v1/vehicles`
- **States**: loading placeholders and summary cards built from live API data.

---

# 10. UI Components

Reusable UI components reside in `src/components/ui/` and `src/components/feedback/`.

| Component | Responsibility | Props / Variations |
| :--- | :--- | :--- |
| **Button** | Clickable action primitive | `variant`: primary, secondary, outline, destructive, ghost. `isLoading`: boolean. |
| **Input** | Text/Number form field | `label`, `error`, `icon`, standard HTML input attributes. |
| **Modal / Dialog** | Overlay container for actions | `isOpen`, `onClose`, `title`, `description`, `children`, `footer`. |
| **Table** | Data grid presentation | Data driven headers, customizable cell renderers, row click actions. |
| **Badge** | Small status indicator pill | `variant`: success (Available), danger (Sold/Unavailable), warning (Low Stock). |
| **Toast** | Temporary notification popups | Managed via Sonner library (`toast.success()`, `toast.error()`). |
| **Loader** | Spinner indicator | Sizes: `sm`, `md`, `lg`. Fullscreen or embedded modes. |
| **Skeleton** | Visual placeholder for content loading | Text line skeleton, card box skeleton, table row skeleton. |
| **Pagination** | Table pagination controller | `currentPage`, `totalPages`, `onPageChange`. |
| **SearchBar** | Input field with debounce hook | `value`, `onChange`, `placeholder`, clear button. |
| **FormField** | Wrapper combining Label, Input, & Error | `label`, `error`, `htmlFor`, `required`. |
| **EmptyState** | Placeholder when datasets are empty | `title`, `description`, `icon`, `actionButton`. |
| **ErrorState** | Layout error boundary box | `title`, `message`, `onRetry`. |
| **ProtectedRoute** | Route security wrapper | Checks authentication status before rendering child routes. |
| **Navbar** | Top navigation bar | User avatar, role display, notification bell, user dropdown, theme toggle. |
| **Sidebar** | Left navigation bar | Route navigation links with active state highlights. |
| **Card / StatCard**| Dashboard metrics container | `title`, `value`, `icon`, `trendDescription`, `color`. |

---

# 11. State Management

DealerFlow adopts a clear three-tiered state management model:

```
┌─────────────────────────────────────────────────────────┐
│                    Server State                         │
│            (Managed via TanStack Query)                 │
│   • Vehicle catalog cache                               │
│   • Inventory stock levels                              │
│   • Purchase transactions                               │
└─────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Context State                        │
│            (Managed via React Context)                  │
│   • Authenticated User profile                          │
│   • JWT token storage state                             │
│   • Theme preferences (Light / Dark)                    │
└─────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                     Local State                         │
│            (Managed via useState / RHF)                 │
│   • Form input values & field errors                    │
│   • Modal open / closed states                          │
│   • Search filter input text                            │
└─────────────────────────────────────────────────────────┘
```

### TanStack Query Caching & Keys Strategy
Centralize query keys in a single module so the app does not scatter cache keys across features.

```ts
export const queryKeys = {
  auth: ['auth'],
  vehicles: ['vehicles'],
  vehicle: (id: string) => ['vehicles', id],
  inventory: ['inventory'],
  purchases: ['purchases'],
};
```

Recommended defaults: `staleTime: 1000 * 60 * 2` (2 minutes) and `refetchOnWindowFocus: true`.

### Mutation Invalidation Rules
- Create Vehicle -> invalidate `vehicles` and `inventory`
- Update Vehicle -> invalidate `vehicles` and `vehicle(id)`
- Delete Vehicle -> invalidate `vehicles` and `inventory`
- Purchase -> invalidate `vehicles` and `inventory`
- Stock Update -> invalidate `inventory` and `vehicles`

---

# 12. API Mapping

This table provides a complete, 1-to-1 mapping between backend endpoints and frontend features:

| HTTP Method | API Endpoint | Frontend Page | Frontend Component | Query / Mutation | Auth Req. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | App Shell | HealthCheckIndicator | Query | No |
| `POST` | `/api/v1/auth/register` | `RegisterPage` | `RegisterForm` | Mutation | No |
| `POST` | `/api/v1/auth/login` | `LoginPage` | `LoginForm` | Mutation | No |
| `GET` | `/api/v1/vehicles` | `VehiclesListPage`, `DashboardPage` | `VehicleTable`, `VehicleFilterBar` | Query | Yes |
| `POST` | `/api/v1/vehicles` | `VehicleCreatePage` | `VehicleForm` | Mutation | Yes |
| `GET` | `/api/v1/vehicles/:id` | `VehicleDetailPage`, `VehicleEditPage` | `VehicleDetailsCard`, `VehicleForm` | Query | Yes |
| `PUT` | `/api/v1/vehicles/:id` | `VehicleEditPage` | `VehicleForm` | Mutation | Yes |
| `DELETE` | `/api/v1/vehicles/:id` | `VehiclesListPage`, `VehicleDetailPage` | `DeleteVehicleDialog` | Mutation | Yes |
| `GET` | `/api/v1/inventory` | `InventoryPage`, `DashboardPage` | `InventorySummaryCards`, `InventoryTable` | Query | Yes |
| `PATCH` | `/api/v1/inventory/:id` | `InventoryPage` | `StockUpdateModal` | Mutation | Yes |
| `POST` | `/api/v1/purchases` | `VehicleDetailPage`, `VehiclesListPage` | `PurchaseConfirmModal` | Mutation | Yes |

---

# 13. Forms

All forms utilize **React Hook Form** paired with **Zod** schema resolvers.

### 1. LoginForm Schema & Fields
- `email`: `z.string().min(1, 'Email is required').email('Invalid email address')`
- `password`: `z.string().min(1, 'Password is required')`

### 2. RegisterForm Schema & Fields
- `name`: `z.string().min(1, 'Name is required')`
- `email`: `z.string().min(1, 'Email is required').email('Invalid email address')`
- `password`: `z.string().min(8, 'Password must be at least 8 characters')`

### 3. VehicleForm Schema & Fields (Create / Edit)
- `make`: `z.string().min(1, 'Make is required')`
- `model`: `z.string().min(1, 'Model is required')`
- `year`: `z.coerce.number().int().min(1886, 'Year must be 1886 or later').max(new Date().getFullYear() + 2, 'Year is too far in future')`
- `price`: `z.coerce.number().positive('Price must be positive')`
- `vin`: `z.string().min(1, 'VIN is required').max(17, 'VIN must be at most 17 characters')`
- `mileage`: `z.coerce.number().nonnegative('Mileage cannot be negative').optional()`
- `color`: `z.string().optional()`

### 4. StockUpdateForm Schema & Fields
- `stockQuantity`: `z.coerce.number().int('Stock quantity must be an integer').nonnegative('Stock quantity cannot be negative')`

### Form Submission & Error Mapping Strategy
1. Client-side Zod validation runs on submit.
2. If invalid, field-level errors render beneath affected inputs immediately.
3. Upon API error response (e.g., 400 Validation Error from backend), the Axios response parser extracts `errors` array and maps specific messages to form fields using `setError(field, { message })`.

---

# 14. Error Handling

DealerFlow handles operational, validation, and network errors gracefully:

```
┌────────────────────────────────────────────────────────┐
│                   HTTP Error Received                  │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
  HTTP 401             HTTP 400             HTTP 409
Unauthorized       Validation Error      Conflict State
       │                    │                    │
       ▼                    ▼                    ▼
Clear session &      Map backend array    Display clear warning
redirect to /login   to input field alerts modal (e.g. Sold out)
```

| HTTP Status | Trigger Scenario | Frontend Handling Strategy |
| :--- | :--- | :--- |
| **400 Bad Request** | Missing fields, invalid format, invalid UUID | Parse `message` or `errors` array. Attach to input fields or show toast alert. |
| **401 Unauthorized** | Missing/invalid/expired JWT token | Clear storage, trigger AuthContext logout, redirect user to `/login?expired=true`. |
| **403 Forbidden** | User lacks required role permissions | Display access denied page or disable admin actions in UI. |
| **404 Not Found** | Non-existent vehicle ID or route | Display `<NotFoundPage>` or feature-level `<EmptyState>` with back navigation button. |
| **409 Conflict** | Vehicle already sold or unavailable for purchase | Show warning dialog: `"This vehicle is no longer available."` Refresh query cache. |
| **500 Server Error** | Unexpected backend exception | Display user-friendly banner: `"Server error encountered. Please try again later."` |
| **Network Error** | Server unreachable / API offline | Show persistent banner: `"Unable to connect to DealerFlow server. Check connection."` |
| **Request Timeout** | Request exceeded 10,000ms | Cancel request via AbortController, present retry button to user. |

---

# 15. Loading Strategy

To ensure a smooth user experience, DealerFlow avoids blank screens and layout shifts using structural placeholders:

1. **Skeleton Screen Placeholders**:
   - Vehicle cards render `<VehicleCardSkeleton />` while catalog queries load.
   - Data tables render 5 rows of `<TableRowSkeleton />`.
2. **Button Loading States**:
   - Form submission buttons replace text with a spinner `<Loader className="animate-spin" />` and disable pointer events to prevent duplicate submissions.
3. **Background Refetching**:
   - Shows subtle top-right progress bar or sync icon while TanStack Query updates stale cached data in the background.
4. **Optimistic Updates**:
   - Stock quantity toggle updates UI state instantly before server response confirmation, rolling back gracefully if the mutation fails.

---

# 16. Responsive Design

DealerFlow adopts a Mobile-First responsive design system powered by Tailwind CSS.

### Breakpoint Conventions
- **Mobile (`< 640px`)**: Single column layout. Sidebar collapses into a slide-over mobile drawer navigation. Tables transform into stacked card lists.
- **Tablet (`640px - 1024px`)**: Two column card grids. Collapsible left navigation panel.
- **Desktop (`> 1024px`)**: Full multi-column dashboard layout. Fixed left sidebar navigation (`w-64`). Expanded data tables with sorting and multi-field filter bars.

---

# 17. Accessibility (a11y)

DealerFlow follows WCAG 2.1 AA accessibility guidelines:

- **Keyboard Navigation**: All interactive elements (Buttons, Inputs, Modals, Dropdowns) are fully operable via `Tab`, `Space`, `Enter`, and `Escape` keys.
- **Focus Management**: Dialogs and Modals trap focus within the overlay container when open and return focus to the trigger element upon closing.
- **ARIA Attributes**: Uses proper ARIA attributes (`aria-expanded`, `aria-label`, `aria-describedby`, `role="dialog"`, `role="alert"`).
- **Color Contrast**: Maintains minimum 4.5:1 color contrast ratio for standard text and 3:1 for graphical icons.
- **Form Labels**: Every input element is explicitly bound to a `<label>` element using matching `id` and `htmlFor` properties.

---

# 18. Coding Standards

The implementation should follow these rules throughout the frontend work:

- Use strict TypeScript and avoid `any`.
- Keep one component responsible for one UI concern.
- Prefer feature-first structure over technical folder sprawl.
- Favor composition over large monolithic components.
- Centralize API requests in services or hooks; do not call the API directly inside components.
- Keep business rules in the backend and let the frontend reflect backend responses.
- Reuse hooks instead of duplicating request logic.
- Keep shared UI primitives in the component layer.

# 19. AI Workflow

When implementing the frontend with AI assistance:

- Never generate code outside the requested milestone.
- Never modify unrelated files.
- Follow the existing architecture and naming conventions.
- Prefer updating existing files over creating new ones.
- Ask for clarification if an API mismatch is detected instead of silently inventing a contract.

# 20. Git Strategy

Use small, focused commits with the following prefixes:

```text
feat(auth):
feat(vehicle):
feat(inventory):
feat(purchase):
refactor(ui):
fix(api):
chore(frontend):
```

# 21. Synchronization Note

> Whenever the backend API changes, update this PLAN.md before implementing new frontend features.

# 22. Development Roadmap

The implementation is divided into 8 distinct, feature-driven milestones.

### Milestone 1: Project Setup & Infrastructure
- **Objective**: Initialize Vite React TypeScript project, configure Tailwind CSS, install dependencies, set up folder architecture and Axios client.
- **Expected Files**: `package.json`, `vite.config.ts`, `tailwind.config.js`, `src/api/axiosClient.ts`, `src/app/providers.tsx`.
- **Dependencies**: `react`, `react-dom`, `axios`, `@tanstack/react-query`, `react-router-dom`, `tailwindcss`.
- **Git Commit**: `feat(setup): initialize Vite React TS project with Tailwind and Axios client`

### Milestone 2: Authentication System
- **Objective**: Build login and registration pages, AuthContext, token storage, and protected route guard.
- **Expected Files**: `src/contexts/AuthContext.tsx`, `src/features/auth/*`, `src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx`, `src/components/guard/ProtectedRoute.tsx`.
- **Dependencies**: `react-hook-form`, `@hookform/resolvers`, `zod`, `sonner`.
- **Git Commit**: `feat(auth): implement authentication context, login, registration, and route guards`

### Milestone 3: Layout & Navigation Shell
- **Objective**: Create responsive application shell with Header, Sidebar, Navbar, and DashboardLayout.
- **Expected Files**: `src/layouts/DashboardLayout.tsx`, `src/components/navigation/*`.
- **Dependencies**: `lucide-react`, `clsx`, `tailwind-merge`.
- **Git Commit**: `feat(layout): implement responsive DashboardLayout with sidebar and navigation`

### Milestone 4: Vehicle CRUD & Catalog Feature
- **Objective**: Implement vehicle catalog listing, filter bar, detail view, creation form, edit form, and deletion modal.
- **Expected Files**: `src/features/vehicles/*`, `src/pages/VehiclesListPage.tsx`, `src/pages/VehicleDetailPage.tsx`, `src/pages/VehicleCreatePage.tsx`, `src/pages/VehicleEditPage.tsx`.
- **Dependencies**: TanStack Query mutations & queries, React Hook Form.
- **Git Commit**: `feat(vehicles): implement vehicle list, filtering, creation, update, and deletion`

### Milestone 5: Inventory Stock Management
- **Objective**: Build inventory status dashboard, metric summary cards, and stock quantity patch updating.
- **Expected Files**: `src/features/inventory/*`, `src/pages/InventoryPage.tsx`.
- **Dependencies**: TanStack Query stock patch mutations.
- **Git Commit**: `feat(inventory): implement inventory status metrics and stock quantity mutation`

### Milestone 6: Purchase Workflow Feature
- **Objective**: Implement purchase confirmation modal, single-click purchase execution, stock sync, and receipt card.
- **Expected Files**: `src/features/purchases/*`, `src/pages/PurchasesPage.tsx`.
- **Dependencies**: TanStack Query cache invalidation.
- **Git Commit**: `feat(purchases): implement purchase workflow, confirmation modal, and receipts`

### Milestone 7: Dashboard & Analytics Overview
- **Objective**: Build main dashboard view assembling inventory metrics, low stock widget, and recent additions.
- **Expected Files**: `src/features/dashboard/*`, `src/pages/DashboardPage.tsx`.
- **Dependencies**: Reusable UI components & stat cards.
- **Git Commit**: `feat(dashboard): implement operational metrics dashboard and low stock alerts`

### Milestone 8: UI Polish, Error Boundaries, Accessibility & Production Build
- **Objective**: Perform accessibility audits, verify empty/error states, add page title tags, optimize bundle size, verify clean production build.
- **Expected Files**: `src/components/feedback/ErrorBoundary.tsx`, `README.md`.
- **Dependencies**: `vite build`, `eslint`.
- **Git Commit**: `chore(prod): finalize UI polish, error boundaries, and production build verification`

---

# 23. Engineering Principles

Future implementation work must adhere strictly to these principles:

1. **Backend as Source of Truth**: Never override, invent, or duplicate backend business logic on the frontend.
2. **Strict Type Safety**: Maintain zero `any` types. All API payloads, states, and props must be strictly typed matching backend definitions.
3. **Feature-First Architecture**: Group code by feature module rather than technical file type to enforce high cohesion and low coupling.
4. **Small, Composable Components**: Keep components under 150 lines where possible. Prefer composition over large monolithic components.
5. **No Mock Data in Production Code**: Connect directly to backend endpoints. Do not leave fake static datasets in features.
6. **Explicit Error Handling**: Every asynchronous API request must handle loading, error, and empty response states explicitly.
7. **Conventional Git Commits**: Commit incrementally per feature milestone using standard Conventional Commit messages (`feat:`, `fix:`, `refactor:`, `chore:`).

---

# 24. Definition of Done

A frontend feature or milestone is defined as complete only when all the following criteria are met:

- [ ] **Build Validation**: Running `npm run build` or `vite build` completes with zero TypeScript or bundling errors.
- [ ] **Lint Clean**: Running `npm run lint` passes without any warnings or errors.
- [ ] **100% Backend Integration**: Fully integrated with live backend APIs (no mock data, no hardcoded responses).
- [ ] **Responsive Design Verified**: UI verified across Mobile (375px), Tablet (768px), and Desktop (1440px) screen sizes.
- [ ] **Accessibility Compliant**: Verified keyboard tab navigation and screen-reader form field label associations.
- [ ] **Error & Loading States**: Every page/feature explicitly displays loading skeletons, empty states, and error alerts on API failure.
- [ ] **Zero Technical Debt**: No remaining `TODO`, `FIXME`, dead code, or unhandled promise rejections.
- [ ] **Documentation**: Project `README.md` updated with setup instructions and environment variable specs.