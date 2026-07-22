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
} from 'lucide-react';
import { StatsCards } from '../features/dashboard/components/StatsCards';
import { LowInventoryCard } from '../features/dashboard/components/LowInventoryCard';
import { RecentPurchases } from '../features/dashboard/components/RecentPurchases';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import { paths } from '../routes/paths';

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
  const { stats, alertItems, totalVehicleCount, isLoading, isError, refetch } =
    useDashboard();

  return (
    <div className="space-y-8">
      {/* Executive Command Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/20 p-6 sm:p-8 shadow-card dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-teal-950/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 border border-teal-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Live Dealership Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {user?.name ? `Good day, ${user.name.split(' ')[0]}` : 'DealerFlow Command Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isLoading
              ? 'Synchronizing inventory telemetry...'
              : isError
              ? 'Unable to connect to inventory services.'
              : `Managing ${totalVehicleCount} registered vehicle${totalVehicleCount !== 1 ? 's' : ''} across active stock.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isError && (
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(paths.vehiclesNew)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Middle Operations Grid: Low Stock Alerts + Recent Purchases */}
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

      {/* Quick Actions Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rapid Operations Shortcuts
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <motion.button
              key={action.path}
              whileHover={{ y: -3 }}
              type="button"
              onClick={() => navigate(action.path)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card text-left hover:border-teal-500/30 hover:shadow-popover transition-all dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-2xl bg-slate-100 p-3 shadow-subtle dark:bg-slate-800 group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {action.badge}
                </span>
              </div>

              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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

