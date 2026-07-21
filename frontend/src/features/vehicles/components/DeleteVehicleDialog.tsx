/**
 * DeleteVehicleDialog Component
 *
 * Modal confirmation dialog before permanently deleting a vehicle.
 * Traps keyboard focus, locks body scroll, and handles loading/error states.
 */

import { useEffect } from 'react';

interface DeleteVehicleDialogProps {
  /** Vehicle UUID to delete */
  vehicleId: string;
  /** Human-readable label shown in the warning copy (e.g. "Toyota Camry (2022)") */
  vehicleDisplayName: string;
  /** Controls dialog visibility */
  isOpen: boolean;
  /** Called with the vehicleId when the user confirms deletion */
  onConfirm: (vehicleId: string) => void;
  /** Called when the user cancels or dismisses the dialog */
  onCancel: () => void;
  /** True while the delete mutation is in-flight */
  isDeleting: boolean;
  /** Error message to surface if the deletion request fails */
  error?: string | null;
}

/**
 * DeleteVehicleDialog
 *
 * Renders a backdrop + centered modal asking the user to confirm
 * the irreversible deletion of a vehicle record.
 *
 * @example
 * ```tsx
 * <DeleteVehicleDialog
 *   vehicleId={id}
 *   vehicleDisplayName={`${vehicle.make} ${vehicle.model}`}
 *   isOpen={isOpen}
 *   isDeleting={isPending}
 *   error={deleteError?.message}
 *   onConfirm={(id) => deleteVehicle(id, { onSuccess: () => navigate('/vehicles') })}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export function DeleteVehicleDialog({
  vehicleId,
  vehicleDisplayName,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}: DeleteVehicleDialogProps) {
  // Close on Escape key; lock body scroll while open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={() => !isDeleting && onCancel()}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
              Delete Vehicle
            </h2>
            <button
              type="button"
              onClick={() => !isDeleting && onCancel()}
              disabled={isDeleting}
              aria-label="Close dialog"
              className="rounded-md p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-4">
            {/* API Error */}
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Warning banner */}
            <div className="flex gap-3 rounded-md bg-yellow-50 p-4">
              <div className="shrink-0">
                {/* Exclamation triangle */}
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">This action cannot be undone.</p>
                <p id="delete-dialog-description" className="mt-1 text-sm text-yellow-700">
                  <span className="font-medium">"{vehicleDisplayName}"</span> will be permanently
                  removed from the system along with all associated data.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to continue? This will delete the vehicle record from the
              inventory.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(vehicleId)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-400 transition-colors"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Deleting…
                </>
              ) : (
                'Delete Vehicle'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
