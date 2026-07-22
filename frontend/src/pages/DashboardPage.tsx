import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Car,
  Package,
  ShoppingCart,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CalendarDays,
} from 'lucide-react';
import { StatsCards } from '../features/dashboard/components/StatsCards';
import { LowInventoryCard } from '../features/dashboard/components/LowInventoryCard';
import { RecentPurchases } from '../features/dashboard/components/RecentPurchases';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import { paths } from '../routes/paths';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Register Vehicle',
    description: 'Add a new vehicle with VIN & photos to catalogue',
    icon: <PlusCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
    path: paths.vehiclesNew,
    badge: 'Fast Add',
  },
  {
    title: 'Fleet Catalogue',
    description: 'Browse, filter, and inspect dealership inventory',
    icon: <Car className="h-6 w-6 text-slate-700 dark:text-slate-300" />,
    path: paths.vehicles,
    badge: 'Showcase',
  },
  {
    title: 'Stock Operations',
    description: 'Adjust stock levels, track availability & status',
    icon: <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    path: paths.inventory,
    badge: 'Real-time',
  },
  {
    title: 'Purchase Order',
    description: 'Process customer sales and generate receipts',
    icon: <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    path: paths.purchases,
    badge: 'Checkout',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, alertItems, totalVehicleCount, vehicles, isLoading, isError, refetch } =
    useDashboard();

  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const greeting = getGreeting();
  const dateStr = getFormattedDate();

  // Compute live inventory value
  const inventoryValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  const formatCompact = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <div className="space-y-8">
      {/* ── Enterprise Hero Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/30 shadow-card dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-teal-950/20">
        {/* Decorative gradient orb */}
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-400/5" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left — Greeting & Date */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 border border-teal-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Dealership Hub
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {greeting}, {firstName}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {dateStr}
              </div>
            </div>

            {/* Right — CTA */}
            <div className="flex items-center gap-3 shrink-0">
              {isError && (
                <button
                  type="button"
                  onClick={refetch}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate(paths.vehiclesNew)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 hover:shadow-teal-500/30 active:scale-[0.98] transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                Add Vehicle
              </button>
            </div>
          </div>

          {/* Live Insight Metrics Strip */}
          {!isLoading && !isError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              <InsightPill
                icon={<Car className="h-4 w-4 text-teal-500" />}
                label="Total Fleet"
                value={String(totalVehicleCount)}
              />
              <InsightPill
                icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                label="Need Attention"
                value={String(alertItems.length)}
                highlight={alertItems.length > 0}
              />
              <InsightPill
                icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
                label="Inventory Value"
                value={formatCompact(inventoryValue)}
              />
              <InsightPill
                icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                label="Available"
                value={stats ? String(stats.totalAvailable ?? totalVehicleCount) : '—'}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Middle Operations Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LowInventoryCard
            alertItems={alertItems}
            isLoading={isLoading}
            maxVisible={5}
          />
        </div>

        <div className="lg:col-span-5">
          <RecentPurchases maxVisible={5} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Rapid Operations
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <motion.button
              key={action.path}
              whileHover={{ y: -3, boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(action.path)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card text-left hover:border-teal-500/30 transition-all dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-2xl bg-slate-100 p-3 shadow-subtle dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {action.badge}
                </span>
              </div>

              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Insight Pill ────────────────────────────────────────────────── */
function InsightPill({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
      highlight
        ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30'
        : 'border-slate-200/60 bg-white/60 dark:border-slate-800 dark:bg-slate-800/40'
    }`}>
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{label}</p>
        <p className={`text-sm font-extrabold truncate ${
          highlight ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'
        }`}>{value}</p>
      </div>
    </div>
  );
}
