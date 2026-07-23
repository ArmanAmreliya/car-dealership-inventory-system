import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '../components/guards/PublicOnlyRoute';
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
import { App } from '../app/App';
import { paths } from './paths';
import { AdminRoute } from '@/components/guards/AdminRoute';

export const appRouter = createBrowserRouter([
  // ── Public: landing page ────────────────────────────────────────────────
  {
    path: paths.root,
    element: <App />,
  },

  // ── Public-only: redirect to dashboard if already signed in ─────────────
  {
    path: paths.login,
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: paths.register,
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },

  // ── Protected: require authentication ───────────────────────────────────
  {
    path: paths.dashboard,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Command Center">
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
          <VehiclesListPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.vehiclesNew,
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <DashboardLayout pageTitle="New Vehicle">
            <VehicleCreatePage />
          </DashboardLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id',
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Vehicle Specifications">
          <VehicleDetailPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/vehicles/:id/edit',
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <DashboardLayout pageTitle="Edit Vehicle">
            <VehicleEditPage />
          </DashboardLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.inventory,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Inventory Control">
          <InventoryPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: paths.purchases,
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Vehicle Acquisition">
          <PurchasesPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchases/new',
    element: (
      <ProtectedRoute>
        <DashboardLayout pageTitle="Create Purchase Order">
          <CreatePurchasePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },

  // ── Error / catch-all ────────────────────────────────────────────────────
  {
    path: paths.notFound,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
