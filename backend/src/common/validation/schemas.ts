import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string({ message: 'make is required' }).min(1, 'make is required'),
  model: z.string({ message: 'model is required' }).min(1, 'model is required'),
  year: z
    .number({ message: 'year must be a number' })
    .int()
    .min(1886, 'year must be 1886 or later')
    .max(new Date().getFullYear() + 2, 'year is too far in the future'),
  price: z.number({ message: 'price must be a number' }).positive('price must be positive'),
  vin: z
    .string({ message: 'vin is required' })
    .min(1, 'vin is required')
    .max(17, 'VIN must be at most 17 characters'),
  mileage: z.number().nonnegative('mileage cannot be negative').optional(),
  color: z.string().optional(),
  imageUrl: z.string().url('imageUrl must be a valid URL').optional().or(z.literal('')),
});

export const updateVehicleSchema = z
  .object({
    make: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    year: z.number().int().min(1886).optional(),
    price: z.number().positive().optional(),
    mileage: z.number().nonnegative().optional(),
    color: z.string().optional(),
    imageUrl: z.string().url('imageUrl must be a valid URL').optional().or(z.literal('')),
    isAvailable: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const stockUpdateSchema = z.object({
  stockQuantity: z
    .number({ message: 'stockQuantity must be a number' })
    .int()
    .nonnegative('stockQuantity cannot be negative'),
});

export const purchaseSchema = z.object({
  vehicleId: z.string({ message: 'vehicleId is required' }).min(1, 'vehicleId is required'),
});

export const restockSchema = z.object({
  quantity: z.number({ message: 'quantity must be a number' }).int().nonnegative('quantity cannot be negative'),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
