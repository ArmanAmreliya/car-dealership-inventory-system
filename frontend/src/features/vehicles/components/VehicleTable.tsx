/**
 * VehicleTable Component
 *
 * Responsive data table for the vehicle list.
 * Renders a full table on md+ screens and delegates to VehicleCard grid on mobile.
 * Handles loading (skeleton rows), empty, and populated states.
 */

import { VehicleDTO } from '../../../api/api';
import { VehicleActions } from './VehicleActions';
import { VehicleCard } from './VehicleCard';

const SKELETON_ROWS = 6;

interface VehicleTableProps {
  /** Vehicles to render */
  vehicles: VehicleDTO[];
  /** Show skeleton rows while data is being fetched */
  isLoading?: boolean;
  /** Called when the user requests deletion of a vehicle */
  onDeleteRequest: (vehicle: VehicleDTO) => void;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[120, 80, 96, 48, 80, 96].map((w, i) => (
        <td key={i} className="px-4 py-3 whitespace-nowrap">
          <div className={`h-4 rounded bg-gray-200`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          {/* Car / inventory icon */}
          <svg
            className="mb-4 h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or add a new vehicle.
          </p>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * VehicleTable
 *
 * On screens ≥ md: renders a sticky-header, horizontally-scrollable HTML table
 * with one row per vehicle and compact icon actions.
 *
 * On screens < md: renders a single-column card grid via VehicleCard.
 *
 * Both views delegate delete trigger to the parent via `onDeleteRequest`.
 */
export function VehicleTable({
  vehicles,
  isLoading = false,
  onDeleteRequest,
}: VehicleTableProps) {
  // ── Mobile card grid ──────────────────────────────────────────────────────
  const cardGrid = (
    <div className="md:hidden">
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-28 rounded bg-gray-100" />
                </div>
                <div className="h-6 w-20 rounded-full bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-2.5 w-10 rounded bg-gray-200" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <div className="h-8 flex-1 rounded bg-gray-200" />
                <div className="h-8 flex-1 rounded bg-gray-200" />
                <div className="h-8 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or add a new vehicle.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );

  // ── Desktop table ─────────────────────────────────────────────────────────
  const desktopTable = (
    <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['VIN', 'Make / Model', 'Year', 'Price', 'Color', 'Actions'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => <SkeletonRow key={i} />)
            ) : vehicles.length === 0 ? (
              <EmptyState />
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="group transition-colors hover:bg-gray-50"
                >
                  {/* VIN */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-600">{vehicle.vin}</span>
                  </td>

                  {/* Make / Model */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </td>

                  {/* Year */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vehicle.year}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-700">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(vehicle.price)}
                    </span>
                  </td>

                  {/* Color */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {vehicle.color ?? <span className="text-gray-300">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <VehicleActions
                      vehicle={vehicle}
                      onDeleteRequest={onDeleteRequest}
                      compact
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {cardGrid}
      {desktopTable}
    </>
  );
}
