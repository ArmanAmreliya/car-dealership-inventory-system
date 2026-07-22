/**
 * useVehicles Hook
 *
 * Custom hook for fetching vehicle list with filtering.
 * Uses TanStack Query for caching and automatic refetching.
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import { VehicleDTO } from '../../../api/api';
import { VehicleFilters, CreateVehicleInput, UpdateVehicleInput } from '../types/vehicle.types';
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
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateVehicle(): UseMutationResult<
  VehicleDTO,
  AxiosError,
  CreateVehicleInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleInput) => vehicleService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.all, refetchType: 'all' });
    },
  });
}

export function useUpdateVehicle(): UseMutationResult<
  VehicleDTO,
  AxiosError,
  { id: string; data: UpdateVehicleInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => vehicleService.updateVehicle(id, data),
    onSuccess: (updatedVehicle) => {
      queryClient.setQueryData(vehicleQueryKeys.detail(updatedVehicle.id), updatedVehicle);
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.all, refetchType: 'all' });
    },
  });
}

export function useDeleteVehicle(): UseMutationResult<
  void,
  AxiosError,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.all, refetchType: 'all' });
    },
  });
}
