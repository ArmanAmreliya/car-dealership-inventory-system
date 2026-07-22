import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { InventoryStats } from '../../inventory/types/inventory.types';
import { paths } from '../../../routes/paths';

interface StatsCardsProps {
  stats: InventoryStats | undefined;
  isLoading?: boolean;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/50" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  linkTo?: string;
  valueColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconBg,
  linkTo,
  valueColor = 'text-slate-900 dark:text-slate-100',
}: StatCardProps) {
  const navigate = useNavigate();

  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <p className={`mt-2 text-3xl font-extrabold tracking-tight ${valueColor}`}>
          {value}
        </p>
        <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {description}
        </p>
      </div>
      <div className={`shrink-0 rounded-2xl p-3 shadow-subtle ${iconBg}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="h-full"
    >
      {linkTo ? (
        <button
          type="button"
          onClick={() => navigate(linkTo)}
          className="w-full h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card text-left hover:border-teal-500/30 hover:shadow-popover transition-all dark:border-slate-800 dark:bg-slate-900/60"
        >
          {content}
        </button>
      ) : (
        <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
          {content}
        </div>
      )}
    </motion.div>
  );
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const needsAttention = stats.outOfStockCount + stats.lowStockCount;
  const attentionColor =
    stats.outOfStockCount > 0
      ? 'text-rose-600 dark:text-rose-400'
      : stats.lowStockCount > 0
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-900 dark:text-slate-100';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Fleet Catalogue"
        value={stats.totalVehicles}
        description={`${stats.totalStock} units registered`}
        icon={<Car className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
        iconBg="bg-teal-50 dark:bg-teal-950/50"
        linkTo={paths.vehicles}
      />
      <StatCard
        title="Ready Available"
        value={stats.availableVehicles}
        description="Available for immediate sale"
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        linkTo={paths.inventory}
        valueColor="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        title="Stock Alerts"
        value={needsAttention}
        description={`${stats.outOfStockCount} out of stock · ${stats.lowStockCount} low stock`}
        icon={<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-50 dark:bg-amber-950/50"
        linkTo={paths.inventory}
        valueColor={attentionColor}
      />
      <StatCard
        title="Fleet Availability"
        value={`${stats.availabilityRate}%`}
        description="Active inventory readiness"
        icon={<TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
        iconBg="bg-teal-50 dark:bg-teal-950/50"
        valueColor="text-teal-600 dark:text-teal-400"
      />
    </div>
  );
}

