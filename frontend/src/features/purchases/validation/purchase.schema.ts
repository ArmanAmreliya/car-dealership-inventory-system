/**
 * Purchase Validation Schema
 *
 * Zod schema for the purchase form.
 * Mirrors the single field the backend accepts:
 *   POST /api/v1/purchases  →  { vehicleId: string }
 *
 * Client-side rules:
 *   - vehicleId must be present and be a non-empty string.
 *   - No additional fields are validated here; availability is checked
 *     at the hook level via usePurchaseValidation before submission.
 */

import { z } from 'zod';

/**
 * Purchase form schema.
 *
 * vehicleId is the only field sent to the backend.
 * The UUID format check uses a simple regex so the error message
 * is human-readable rather than a raw regex failure.
 */
export const purchaseSchema = z.object({
  vehicleId: z
    .string()
    .min(1, 'Please select a vehicle')
    .uuid('Invalid vehicle selection — please choose from the list'),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
