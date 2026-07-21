/**
 * ErrorState Component
 *
 * Generic error boundary display for feature-level failures.
 * Handles API errors, network errors, and unexpected exceptions.
 * Three variants: default (white card), banner (inline alert bar), inline.
 *
 * @example
 * ```tsx
 * // Full page / panel error
 * <ErrorState
 *   title="Failed to load vehicles"
 *   message={error.message}
 *   onRetry={refetch}
 * />
 *
 * // Inline banner
 * <ErrorState
 *   variant="banner"
 *   message="Unable to connect to server."
 *   onRetry={refetch}
 * />
 *
 * // 404 preset
 * <NotFoundError onBack={() => navigate(-1)} />
 * ```
 */

import React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type Severity = 'error' | 'warning' | 'info';
type Variant  = 'default' | 'banner' | 'inline';

interface ErrorStateProps {
  /** Short heading (default: "Something went wrong") */
  title?: string;
  /** Detailed message string or Error object */
  message?: string | Error | unknown;
  /** Visual severity (default: "error") */
  severity?: Severity;
  /** Layout variant */
  variant?: Variant;
  /** Custom icon — overrides the default severity icon */
  icon?: React.ReactNode;
  /** Called when the user clicks the Retry button */
  onRetry?: () => void;
  /** Additional wrapper className */
  className?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function extractMessage(message: ErrorStateProps['message']): string {
  if (!message) return '';
  if (typeof message === 'string') return message;
  if (message instanceof Error) return message.message;
  if (
    typeof message === 'object' &&
    message !== null &&
    'message' in message &&
    typeof (message as Record<string, unknown>).message === 'string'
  ) {
    return (message as Record<string, unknown>).message as string;
  }
  return 'An unexpected error occurred.';
}

// ── Severity config ────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  Severity,
  {
    iconClass: string;
    borderClass: string;
    bgClass: string;
    titleClass: string;
    messageClass: string;
    retryClass: string;
  }
> = {
  error: {
    iconClass:    'text-red-400',
    borderClass:  'border-red-200',
    bgClass:      'bg-red-50',
    titleClass:   'text-red-900',
    messageClass: 'text-red-700',
    retryClass:   'bg-red-100 text-red-700 hover:bg-red-200',
  },
  warning: {
    iconClass:    'text-amber-400',
    borderClass:  'border-amber-200',
    bgClass:      'bg-amber-50',
    titleClass:   'text-amber-900',
    messageClass: 'text-amber-700',
    retryClass:   'bg-amber-100 text-amber-700 hover:bg-amber-200',
  },
  info: {
    iconClass:    'text-blue-400',
    borderClass:  'border-blue-200',
    bgClass:      'bg-blue-50',
    titleClass:   'text-blue-900',
    messageClass: 'text-blue-700',
    retryClass:   'bg-blue-100 text-blue-700 hover:bg-blue-200',
  },
};

// ── Icons ──────────────────────────────────────────────────────────────────

function ErrorIcon({ className }: { className: string }) {
  return (
    <svg className={`h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function LargeErrorIcon({ className }: { className: string }) {
  return (
    <svg className={`h-12 w-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

// ── Default variant ────────────────────────────────────────────────────────

function DefaultError({
  title,
  message,
  onRetry,
  severity,
  icon,
  className,
}: Required<Pick<ErrorStateProps, 'title' | 'message' | 'severity' | 'className'>> &
  Pick<ErrorStateProps, 'onRetry' | 'icon'>) {
  const cfg = SEVERITY_CONFIG[severity];
  const msg = extractMessage(message);

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-lg border px-6 py-12 text-center ${cfg.borderClass} ${cfg.bgClass} ${className}`}
    >
      <div className="mb-4">
        {icon ?? <LargeErrorIcon className={cfg.iconClass} />}
      </div>
      <h3 className={`text-sm font-semibold ${cfg.titleClass}`}>{title}</h3>
      {msg && (
        <p className={`mt-1 max-w-sm text-sm ${cfg.messageClass}`}>{msg}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${cfg.retryClass}`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Retry
        </button>
      )}
    </div>
  );
}

// ── Banner variant ─────────────────────────────────────────────────────────

function BannerError({
  title,
  message,
  onRetry,
  severity,
  className,
}: Required<Pick<ErrorStateProps, 'title' | 'message' | 'severity' | 'className'>> &
  Pick<ErrorStateProps, 'onRetry'>) {
  const cfg = SEVERITY_CONFIG[severity];
  const msg = extractMessage(message);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-4 ${cfg.borderClass} ${cfg.bgClass} ${className}`}
    >
      <ErrorIcon className={`mt-0.5 shrink-0 ${cfg.iconClass}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${cfg.titleClass}`}>{title}</p>
        {msg && (
          <p className={`mt-0.5 text-sm ${cfg.messageClass}`}>{msg}</p>
        )}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${cfg.retryClass}`}
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Inline variant ─────────────────────────────────────────────────────────

function InlineError({
  message,
  severity,
  className,
}: Required<Pick<ErrorStateProps, 'message' | 'severity' | 'className'>>) {
  const cfg = SEVERITY_CONFIG[severity];
  const msg = extractMessage(message);
  if (!msg) return null;

  return (
    <p
      role="alert"
      className={`flex items-center gap-1.5 text-sm ${cfg.messageClass} ${className}`}
    >
      <ErrorIcon className={`h-4 w-4 shrink-0 ${cfg.iconClass}`} />
      {msg}
    </p>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * ErrorState
 *
 * Flexible error display component. Choose `variant` to control layout:
 *   default – centred panel (full card with icon)
 *   banner  – horizontal alert strip (for page-level errors)
 *   inline  – single line with icon (for form field errors)
 */
export function ErrorState({
  title = 'Something went wrong',
  message,
  severity = 'error',
  variant = 'default',
  icon,
  onRetry,
  className = '',
}: ErrorStateProps) {
  if (variant === 'banner') {
    return (
      <BannerError
        title={title}
        message={message}
        severity={severity}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (variant === 'inline') {
    return (
      <InlineError
        message={message}
        severity={severity}
        className={className}
      />
    );
  }

  return (
    <DefaultError
      title={title}
      message={message}
      severity={severity}
      icon={icon}
      onRetry={onRetry}
      className={className}
    />
  );
}

// ── Domain-specific presets ────────────────────────────────────────────────

/** 404-style not-found error */
export function NotFoundError({
  title = 'Not Found',
  message = 'The resource you are looking for does not exist.',
  onBack,
  className,
}: {
  title?: string;
  message?: string;
  onBack?: () => void;
  className?: string;
}) {
  const cfg = SEVERITY_CONFIG['warning'];
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-lg border px-6 py-12 text-center ${cfg.borderClass} ${cfg.bgClass} ${className ?? ''}`}
    >
      <p className="mb-2 text-5xl font-bold text-gray-300">404</p>
      <h3 className={`text-sm font-semibold ${cfg.titleClass}`}>{title}</h3>
      <p className={`mt-1 max-w-sm text-sm ${cfg.messageClass}`}>{message}</p>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={`mt-5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${cfg.retryClass}`}
        >
          ← Go Back
        </button>
      )}
    </div>
  );
}

/** Network / server unreachable error */
export function NetworkError({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      title="Unable to connect"
      message="Cannot reach the DealerFlow server. Check your connection and try again."
      onRetry={onRetry}
      className={className}
    />
  );
}
