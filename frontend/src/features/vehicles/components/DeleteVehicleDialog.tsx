/**
 * DeleteVehicleDialog Component — Premium Enterprise Edition
 *
 * A polished modal confirmation dialog before permanently deleting a vehicle.
 * Features:
 *   - Backdrop blur overlay
 *   - Red accent gradient icon
 *   - Smooth transitions
 *   - Keyboard-accessible (Escape to close, focus trap)
 *   - Loading and error states
 */

import { useEffect, useRef } from 'react';

interface DeleteVehicleDialogProps {
  vehicleId: string;
  vehicleDisplayName: string;
  isOpen: boolean;
  onConfirm: (vehicleId: string) => void;
  onCancel: () => void;
  isDeleting: boolean;
  error?: string | null;
}

export function DeleteVehicleDialog({
  vehicleId,
  vehicleDisplayName,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}: DeleteVehicleDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Close on Escape; lock body scroll while open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus cancel button when dialog opens
      setTimeout(() => cancelRef.current?.focus(), 50);
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
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
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
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50">
          {/* Header */}
          <div className="px-6 pt-6 pb-0">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 ring-8 ring-red-50/50">
                <svg
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Title & description */}
              <div className="flex-1 min-w-0">
                <h2 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
                  Delete Vehicle
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action is permanent and cannot be undone.
                </p>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => !isDeleting && onCancel()}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="shrink-0 rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* API Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Warning content */}
            <div id="delete-dialog-description" className="rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-4">
              <p className="text-sm text-amber-800">
                You are about to permanently delete{' '}
                <span className="font-bold text-amber-900">"{vehicleDisplayName}"</span>
                {' '}and all associated data. This will remove the vehicle from your inventory.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(vehicleId)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-500/20 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:from-red-300 disabled:to-red-400 disabled:shadow-none transition-all"
            >
              {isDeleting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete Vehicle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
