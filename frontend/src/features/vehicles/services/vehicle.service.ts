/**
 * Vehicle Service
 *
 * Wraps backend vehicle endpoints with the shared Axios client.
 * Provides vehicle CRUD operations with filtering support.
 */

import { apiClient } from '../../../api/axios-client';
import { VehicleDTO } from '../../../api/api';
import { VehicleFilters, CreateVehicleInput, UpdateVehicleInput } from '../types/vehicle.types';

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

  /**
   * Create a new vehicle
   *
   * @param data - Vehicle creation data
   * @returns Created vehicle with ID and timestamps
   */
  createVehicle: async (data: CreateVehicleInput): Promise<VehicleDTO> => {
    const response = await apiClient.post<VehicleDTO>('/v1/vehicles', data);
    return response.data;
  },

  /**
   * Update an existing vehicle
   *
   * @param id - Vehicle UUID
   * @param data - Partial vehicle update data
   * @returns Updated vehicle
   */
  updateVehicle: async (id: string, data: UpdateVehicleInput): Promise<VehicleDTO> => {
    const response = await apiClient.put<VehicleDTO>(`/v1/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a vehicle
   *
   * @param id - Vehicle UUID
   * @returns void
   */
  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/vehicles/${id}`);
  },
};
