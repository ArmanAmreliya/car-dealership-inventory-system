/**
 * Skeleton Component
 *
 * Animated grey placeholder shapes for content that is loading.
 * Exports a base Skeleton primitive plus higher-level composites:
 *   SkeletonText    – one or more text lines
 *   SkeletonCard    – white card with configurable line count
 *   SkeletonTable   – thead + tbody rows
 *   SkeletonAvatar  – circle avatar placeholder
 *
 * @example
 * ```tsx
 * // Single block
 * <Skeleton className="h-10 w-full" />
 *
 * // A labelled card
 * <SkeletonCard lines={4} />
 *
 * // A data table
 * <SkeletonTable rows={5} cols={4} />
 * ```
 */

// ── Base primitive ─────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton
 *
 * A single animated grey rectangle. Width and height must be set via
 * `className` (e.g. `h-4 w-32`).
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
}

// ── Text lines ─────────────────────────────────────────────────────────────

interface SkeletonTextProps {
  /** Number of lines to render (default 3) */
  lines?: number;
  /** Make the last line narrower to look like a paragraph end */
  shortenLast?: boolean;
  className?: string;
}

/**
 * SkeletonText
 *
 * Stacked text-line placeholders. The last line is optionally shortened
 * to mimic a paragraph's final line.
 */
export function SkeletonText({
  lines = 3,
  shortenLast = true,
  className = '',
}: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      className={`space-y-2 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            shortenLast && i === lines - 1 ? 'w-3/5' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  /** Number of body text lines (default 3) */
  lines?: number;
  /** Show a header line above the body (default true) */
  showHeader?: boolean;
  className?: string;
}

/**
 * SkeletonCard
 *
 * White bordered card with a title placeholder and configurable body lines.
 */
export function SkeletonCard({
  lines = 3,
  showHeader = true,
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16" />
        </div>
      )}
      <SkeletonText lines={lines} />
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────

interface SkeletonTableProps {
  /** Number of body rows (default 5) */
  rows?: number;
  /** Number of columns (default 4) */
  cols?: number;
  /** Show a table header row (default true) */
  showHeader?: boolean;
  className?: string;
}

/**
 * SkeletonTable
 *
 * Full table skeleton with a header row and configurable body rows/cols.
 * Renders inside a white bordered container matching the app's table style.
 */
export function SkeletonTable({
  rows = 5,
  cols = 4,
  showHeader = true,
  className = '',
}: SkeletonTableProps) {
  // Vary column widths slightly so it looks natural
  const COL_WIDTHS = ['w-32', 'w-24', 'w-20', 'w-28', 'w-16', 'w-24'];

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <Skeleton
                      className={`h-3 ${COL_WIDTHS[i % COL_WIDTHS.length]}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="animate-pulse">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="px-4 py-3 whitespace-nowrap">
                    <Skeleton
                      className={`h-4 ${COL_WIDTHS[(r + c) % COL_WIDTHS.length]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AVATAR_SIZE: Record<NonNullable<SkeletonAvatarProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

/**
 * SkeletonAvatar
 *
 * Circular avatar placeholder.
 */
export function SkeletonAvatar({ size = 'md', className = '' }: SkeletonAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-full bg-gray-200 ${AVATAR_SIZE[size]} ${className}`}
    />
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────

interface SkeletonStatCardProps {
  className?: string;
}

/**
 * SkeletonStatCard
 *
 * Matches the shape of the dashboard StatsCards component.
 */
export function SkeletonStatCard({ className = '' }: SkeletonStatCardProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}
