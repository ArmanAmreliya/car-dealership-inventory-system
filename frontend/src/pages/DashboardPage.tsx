/**
 * Dashboard Page
 *
 * Main authenticated dashboard landing page.
 * Placeholder for inventory overview and metrics.
 */

/**
 * DashboardPage Component
 *
 * Displays dashboard overview with:
 * - Placeholder for inventory metrics
 * - Placeholder for quick actions
 * - Coming soon message
 */
export function DashboardPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to DealerFlow
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your vehicle inventory and sales efficiently.
        </p>
      </div>

      {/* Placeholder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Overview Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
            </div>
            <span className="text-4xl">🚗</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">Coming soon</p>
        </div>

        {/* Available Stock Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">Coming soon</p>
        </div>

        {/* Recent Sales Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Sales</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">Coming soon</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/vehicles/new"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900">Add New Vehicle</h3>
            <p className="mt-2 text-sm text-gray-600">Create a new vehicle listing</p>
          </a>
          <a
            href="/vehicles"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900">View Inventory</h3>
            <p className="mt-2 text-sm text-gray-600">Browse all vehicles</p>
          </a>
          <a
            href="/inventory"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900">Stock Management</h3>
            <p className="mt-2 text-sm text-gray-600">Manage inventory levels</p>
          </a>
          <a
            href="/purchases"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-900">Sales History</h3>
            <p className="mt-2 text-sm text-gray-600">View recent purchases</p>
          </a>
        </div>
      </div>
    </div>
  );
}
