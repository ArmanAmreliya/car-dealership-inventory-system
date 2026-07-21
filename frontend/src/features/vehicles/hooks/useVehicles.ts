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
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for creating a vehicle
 *
 * @returns Mutation object with mutate function and states
 *
 * @example
 * ```tsx
 * const { mutate: createVehicle, isPending } = useCreateVehicle();
 * 
 * const handleCreate = (data: CreateVehicleInput) => {
 *   createVehicle(data);
 * };
 * ```
 */
export function useCreateVehicle(): UseMutationResult<
  VehicleDTO,
  AxiosError,
  CreateVehicleInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleInput) => vehicleService.createVehicle(data),
    onSuccess: () => {
      // Invalidate vehicle list to trigger refetch
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.lists() });
    },
  });
}

/**
 * Hook for updating a vehicle
 *
 * @returns Mutation object with mutate function and states
 *
 * @example
 * ```tsx
 * const { mutate: updateVehicle, isPending } = useUpdateVehicle();
 * 
 * const handleUpdate = (id: string, data: UpdateVehicleInput) => {
 *   updateVehicle({ id, data });
 * };
 * ```
 */
export function useUpdateVehicle(): UseMutationResult<
  VehicleDTO,
  AxiosError,
  { id: string; data: UpdateVehicleInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => vehicleService.updateVehicle(id, data),
    onSuccess: (updatedVehicle) => {
      // Update specific vehicle in cache
      queryClient.setQueryData(vehicleQueryKeys.detail(updatedVehicle.id), updatedVehicle);
      // Invalidate vehicle list to trigger refetch
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.lists() });
    },
  });
}

/**
 * Hook for deleting a vehicle
 *
 * @returns Mutation object with mutate function and states
 *
 * @example
 * ```tsx
 * const { mutate: deleteVehicle, isPending } = useDeleteVehicle();
 * 
 * const handleDelete = (id: string) => {
 *   deleteVehicle(id);
 * };
 * ```
 */
export function useDeleteVehicle(): UseMutationResult<
  void,
  AxiosError,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      // Invalidate all vehicle queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: vehicleQueryKeys.all });
    },
  });
}
