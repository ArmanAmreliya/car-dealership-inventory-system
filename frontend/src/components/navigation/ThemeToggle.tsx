/**
 * ThemeToggle Component
 *
 * A single icon button that cycles through Light → Dark → System themes.
 * The icon reflects the current active preference:
 *   light  → sun icon
 *   dark   → moon icon
 *   system → monitor icon
 *
 * Two variants:
 *   icon    – compact icon button (default, for use in Navbar)
 *   menu    – labelled button row (for use in a dropdown menu)
 *
 * @example
 * ```tsx
 * // In Navbar
 * <ThemeToggle />
 *
 * // In a settings dropdown
 * <ThemeToggle variant="menu" />
 *
 * // Explicit selection buttons
 * <ThemeToggle showAll />
 * ```
 */

import { useTheme } from '../../hooks/useTheme';
import {
  Theme,
  THEMES,
  THEME_LABELS,
  nextThemeAriaLabel,
} from '../../lib/theme';

// ── Icons ──────────────────────────────────────────────────────────────────

function SunIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function SystemIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ThemeIcon({ theme, className }: { theme: Theme; className?: string }) {
  switch (theme) {
    case 'dark':   return <MoonIcon   className={className} />;
    case 'system': return <SystemIcon className={className} />;
    default:       return <SunIcon    className={className} />;
  }
}

// ── Variant: icon (compact) ────────────────────────────────────────────────

interface IconToggleProps {
  theme: Theme;
  onToggle: () => void;
}

function IconToggle({ theme, onToggle }: IconToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={nextThemeAriaLabel(theme)}
      title={`${THEME_LABELS[theme]} mode — click to change`}
      className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      <ThemeIcon theme={theme} className="h-4 w-4" />
    </button>
  );
}

// ── Variant: menu (labelled row) ───────────────────────────────────────────

interface MenuToggleProps {
  theme: Theme;
  onToggle: () => void;
}

function MenuToggle({ theme, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={nextThemeAriaLabel(theme)}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <ThemeIcon theme={theme} className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">
        {THEME_LABELS[theme]} mode
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        click to change
      </span>
    </button>
  );
}

// ── Variant: showAll (three explicit buttons) ──────────────────────────────

interface AllToggleProps {
  theme: Theme;
  onSetTheme: (t: Theme) => void;
}

function AllToggle({ theme, onSetTheme }: AllToggleProps) {
  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800"
    >
      {THEMES.map((t) => {
        const isActive = theme === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onSetTheme(t)}
            aria-pressed={isActive}
            aria-label={`${THEME_LABELS[t]} mode`}
            title={THEME_LABELS[t]}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ThemeIcon theme={t} className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{THEME_LABELS[t]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

interface ThemeToggleProps {
  /**
   * icon    – compact icon button (default, Navbar use)
   * menu    – labelled row for dropdown menus
   */
  variant?: 'icon' | 'menu';
  /**
   * When true, renders three explicit Light / Dark / System buttons
   * instead of a cycle toggle. Overrides `variant`.
   */
  showAll?: boolean;
  /** Additional wrapper className */
  className?: string;
}

/**
 * ThemeToggle
 *
 * Drops into any container. Reads and writes the theme via useTheme().
 * Requires <ThemeProvider> to be present in the component tree.
 *
 * @example
 * ```tsx
 * // Navbar top-right
 * <ThemeToggle />
 *
 * // Settings dropdown
 * <ThemeToggle variant="menu" />
 *
 * // Three-button segmented control (e.g. settings page)
 * <ThemeToggle showAll />
 * ```
 */
export function ThemeToggle({
  variant = 'icon',
  showAll = false,
  className = '',
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (showAll) {
    return (
      <div className={className}>
        <AllToggle theme={theme} onSetTheme={setTheme} />
      </div>
    );
  }

  return (
    <div className={className}>
      {variant === 'menu' ? (
        <MenuToggle theme={theme} onToggle={toggleTheme} />
      ) : (
        <IconToggle theme={theme} onToggle={toggleTheme} />
      )}
    </div>
  );
}
