/**
 * ThemeContext
 *
 * Provides application-wide theme state (light / dark / system).
 * Persists the preference to localStorage and applies the resolved
 * theme to <html> immediately — no flash of wrong theme on reload.
 *
 * Usage:
 *   Wrap the app root (or the router) with <ThemeProvider>.
 *   Consume via the useTheme() hook.
 *
 * @example
 * ```tsx
 * // In providers.tsx
 * <ThemeProvider>
 *   <RouterProvider router={router} />
 * </ThemeProvider>
 * ```
 */

import { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import {
  Theme,
  applyTheme,
  getStoredTheme,
  resolveTheme,
  setStoredTheme,
  subscribeToSystemTheme,
  cycleTheme,
} from '../lib/theme';

// ── Context type ───────────────────────────────────────────────────────────

export interface ThemeContextType {
  /** The user's stored preference: 'light' | 'dark' | 'system' */
  theme: Theme;
  /** The resolved effective theme: 'light' | 'dark' */
  resolvedTheme: 'light' | 'dark';
  /** True when the effective (resolved) theme is dark */
  isDark: boolean;
  /** Set a specific theme and persist it */
  setTheme: (theme: Theme) => void;
  /** Cycle light → dark → system → light and persist */
  toggleTheme: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// ── Provider ───────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider
 *
 * Steps on mount:
 *  1. Read stored preference (or DEFAULT_THEME = 'system').
 *  2. Apply it to <html> immediately (no flash).
 *  3. Subscribe to OS preference changes when preference is 'system'.
 *  4. Re-apply on every preference change.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  // Apply to DOM whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Re-apply when the OS preference changes (only relevant for 'system')
  useEffect(() => {
    const unsubscribe = subscribeToSystemTheme(() => {
      if (theme === 'system') applyTheme('system');
    });
    return unsubscribe;
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setStoredTheme(next);
    setThemeState(next);
    // applyTheme is also called by the useEffect above, but calling it
    // here synchronously prevents a one-frame flicker.
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(cycleTheme(theme));
  }, [theme, setTheme]);

  const resolvedTheme = resolveTheme(theme);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
