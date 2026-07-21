/**
 * Vehicle Service
 *
 * Wraps backend vehicle endpoints with the shared Axios client.
 * Provides vehicle listing with filtering support.
 */

import { apiClient } from '../../../api/axios-client';
import { VehicleDTO } from '../../../api/api';
import { VehicleFilters } from '../types/vehicle.types';

/**
 * Vehicle API service
 */
export const vehicleService = {
  /**
   * Get all vehicles with optional filters
   *
   * @param filters - Optional filter parameters (make, model, year, availability, minPrice, maxPrice)
   * @returns Array of vehicles matching filters
   */
  listVehicles: async (filters?: VehicleFilters): Promise<VehicleDTO[]> => {
    const response = await apiClient.get<VehicleDTO[]>('/v1/vehicles', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single vehicle by ID
   *
   * @param id - Vehicle UUID
   * @returns Vehicle details
   */
  getVehicle: async (id: string): Promise<VehicleDTO> => {
    const response = await apiClient.get<VehicleDTO>(`/v1/vehicles/${id}`);
    return response.data;
  },
};
