/**
 * VehicleForm Component
 *
 * Reusable form for creating and editing vehicles.
 * Uses React Hook Form with Zod validation.
 * Supports both create and edit modes.
 */

import React from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleCreateSchema, vehicleUpdateSchema, VehicleCreateInput, VehicleUpdateInput } from '../validation/vehicle.schema';
import { VehicleDTO } from '../../../api/api';

interface VehicleFormProps {
  /**
   * Form mode: create or edit
   */
  mode: 'create' | 'edit';

  /**
   * Initial vehicle data for edit mode
   */
  initialData?: VehicleDTO;

  /**
   * Callback when form is submitted successfully
   */
  onSubmit: (data: FieldValues) => void;

  /**
   * Is the mutation pending
   */
  isPending: boolean;

  /**
   * Mutation error message
   */
  error?: string | null;
}

/**
 * VehicleForm Component
 *
 * A reusable form for creating and editing vehicles.
 * Handles validation with Zod and form state with React Hook Form.
 *
 * @example
 * ```tsx
 * function CreateVehiclePage() {
 *   const { mutate: createVehicle, isPending, error } = useCreateVehicle();
 *
 *   const handleSubmit = (data: VehicleCreateInput) => {
 *     createVehicle(data, {
 *       onSuccess: () => {
 *         navigate('/vehicles');
 *       },
 *     });
 *   };
 *
 *   return (
 *     <VehicleForm
 *       mode="create"
 *       onSubmit={handleSubmit}
 *       isPending={isPending}
 *       error={error?.message}
 *     />
 *   );
 * }
 * ```
 */
export function VehicleForm({ mode, initialData, onSubmit, isPending, error }: VehicleFormProps) {
  const schema = mode === 'create' ? vehicleCreateSchema : vehicleUpdateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData
      ? {
          vin: initialData.vin,
          make: initialData.make,
          model: initialData.model,
          year: initialData.year.toString(),
          price: initialData.price.toString(),
          mileage: initialData.mileage?.toString() || '',
          color: initialData.color || '',
        }
      : undefined,
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        vin: initialData.vin,
        make: initialData.make,
        model: initialData.model,
        year: initialData.year.toString(),
        price: initialData.price.toString(),
        mileage: initialData.mileage?.toString() || '',
        color: initialData.color || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data as VehicleCreateInput | VehicleUpdateInput);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* VIN */}
      <div>
        <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
          VIN <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="vin"
          placeholder="Enter vehicle identification number"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.vin
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('vin')}
          disabled={isPending}
        />
        {errors.vin && <p className="mt-1 text-sm text-red-600">{String(errors.vin.message)}</p>}
      </div>

      {/* Make */}
      <div>
        <label htmlFor="make" className="block text-sm font-medium text-gray-700">
          Make <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="make"
          placeholder="e.g. Toyota, Ford, BMW"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.make
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('make')}
          disabled={isPending}
        />
        {errors.make && <p className="mt-1 text-sm text-red-600">{String(errors.make.message)}</p>}
      </div>

      {/* Model */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          Model <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="model"
          placeholder="e.g. Camry, F-150, 3 Series"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.model
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('model')}
          disabled={isPending}
        />
        {errors.model && <p className="mt-1 text-sm text-red-600">{String(errors.model.message)}</p>}
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Year <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="year"
          placeholder="e.g. 2024"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.year
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('year')}
          disabled={isPending}
        />
        {errors.year && <p className="mt-1 text-sm text-red-600">{String(errors.year.message)}</p>}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="price"
            placeholder="0.00"
            step="0.01"
            className={`block w-full rounded-md border px-3 py-2 pl-7 shadow-sm focus:outline-none sm:text-sm ${
              errors.price
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            {...register('price')}
            disabled={isPending}
          />
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-600">{String(errors.price.message)}</p>}
      </div>

      {/* Mileage */}
      <div>
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
          Mileage (optional)
        </label>
        <input
          type="number"
          id="mileage"
          placeholder="Enter mileage in miles"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.mileage
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('mileage')}
          disabled={isPending}
        />
        {errors.mileage && <p className="mt-1 text-sm text-red-600">{String(errors.mileage.message)}</p>}
      </div>

      {/* Color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color (optional)
        </label>
        <input
          type="text"
          id="color"
          placeholder="e.g. Red, Blue, Black"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${
            errors.color
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...register('color')}
          disabled={isPending}
        />
        {errors.color && <p className="mt-1 text-sm text-red-600">{String(errors.color.message)}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {mode === 'create' ? 'Creating...' : 'Updating...'}
          </span>
        ) : mode === 'create' ? (
          'Create Vehicle'
        ) : (
          'Update Vehicle'
        )}
      </button>
    </form>
  );
}
