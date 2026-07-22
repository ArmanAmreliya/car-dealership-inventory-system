/**
 * VehicleForm Component — Premium Enterprise Edition
 *
 * Reusable form for creating and editing vehicles.
 * Uses React Hook Form with Zod validation.
 * Premium design with:
 *   - Grouped fields with section dividers
 *   - Smooth error animations
 *   - Polished input styling
 */

import React from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleCreateSchema, vehicleUpdateSchema, VehicleCreateInput, VehicleUpdateInput } from '../validation/vehicle.schema';
import { VehicleDTO } from '../../../api/api';

interface VehicleFormProps {
  mode: 'create' | 'edit';
  initialData?: VehicleDTO;
  onSubmit: (data: FieldValues) => void;
  isPending: boolean;
  error?: string | null;
}

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

  // Shared classes
  const inputBase =
    'block w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none disabled:bg-slate-100 disabled:text-slate-400';
  const inputNormal = `${inputBase} border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20`;
  const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/20`;
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5';
  const errorCls = 'mt-1.5 text-xs font-medium text-red-500';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Something went wrong</p>
            <p className="mt-0.5 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* ── Section: Identification ─────────────────────────────────────────── */}
      <div>
        <h3 className="mb-1 text-sm font-bold text-slate-900">Identification</h3>
        <p className="mb-5 text-xs text-slate-500">Vehicle identification and classification details</p>

        <div className="space-y-5">
          {/* VIN */}
          <div>
            <label htmlFor="vin" className={labelCls}>
              VIN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="vin"
              placeholder="Enter vehicle identification number"
              className={errors.vin ? inputError : inputNormal}
              {...register('vin')}
              disabled={isPending}
            />
            {errors.vin && <p className={errorCls}>{String(errors.vin.message)}</p>}
          </div>

          {/* Make & Model row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="make" className={labelCls}>
                Make <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="make"
                placeholder="e.g. Toyota, Ford, BMW"
                className={errors.make ? inputError : inputNormal}
                {...register('make')}
                disabled={isPending}
              />
              {errors.make && <p className={errorCls}>{String(errors.make.message)}</p>}
            </div>

            <div>
              <label htmlFor="model" className={labelCls}>
                Model <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="model"
                placeholder="e.g. Camry, F-150, 3 Series"
                className={errors.model ? inputError : inputNormal}
                {...register('model')}
                disabled={isPending}
              />
              {errors.model && <p className={errorCls}>{String(errors.model.message)}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* ── Section: Specifications ─────────────────────────────────────────── */}
      <div>
        <h3 className="mb-1 text-sm font-bold text-slate-900">Specifications</h3>
        <p className="mb-5 text-xs text-slate-500">Year, pricing, and physical attributes</p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Year */}
          <div>
            <label htmlFor="year" className={labelCls}>
              Year <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="year"
              placeholder="e.g. 2024"
              className={errors.year ? inputError : inputNormal}
              {...register('year')}
              disabled={isPending}
            />
            {errors.year && <p className={errorCls}>{String(errors.year.message)}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className={labelCls}>
              Price <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.01"
                className={`${errors.price ? inputError : inputNormal} pl-8`}
                {...register('price')}
                disabled={isPending}
              />
            </div>
            {errors.price && <p className={errorCls}>{String(errors.price.message)}</p>}
          </div>

          {/* Mileage */}
          <div>
            <label htmlFor="mileage" className={labelCls}>
              Mileage <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="mileage"
                placeholder="Enter mileage in miles"
                className={errors.mileage ? inputError : inputNormal}
                {...register('mileage')}
                disabled={isPending}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">mi</span>
            </div>
            {errors.mileage && <p className={errorCls}>{String(errors.mileage.message)}</p>}
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className={labelCls}>
              Color <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              id="color"
              placeholder="e.g. Red, Blue, Black"
              className={errors.color ? inputError : inputNormal}
              {...register('color')}
              disabled={isPending}
            />
            {errors.color && <p className={errorCls}>{String(errors.color.message)}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {mode === 'create' ? 'Creating Vehicle...' : 'Saving Changes...'}
          </span>
        ) : mode === 'create' ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Vehicle
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Save Changes
          </span>
        )}
      </button>
    </form>
  );
}
