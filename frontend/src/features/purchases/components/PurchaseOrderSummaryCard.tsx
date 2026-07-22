/**
 * PurchaseOrderSummaryCard Component
 *
 * Clean, modern order calculation summary and action panel.
 * Design: Stripe Dashboard checkout pattern.
 */

import { motion } from 'framer-motion';
import { VehicleDTO } from '../../../api/api';
import { ShoppingBag, ShieldCheck, Loader2, ArrowRight, X } from 'lucide-react';

interface PurchaseOrderSummaryCardProps {
  vehicle: VehicleDTO;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PurchaseOrderSummaryCard({
  vehicle,
  isPending,
  onConfirm,
  onCancel,
}: PurchaseOrderSummaryCardProps) {
  const basePrice = vehicle.price;
  const estimatedTax = Math.round(basePrice * 0.05); // 5% estimated processing / tax fee
  const totalAmount = basePrice + estimatedTax;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Title Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Purchase Order Summary</h3>
              <p className="text-xs text-slate-500">Review total cost & terms</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Deselect Vehicle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Breakdown Items */}
        <div className="mt-5 space-y-3.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Selected Vehicle</span>
            <span className="font-semibold text-slate-900 text-right">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>VIN</span>
            <span className="font-mono text-slate-700">{vehicle.vin}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Base Acquisition Price</span>
            <span className="font-semibold text-slate-900">{formatCurrency(basePrice)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Est. Processing & Licensing (5%)</span>
            <span className="font-semibold text-slate-900">{formatCurrency(estimatedTax)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Quantity</span>
            <span className="font-semibold text-slate-900">1 Unit</span>
          </div>

          <div className="border-t border-dashed border-slate-200 pt-3.5 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Final Total Due</span>
            <span className="text-xl font-extrabold text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Security / Guarantee notice */}
        <div className="mt-5 rounded-xl bg-slate-50 p-3 flex items-start gap-2.5 text-slate-500 text-[11px]">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Instant allocation. Executing this purchase automatically updates inventory stock and records the transaction.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-6 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing Transaction...</span>
            </>
          ) : (
            <>
              <span>Confirm Purchase</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
