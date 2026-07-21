/**
 * ErrorBoundary Component
 *
 * React class-based error boundary that catches unhandled JavaScript errors
 * thrown during rendering, in lifecycle methods, or in constructors of any
 * child component tree.
 *
 * Why a class component?
 * React's getDerivedStateFromError and componentDidCatch lifecycle methods
 * are only available on class components. Function components cannot be
 * error boundaries.
 *
 * Exports:
 *   ErrorBoundary        – general-purpose boundary with a configurable fallback
 *   PageErrorBoundary    – full-page boundary for route-level wrapping
 *   withErrorBoundary    – HOC to wrap any component in a boundary
 *
 * @example
 * ```tsx
 * // Wrap a feature section
 * <ErrorBoundary fallback={<p>Chart failed to load.</p>}>
 *   <DashboardCharts />
 * </ErrorBoundary>
 *
 * // Route-level boundary with reset button
 * <PageErrorBoundary>
 *   <VehiclesPage />
 * </PageErrorBoundary>
 *
 * // HOC pattern
 * const SafeCharts = withErrorBoundary(DashboardCharts, {
 *   fallback: <p>Charts unavailable.</p>,
 * });
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  /** Content to render when no error has occurred */
  children: ReactNode;
  /**
   * Custom fallback UI. Receives the caught error and a reset callback.
   * When omitted, the default error panel is rendered.
   */
  fallback?:
    | ReactNode
    | ((error: Error | null, reset: () => void) => ReactNode);
  /**
   * Called when an error is caught. Use for error reporting (e.g. Sentry).
   */
  onError?: (error: Error, info: ErrorInfo) => void;
  /**
   * Called after the boundary successfully resets.
   */
  onReset?: () => void;
  /**
   * Key that, when changed, resets the boundary.
   * Useful for resetting when the route changes.
   */
  resetKey?: unknown;
}

// ── Default fallback UI ────────────────────────────────────────────────────

interface DefaultFallbackProps {
  error: Error | null;
  onReset: () => void;
  showDetails?: boolean;
}

function DefaultFallback({
  error,
  onReset,
  showDetails = false,
}: DefaultFallbackProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      {/* Icon */}
      <svg
        className="mb-4 h-12 w-12 text-red-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>

      <h2 className="text-sm font-semibold text-red-900">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-sm text-sm text-red-700">
        An unexpected error occurred. Try refreshing the page or contact
        support if the problem persists.
      </p>

      {/* Error detail (collapsed in production) */}
      {showDetails && error && (
        <details className="mt-4 w-full max-w-md rounded-md border border-red-200 bg-white text-left">
          <summary className="cursor-pointer px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50">
            Error details
          </summary>
          <pre className="overflow-x-auto px-4 pb-3 pt-2 text-xs text-gray-700">
            <strong>{error.name}:</strong> {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

// ── Main ErrorBoundary class ───────────────────────────────────────────────

/**
 * ErrorBoundary
 *
 * Catches any error thrown in its child tree and renders either the
 * provided `fallback` or the built-in DefaultFallback panel.
 *
 * The boundary resets (un-catches the error) when:
 *   1. The user clicks "Try again" in the fallback.
 *   2. The `resetKey` prop changes (e.g. route change).
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ errorInfo: info });
    this.props.onError?.(error, info);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', info.componentStack);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset when the resetKey prop changes (e.g. navigating to a new route)
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.reset();
    }
  }

  reset(): void {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) return children;

    // Custom fallback — function form
    if (typeof fallback === 'function') {
      return fallback(error, this.reset);
    }

    // Custom fallback — element form
    if (fallback !== undefined) {
      return fallback;
    }

    // Built-in fallback
    return (
      <DefaultFallback
        error={error}
        onReset={this.reset}
        showDetails={import.meta.env.DEV}
      />
    );
  }
}

// ── PageErrorBoundary ──────────────────────────────────────────────────────

interface PageErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

/**
 * PageErrorBoundary
 *
 * Full-viewport error boundary for wrapping entire route pages.
 * Centres the fallback vertically in the available space.
 *
 * @example
 * ```tsx
 * // In AppRoutes.tsx, wrap each protected route
 * <PageErrorBoundary>
 *   <VehiclesListPage />
 * </PageErrorBoundary>
 * ```
 */
export function PageErrorBoundary({
  children,
  onError,
}: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      onError={onError}
      fallback={(error, reset) => (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="w-full max-w-md">
            <DefaultFallback
              error={error}
              onReset={reset}
              showDetails={import.meta.env.DEV}
            />
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// ── withErrorBoundary HOC ─────────────────────────────────────────────────

interface WithErrorBoundaryOptions {
  fallback?: ErrorBoundaryProps['fallback'];
  onError?: ErrorBoundaryProps['onError'];
  onReset?: ErrorBoundaryProps['onReset'];
}

/**
 * withErrorBoundary
 *
 * Higher-order component that wraps `WrappedComponent` in an ErrorBoundary.
 * The display name is preserved for React DevTools.
 *
 * @example
 * ```tsx
 * const SafeCharts = withErrorBoundary(DashboardCharts, {
 *   fallback: <p className="text-sm text-gray-400">Charts unavailable.</p>,
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): React.ComponentType<P> {
  const { fallback, onError, onReset } = options;

  function WithBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError} onReset={onReset}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithBoundary.displayName = `WithErrorBoundary(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithBoundary;
}
