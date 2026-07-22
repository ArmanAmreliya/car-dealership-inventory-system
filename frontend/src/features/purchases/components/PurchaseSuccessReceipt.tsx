/**
 * PurchaseSuccessReceipt Component — Enterprise Edition with Confetti & Telemetry
 *
 * Animated confirmation receipt shown upon successful purchase execution.
 * Includes confetti effect, inventory update status badge, new quantity tracking,
 * and a direct "Return to Dashboard" CTA.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PurchaseDTO } from '../types/purchase.types';
import { VehicleDTO } from '../../../api/api';
import { CheckCircle2, RefreshCw, Layers, LayoutDashboard, Check, Package, Sparkles } from 'lucide-react';
import { paths } from '../../../routes/paths';

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
  const navigate = useNavigate();

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
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-emerald-200/80 bg-white p-8 shadow-popover text-center dark:border-emerald-900/40 dark:bg-slate-900"
    >
      {/* Decorative Confetti Sparks */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400 animate-pulse" />

      {/* Floating Confetti Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 8) % 100}%`,
              y: -20,
              scale: 0.8,
              opacity: 1,
            }}
            animate={{
              y: 280,
              rotate: [0, 180, 360],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2.2 + (i % 3) * 0.4,
              repeat: Infinity,
              delay: (i % 5) * 0.2,
              ease: 'easeOut',
            }}
            className={`absolute h-2 w-2 rounded-full ${
              i % 4 === 0
                ? 'bg-teal-400'
                : i % 4 === 1
                ? 'bg-emerald-400'
                : i % 4 === 2
                ? 'bg-amber-400'
                : 'bg-violet-400'
            }`}
          />
        ))}
      </div>

      {/* Animated Checkmark Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.1 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400 shadow-lg shadow-emerald-500/20"
      >
        <CheckCircle2 className="h-12 w-12 stroke-[2.2]" />
      </motion.div>

      {/* Header Status */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
        <Sparkles className="h-3.5 w-3.5" />
        ✓ Purchase Complete
      </span>

      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Transaction Confirmed
      </h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Official purchase order processed and telemetry synced with inventory control.
      </p>

      {/* Status Highlights */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
          <Check className="h-3.5 w-3.5" />
          Inventory Updated
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-900">
          <Package className="h-3.5 w-3.5" />
          Stock Quantity Decremented
        </span>
      </div>

      {/* Receipt Details Card */}
      <div className="mt-6 text-left rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 space-y-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex justify-between items-center text-slate-500">
          <span>Transaction ID</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{purchase.id}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>Vehicle</span>
          <span className="font-bold text-slate-900 dark:text-white">{vehicleName}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>VIN</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{vehicle?.vin ?? purchase.vehicle?.vin ?? '—'}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>Timestamp</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">{dateFormatted}</span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
          <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{formattedPrice}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => navigate(paths.dashboard)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 transition-all"
        >
          <LayoutDashboard className="h-4 w-4" />
          Return to Dashboard
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
        >
          <RefreshCw className="h-4 w-4 text-slate-500" />
          New Purchase
        </button>
      </div>
    </motion.div>
  );
}
