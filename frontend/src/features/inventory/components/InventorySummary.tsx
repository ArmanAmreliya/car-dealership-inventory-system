/**
 * InventorySummary Component
 *
 * Enterprise SaaS metrics grid displaying 6 statistics cards:
 * - Total Vehicles
 * - Available
 * - Reserved
 * - Low Stock
 * - Out of Stock
 * - Inventory Value
 */

import { motion } from 'framer-motion';
import { useInventoryStats } from '../hooks/useInventoryStats';
import { Car, CheckCircle2, AlertTriangle, XCircle, Bookmark, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  accentClass: string;
  iconColor: string;
  isLoading?: boolean;
}

function StatCard({ title, value, description, icon, accentClass, iconColor, isLoading }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {isLoading ? (
            <div className="mt-2.5 h-8 w-20 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          )}
          {description && !isLoading && (
            <p className="mt-1.5 truncate text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 transition-transform group-hover:scale-105 ${accentClass} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2.5">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-7 w-16 rounded bg-slate-200" />
          <div className="h-3 w-28 rounded bg-slate-100" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function InventorySummary() {
  const { stats, isLoading, isError } = useInventoryStats();

  if (isError) {
    return (
      <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-sm font-medium text-rose-700">
        Unable to load inventory statistics.
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(stats.totalValue);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Catalog"
        value={stats.totalVehicles}
        description={`${stats.totalStock} units in inventory`}
        icon={<Car className="h-5 w-5" />}
        accentClass="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatCard
        title="Available Stock"
        value={stats.availableVehicles}
        description={`${stats.availabilityRate}% health rate`}
        icon={<CheckCircle2 className="h-5 w-5" />}
        accentClass="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        title="Reserved Hold"
        value={stats.reservedCount}
        description="Active buyer holds"
        icon={<Bookmark className="h-5 w-5" />}
        accentClass="bg-purple-50"
        iconColor="text-purple-600"
      />
      <StatCard
        title="Low Stock Alert"
        value={stats.lowStockCount}
        description="Requires restock"
        icon={<AlertTriangle className="h-5 w-5" />}
        accentClass="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        title="Out of Stock"
        value={stats.outOfStockCount}
        description="Zero units available"
        icon={<XCircle className="h-5 w-5" />}
        accentClass="bg-rose-50"
        iconColor="text-rose-600"
      />
      <StatCard
        title="Total Valuation"
        value={formattedValue}
        description="Combined asset value"
        icon={<DollarSign className="h-5 w-5" />}
        accentClass="bg-teal-50"
        iconColor="text-teal-600"
      />
    </div>
  );
}
