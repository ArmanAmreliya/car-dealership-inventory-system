/**
 * VehicleCard Component
 *
 * Card-style presentation of a single vehicle for the mobile/grid view.
 * Displays key vehicle details and delegates actions to VehicleActions.
 */

import { VehicleDTO } from '../../../api/api';
import { VehicleActions } from './VehicleActions';

interface VehicleCardProps {
  /** Vehicle data to display */
  vehicle: VehicleDTO;
  /** Forwarded to VehicleActions — parent owns the delete dialog */
  onDeleteRequest: (vehicle: VehicleDTO) => void;
}

/**
 * VehicleCard
 *
 * Renders a bordered card with the vehicle make/model/year as title,
 * price prominently displayed, and VIN + optional color/mileage as metadata.
 * Full-width action buttons sit at the card footer.
 *
 * Used in the mobile card grid on `VehiclesListPage` at breakpoints < md.
 *
 * @example
 * ```tsx
 * <VehicleCard
 *   vehicle={vehicle}
 *   onDeleteRequest={(v) => { setTarget(v); setDialogOpen(true); }}
 * />
 * ```
 */
export function VehicleCard({ vehicle, onDeleteRequest }: VehicleCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Card header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-0.5 truncate font-mono text-xs text-gray-500">
              {vehicle.vin}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Card body — optional metadata */}
      <div className="flex-1 px-5 py-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Make</dt>
            <dd className="mt-0.5 text-gray-700">{vehicle.make}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Model</dt>
            <dd className="mt-0.5 text-gray-700">{vehicle.model}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Year</dt>
            <dd className="mt-0.5 text-gray-700">{vehicle.year}</dd>
          </div>
          {vehicle.color && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Color</dt>
              <dd className="mt-0.5 text-gray-700">{vehicle.color}</dd>
            </div>
          )}
          {vehicle.mileage != null && (
            <div className="col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">Mileage</dt>
              <dd className="mt-0.5 text-gray-700">
                {new Intl.NumberFormat('en-US').format(vehicle.mileage)} mi
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Card footer — actions */}
      <div className="border-t border-gray-100 px-5 py-3">
        <VehicleActions vehicle={vehicle} onDeleteRequest={onDeleteRequest} compact={false} />
      </div>
    </article>
  );
}
