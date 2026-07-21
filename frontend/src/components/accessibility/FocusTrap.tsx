/**
 * FocusTrap Component
 *
 * Constrains keyboard focus to its children while active.
 * Required for all modal dialogs, drawers, and popover menus to satisfy
 * WCAG 2.1 success criterion 2.1.2 No Keyboard Trap (Level A) — the
 * inverse requirement: focus MUST be trapped inside a modal so users
 * cannot accidentally Tab into obscured background content.
 *
 * Behaviour:
 *   - Tab   : moves to the next focusable element; wraps to the first
 *             when the last is reached.
 *   - Shift+Tab : moves to the previous focusable element; wraps to the
 *             last when the first is reached.
 *   - Escape: calls `onEscape` when provided (callers use this to close).
 *   - Focus that escapes the container (e.g. programmatic focus elsewhere)
 *     is silently redirected back to the first focusable element.
 *
 * Focus restoration:
 *   When `restoreFocus` is true (default) the element that held focus
 *   before the trap activated regains focus when the trap is deactivated.
 *
 * @example
 * ```tsx
 * // Modal dialog
 * {isOpen && (
 *   <FocusTrap onEscape={() => setOpen(false)}>
 *     <div role="dialog" aria-modal="true">
 *       <h2>Confirm deletion</h2>
 *       <button onClick={onCancel}>Cancel</button>
 *       <button onClick={onConfirm}>Delete</button>
 *     </div>
 *   </FocusTrap>
 * )}
 *
 * // Mobile nav drawer
 * <FocusTrap active={sidebarOpen} onEscape={closeSidebar}>
 *   <nav>…</nav>
 * </FocusTrap>
 * ```
 */

import {
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  KeyboardEvent,
} from 'react';
import { getFocusableElements } from '../../hooks/useFocusManagement';

// ── Types ──────────────────────────────────────────────────────────────────

interface FocusTrapProps {
  /** Content to trap focus within */
  children: ReactNode;
  /**
   * When false the trap is inactive — Tab key behaves normally.
   * Useful when FocusTrap is always mounted but conditionally active
   * (e.g. a drawer that slides in/out).
   * Defaults to true.
   */
  active?: boolean;
  /**
   * Called when the user presses Escape while the trap is active.
   * Typically used to close the overlay.
   */
  onEscape?: () => void;
  /**
   * When true (default) the element that held focus before the trap
   * activated will regain focus when `active` becomes false.
   */
  restoreFocus?: boolean;
  /**
   * Element to focus when the trap activates.
   * Defaults to the first focusable descendant.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Additional class name for the wrapper <div> */
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * FocusTrap
 *
 * Wraps its children in a <div> that intercepts Tab and Shift+Tab to
 * keep focus cycling within the subtree. Mount and unmount this component
 * (or toggle `active`) to engage/disengage the trap.
 */
export function FocusTrap({
  children,
  active = true,
  onEscape,
  restoreFocus = true,
  initialFocusRef,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Save trigger and move focus in ────────────────────────────────────
  useEffect(() => {
    if (!active) return;

    // Remember what was focused before we take over
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const moveFocusIn = () => {
      if (!containerRef.current) return;

      // Honour an explicit initial focus target
      if (
        initialFocusRef?.current &&
        containerRef.current.contains(initialFocusRef.current)
      ) {
        initialFocusRef.current.focus({ preventScroll: false });
        return;
      }

      // Fall back to the first focusable descendant
      const focusables = getFocusableElements(containerRef.current);
      if (focusables.length > 0) {
        focusables[0].focus({ preventScroll: false });
      } else {
        // Nothing focusable — make the container itself focusable as a
        // last resort so keyboard users are not completely stranded.
        containerRef.current.tabIndex = -1;
        containerRef.current.focus({ preventScroll: false });
      }
    };

    const id = requestAnimationFrame(moveFocusIn);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ── Restore focus when trap deactivates ───────────────────────────────
  useEffect(() => {
    if (active) return;

    if (restoreFocus) {
      const trigger = previousFocusRef.current;
      if (trigger && typeof trigger.focus === 'function') {
        Promise.resolve().then(() => trigger.focus());
      }
    }
    previousFocusRef.current = null;
  }, [active, restoreFocus]);

  // ── Redirect focus that escapes the container ─────────────────────────
  useEffect(() => {
    if (!active) return;

    const onFocusIn = (e: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        // Focus escaped — pull it back to the first focusable child
        const focusables = getFocusableElements(containerRef.current);
        if (focusables.length > 0) {
          e.preventDefault();
          focusables[0].focus();
        }
      }
    };

    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [active]);

  // ── Tab / Shift+Tab cycling ───────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!active) return;

      // Escape
      if (e.key === 'Escape') {
        e.stopPropagation();
        onEscape?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active_el = document.activeElement;

      if (e.shiftKey) {
        // Shift+Tab: if on the first element, wrap to last
        if (active_el === first || !container.contains(active_el)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on the last element, wrap to first
        if (active_el === last || !container.contains(active_el)) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [active, onEscape]
  );

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      // The wrapper itself is not interactive; tabIndex is managed on children
      className={className}
    >
      {children}
    </div>
  );
}
