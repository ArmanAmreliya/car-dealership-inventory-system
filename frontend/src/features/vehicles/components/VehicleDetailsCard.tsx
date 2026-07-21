/**
 * VehicleDetailsCard Component
 *
 * Displays a complete, formatted summary of a single vehicle record.
 * Shows all available fields: VIN, make, model, year, price, mileage,
 * color, and timestamps.
 */

import { VehicleDTO } from '../../../api/api';

interface VehicleDetailsCardProps {
  /** Vehicle data to render */
  vehicle: VehicleDTO;
}

/** Format a price value as USD currency */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/** Format a mileage value with thousands separator */
function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat('en-US').format(mileage)} mi`;
}

/** Format an ISO date string to a readable local date */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * VehicleDetailsCard
 *
 * Renders a white card with two sections:
 * - A header showing the vehicle title and VIN.
 * - A responsive grid of labelled field values.
 *
 * @example
 * ```tsx
 * const { data: vehicle } = useVehicle(vehicleId);
 * if (vehicle) return <VehicleDetailsCard vehicle={vehicle} />;
 * ```
 */
export function VehicleDetailsCard({ vehicle }: VehicleDetailsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              VIN: <span className="font-mono text-gray-700">{vehicle.vin}</span>
            </p>
          </div>
          {/* Price badge */}
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-base font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
            {formatPrice(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Make */}
          <DetailItem label="Make" value={vehicle.make} />

          {/* Model */}
          <DetailItem label="Model" value={vehicle.model} />

          {/* Year */}
          <DetailItem label="Year" value={String(vehicle.year)} />

          {/* Price */}
          <DetailItem label="Price" value={formatPrice(vehicle.price)} valueClassName="text-green-600" />

          {/* Mileage — only shown when present */}
          {vehicle.mileage !== undefined && vehicle.mileage !== null && (
            <DetailItem label="Mileage" value={formatMileage(vehicle.mileage)} />
          )}

          {/* Color — only shown when present */}
          {vehicle.color && (
            <DetailItem label="Color" value={vehicle.color} />
          )}

          {/* VIN */}
          <DetailItem
            label="VIN"
            value={vehicle.vin}
            valueClassName="font-mono text-sm tracking-wider"
          />

          {/* Record ID */}
          <DetailItem
            label="Record ID"
            value={vehicle.id}
            valueClassName="font-mono text-xs text-gray-500"
          />

          {/* Added date */}
          <DetailItem label="Added" value={formatDate(vehicle.createdAt)} />

          {/* Last updated date */}
          <DetailItem label="Last Updated" value={formatDate(vehicle.updatedAt)} />
        </dl>
      </div>
    </div>
  );
}

// ── Internal helper ──────────────────────────────────────────────────────────

interface DetailItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function DetailItem({ label, value, valueClassName = '' }: DetailItemProps) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className={`mt-1 text-base font-medium text-gray-900 ${valueClassName}`}>{value}</dd>
    </div>
  );
}
