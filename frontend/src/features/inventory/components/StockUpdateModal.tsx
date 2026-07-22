/**
 * StockUpdateModal Component
 *
 * Accessible modal dialog for updating inventory stock quantity.
 * Features:
 * - Quick stepper buttons (+1, -1, +5, -5)
 * - Reason dropdown (Shipment, Audit, Sale, Damage, Adjustment)
 * - Optional notes input
 * - Validation (must be integer >= 0)
 * - Record movement history entry
 * - Optimistic update trigger & success toast
 */

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { InventoryItemDTO } from '../types/inventory.types';
import { StockBadge } from './StockBadge';
import { useUpdateStock } from '../hooks/useInventory';
import { recordStockMovement } from '../utils/stockHistory';
import { X, Plus, Minus, PackageCheck, AlertCircle } from 'lucide-react';

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

export function StockUpdateModal({ item, onClose }: StockUpdateModalProps) {
  const { mutate: updateStock, isPending, error } = useUpdateStock();
  const targetId = item.id || item.vehicleId;
  const [quantity, setQuantity] = useState<number>(item.quantity ?? 0);
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [notes, setNotes] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isPending, onClose]);

  const vehicleLabel = item.vehicle
    ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
    : item.vehicleId;

  const handleAdjust = (delta: number) => {
    setQuantity((prev) => Math.max(0, (prev ?? 0) + delta));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(quantity) || quantity < 0) return;

    const previousQuantity = item.quantity ?? 0;
    const change = quantity - previousQuantity;

    updateStock(
      { id: targetId, data: { stockQuantity: quantity } },
      {
        onSuccess: () => {
          recordStockMovement({
            inventoryId: targetId,
            vehicleId: item.vehicleId || targetId,
            previousQuantity,
            newQuantity: quantity,
            change,
            reason,
            notes: notes.trim() || undefined,
          });

          toast.success(`Stock updated for ${vehicleLabel} (Qty: ${quantity})`);
          onClose();
        },
      }
    );
  };

  const isInvalid = isNaN(quantity) || quantity < 0;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-update-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 id="stock-update-title" className="text-base font-bold text-slate-900">
                  Update Inventory Stock
                </h2>
                <p className="text-xs text-slate-500 font-medium">{vehicleLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current Stock Banner */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <StockBadge quantity={item.quantity} available={item.available} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Qty</span>
                <p className="mt-0.5 text-lg font-bold text-slate-900">{item.quantity} units</p>
              </div>
            </div>

            {/* Stepper & Input */}
            <div>
              <label htmlFor="stock-qty-input" className="block text-xs font-semibold text-slate-700">
                New Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjust(-5)}
                  disabled={isPending || quantity <= 0}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjust(-1)}
                  disabled={isPending || quantity <= 0}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  ref={inputRef}
                  id="stock-qty-input"
                  type="number"
                  min={0}
                  value={quantity ?? 0}
                  onChange={(e) => setQuantity(isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10))}
                  disabled={isPending}
                  className="w-full text-center font-mono font-bold text-lg rounded-xl border border-slate-200 bg-white py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => handleAdjust(1)}
                  disabled={isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjust(5)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Adjustment Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Adjustment</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
                rows={2}
                placeholder="Add details about shipment PO#, condition, or inspector notes..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to update stock. Please try again.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || isInvalid}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isPending && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Save Stock Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
