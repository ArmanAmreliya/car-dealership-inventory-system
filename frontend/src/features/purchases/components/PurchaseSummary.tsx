/**
 * PurchaseSummary Component
 *
 * Receipt card displayed after a successful purchase.
 * Shows the transaction details returned by POST /api/v1/purchases,
 * enriched with vehicle information when available.
 *
 * Can also render a compact inline variant for table row expansion.
 */

import { PurchaseDTO } from '../types/purchase.types';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';
import { buildPurchaseReceipt, formatPurchaseDate } from '../utils/purchase.utils';
import { VehicleDTO } from '../../../api/api';

interface PurchaseSummaryProps {
  /** The completed purchase DTO from the API */
  purchase: PurchaseDTO;
  /**
   * Optional additional vehicle data map for enrichment.
   * If the DTO already carries a nested vehicle relation this is ignored.
   */
  vehicleMap?: Record<string, VehicleDTO>;
  /** Render a compact single-line variant instead of the full card */
  compact?: boolean;
  /** Optional wrapper className */
  className?: string;
}

/**
 * PurchaseSummary
 *
 * Full-card mode: white receipt card with purchase ID, vehicle label,
 * quantity, price, and date.
 *
 * Compact mode: single-line strip for embedding inside table row details.
 *
 * @example
 * ```tsx
 * // Full receipt after checkout
 * <PurchaseSummary purchase={receipt} />
 *
 * // Inside a table row
 * <PurchaseSummary purchase={purchase} compact />
 * ```
 */
export function PurchaseSummary({
  purchase,
  vehicleMap,
  compact = false,
  className = '',
}: PurchaseSummaryProps) {
  const receipt = buildPurchaseReceipt(purchase, vehicleMap);

  const formattedPrice =
    receipt.price != null
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(receipt.price)
      : null;

  // ── Compact variant ──────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${className}`}>
        <span className="font-medium text-gray-900">{receipt.vehicleLabel}</span>
        {formattedPrice && (
          <span className="text-green-700 font-semibold">{formattedPrice}</span>
        )}
        <span className="text-gray-400">
          {formatPurchaseDate(receipt.purchasedAt)}
        </span>
        <PurchaseStatusBadge status="completed" />
      </div>
    );
  }

  // ── Full receipt card ────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-lg border border-green-200 bg-white shadow-sm ${className}`}
      role="region"
      aria-label="Purchase receipt"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-green-50 px-5 py-4">
        <div className="flex items-center gap-2">
          {/* Checkmark circle */}
          <svg
            className="h-5 w-5 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-green-900">
            Purchase Confirmed
          </h3>
        </div>
        <PurchaseStatusBadge status="completed" />
      </div>

      {/* Body */}
      <dl className="divide-y divide-gray-100 px-5">
        <DetailRow label="Vehicle" value={receipt.vehicleLabel} />

        {formattedPrice && (
          <DetailRow
            label="Price"
            value={formattedPrice}
            valueClassName="font-semibold text-green-700"
          />
        )}

        <DetailRow
          label="Qty"
          value={`${receipt.quantity} unit${receipt.quantity !== 1 ? 's' : ''}`}
        />

        <DetailRow
          label="Purchase Date"
          value={formatPurchaseDate(receipt.purchasedAt)}
        />

        <DetailRow
          label="Transaction ID"
          value={receipt.purchaseId}
          valueClassName="font-mono text-xs text-gray-500 break-all"
        />

        <DetailRow
          label="Vehicle ID"
          value={receipt.vehicleId}
          valueClassName="font-mono text-xs text-gray-400 break-all"
        />
      </dl>
    </div>
  );
}

// ── Internal helper ──────────────────────────────────────────────────────

interface DetailRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function DetailRow({ label, value, valueClassName = 'text-gray-900' }: DetailRowProps) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className={`text-right text-sm ${valueClassName}`}>{value}</dd>
    </div>
  );
}
