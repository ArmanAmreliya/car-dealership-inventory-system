/**
 * useVehicle Hook
 *
 * Custom hook for fetching a single vehicle by ID.
 * Uses TanStack Query for caching and automatic refetching.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import { VehicleDTO } from '../../../api/api';
import { AxiosError } from 'axios';

/**
 * Query key factory for vehicle detail queries
 */
const vehicleDetailQueryKeys = {
  details: () => ['vehicles', 'detail'] as const,
  detail: (id: string) => [...vehicleDetailQueryKeys.details(), id] as const,
};

/**
 * Hook for fetching a single vehicle by ID
 *
 * @param id - Vehicle UUID
 * @returns Query result with vehicle, loading, and error states
 *
 * @example
 * ```tsx
 * const { data: vehicle, isLoading, error } = useVehicle(vehicleId);
 * 
 * if (isLoading) return <Skeleton />;
 * if (error) return <Error message={error.message} />;
 * if (!vehicle) return <NotFound />;
 * 
 * return <VehicleDetail vehicle={vehicle} />;
 * ```
 */
export function useVehicle(id: string): UseQueryResult<VehicleDTO, AxiosError> {
  return useQuery({
    queryKey: vehicleDetailQueryKeys.detail(id),
    queryFn: () => vehicleService.getVehicle(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run query if id is provided
  });
}
