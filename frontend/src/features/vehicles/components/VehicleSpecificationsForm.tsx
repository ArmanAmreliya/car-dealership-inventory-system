/**
 * VehicleSpecificationsForm Component
 *
 * Form for editing vehicle specifications.
 * Clean, minimal design with neutral + teal accent.
 * Used within the VehicleEditDrawer.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VehicleDTO } from '../../../api/api';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1886, 'Year must be 1886 or later').max(new Date().getFullYear() + 2, 'Year is too far in future'),
  price: z.coerce.number().positive('Price must be positive'),
  vin: z.string().min(1, 'VIN is required').max(17, 'VIN must be at most 17 characters'),
  mileage: z.coerce.number().nonnegative('Mileage cannot be negative').optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleSpecificationsFormProps {
  vehicle?: VehicleDTO;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VehicleSpecificationsForm({ vehicle, onSubmit, onCancel, isLoading }: VehicleSpecificationsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle ? {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      vin: vehicle.vin,
      mileage: vehicle.mileage ?? undefined,
      color: vehicle.color ?? '',
      description: '',
      notes: '',
    } : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Basic Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Make
            </label>
            <input
              id="make"
              type="text"
              {...register('make')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., Toyota"
            />
            {errors.make && (
              <p className="mt-1 text-xs text-status-error">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Model
            </label>
            <input
              id="model"
              type="text"
              {...register('model')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., Camry"
            />
            {errors.model && (
              <p className="mt-1 text-xs text-status-error">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Year
            </label>
            <input
              id="year"
              type="number"
              {...register('year')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., 2024"
            />
            {errors.year && (
              <p className="mt-1 text-xs text-status-error">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., 25000"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-status-error">{errors.price.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Vehicle Details</h3>
        
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-neutral-700 mb-1.5">
            VIN
          </label>
          <input
            id="vin"
            type="text"
            {...register('vin')}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            placeholder="e.g., 1HGCM82633A004352"
          />
          {errors.vin && (
            <p className="mt-1 text-xs text-status-error">{errors.vin.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Mileage (optional)
            </label>
            <input
              id="mileage"
              type="number"
              {...register('mileage')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., 45000"
            />
            {errors.mileage && (
              <p className="mt-1 text-xs text-status-error">{errors.mileage.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Color (optional)
            </label>
            <input
              id="color"
              type="text"
              {...register('color')}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="e.g., Silver"
            />
            {errors.color && (
              <p className="mt-1 text-xs text-status-error">{errors.color.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Additional Information</h3>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
            placeholder="Vehicle description..."
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Internal Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            {...register('notes')}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
            placeholder="Internal notes..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}
