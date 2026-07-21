/**
 * Vehicle Validation Schema
 *
 * Zod schema for vehicle form validation.
 * Used by both creation and update forms.
 */

import { z } from 'zod';

const currentYear = new Date().getFullYear();

/**
 * Full vehicle schema for creation
 */
export const vehicleCreateSchema = z
  .object({
    vin: z.string().min(1, 'VIN is required').max(17, 'VIN must be at most 17 characters'),
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.string().or(z.number()).transform((val) => Number(val)),
    price: z.string().or(z.number()).transform((val) => Number(val)),
    mileage: z
      .string()
      .or(z.number())
      .or(z.undefined())
      .optional()
      .transform((val) => (val === '' || val === undefined ? undefined : Number(val))),
    color: z.string().optional().transform((val) => (val === '' ? undefined : val)),
  })
  .refine((data) => data.year >= 1886, {
    message: 'Year must be 1886 or later',
    path: ['year'],
  })
  .refine((data) => data.year <= currentYear + 2, {
    message: 'Year is too far in the future',
    path: ['year'],
  })
  .refine((data) => data.price > 0, {
    message: 'Price must be greater than 0',
    path: ['price'],
  })
  .refine((data) => data.mileage === undefined || data.mileage >= 0, {
    message: 'Mileage cannot be negative',
    path: ['mileage'],
  });

/**
 * Partial schema for vehicle updates
 * All fields are optional
 */
export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;
