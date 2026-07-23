/**
 * useIsAdmin Hook
 *
 * Returns true when the currently authenticated user has the 'admin' role.
 *
 * WHY this exists as a hook instead of inline `user.role === 'admin'`:
 *   - Single source of truth for the role check. If the role name ever
 *     changes (e.g. 'admin' → 'ADMIN' or 'superuser'), you fix it here
 *     and every component automatically gets the correct behaviour.
 *   - Keeps business-logic strings out of JSX.
 *   - Easy to unit-test in isolation.
 *
 * USAGE:
 *   const isAdmin = useIsAdmin();
 *   if (isAdmin) { ... }
 */

import { useAuth } from './useAuth';

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'admin';
}
