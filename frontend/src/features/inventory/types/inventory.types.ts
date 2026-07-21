/**
 * Inventory Feature Types
 *
 * Strong TypeScript types mirroring the backend Prisma schema and
 * the response shapes returned by GET /api/v1/inventory and
 * PATCH /api/v1/inventory/:id.
 *
 * Backend model reference:
 *   model Inventory {
 *     id        String   @id @default(uuid())
 *     vehicleId String   @unique
 *     quantity  Int      @default(0)
 *     available Boolean  @default(true)
 *     createdAt DateTime @default(now())
 *     updatedAt DateTime @updatedAt
 *   }
 */

import { VehicleDTO } from '../../../api/api';

// ── Core DTOs ──────────────────────────────────────────────────────────────

/**
 * A single inventory record as returned by the backend.
 * Extends the base InventoryItemDTO with the nested vehicle relation
 * that the backend populates on the GET /v1/inventory endpoint.
 */
export interface InventoryItemDTO {
  id: string;
  vehicleId: string;
  /** Nested vehicle data included by the API */
  vehicle?: VehicleDTO;
  quantity: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Full response shape of GET /api/v1/inventory.
 *
 * The backend returns aggregate totals alongside the item list:
 *   { items, totalVehicles, availableVehicles }
 */
export interface InventoryResponse {
  items: InventoryItemDTO[];
  totalVehicles: number;
  availableVehicles: number;
}

// ── Mutation inputs ────────────────────────────────────────────────────────

/**
 * Payload for PATCH /api/v1/inventory/:id.
 * Only stockQuantity is accepted by the backend.
 */
export interface UpdateStockInput {
  stockQuantity: number;
}

/**
 * Arguments shape accepted by useUpdateStock mutation.
 * Combines the inventory item ID with the update payload.
 */
export interface UpdateStockArgs {
  id: string;
  data: UpdateStockInput;
}

// ── Derived / computed types ───────────────────────────────────────────────

/**
 * Availability status derived from an inventory item.
 * Used for badge rendering and filtering.
 */
export type AvailabilityStatus = 'available' | 'unavailable' | 'low-stock';

/**
 * Dashboard-level summary derived from InventoryResponse.
 * Computed by useInventoryStats and consumed by dashboard stat cards.
 */
export interface InventoryStats {
  /** Total number of inventory items (vehicles tracked) */
  totalVehicles: number;
  /** Number of vehicles with available === true */
  availableVehicles: number;
  /** Number of vehicles with available === false */
  unavailableVehicles: number;
  /** Percentage of vehicles that are available (0–100, rounded) */
  availabilityRate: number;
  /** Total units in stock across all inventory items */
  totalStock: number;
  /** Number of items with quantity === 0 */
  outOfStockCount: number;
  /** Number of items with quantity > 0 and quantity <= LOW_STOCK_THRESHOLD */
  lowStockCount: number;
}

/**
 * Threshold below which an item is considered "low stock".
 * Kept here so both hooks and UI can reference the same value.
 */
export const LOW_STOCK_THRESHOLD = 3;
