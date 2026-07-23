/**
 * StockUpdateModal
 *
 * Modal for updating inventory stock quantity.
 * Design: matches app design system — slate-900 CTAs, teal accents, same
 * card / border language as InventoryPage and PurchasesPage.
 *
 * Features:
 *  - Live delta preview (e.g. "+4 units" / "−2 units") with colour coding
 *  - Quick preset buttons: Set to 0, +1, +5, +10
 *  - Reason dropdown + optional notes
 *  - Keyboard: Enter submits, Escape closes, ↑/↓ adjusts quantity
 *  - Full accessible dialog (role, aria-modal, focus trap via initial focus)
 *  - Error display with retry affordance
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { InventoryItemDTO } from '../types/inventory.types';
import { useUpdateStock } from '../hooks/useInventory';
import { recordStockMovement } from '../utils/stockHistory';
import {
  X,
  Plus,
  Minus,
  PackageCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus as MinusIcon,
  Package,
} from 'lucide-react';

interface StockUpdateModalProps {
  item: InventoryItemDTO;
  onClose: () => void;
}

const REASONS = [
  'Shipment Received',
  'Inventory Audit / Count Adjustment',
  'Vehicle Sale / Customer Purchase',
  'Damaged / Returned Unit',
  'Dealer Transfer',
  'Manual Correction',
];

// ── helpers ────────────────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 9999): number {
  return Math.max(min, Math.min(max, n));
}

function deltaLabel(delta: number): string {
  if (delta === 0) return 'No change';
  return delta > 0 ? `+${delta} unit${delta !== 1 ? 's' : ''}` : `${delta} unit${delta !== -1 ? 's' : ''}`;
}

// ── component ──────────────────────────────────────────────────────────────

export function StockUpdateModal({ item, onClose }: StockUpdateModalProps) {
  const { mutate: updateStock, isPending, error, reset } = useUpdateStock();

  // Always use vehicleId — that's what the backend PATCH /inventory/:id expects.
  // item.id and item.vehicleId are often the same value, but vehicleId is
  // the explicit contract. Never rely on item.id alone.
  const targetId = item.vehicleId || item.id;
  const currentQty = item.quantity ?? 0;

  const [quantity, setQuantity] = useState<number>(currentQty);
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [notes, setNotes] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const delta = quantity - currentQty;
  const isUnchanged = delta === 0;
  const isInvalid = isNaN(quantity) || quantity < 0;

  const vehicleLabel = item.vehicle
    ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
    : item.vehicleId;

  // ── focus on open ────────────────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // ── keyboard listeners ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isPending) return;
      if (e.key === 'Escape') { onClose(); return; }
      // ↑ / ↓ while input is focused are handled natively by <input type="number">
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isPending, onClose]);

  // ── adjust helpers ───────────────────────────────────────────────────────
  const adjust = useCallback((delta: number) => {
    setQuantity((prev) => clamp(prev + delta));
  }, []);

  const setPreset = useCallback((val: number) => {
    setQuantity(clamp(val));
  }, []);

  // ── submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    reset(); // clear any previous error

    updateStock(
      { id: targetId, data: { stockQuantity: quantity } },
      {
        onSuccess: () => {
          recordStockMovement({
            inventoryId: targetId,
            vehicleId: item.vehicleId || targetId,
            previousQuantity: currentQty,
            newQuantity: quantity,
            change: delta,
            reason,
            notes: notes.trim() || undefined,
          });
          toast.success(
            `Stock updated — ${vehicleLabel} is now ${quantity} unit${quantity !== 1 ? 's' : ''}`,
            { description: `${isUnchanged ? 'Confirmed at same quantity' : deltaLabel(delta)} · ${reason}` }
          );
          onClose();
        },
      }
    );
  };

  // ── delta display ─────────────────────────────────────────────────────────
  const DeltaIcon =
    delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : MinusIcon;
  const deltaColour =
    delta > 0
      ? 'text-teal-700 bg-teal-500/10 border-teal-500/30'
      : delta < 0
      ? 'text-rose-700 bg-rose-50 border-rose-200'
      : 'text-slate-500 bg-slate-100 border-slate-200';

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => !isPending && onClose()}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/80"
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[#55E6D9]">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="stock-modal-title"
                  className="text-sm font-extrabold text-slate-900"
                >
                  Update Stock
                </h2>
                <p className="text-xs font-medium text-slate-500 truncate max-w-[220px]">
                  {vehicleLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="Close"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Form ──────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Current vs New summary row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Current */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Current
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xl font-black text-slate-900">{currentQty}</span>
                </div>
              </div>

              {/* Delta */}
              <div className={`rounded-xl border px-3 py-3 text-center transition-colors ${deltaColour}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                  Change
                </p>
                <div className="flex items-center justify-center gap-1">
                  <DeltaIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-sm font-black">
                    {delta === 0 ? '—' : deltaLabel(delta)}
                  </span>
                </div>
              </div>

              {/* New */}
              <div className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                isUnchanged
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-[#55E6D9]/60 bg-teal-500/5'
              }`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  New Total
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Package className={`h-3.5 w-3.5 shrink-0 ${isUnchanged ? 'text-slate-400' : 'text-teal-600'}`} />
                  <span className={`text-xl font-black ${isUnchanged ? 'text-slate-400' : 'text-slate-900'}`}>
                    {isNaN(quantity) ? '—' : quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <label
                htmlFor="stock-qty-input"
                className="block text-xs font-bold text-slate-700 mb-2"
              >
                Set New Quantity
                <span className="ml-1 text-rose-500">*</span>
                <span className="ml-2 font-normal text-slate-400">
                  (↑ ↓ arrow keys to adjust)
                </span>
              </label>

              <div className="flex items-center gap-2">
                {/* -5 */}
                <button
                  type="button"
                  onClick={() => adjust(-5)}
                  disabled={isPending || quantity <= 0}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  −5
                </button>

                {/* -1 */}
                <button
                  type="button"
                  onClick={() => adjust(-1)}
                  disabled={isPending || quantity <= 0}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>

                {/* Input */}
                <input
                  ref={inputRef}
                  id="stock-qty-input"
                  type="number"
                  min={0}
                  max={9999}
                  value={quantity}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    setQuantity(isNaN(parsed) ? 0 : clamp(parsed));
                  }}
                  disabled={isPending}
                  className="w-full text-center font-mono font-black text-xl rounded-xl border border-slate-200 bg-white py-2 focus:border-[#55E6D9] focus:outline-none focus:ring-2 focus:ring-[#55E6D9]/20 transition-all disabled:opacity-50"
                />

                {/* +1 */}
                <button
                  type="button"
                  onClick={() => adjust(1)}
                  disabled={isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>

                {/* +5 */}
                <button
                  type="button"
                  onClick={() => adjust(5)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  +5
                </button>
              </div>

              {/* Quick preset row */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick set:
                </span>
                {[0, 1, 5, 10, 25].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPreset(preset)}
                    disabled={isPending}
                    className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold transition-all disabled:opacity-40 ${
                      quantity === preset
                        ? 'border-slate-900 bg-slate-900 text-[#55E6D9]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="stock-reason"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Reason for Adjustment
              </label>
              <select
                id="stock-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-[#55E6D9] focus:outline-none focus:ring-2 focus:ring-[#55E6D9]/20 transition-all"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="stock-notes"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Audit Notes{' '}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="stock-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
                rows={2}
                placeholder="PO number, unit condition, inspector name..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#55E6D9] focus:outline-none focus:ring-2 focus:ring-[#55E6D9]/20 resize-none transition-all"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Failed to update stock. Please try again.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              {/* Keyboard hint */}
              <p className="text-[10px] text-slate-400 font-medium">
                <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono">Esc</kbd>
                {' '}to cancel
              </p>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending || isInvalid}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-[#55E6D9] shadow-md hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <PackageCheck className="h-3.5 w-3.5" />
                      Save Stock
                      {!isUnchanged && (
                        <span className="ml-0.5 opacity-70">
                          ({deltaLabel(delta)})
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
