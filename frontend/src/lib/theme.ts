/**
 * Theme Library
 *
 * All theme logic that does NOT require React.
 * Safe to import from contexts, hooks, and utilities.
 *
 * Theme model:
 *   'light'  – always light
 *   'dark'   – always dark
 *   'system' – follows the OS/browser prefers-color-scheme media query
 *
 * Tailwind dark mode strategy: 'class'
 * The resolved theme is applied by adding/removing the 'dark' class
 * on the <html> element. Tailwind then activates all `dark:` variants.
 */

// ── Constants ──────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system';

export const THEMES = ['light', 'dark', 'system'] as const;

/** localStorage key — consistent with the PLAN.md storage conventions */
export const THEME_STORAGE_KEY = 'dealerflow_theme' as const;

/** The default preference when nothing is stored */
export const DEFAULT_THEME: Theme = 'system';

// ── Storage ────────────────────────────────────────────────────────────────

/**
 * Read the persisted theme preference from localStorage.
 * Returns `DEFAULT_THEME` when the key is absent or the stored value
 * is not one of the valid theme literals.
 */
export function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // localStorage unavailable (SSR, private mode restrictions, etc.)
  }
  return DEFAULT_THEME;
}

/**
 * Persist the theme preference to localStorage.
 */
export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Silently degrade when storage is unavailable
  }
}

// ── Resolution ─────────────────────────────────────────────────────────────

/**
 * Resolve 'system' → 'light' | 'dark' using the OS preference.
 * Returns the value unchanged for 'light' and 'dark'.
 *
 * @example
 * ```ts
 * resolveTheme('system') // → 'dark' on a device with dark mode enabled
 * resolveTheme('light')  // → 'light'
 * ```
 */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// ── DOM application ────────────────────────────────────────────────────────

/**
 * Apply the resolved theme to the <html> element.
 *
 * - Adds    `dark`  class when resolved theme is 'dark'.
 * - Removes `dark`  class when resolved theme is 'light'.
 * - Updates the `color-scheme` CSS property so native UI elements
 *   (scrollbars, form controls) also adapt.
 *
 * This is the single point of contact with the DOM; call it whenever
 * the preference changes or the system preference changes.
 */
export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

// ── System preference listener ─────────────────────────────────────────────

/**
 * Subscribe to OS color-scheme changes.
 * Returns an unsubscribe function — call it in the useEffect cleanup.
 *
 * Only fires the callback when the stored preference is 'system'
 * so that explicit 'light'/'dark' choices are never overridden.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   const unsubscribe = subscribeToSystemTheme(() => {
 *     if (theme === 'system') applyTheme('system');
 *   });
 *   return unsubscribe;
 * }, [theme]);
 * ```
 */
export function subscribeToSystemTheme(callback: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

// ── Cycle helper ───────────────────────────────────────────────────────────

/**
 * Return the next theme in the cycle: light → dark → system → light.
 * Useful for a single-button toggle that loops through all three modes.
 *
 * @example
 * ```ts
 * cycleTheme('light')  // → 'dark'
 * cycleTheme('dark')   // → 'system'
 * cycleTheme('system') // → 'light'
 * ```
 */
export function cycleTheme(current: Theme): Theme {
  const order: Theme[] = ['light', 'dark', 'system'];
  return order[(order.indexOf(current) + 1) % order.length];
}

// ── Label helpers ──────────────────────────────────────────────────────────

/** Human-readable label for each theme option */
export const THEME_LABELS: Record<Theme, string> = {
  light:  'Light',
  dark:   'Dark',
  system: 'System',
};

/** Short accessible label describing the action toggling to the next theme */
export function nextThemeAriaLabel(current: Theme): string {
  const next = cycleTheme(current);
  return `Switch to ${THEME_LABELS[next]} mode`;
}
