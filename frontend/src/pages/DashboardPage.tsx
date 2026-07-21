/**
 * DashboardPage
 *
 * Main authenticated landing page. Provides a real-time overview of the
 * dealership's vehicle inventory and recent session activity.
 *
 * API calls (per PLAN.md):
 *   GET /api/v1/inventory  →  stats, alert items
 *   GET /api/v1/vehicles   →  total vehicle count, quick-action context
 *
 * Layout (responsive):
 *   ┌──────────────────────────────────────────┐
 *   │  Welcome header                          │
 *   ├──────────────────────────────────────────┤
 *   │  StatsCards  (4-column KPI grid)         │
 *   ├─────────────────────┬────────────────────┤
 *   │  LowInventoryCard   │  RecentPurchases   │
 *   │  (left, 7/12)       │  (right, 5/12)     │
 *   ├──────────────────────────────────────────┤
 *   │  Quick Actions grid                      │
 *   └──────────────────────────────────────────┘
 */

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { StatsCards } from '../features/dashboard/components/StatsCards';
import { LowInventoryCard } from '../features/dashboard/components/LowInventoryCard';
import { RecentPurchases } from '../features/dashboard/components/RecentPurchases';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import { paths } from '../routes/paths';

// ── Quick action definition ────────────────────────────────────────────────

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  accent: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Add Vehicle',
    description: 'Register a new vehicle in inventory',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    path: paths.vehiclesNew,
    accent: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
  },
  {
    title: 'Browse Vehicles',
    description: 'View and manage the full vehicle catalog',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    path: paths.vehicles,
    accent: 'text-gray-600 bg-gray-50 group-hover:bg-gray-100',
  },
  {
    title: 'Stock Management',
    description: 'Update quantities and availability',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    path: paths.inventory,
    accent: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100',
  },
  {
    title: 'New Purchase',
    description: 'Process a vehicle purchase transaction',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    path: paths.purchases,
    accent: 'text-green-600 bg-green-50 group-hover:bg-green-100',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────

/**
 * DashboardPage
 *
 * Uses DashboardLayout (wraps itself — per the app router pattern where
 * the router wraps each page, this page renders *inside* the layout
 * via AppRoutes, so the layout is applied by the router, not here).
 *
 * NOTE: DashboardPage is rendered by AppRoutes already wrapped in
 * DashboardLayout — so the page itself does NOT add another DashboardLayout.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, alertItems, totalVehicleCount, isLoading, isError, refetch } =
    useDashboard();

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Welcome header ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome to DealerFlow'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading
                ? 'Loading inventory overview…'
                : isError
                ? 'Some data could not be loaded.'
                : `${totalVehicleCount} vehicle${totalVehicleCount !== 1 ? 's' : ''} in system`}
            </p>
          </div>

          {isError && (
            <button
              type="button"
              onClick={refetch}
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retry
            </button>
          )}
        </div>

        {/* ── KPI stat cards ───────────────────────────────────────────── */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* ── Middle row: alerts + recent purchases ────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Low inventory — wider column */}
          <div className="lg:col-span-7">
            <LowInventoryCard
              alertItems={alertItems}
              isLoading={isLoading}
              maxVisible={5}
            />
          </div>

          {/* Recent purchases — narrower column */}
          <div className="lg:col-span-5">
            <RecentPurchases maxVisible={5} />
          </div>
        </div>

        {/* ── Quick actions ────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.path}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-blue-200 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <span className={`shrink-0 rounded-lg p-2 transition-colors ${action.accent}`}>
                  {action.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{action.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
