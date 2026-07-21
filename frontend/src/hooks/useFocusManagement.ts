/**
 * useFocusManagement Hook
 *
 * A collection of focused hooks for keyboard-accessible UI patterns.
 * No business logic — pure DOM/React focus utilities.
 *
 * Exports:
 *   FOCUSABLE_SELECTOR  – CSS selector for all natively focusable elements
 *   getFocusableElements – enumerate focusable descendants
 *   useFocusReturn       – restore focus to trigger on unmount / close
 *   useFocusOnMount      – move focus into a container on mount
 *   useRestoreFocus      – combined save-trigger + focus-container + restore
 *   useEscapeKey         – call a handler when Escape is pressed
 *   useRovingTabIndex    – roving tabIndex for toolbars / tab lists / menus
 */

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  RefObject,
  KeyboardEvent,
} from 'react';

// ── Selector for focusable elements ───────────────────────────────────────

/**
 * CSS selector that matches all natively focusable elements.
 * Used by FocusTrap and useFocusOnMount to enumerate candidates.
 */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'details > summary',
].join(', ');

/**
 * Return all focusable descendants of `container` in DOM order,
 * excluding hidden elements and those with aria-hidden="true".
 */
export function getFocusableElements(
  container: HTMLElement
): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.offsetParent !== null // excludes display:none subtrees
  );
}

// ── useFocusReturn ─────────────────────────────────────────────────────────

/**
 * useFocusReturn
 *
 * Saves a reference to the currently focused element when `isActive`
 * becomes true, and restores focus to it when `isActive` becomes false
 * (or when the component unmounts).
 *
 * Typical use: dialogs, drawers, dropdowns — restore focus to the button
 * that opened the overlay when it closes.
 *
 * @param isActive - While true the trigger is saved; on false focus is restored.
 *
 * @example
 * ```tsx
 * useFocusReturn(isOpen);
 * ```
 */
export function useFocusReturn(isActive: boolean): void {
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isActive) {
      triggerRef.current = document.activeElement;
    } else {
      const el = triggerRef.current as HTMLElement | null;
      if (el && typeof el.focus === 'function') {
        // Defer so the overlay is removed from the DOM first
        Promise.resolve().then(() => el.focus());
      }
      triggerRef.current = null;
    }
  }, [isActive]);
}

// ── useFocusOnMount ────────────────────────────────────────────────────────

/**
 * useFocusOnMount
 *
 * Moves focus to the first focusable element inside `containerRef`
 * when the component mounts. Falls back to `containerRef` itself when
 * no focusable children exist (container must have tabIndex set).
 *
 * @param containerRef - Ref to the container element
 * @param enabled      - Skip when false (default: true)
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useFocusOnMount(ref);
 * return <div ref={ref} tabIndex={-1}>…</div>;
 * ```
 */
export function useFocusOnMount(
  containerRef: RefObject<HTMLElement | null>,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const focusables = getFocusableElements(containerRef.current);
    const target = focusables[0] ?? containerRef.current;

    const id = requestAnimationFrame(() => {
      if (target && typeof target.focus === 'function') {
        target.focus({ preventScroll: false });
      }
    });

    return () => cancelAnimationFrame(id);
    // Intentionally runs only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

// ── useRestoreFocus ────────────────────────────────────────────────────────

/**
 * useRestoreFocus
 *
 * Combined hook: saves the focus trigger when `isOpen` becomes true,
 * moves focus into `containerRef`, and restores the saved trigger when
 * `isOpen` becomes false.
 *
 * The single hook to reach for when building modals and drawers.
 *
 * @param containerRef - The dialog / drawer container
 * @param isOpen       - Whether the overlay is currently visible
 *
 * @example
 * ```tsx
 * const dialogRef = useRef<HTMLDivElement>(null);
 * useRestoreFocus(dialogRef, isOpen);
 * ```
 */
export function useRestoreFocus(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean
): void {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;

      const id = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const focusables = getFocusableElements(containerRef.current);
        const target = focusables[0] ?? containerRef.current;
        target.focus({ preventScroll: false });
      });

      return () => cancelAnimationFrame(id);
    } else {
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === 'function') {
        Promise.resolve().then(() => trigger.focus());
      }
      triggerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}

// ── useEscapeKey ───────────────────────────────────────────────────────────

/**
 * useEscapeKey
 *
 * Attaches a document-level `keydown` listener for the Escape key and
 * calls `handler` when it fires. The listener is added during capture
 * phase so it fires before child handlers.
 *
 * The `handler` reference is kept stable via a ref so callers don't
 * need to memoize it.
 *
 * @param handler  - Called when Escape is pressed
 * @param enabled  - Listener only attached when true (default: true)
 *
 * @example
 * ```tsx
 * useEscapeKey(() => setOpen(false), isOpen);
 * ```
 */
export function useEscapeKey(handler: () => void, enabled = true): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handlerRef.current();
      }
    };

    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () =>
      document.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [enabled]);
}

// ── useRovingTabIndex ──────────────────────────────────────────────────────

export interface RovingTabIndexResult {
  /** Index of the currently active (tabIndex=0) item */
  activeIndex: number;
  /** Imperatively set the active index (e.g. on mouseenter) */
  setActiveIndex: (index: number) => void;
  /**
   * Spread the returned props onto each item element.
   * Provides the correct tabIndex and arrow-key / Home / End handlers.
   */
  getItemProps: (index: number) => {
    tabIndex: number;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  };
}

/**
 * useRovingTabIndex
 *
 * Implements the roving tabIndex pattern for composite widgets such as
 * toolbars, tab lists, and menu bars (ARIA APG pattern §5.7).
 *
 * Only the active item has `tabIndex=0`; all others have `tabIndex=-1`.
 * Arrow keys move the active index; Home/End jump to first/last.
 *
 * @param count       - Total number of items
 * @param orientation - 'horizontal' (default) | 'vertical'
 * @param loop        - Wrap around at boundaries (default: true)
 *
 * @example
 * ```tsx
 * const { activeIndex, setActiveIndex, getItemProps } =
 *   useRovingTabIndex(tabs.length);
 *
 * return tabs.map((tab, i) => (
 *   <button
 *     key={i}
 *     {...getItemProps(i)}
 *     onMouseEnter={() => setActiveIndex(i)}
 *   >
 *     {tab.label}
 *   </button>
 * ));
 * ```
 */
export function useRovingTabIndex(
  count: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  loop = true
): RovingTabIndexResult {
  const [activeIndex, setActiveIndex] = useState(0);

  const move = useCallback(
    (delta: -1 | 1) => {
      setActiveIndex((prev) => {
        const next = prev + delta;
        if (loop) return (next + count) % count;
        return Math.max(0, Math.min(count - 1, next));
      });
    },
    [count, loop]
  );

  const getItemProps = useCallback(
    (index: number) => {
      const prevKey =
        orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const nextKey =
        orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

      return {
        tabIndex: index === activeIndex ? 0 : -1,
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          switch (e.key) {
            case nextKey:
              e.preventDefault();
              move(1);
              break;
            case prevKey:
              e.preventDefault();
              move(-1);
              break;
            case 'Home':
              e.preventDefault();
              setActiveIndex(0);
              break;
            case 'End':
              e.preventDefault();
              setActiveIndex(count - 1);
              break;
          }
        },
      };
    },
    [activeIndex, orientation, move, count]
  );

  return { activeIndex, setActiveIndex, getItemProps };
}
