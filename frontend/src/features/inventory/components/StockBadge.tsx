/**
 * StockBadge Component
 *
 * Visual pill indicator for a single inventory item's stock status.
 *
 * Variants:
 *   available   – quantity > LOW_STOCK_THRESHOLD and available === true  → green
 *   low-stock   – quantity in (0, LOW_STOCK_THRESHOLD] and available === true → amber
 *   reserved    – reserved === true → purple
 *   unavailable – available === false or quantity === 0 → red
 */

import { AvailabilityStatus, LOW_STOCK_THRESHOLD } from '../types/inventory.types';

interface StockBadgeProps {
  quantity: number;
  available: boolean;
  reserved?: boolean;
  className?: string;
}

export function getAvailabilityStatus(
  quantity: number,
  available: boolean,
  reserved?: boolean
): AvailabilityStatus {
  if (reserved) return 'reserved';
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
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dotClass: 'bg-emerald-500',
  },
  'low-stock': {
    label: 'Low Stock',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
  reserved: {
    label: 'Reserved',
    classes: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20',
    dotClass: 'bg-purple-500',
  },
  unavailable: {
    label: 'Out of Stock',
    classes: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
    dotClass: 'bg-rose-500',
  },
};

export function StockBadge({ quantity, available, reserved, className = '' }: StockBadgeProps) {
  const status = getAvailabilityStatus(quantity, available, reserved);
  const { label, classes, dotClass } = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes} ${className}`}
    >
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
