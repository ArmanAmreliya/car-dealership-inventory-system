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
import { VehiclesListPage } from '../pages/VehiclesListPage';
import { VehicleCreatePage } from '../pages/VehicleCreatePage';
import { VehicleDetailPage } from '../pages/VehicleDetailPage';
import { VehicleEditPage } from '../pages/VehicleEditPage';
import { InventoryPage } from '../pages/InventoryPage';
import { PurchasesPage } from '../pages/PurchasesPage';
import { CreatePurchasePage } from '../pages/CreatePurchasePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { paths } from './paths';
import { App } from '../app/App';

/**
 * Browser router configuration
 *
 * Route hierarchy:
 * - Public routes: /login, /register
 * - Protected routes: All dashboard features wrapped in ProtectedRoute
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
    element: <App />,
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
        <VehiclesListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.vehiclesNew,
    element: (
      <ProtectedRoute>
        <VehicleCreatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id',
    element: (
      <ProtectedRoute>
        <VehicleDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id/edit',
    element: (
      <ProtectedRoute>
        <VehicleEditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.inventory,
    element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.purchases,
    element: (
      <ProtectedRoute>
        <PurchasesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchases/new',
    element: (
      <ProtectedRoute>
        <CreatePurchasePage />
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
