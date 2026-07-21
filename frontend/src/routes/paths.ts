/**
 * Route Paths Configuration
 *
 * Centralized route path definitions to avoid hardcoding paths
 * throughout the application and provide type-safe navigation.
 */

/**
 * Application route paths
 */
export const paths = {
  // Public routes
  login: '/login',
  register: '/register',

  // Protected routes
  root: '/',
  dashboard: '/dashboard',
  
  // Vehicle routes
  vehicles: '/vehicles',
  vehiclesNew: '/vehicles/new',
  vehicleDetail: (id: string) => `/vehicles/${id}`,
  vehicleEdit: (id: string) => `/vehicles/${id}/edit`,
  
  // Inventory routes
  inventory: '/inventory',
  
  // Purchase routes
  purchases: '/purchases',

  // Error pages
  notFound: '/404',
} as const;
