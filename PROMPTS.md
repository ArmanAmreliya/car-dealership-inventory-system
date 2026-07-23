# PROMPTS.md — AI Chat History

This file documents my AI tooling interactions throughout the DealerFlow project.
Tool used: **Kiro** (Amazon agentic AI IDE, model: Auto)

All conversations took place inside the Kiro IDE chat interface while working directly in the codebase.

---

## Session 1 — Codebase onboarding and learning

**My prompt:**
> You are a Senior Frontend Architect mentoring a new engineer joining the project. Teach me the entire frontend codebase from scratch until I can confidently implement features, debug issues, optimize performance, and explain every architectural decision in an interview. [Full roadmap with 21 chapters listed]

**What Kiro did:**
Read every config file, entry point, provider, route, layout, and component before teaching. Taught Chapters 1–5: Project Architecture, Vite Entry Point, React Rendering Lifecycle, Routing, and Layout Structure. Explained every file, every pattern, and why each decision was made. Ended with 10 interview questions and a practical task.

---

## Session 2 — Role-based delete (backend already done, frontend missing)

**My prompt:**
> make DELETE /api/vehicles/:id: Delete a vehicle (Admin only). there are two user one admin and user role with specific requirement to action perform. The Senior Engineer's Observation: The feature is already fully implemented on backend. vehicle.routes.ts → router.delete('/:id', authenticate, requireAdmin, ...) ✅ [etc.] it's done from backend side still frontend shows user's to delete button? how to implement role admin? or user? from frontend and give access! there is simple login/register page without role!

**What Kiro did:**
Read all relevant files (vehicle routes, controller, auth context, frontend components). Taught the mental model of frontend permission-aware view layer vs backend enforcement. Explained why to extract role checks into a `useIsAdmin` hook (single source of truth) rather than inline `user.role === 'admin'` checks. Explained conditional rendering vs disabled buttons and why hiding is correct.

---

## Session 3 — Debugging VehicleActions.tsx

**My prompt:**
> C:\Users\Aman\OneDrive\Desktop\dealer-flow\frontend\src\features\vehicles\components\VehicleActions.tsx. I my best but still shows error

**What Kiro did:**
Read the file. Identified 4 bugs:
1. Hook (`useIsAdmin`) called inside JSX instead of top of component — explained Rules of Hooks
2. Closing `)}` placed inside button's opening tag instead of after `</button>`
3. Wrong import path (`../hooks/` instead of `../../../hooks/`)
4. Card layout delete button still unguarded

Explained each bug with the correct mental model before showing the fix.

---

## Session 4 — POST /api/vehicles/:id/restock backend feature

**My prompt:**
> POST /api/vehicles/:id/restock: Restock a vehicle, increasing its quantity (Admin only). give more short and precise response save tokens from backend POST /:id/restock → authenticate → requireAdmin → validate(restockSchema) → inventoryController.updateStock. guide me

**What Kiro did:**
Read all inventory files. Built a clear implementation map across 4 files (types, service, controller, routes). Explained the read-modify-write pattern for stock addition. Asked me to check `IVehicleRepository` for `findById` before writing the service method. Guided each step without writing the full code.

---

## Session 5 — inventory.controller.ts restock method

**My prompt:**
> Step 3 — inventory.controller.ts Add a restock method [...] give me full code

**What Kiro did:**
Read the current controller. Provided the structure with one intentional gap left for me to fill — the actual service call line — explaining this is how real learning works. Pointed out the pattern mirrors `updateStock` exactly.

---

## Session 6 — inventory.service.ts restock method

**My prompt:**
> Step 2 — inventory.service.ts Add a restock method [...] what happens if vehicleId doesn't exist? What if quantity is 0?

**What Kiro did:**
Read the repository interface and Prisma implementation to identify `findById`. Provided the method with one intentional gap (the `newStock` calculation line), explaining the read-modify-write pattern and why a DB-level atomic increment wasn't used.

---

## Session 7 — Frontend inventory service error (backend code pasted into frontend)

**My prompt:**
> C:\...\frontend\src\features\inventory\services\inventory.service.ts ! change resolve error

**What Kiro did:**
Read both files. Identified the critical confusion: backend service code (AppError, vehicleRepository, findById) had been pasted into the frontend service file. Explained the layer distinction clearly with a table. Also identified the method was nested inside `updateStock`'s return statement. Rewrote the entire file cleanly.

---

## Session 8 — useInventory.ts hook error

**My prompt:**
> C:\...\frontend\src\features\inventory\hooks\useInventory.ts solve error

**What Kiro did:**
Read the file. Identified `useRestock` was nested inside `useUpdateStock`'s closing brace instead of being a separate top-level function. Fixed by adding the missing `}` that closed `useUpdateStock`. Explained brace counting as a debugging technique.

---

## Session 9 — InventoryTable.tsx restock button

**My prompt:**
> Call mutate from useRestock when the button is clicked. Wrap the button in {isAdmin && (...)}. Show a toast on success. how to do this? C:\...\InventoryTable.tsx

**What Kiro did:**
Read the file. Confirmed imports and hooks already in place. Provided exact three-change instructions: `toast` import, `Package` icon import, and the full button JSX with `restock.mutate()` call pattern and `onSuccess`/`onError` callbacks.

---

## Session 10 — InventoryTable.tsx bug fixes

**My prompt:**
> C:\...\InventoryTable.tsx error how to solve it

**What Kiro did:**
Read the file. Identified 5 bugs: `inPending` typo (should be `isPending`), `item.vehicle` used as ID (should be `item.vehicleId`), `quantity:` with no value, `onSucces` typo causing silent callback failure, misplaced `{` in toast call, and unquoted string. Fixed all 5 and explained each with the rule to remember.

---

## Session 11 — 404 on restock (wrong URL)

**My prompt:**
> requests.js:1 POST http://localhost:3000/api/v1/inventory/cc8abbd5.../restock 404 (Not Found)

**What Kiro did:**
Read routes/index.ts and vehicle.routes.ts. Discovered the restock route was already registered at `/v1/vehicles/:id/restock` in vehicle.routes.ts — not at `/v1/inventory/:id/restock`. The frontend was calling the wrong URL. Fixed the one-line URL in the frontend service.

---

## Session 12 — Accidentally removed restock feature

**My prompt:**
> I mistakenly removed it please add them restock feature [explained what was removed]

**What Kiro did:**
Read all three backend inventory files to confirm current state. Re-added `restock` method to service (with proper read-modify-write logic), controller (handler with `req.params.id`), and routes (POST `/:id/restock` with all middleware). Also corrected the frontend URL back to `/v1/inventory/:id/restock`.

---

## Session 13 — Full requirements audit

**My prompt:**
> DONE! [full assignment requirements pasted] — checking what is done and what is missing

**What Kiro did:**
Delegated to context-gatherer sub-agent for full codebase audit. Produced a comprehensive table of every requirement with DONE/MISSING status. Identified 3 gaps: missing `category` field on Vehicle model, wrong purchase endpoint URL (`/api/purchases` instead of `/api/vehicles/:id/purchase`), and purchase button not disabled when `stockQuantity === 0`.

---

## Session 14 — Fix the 3 gaps

**My prompt:**
> C:\...\schemas.ts / C:\...\vehicle.routes.ts / C:\...\PurchasesPage.tsx [opened all three]

**What Kiro did:**
Fixed `createVehicleSchema` syntax error (broken `category` field with wrong key name and unclosed method chain). Added `category` to `updateVehicleSchema`. Fixed `vehicle.routes.ts` `/:id/purchase` route to inject `vehicleId` from URL params into body and use `PurchaseController` (not `vehicleController.purchase` which doesn't exist). Added `outOfStock` gate to `VehicleSelectionCard`.

---

## Session 15 — Admin UI gate check

**My prompt:**
> Done? (For Admin Users) Forms/UI to add, update, and delete vehicles.

**What Kiro did:**
Read `VehicleCreatePage`, `VehicleEditPage`, and `AppRoutes.tsx`. Confirmed forms exist but routes are not admin-gated — any authenticated user can navigate to `/vehicles/new` and `/vehicles/:id/edit`. Designed `AdminRoute` guard component with correct redirect logic and showed exactly where to add it in the router.

---

## Session 16 — Verify admin gate implementation

**My prompt:**
> check I did it! [opened AdminRoute.tsx, AppRoutes.tsx, VehiclesListPage.tsx]

**What Kiro did:**
Read all three files. Confirmed correct implementation: `AdminRoute` has proper `isLoading` guard and redirects to dashboard (not login), both create and edit routes correctly wrapped, `isAdmin` hook called at component top level, Add Vehicle button hidden from non-admins. Fixed one unused `Navigate` import.

---

## Session 17 — Swagger update

**My prompt:**
> C:\...\swagger.ts. update with current all APIs

**What Kiro did:**
Read swagger config, auth types, purchase types, vehicle types, and all route files. Identified missing entries: `POST /v1/vehicles/{id}/purchase`, `POST /v1/vehicles/{id}/restock`, `POST /v1/inventory/{id}/restock`, `GET /v1/vehicles/search`. Also identified missing schema fields: `category`, `stockQuantity`, `imageUrl` on Vehicle schema. Rewrote the entire swagger spec.

---

## Session 18 — TDD for search endpoint

**My prompt:**
> GET /v1/vehicles/search — was missing entirely from v1 paths?? it is there or not? if missing add it with TDD approach

**What Kiro did:**
Read vehicle.routes.ts, controller, service, and all existing test files. Confirmed the route exists (`router.get('/search', authenticate, vehicleController.list)`). Noted only the compatibility alias `/api/vehicles/search` had a test — the `/api/v1/vehicles/search` path had no integration test coverage. Wrote 12 integration tests following Red-Green-Refactor: auth guard tests, filter-by-make/model/year/price tests, combined filter test, empty result test, response shape test, and parity test confirming `/search` and `/vehicles` return identical results. Ran tests — all 12 passed.

---

## Session 19 — README and deliverables

**My prompt:**
> [full assignment deliverables requirements pasted] — README.md, PROMPTS.md, test report, git commit messages with co-author

**What Kiro did:**
Read package.json files for both backend and frontend. Ran full test suite to get accurate coverage numbers. Created comprehensive README.md with project overview, tech stack table, all API endpoints, local setup instructions for both backend and frontend, test report with accurate pass/fail counts and explanation of the VIN uniqueness issue, and the required "My AI Usage" section. Created this PROMPTS.md file.

---

*All sessions conducted with Kiro AI (Amazon) inside the Kiro IDE.*
*Co-authored-by: Kiro <kiro@amazon.com>*
