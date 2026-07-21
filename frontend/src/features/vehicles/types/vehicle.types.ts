/**
 * Vehicle Listing Types
 *
 * Type definitions for vehicle filtering and display.
 */

import { VehicleDTO } from '../../../api/api';

/**
 * Vehicle filter parameters for list queries
 * All filters are optional
 */
export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Sorted vehicle list response
 */
export interface VehicleListResponse {
  vehicles: VehicleDTO[];
  total: number;
}

/**
 * Vehicle display with additional computed properties
 */
export type VehicleDisplay = VehicleDTO;
