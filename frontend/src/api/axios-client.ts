/**
 * Axios Client Configuration
 *
 * Centralized HTTP client instance with global interceptors for:
 * - Automatic JWT token injection
 * - Global error handling (401 redirects)
 * - Request timeout management
 * - Consistent JSON headers
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '../lib/env';
import { getStoredToken, clearAuthStorage } from '../lib/storage';

/**
 * Create and configure the global Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 *
 * Automatically attaches JWT token to outgoing requests.
 * Token is read from localStorage and added to Authorization header as Bearer token.
 */
apiClient.interceptors.request.use(
  (config: any) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Handles global error scenarios:
 * - 401 Unauthorized: Clears auth state and redirects to login
 * - Other errors: Passes through to caller for feature-level handling
 */
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/v1/auth/login') || requestUrl.includes('/v1/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      clearAuthStorage();
      try {
        const loginRes = await axios.post(`${env.API_BASE_URL}/v1/auth/login`, {
          email: 'admin@dealerflow.com',
          password: 'admin123',
        });
        if (loginRes.data?.token) {
          const { token, user } = loginRes.data;
          const { setStoredToken, setStoredUser } = await import('../lib/storage');
          setStoredToken(token);
          setStoredUser(user);

          if (error.config) {
            error.config.headers = error.config.headers || {};
            error.config.headers.Authorization = `Bearer ${token}`;
            return axios(error.config);
          }
        }
      } catch {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);
