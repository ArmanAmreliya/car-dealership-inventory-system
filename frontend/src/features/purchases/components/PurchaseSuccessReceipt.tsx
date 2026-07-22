/**
 * PurchaseSuccessReceipt Component
 *
 * Animated confirmation receipt shown upon successful purchase execution.
 * Design: Minimal, Stripe-like success screen with smooth Framer Motion entrance.
 */

import { motion } from 'framer-motion';
import { PurchaseDTO } from '../types/purchase.types';
import { VehicleDTO } from '../../../api/api';
import { CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface PurchaseSuccessReceiptProps {
  purchase: PurchaseDTO;
  vehicle?: VehicleDTO;
  onReset: () => void;
  onViewHistory: () => void;
}

export function PurchaseSuccessReceipt({
  purchase,
  vehicle,
  onReset,
  onViewHistory,
}: PurchaseSuccessReceiptProps) {
  const vehicleName = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : purchase.vehicle
    ? `${purchase.vehicle.year} ${purchase.vehicle.make} ${purchase.vehicle.model}`
    : `Vehicle (${purchase.vehicleId.slice(0, 8)}…)`;

  const price = vehicle?.price ?? purchase.vehicle?.price ?? 0;
  const formattedPrice = price > 0
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
    : '—';

  const dateFormatted = new Date(purchase.purchasedAt || Date.now()).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-8 shadow-md text-center"
    >
      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60"
      >
        <CheckCircle2 className="h-10 w-10 stroke-[2]" />
      </motion.div>

      {/* Success Messages */}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Confirmed!</h2>
      <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
        The vehicle has been successfully purchased and stock allocations have been updated across inventory.
      </p>

      {/* Receipt Details Card */}
      <div className="mt-6 text-left rounded-xl border border-slate-100 bg-slate-50/70 p-5 space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-500">
          <span>Transaction ID</span>
          <span className="font-mono text-slate-700 font-medium">{purchase.id}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>Vehicle</span>
          <span className="font-bold text-slate-900">{vehicleName}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>VIN</span>
          <span className="font-mono text-slate-700">{vehicle?.vin ?? purchase.vehicle?.vin ?? '—'}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>Purchased At</span>
          <span className="text-slate-700 font-medium">{dateFormatted}</span>
        </div>

        <div className="border-t border-slate-200/60 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-slate-900">Total Price</span>
          <span className="text-base font-extrabold text-slate-900">{formattedPrice}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 text-slate-500" />
          Make Another Purchase
        </button>

        <button
          type="button"
          onClick={onViewHistory}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <Layers className="h-4 w-4" />
          View History Logs
        </button>
      </div>
    </motion.div>
  );
}
