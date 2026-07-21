/**
 * Loader Component
 *
 * Animated spinner for in-progress states.
 * Three sizes: sm, md (default), lg.
 * Two display modes: inline (default) and centred fullscreen overlay.
 *
 * @example
 * ```tsx
 * // Inline inside a button
 * <Loader size="sm" />
 *
 * // Centred in a content area
 * <Loader size="lg" centered label="Loading vehicles…" />
 * ```
 */

interface LoaderProps {
  /** Visual size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** When true, the spinner is centred with flex in the available space */
  centered?: boolean;
  /** Accessible label read by screen readers (default: "Loading") */
  label?: string;
  /** Additional wrapper className */
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<LoaderProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/**
 * Loader
 *
 * Pure CSS border-spin spinner. No JS animation frames.
 * The `aria-label` and `role="status"` make it accessible without
 * requiring visually hidden text.
 */
export function Loader({
  size = 'md',
  centered = false,
  label = 'Loading',
  className = '',
}: LoaderProps) {
  const spinner = (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-gray-200 border-t-blue-600 ${SIZE_CLASS[size]}`}
    />
  );

  if (centered) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 ${className}`}
      >
        {spinner}
        {label !== 'Loading' && (
          <p className="text-sm text-gray-500">{label}</p>
        )}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      {spinner}
    </span>
  );
}
