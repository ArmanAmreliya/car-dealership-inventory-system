/**
 * SkipToContent Component
 *
 * A "Skip to main content" anchor that is visually hidden until it
 * receives keyboard focus. Allows keyboard and screen-reader users to
 * bypass repeated navigation links and jump directly to the page's
 * primary content region.
 *
 * WCAG 2.1 success criterion: 2.4.1 Bypass Blocks (Level A).
 *
 * Usage:
 *   1. Place <SkipToContent /> as the very first child of <body> (or the
 *      root layout component) so it is the first focusable element in
 *      tab order.
 *   2. Add `id="main-content"` to your <main> element (or use the
 *      `targetId` prop to specify a custom id).
 *
 * @example
 * ```tsx
 * // In DashboardLayout.tsx — before the Sidebar / Navbar
 * <SkipToContent />
 * <Sidebar />
 * <Navbar />
 * <main id="main-content">…</main>
 * ```
 *
 * ```tsx
 * // Custom target id
 * <SkipToContent targetId="page-content" label="Skip to page content" />
 * <div id="page-content">…</div>
 * ```
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface SkipToContentProps {
  /** id of the target element to scroll / focus to (default: "main-content") */
  targetId?: string;
  /** Visible link label (default: "Skip to main content") */
  label?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * SkipToContent
 *
 * Rendered as a normal anchor element that sits above all other content
 * in the DOM. It is positioned off-screen using `translate-y` until it
 * receives `:focus`, at which point it animates into the viewport so
 * keyboard users can see and activate it.
 *
 * The click/Enter handler manually focuses the target element and adds a
 * temporary `tabIndex` so it is programmatically focusable even if the
 * element is not natively interactive (e.g. a <main>).
 */
export function SkipToContent({
  targetId = 'main-content',
  label = 'Skip to main content',
}: SkipToContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    // Make the target temporarily focusable if it lacks a tabIndex
    const hadTabIndex = target.hasAttribute('tabindex');
    if (!hadTabIndex) target.setAttribute('tabindex', '-1');

    target.focus({ preventScroll: false });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Remove the temporary tabIndex after focus leaves the element
    if (!hadTabIndex) {
      const remove = () => {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', remove);
      };
      target.addEventListener('blur', remove);
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      /**
       * The link is visually hidden off the top of the viewport.
       * On :focus it slides into view with a smooth transition.
       * z-[9999] ensures it always appears above sidebars/navbars.
       */
      className={[
        // Positioning
        'fixed left-4 top-4 z-[9999]',
        // Off-screen by default
        '-translate-y-24 opacity-0',
        // On focus: slide in and become visible
        'focus:translate-y-0 focus:opacity-100',
        // Transition
        'transition-all duration-200 ease-out',
        // Appearance
        'rounded-md bg-blue-600 px-4 py-2',
        'text-sm font-semibold text-white shadow-lg',
        // Focus ring (for high-contrast mode)
        'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
      ].join(' ')}
    >
      {label}
    </a>
  );
}
