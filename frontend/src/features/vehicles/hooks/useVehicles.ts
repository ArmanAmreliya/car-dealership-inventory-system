/**
 * useVehicles Hook
 *
 * Custom hook for fetching vehicle list with filtering.
 * Uses TanStack Query for caching and automatic refetching.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import { VehicleDTO } from '../../../api/api';
import { VehicleFilters } from '../types/vehicle.types';
import { AxiosError } from 'axios';

/**
 * Query key factory for vehicle queries
 */
const vehicleQueryKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleQueryKeys.all, 'list'] as const,
  list: (filters?: VehicleFilters) => [
    ...vehicleQueryKeys.lists(),
    filters,
  ] as const,
  details: () => [...vehicleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleQueryKeys.details(), id] as const,
};

/**
 * Hook for fetching vehicle list
 *
 * @param filters - Optional filter parameters
 * @returns Query result with vehicles, loading, and error states
 *
 * @example
 * ```tsx
 * const { data: vehicles, isLoading, error } = useVehicles({
 *   make: 'Toyota',
 *   minPrice: 10000,
 * });
 * ```
 */
export function useVehicles(
  filters?: VehicleFilters
): UseQueryResult<VehicleDTO[], AxiosError> {
  return useQuery({
    queryKey: vehicleQueryKeys.list(filters),
    queryFn: () => vehicleService.listVehicles(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for fetching a single vehicle by ID
 *
 * @param id - Vehicle UUID
 * @returns Query result with vehicle, loading, and error states
 *
 * @example
 * ```tsx
 * const { data: vehicle, isLoading, error } = useVehicle(vehicleId);
 * ```
 */
export function useVehicle(id: string): UseQueryResult<VehicleDTO, AxiosError> {
  return useQuery({
    queryKey: vehicleQueryKeys.detail(id),
    queryFn: () => vehicleService.getVehicle(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}
