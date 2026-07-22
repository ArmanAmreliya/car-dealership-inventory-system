/**
 * VehicleForm Component — Premium Enterprise Edition (Compact Split Layout)
 *
 * Reusable form for creating and editing vehicles.
 * Uses a compact 2-column split layout to eliminate unnecessary scrolling.
 */

import React, { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleCreateSchema, vehicleUpdateSchema, VehicleCreateInput, VehicleUpdateInput } from '../validation/vehicle.schema';
import { VehicleDTO } from '../../../api/api';
import { VehicleImageUpload } from './VehicleImageUpload';

interface VehicleFormProps {
  mode: 'create' | 'edit';
  initialData?: VehicleDTO;
  onSubmit: (data: FieldValues) => void;
  isPending: boolean;
  error?: string | null;
}

export function VehicleForm({ mode, initialData, onSubmit, isPending, error }: VehicleFormProps) {
  const schema = mode === 'create' ? vehicleCreateSchema : vehicleUpdateSchema;
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.imageUrl);

  const {
    register,
    handleSubmit,
    setValue,
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
          imageUrl: initialData.imageUrl || '',
        }
      : undefined,
  });

  React.useEffect(() => {
    if (initialData) {
      setImageUrl(initialData.imageUrl);
      reset({
        vin: initialData.vin,
        make: initialData.make,
        model: initialData.model,
        year: initialData.year.toString(),
        price: initialData.price.toString(),
        mileage: initialData.mileage?.toString() || '',
        color: initialData.color || '',
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData, reset]);

  const handleImageChange = (url: string | undefined) => {
    setImageUrl(url);
    setValue('imageUrl', url ?? '');
  };

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    const payload = {
      ...data,
      imageUrl: imageUrl ?? data.imageUrl,
    };
    onSubmit(payload as VehicleCreateInput | VehicleUpdateInput);
  };

  // Shared input styling
  const inputBase =
    'block w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none disabled:bg-slate-100 disabled:text-slate-400';
  const inputNormal = `${inputBase} border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20`;
  const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/20`;
  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1';
  const errorCls = 'mt-1 text-xs font-medium text-red-500';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-xs font-bold text-red-800">Validation Error</p>
            <p className="mt-0.5 text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Grid container: Left col image upload, Right col form fields */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column (Image Upload) */}
        <div className="lg:col-span-5 space-y-4">
          <VehicleImageUpload
            initialUrl={imageUrl}
            onImageChange={handleImageChange}
            disabled={isPending}
          />
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">Tip:</span> High-quality vehicle photos improve buyer engagement in inventory listings.
            </p>
          </div>
        </div>

        {/* Right Column (Fields) */}
        <div className="lg:col-span-7 space-y-4">
          {/* VIN (Full width) */}
          <div>
            <label htmlFor="vin" className={labelCls}>
              VIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vin"
              placeholder="17-character VIN"
              className={errors.vin ? inputError : inputNormal}
              {...register('vin')}
              disabled={isPending}
            />
            {errors.vin && <p className={errorCls}>{String(errors.vin.message)}</p>}
          </div>

          {/* Make & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="make" className={labelCls}>
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="make"
                placeholder="e.g. Toyota"
                className={errors.make ? inputError : inputNormal}
                {...register('make')}
                disabled={isPending}
              />
              {errors.make && <p className={errorCls}>{String(errors.make.message)}</p>}
            </div>

            <div>
              <label htmlFor="model" className={labelCls}>
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="model"
                placeholder="e.g. Camry"
                className={errors.model ? inputError : inputNormal}
                {...register('model')}
                disabled={isPending}
              />
              {errors.model && <p className={errorCls}>{String(errors.model.message)}</p>}
            </div>
          </div>

          {/* Year & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="year" className={labelCls}>
                Year <span className="text-red-500">*</span>
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

            <div>
              <label htmlFor="price" className={labelCls}>
                Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">$</span>
                <input
                  type="number"
                  id="price"
                  placeholder="0.00"
                  step="0.01"
                  className={`${errors.price ? inputError : inputNormal} pl-7`}
                  {...register('price')}
                  disabled={isPending}
                />
              </div>
              {errors.price && <p className={errorCls}>{String(errors.price.message)}</p>}
            </div>
          </div>

          {/* Mileage & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mileage" className={labelCls}>
                Mileage <span className="text-[10px] font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="mileage"
                  placeholder="e.g. 25000"
                  className={errors.mileage ? inputError : inputNormal}
                  {...register('mileage')}
                  disabled={isPending}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">mi</span>
              </div>
              {errors.mileage && <p className={errorCls}>{String(errors.mileage.message)}</p>}
            </div>

            <div>
              <label htmlFor="color" className={labelCls}>
                Color <span className="text-[10px] font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                id="color"
                placeholder="e.g. Silver"
                className={errors.color ? inputError : inputNormal}
                {...register('color')}
                disabled={isPending}
              />
              {errors.color && <p className={errorCls}>{String(errors.color.message)}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
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
          </div>
        </div>
      </div>
    </form>
  );
}
