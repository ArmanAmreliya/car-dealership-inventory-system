/**
 * InventoryTable Component
 *
 * Responsive data table for inventory items.
 * Each row shows vehicle details, current quantity, availability badge,
 * and an inline "Update Stock" action that opens a compact modal.
 *
 * Handles loading (skeleton), empty, and populated states.
 * Delegates the stock update mutation to useUpdateStock.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { InventoryItemDTO } from '../types/inventory.types';
import { StockBadge } from './StockBadge';
import { useUpdateStock } from '../hooks/useInventory';
import { paths } from '../../../routes/paths';

const SKELETON_ROWS = 6;

// ── Types ──────────────────────────────────────────────────────────────────

interface InventoryTableProps {
  /** Filtered items to render */
  items: InventoryItemDTO[];
  /** Show skeleton while the query is in-flight */
  isLoading?: boolean;
}

// ── Stock update modal ─────────────────────────────────────────────────────

interface StockModalProps {
  item: InventoryItemDTO;
  onClose: () => void;
}

function StockUpdateModal({ item, onClose }: StockModalProps) {
  const { mutate: updateStock, isPending, error } = useUpdateStock();
  const [value, setValue] = useState(String(item.quantity));
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [isPending, onClose]);

  const vehicleLabel = item.vehicle
    ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
    : item.vehicleId;

  const extractMessage = (err: unknown): string | null => {
    if (err == null) return null;
    const e = err as { response?: { data?: unknown }; message?: string };
    if (
      e.response?.data != null &&
      typeof e.response.data === 'object' &&
      'message' in (e.response.data as object)
    ) {
      return String((e.response.data as Record<string, unknown>).message);
    }
    return e.message ?? null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) return;

    updateStock(
      { id: item.id, data: { stockQuantity: parsed } },
      {
        onSuccess: () => {
          toast.success(`Stock updated for ${vehicleLabel}.`);
          onClose();
        },
      }
    );
  };

  const isInvalid =
    value === '' || isNaN(parseInt(value, 10)) || parseInt(value, 10) < 0;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => !isPending && onClose()}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 id="stock-modal-title" className="text-base font-semibold text-gray-900">
              Update Stock
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="Close"
              className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-5 py-5 space-y-4">
              <p className="text-sm text-gray-600">
                Set the stock quantity for{' '}
                <span className="font-medium text-gray-900">{vehicleLabel}</span>.
              </p>

              {/* Current vs new */}
              <div className="flex items-center gap-3 rounded-md bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-500">Current:</span>
                <StockBadge quantity={item.quantity} available={item.available} />
                <span className="ml-auto font-semibold text-gray-700">
                  {item.quantity} unit{item.quantity !== 1 ? 's' : ''}
                </span>
              </div>

              {/* New quantity input */}
              <div>
                <label htmlFor="stock-qty" className="block text-sm font-medium text-gray-700">
                  New Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  ref={inputRef}
                  id="stock-qty"
                  type="number"
                  min={0}
                  step={1}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isPending}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 ${
                    isInvalid && value !== ''
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {isInvalid && value !== '' && (
                  <p className="mt-1 text-xs text-red-600">
                    Must be a non-negative integer.
                  </p>
                )}
              </div>

              {/* API error */}
              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-700">{extractMessage(error)}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || isInvalid}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                {isPending && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Skeleton row ───────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[160, 80, 48, 72, 64, 80].map((w, i) => (
        <td key={i} className="px-4 py-3 whitespace-nowrap">
          <div className="h-4 rounded bg-gray-200" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No inventory items found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
        </div>
      </td>
    </tr>
  );
}

// ── Mobile card ────────────────────────────────────────────────────────────

interface MobileCardProps {
  item: InventoryItemDTO;
  onUpdateStock: (item: InventoryItemDTO) => void;
}

function MobileCard({ item, onUpdateStock }: MobileCardProps) {
  const navigate = useNavigate();
  const vehicleLabel = item.vehicle
    ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
    : 'Unknown Vehicle';
  const vin = item.vehicle?.vin ?? item.vehicleId;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{vehicleLabel}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-gray-400">{vin}</p>
        </div>
        <StockBadge quantity={item.quantity} available={item.available} className="shrink-0" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Qty</span>
          <p className="mt-0.5 font-semibold text-gray-800">{item.quantity}</p>
        </div>
        {item.vehicle && (
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Price</span>
            <p className="mt-0.5 font-semibold text-green-700">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(item.vehicle.price)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
        {item.vehicle && (
          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
            className="flex-1 rounded-md border border-gray-300 bg-white py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Vehicle
          </button>
        )}
        <button
          type="button"
          onClick={() => onUpdateStock(item)}
          className="flex-1 rounded-md bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Update Stock
        </button>
      </div>
    </article>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * InventoryTable
 *
 * Renders a desktop table (md+) and a mobile card grid (< md).
 * The "Update Stock" action opens StockUpdateModal at this level —
 * one modal instance shared across all rows.
 */
export function InventoryTable({ items, isLoading = false }: InventoryTableProps) {
  const navigate = useNavigate();
  const [modalTarget, setModalTarget] = useState<InventoryItemDTO | null>(null);

  const TABLE_HEADERS = ['Vehicle', 'VIN', 'Qty', 'Status', 'Price', 'Actions'];

  // ── Mobile grid ─────────────────────────────────────────────────────────
  const mobileGrid = (
    <div className="md:hidden">
      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><div className="h-3 w-6 rounded bg-gray-200" /><div className="h-4 w-8 rounded bg-gray-100" /></div>
                <div className="space-y-1"><div className="h-3 w-10 rounded bg-gray-200" /><div className="h-4 w-16 rounded bg-gray-100" /></div>
              </div>
              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <div className="h-8 flex-1 rounded bg-gray-200" />
                <div className="h-8 flex-1 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
          <svg className="mb-4 h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No inventory items found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <MobileCard key={item.id} item={item} onUpdateStock={setModalTarget} />
          ))}
        </div>
      )}
    </div>
  );

  // ── Desktop table ────────────────────────────────────────────────────────
  const desktopTable = (
    <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((h) => (
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
            ) : items.length === 0 ? (
              <EmptyRow colSpan={TABLE_HEADERS.length} />
            ) : (
              items.map((item) => {
                const vehicleLabel = item.vehicle
                  ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
                  : '—';
                const vin = item.vehicle?.vin ?? '—';
                const price = item.vehicle
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(item.vehicle.price)
                  : '—';

                return (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50">
                    {/* Vehicle */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.vehicle ? (
                        <button
                          type="button"
                          onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                          className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {vehicleLabel}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">{vehicleLabel}</span>
                      )}
                    </td>

                    {/* VIN */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-500">{vin}</span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StockBadge quantity={item.quantity} available={item.available} />
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-700">{price}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setModalTarget(item)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {mobileGrid}
      {desktopTable}

      {/* Stock update modal — single instance */}
      {modalTarget && (
        <StockUpdateModal
          item={modalTarget}
          onClose={() => setModalTarget(null)}
        />
      )}
    </>
  );
}
