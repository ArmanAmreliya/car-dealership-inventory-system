/**
 * PageLoader Component
 *
 * Full-page loading screen used during:
 *   - Initial app hydration (auth session restore)
 *   - Page-level data fetches before first render
 *   - Lazy-loaded route transitions
 *
 * Two variants:
 *   overlay  – absolute-positioned over the current page (default)
 *   fullscreen – takes the full viewport, replaces page content
 *
 * @example
 * ```tsx
 * // During auth restore
 * if (isLoading) return <PageLoader label="Authenticating…" />;
 *
 * // Fullscreen initial load
 * <PageLoader variant="fullscreen" label="Loading DealerFlow…" showBrand />
 * ```
 */

import { Loader } from './Loader';

// ── Types ──────────────────────────────────────────────────────────────────

interface PageLoaderProps {
  /** Accessible / visible loading message */
  label?: string;
  /** Show the DealerFlow brand name above the spinner */
  showBrand?: boolean;
  /** Layout variant */
  variant?: 'overlay' | 'fullscreen';
  /** Additional wrapper className */
  className?: string;
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * PageLoader
 *
 * Centred spinner with an optional brand name and label.
 * The overlay variant sits on top of existing page content;
 * the fullscreen variant replaces it entirely.
 */
export function PageLoader({
  label = 'Loading…',
  showBrand = false,
  variant = 'overlay',
  className = '',
}: PageLoaderProps) {
  const base =
    variant === 'fullscreen'
      ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50'
      : 'absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm';

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={`${base} ${className}`}
    >
      {showBrand && (
        <p className="mb-6 text-xl font-bold tracking-tight text-gray-900">
          DealerFlow
        </p>
      )}

      <Loader size="lg" />

      <p className="mt-4 text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ── Auth-restore variant ───────────────────────────────────────────────────

/**
 * AppInitLoader
 *
 * Used during the auth session restore on first mount.
 * Fullscreen with brand, no backdrop blur.
 */
export function AppInitLoader() {
  return (
    <div
      role="status"
      aria-label="Initialising DealerFlow"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50"
    >
      {/* Wordmark */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">DealerFlow</span>
      </div>

      <Loader size="lg" />
      <p className="mt-4 text-sm text-gray-400">Loading your workspace…</p>
    </div>
  );
}

// ── Route-transition overlay ───────────────────────────────────────────────

/**
 * RouteLoader
 *
 * Lightweight overlay for route-level data fetching.
 * Semi-transparent so the previous page content remains visible.
 */
export function RouteLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className="flex min-h-64 flex-col items-center justify-center gap-3 py-16"
    >
      <Loader size="lg" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
