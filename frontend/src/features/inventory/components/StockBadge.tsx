/**
 * StockBadge Component
 *
 * Visual pill indicator for a single inventory item's stock status.
 * Derives the status from quantity and the available flag, matching
 * the LOW_STOCK_THRESHOLD constant from inventory.types.
 *
 * Variants:
 *   available   – quantity >  LOW_STOCK_THRESHOLD  and available === true  → green
 *   low-stock   – quantity in (0, LOW_STOCK_THRESHOLD] and available === true → amber
 *   unavailable – available === false  or  quantity === 0                   → red
 */

import { AvailabilityStatus, LOW_STOCK_THRESHOLD } from '../types/inventory.types';

interface StockBadgeProps {
  /** Current stock quantity */
  quantity: number;
  /** Backend-computed availability flag */
  available: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Derive the display status from raw inventory values.
 * Exported so callers can also compute the status without rendering.
 */
export function getAvailabilityStatus(
  quantity: number,
  available: boolean
): AvailabilityStatus {
  if (!available || quantity === 0) return 'unavailable';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low-stock';
  return 'available';
}

const STATUS_CONFIG: Record<
  AvailabilityStatus,
  { label: string; classes: string; dotClass: string }
> = {
  available: {
    label: 'Available',
    classes:
      'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    dotClass: 'bg-green-500',
  },
  'low-stock': {
    label: 'Low Stock',
    classes:
      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
  unavailable: {
    label: 'Unavailable',
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dotClass: 'bg-red-500',
  },
};

/**
 * StockBadge
 *
 * Renders a small coloured pill indicating availability status.
 * A pulsing dot on the "available" variant conveys live stock.
 *
 * @example
 * ```tsx
 * <StockBadge quantity={item.quantity} available={item.available} />
 * ```
 */
export function StockBadge({ quantity, available, className = '' }: StockBadgeProps) {
  const status = getAvailabilityStatus(quantity, available);
  const { label, classes, dotClass } = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes} ${className}`}
    >
      {/* Status dot — pulses when actively available */}
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotClass} ${
          status === 'available' ? 'animate-pulse' : ''
        }`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
