/**
 * Purchase Feature Types
 *
 * Strong TypeScript types mirroring the backend Prisma schema and
 * the response shape returned by POST /api/v1/purchases.
 *
 * Backend model reference:
 *   model Purchase {
 *     id          String   @id @default(uuid())
 *     userId      String
 *     vehicleId   String
 *     quantity    Int      @default(1)
 *     purchasedAt DateTime @default(now())
 *   }
 *
 * IMPORTANT: The backend exposes only one purchase endpoint:
 *   POST /api/v1/purchases  →  { vehicleId: string }
 * There is no purchase history or list endpoint.
 */

import { VehicleDTO, UserDTO } from '../../../api/api';

// ── Core DTOs ──────────────────────────────────────────────────────────────

/**
 * Purchase record as returned by POST /api/v1/purchases.
 *
 * The backend may optionally populate the nested `vehicle` and `user`
 * relations in the response body. Both are typed as optional so the
 * frontend handles both populated and unpopulated responses safely.
 */
export interface PurchaseDTO {
  id: string;
  userId: string;
  vehicleId: string;
  /** Quantity purchased — backend defaults to 1 */
  quantity: number;
  purchasedAt: string;
  /** Optionally populated vehicle relation */
  vehicle?: VehicleDTO;
  /** Optionally populated user relation */
  user?: UserDTO;
}

// ── Mutation inputs ────────────────────────────────────────────────────────

/**
 * Payload for POST /api/v1/purchases.
 * Only vehicleId is accepted by the backend.
 */
export interface CreatePurchaseInput {
  vehicleId: string;
}

// ── Error classification ───────────────────────────────────────────────────

/**
 * HTTP status codes the purchase endpoint can return that require
 * specific UI handling beyond a generic error message.
 *
 * 409 Conflict – vehicle is already sold or inventory is exhausted.
 *   UI must refresh the vehicle/inventory cache and show an
 *   "unavailable" warning rather than a generic error.
 */
export type PurchaseErrorCode = 409 | 400 | 401 | 403 | 404 | 500;

/**
 * Structured error extracted from a failed purchase response.
 * Used by components to distinguish conflict errors from other failures.
 */
export interface PurchaseError {
  /** HTTP status code */
  status: PurchaseErrorCode;
  /** Human-readable message from the backend error body */
  message: string;
  /** True when the vehicle is no longer available (HTTP 409) */
  isConflict: boolean;
}

// ── Receipt / confirmation ─────────────────────────────────────────────────

/**
 * Subset of PurchaseDTO used when rendering a purchase receipt card.
 * Carries everything the receipt component needs without the full DTO.
 */
export interface PurchaseReceipt {
  purchaseId: string;
  vehicleId: string;
  vehicleLabel: string;
  quantity: number;
  purchasedAt: string;
  /** Formatted price at time of display (sourced from vehicle.price) */
  price?: number;
}
