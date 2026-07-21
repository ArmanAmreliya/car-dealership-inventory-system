/**
 * Environment Variables Configuration
 * 
 * Centralized access to Vite environment variables with type safety.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

export const env = {
  /**
   * Backend API base URL
   * @default http://localhost:3000/api
   */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',

  /**
   * Application display title
   * @default DealerFlow
   */
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'DealerFlow',

  /**
   * Enable analytics tracking (optional)
   * @default false
   */
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;
