/**
 * Application Routes Configuration
 *
 * Defines all application routes with public and protected access levels.
 * Uses React Router v7 with nested route definitions.
 */

import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { paths } from './paths';

/**
 * Browser router configuration
 *
 * Route hierarchy:
 * - Public routes: /login, /register
 * - Protected routes: All others under DashboardLayout
 * - Catch-all: /404 and any undefined routes
 */
export const appRouter = createBrowserRouter([
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    path: paths.register,
    element: <RegisterPage />,
  },
  {
    path: paths.root,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Dashboard">
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Dashboard">
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.vehicles,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Vehicles">
          <div className="p-6">
            <p className="text-gray-600">Vehicles page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.vehiclesNew,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Create Vehicle">
          <div className="p-6">
            <p className="text-gray-600">Create vehicle page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id',
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Vehicle Details">
          <div className="p-6">
            <p className="text-gray-600">Vehicle details page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id/edit',
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Edit Vehicle">
          <div className="p-6">
            <p className="text-gray-600">Edit vehicle page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.inventory,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Inventory">
          <div className="p-6">
            <p className="text-gray-600">Inventory page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.purchases,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Purchases">
          <div className="p-6">
            <p className="text-gray-600">Purchases page - Coming soon</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.notFound,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
