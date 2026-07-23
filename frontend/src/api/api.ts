/**
 * API Service Layer
 *
 * Centralized service functions for backend API endpoints.
 * Each service wraps the configured Axios client with typed request/response contracts.
 * This layer abstracts HTTP details and provides a clean interface for features to consume.
 */

import { apiClient } from './axios-client';

/**
 * User DTO returned from authentication endpoints
 */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vehicle DTO
 */
export interface VehicleDTO {
  stockQuantity: number;
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cloudinary Upload Signature DTO
 */
export interface UploadSignatureDTO {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Inventory DTO
 */
export interface InventoryItemDTO {
  id: string;
  vehicleId: string;
  quantity: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Purchase DTO
 */
export interface PurchaseDTO {
  id: string;
  userId: string;
  vehicleId: string;
  quantity: number;
  purchasedAt: string;
}

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Register a new user account
   */
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post<{ user: UserDTO; token: string }>(
      '/v1/auth/register',
      data
    );
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post<{ user: UserDTO; token: string }>(
      '/v1/auth/login',
      data
    );
    return response.data;
  },
};

/**
 * Vehicle API Service
 */
export const vehicleService = {
  /**
   * Get Cloudinary upload signature
   */
  getUploadSignature: async () => {
    try {
      const response = await apiClient.get<UploadSignatureDTO>('/v1/vehicles/upload-signature');
      return response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const fallbackResponse = await apiClient.get<UploadSignatureDTO>('/v1/upload-signature');
        return fallbackResponse.data;
      }
      throw err;
    }
  },

  /**
   * Get all vehicles with optional filters
   */
  listVehicles: async (params?: {
    make?: string;
    model?: string;
    year?: number;
    availability?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await apiClient.get<VehicleDTO[]>('/v1/vehicles', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single vehicle by ID
   */
  getVehicle: async (id: string) => {
    const response = await apiClient.get<VehicleDTO>(`/v1/vehicles/${id}`);
    return response.data;
  },

  /**
   * Create a new vehicle (requires authentication)
   */
  createVehicle: async (data: {
    vin: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage?: number;
    color?: string;
    imageUrl?: string;
  }) => {
    const response = await apiClient.post<VehicleDTO>('/v1/vehicles', data);
    return response.data;
  },

  /**
   * Update an existing vehicle (requires authentication)
   */
  updateVehicle: async (
    id: string,
    data: {
      vin?: string;
      make?: string;
      model?: string;
      year?: number;
      price?: number;
      mileage?: number;
      color?: string;
      imageUrl?: string;
    }
  ) => {
    const response = await apiClient.put<VehicleDTO>(`/v1/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a vehicle (requires authentication)
   */
  deleteVehicle: async (id: string) => {
    await apiClient.delete(`/v1/vehicles/${id}`);
  },
};

/**
 * Inventory API Service
 */
export const inventoryService = {
  /**
   * Get inventory status and items (requires authentication)
   */
  getInventory: async () => {
    const response = await apiClient.get<{
      items: InventoryItemDTO[];
      totalVehicles: number;
      availableVehicles: number;
    }>('/v1/inventory');
    return response.data;
  },

  /**
   * Update stock quantity for an inventory item (requires authentication)
   */
  updateStock: async (id: string, data: { stockQuantity: number }) => {
    const response = await apiClient.patch<InventoryItemDTO>(
      `/v1/inventory/${id}`,
      data
    );
    return response.data;
  },
};

/**
 * Purchase API Service
 */
export const purchaseService = {
  /**
   * Execute a purchase transaction (requires authentication)
   */
  executePurchase: async (data: { vehicleId: string }) => {
    const response = await apiClient.post<PurchaseDTO>(
      '/v1/purchases',
      data
    );
    return response.data;
  },
};

/**
 * Health Check API Service
 */
export const healthService = {
  /**
   * Check backend API health status
   */
  checkHealth: async () => {
    const response = await apiClient.get<{ status: string }>('/health');
    return response.data;
  },
};
