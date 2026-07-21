/**
 * useTheme Hook
 *
 * Consumes ThemeContext and returns the full theme API.
 * Throws a descriptive error when used outside <ThemeProvider>
 * so misconfiguration surfaces immediately during development.
 *
 * @returns ThemeContextType – theme, resolvedTheme, isDark, setTheme, toggleTheme
 * @throws  Error if called outside ThemeProvider
 *
 * @example
 * ```tsx
 * const { theme, isDark, setTheme, toggleTheme } = useTheme();
 *
 * // Explicit selection
 * <button onClick={() => setTheme('dark')}>Dark mode</button>
 *
 * // Cycle toggle (light → dark → system → light)
 * <button onClick={toggleTheme}>Toggle theme</button>
 *
 * // Conditional styling without Tailwind dark: variants
 * <div className={isDark ? 'bg-gray-900' : 'bg-white'}>…</div>
 * ```
 */

import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../contexts/ThemeContext';

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }

  return context;
}
