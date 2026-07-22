/**
 * Inventory Feature Types
 *
 * Strong TypeScript types mirroring the backend Prisma schema and
 * response shapes for GET /api/v1/inventory and PATCH /api/v1/inventory/:id.
 */

import { VehicleDTO } from '../../../api/api';

// ── Core DTOs ──────────────────────────────────────────────────────────────

export interface InventoryItemDTO {
  id: string;
  vehicleId: string;
  vehicle?: VehicleDTO;
  quantity: number;
  available: boolean;
  reserved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryResponse {
  items: InventoryItemDTO[];
  totalVehicles: number;
  availableVehicles: number;
}

// ── Mutation inputs ────────────────────────────────────────────────────────

export interface UpdateStockInput {
  stockQuantity: number;
  reason?: string;
  notes?: string;
}

export interface UpdateStockArgs {
  id: string;
  data: UpdateStockInput;
}

// ── Stock Movement History ─────────────────────────────────────────────────

export interface StockMovement {
  id: string;
  inventoryId: string;
  vehicleId: string;
  previousQuantity: number;
  newQuantity: number;
  change: number;
  reason: string;
  notes?: string;
  timestamp: string;
}

// ── Derived / Computed Types ───────────────────────────────────────────────

export type AvailabilityStatus = 'available' | 'unavailable' | 'low-stock' | 'reserved';

export interface InventoryStats {
  totalVehicles: number;
  availableVehicles: number;
  unavailableVehicles: number;
  reservedCount: number;
  availabilityRate: number;
  totalStock: number;
  outOfStockCount: number;
  lowStockCount: number;
  totalValue: number;
}

export const LOW_STOCK_THRESHOLD = 3;

// ── Filters & Sorting ──────────────────────────────────────────────────────

export type StockLevelFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'quantity-asc'
  | 'quantity-desc'
  | 'updated-desc';

export interface InventoryFilterState {
  search: string;
  status: 'all' | AvailabilityStatus;
  stockLevel: StockLevelFilter;
  manufacturer: string;
  sortBy: SortOption;
}
