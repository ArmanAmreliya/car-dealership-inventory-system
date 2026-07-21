/**
 * PurchaseStatusBadge Component
 *
 * Small coloured pill indicating the status of a purchase record.
 *
 * The backend Purchase model has no explicit status field — every persisted
 * record represents a completed transaction. Statuses are therefore derived
 * from the context in which the badge is rendered:
 *
 *   completed  – default for any persisted PurchaseDTO
 *   pending    – mutation is in-flight (not yet saved)
 *   failed     – mutation returned an error
 *   conflict   – HTTP 409: vehicle was no longer available
 */

export type PurchaseStatus = 'completed' | 'pending' | 'failed' | 'conflict';

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  PurchaseStatus,
  { label: string; classes: string; dotClass: string }
> = {
  completed: {
    label: 'Completed',
    classes: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    dotClass: 'bg-green-500',
  },
  pending: {
    label: 'Processing',
    classes: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dotClass: 'bg-blue-500 animate-pulse',
  },
  failed: {
    label: 'Failed',
    classes: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dotClass: 'bg-red-500',
  },
  conflict: {
    label: 'Unavailable',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
};

/**
 * PurchaseStatusBadge
 *
 * @example
 * ```tsx
 * <PurchaseStatusBadge status="completed" />
 * <PurchaseStatusBadge status="pending" />
 * ```
 */
export function PurchaseStatusBadge({
  status,
  className = '',
}: PurchaseStatusBadgeProps) {
  const { label, classes, dotClass } = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}
