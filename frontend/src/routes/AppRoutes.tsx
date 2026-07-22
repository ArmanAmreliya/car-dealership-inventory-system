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
        <DashboardLayout pageTitle="New Vehicle">
          <VehicleCreatePage />
        </DashboardLayout>
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
        <DashboardLayout pageTitle="Edit Vehicle">
          <VehicleEditPage />
        </DashboardLayout>
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
        <DashboardLayout pageTitle="Purchase History">
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
  {
    path: paths.notFound,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

