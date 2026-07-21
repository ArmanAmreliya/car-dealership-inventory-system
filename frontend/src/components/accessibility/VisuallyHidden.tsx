/**
 * VisuallyHidden Component
 *
 * Renders content that is visible to screen readers but not to sighted users.
 * The CSS technique used (absolute positioning with near-zero dimensions)
 * is the WCAG-recommended alternative to `display:none` or `visibility:hidden`,
 * which both remove content from the accessibility tree.
 *
 * Use cases:
 *   - Provide labels for icon-only buttons ("Search", "Close", "Delete")
 *   - Supplement terse visible text with descriptive context
 *   - Announce dynamic status messages via aria-live regions
 *
 * @example
 * ```tsx
 * // Label an icon-only button
 * <button aria-label="Search">
 *   <SearchIcon />
 *   <VisuallyHidden>Search</VisuallyHidden>
 * </button>
 *
 * // Supplement visible text
 * <button>
 *   Delete
 *   <VisuallyHidden>Toyota Camry 2022</VisuallyHidden>
 * </button>
 *
 * // Live region for dynamic announcements
 * <VisuallyHidden as="div" aria-live="polite" aria-atomic="true">
 *   {statusMessage}
 * </VisuallyHidden>
 * ```
 */

import React from 'react';

// ── The visually-hidden CSS class ──────────────────────────────────────────
// Applied inline to avoid requiring a separate CSS module. The technique
// is equivalent to the .sr-only utility class in Tailwind CSS.
const STYLE: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

// ── Types ──────────────────────────────────────────────────────────────────

type SupportedTag =
  | 'span'
  | 'div'
  | 'p'
  | 'li'
  | 'label'
  | 'legend'
  | 'caption';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML element to render (default: 'span') */
  as?: SupportedTag;
  children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * VisuallyHidden
 *
 * Screen-reader-only text wrapper.
 * Renders as `<span>` by default; use `as="div"` for block-level
 * aria-live regions.
 */
export function VisuallyHidden({
  as: Tag = 'span',
  children,
  ...props
}: VisuallyHiddenProps) {
  return (
    <Tag style={STYLE} {...props}>
      {children}
    </Tag>
  );
}

// ── Specialised variants ───────────────────────────────────────────────────

interface LiveRegionProps {
  /** Announcement text. An empty string clears the previous announcement. */
  message: string;
  /** How urgently the message should be announced (default: 'polite') */
  politeness?: 'polite' | 'assertive';
}

/**
 * LiveRegion
 *
 * An aria-live region that announces dynamic text changes to screen readers.
 * Use `politeness="assertive"` only for critical, time-sensitive messages
 * (e.g. validation errors); prefer `'polite'` for status updates.
 *
 * @example
 * ```tsx
 * <LiveRegion message={`${vehicles.length} results found`} />
 * <LiveRegion message={errorMessage} politeness="assertive" />
 * ```
 */
export function LiveRegion({
  message,
  politeness = 'polite',
}: LiveRegionProps) {
  return (
    <VisuallyHidden
      as="div"
      aria-live={politeness}
      aria-atomic="true"
      aria-relevant="text"
    >
      {message}
    </VisuallyHidden>
  );
}
