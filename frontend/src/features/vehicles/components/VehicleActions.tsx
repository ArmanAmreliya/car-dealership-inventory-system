/**
 * VehicleActions Component
 *
 * Row/card action menu for a single vehicle.
 * Renders View, Edit, and Delete buttons.
 * Keeps mutation logic out of the table/card components.
 */

import { useNavigate } from 'react-router-dom';
import { VehicleDTO } from '../../../api/api';
import { paths } from '../../../routes/paths';
import { useIsAdmin } from '../../../hooks/useIsAdmin';

interface VehicleActionsProps {
  /** The vehicle this action set belongs to */
  vehicle: VehicleDTO;
  /** Called when the user clicks Delete — parent owns the dialog */
  onDeleteRequest: (vehicle: VehicleDTO) => void;
  /** Compact layout used inside table rows (default: false = card layout) */
  compact?: boolean;
}

/**
 * VehicleActions
 *
 * Three-button action group: View details, Edit, and Delete.
 * Navigation is handled internally via React Router.
 * The delete flow is delegated to the parent via `onDeleteRequest`
 * so the confirmation dialog can be rendered once at the page level.
 *
 * @example
 * ```tsx
 * <VehicleActions
 *   vehicle={vehicle}
 *   onDeleteRequest={(v) => { setTarget(v); setDialogOpen(true); }}
 *   compact
 * />
 * ```
 */
export function VehicleActions({
  vehicle,
  onDeleteRequest,
  compact = false,
}: VehicleActionsProps) {
  const navigate = useNavigate();
   const isAdmin = useIsAdmin();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* View */}
        <button
          type="button"
          onClick={() => navigate(paths.vehicleDetail(vehicle.id))}
          aria-label={`View ${vehicle.make} ${vehicle.model}`}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          title="View details"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {/* Edit — admin only */}
        {isAdmin && (
        <button
          type="button"
          onClick={() => navigate(paths.vehicleEdit(vehicle.id))}
          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          title="Edit vehicle"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        )}

        {/* Delete */}

        {isAdmin && (
        <button
          type="button"
          onClick={() => onDeleteRequest(vehicle)}
          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
          title="Delete vehicle"
        > 
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        )}
      </div>
    );
  }

  // Card layout — admin only shows Edit and Delete
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => navigate(paths.vehicleDetail(vehicle.id))}
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </button>

      {isAdmin && (
        <button
          type="button"
          onClick={() => navigate(paths.vehicleEdit(vehicle.id))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={() => onDeleteRequest(vehicle)}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      )}
    </div>
  );
}
