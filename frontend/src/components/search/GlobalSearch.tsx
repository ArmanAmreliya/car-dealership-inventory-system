/**
 * GlobalSearch Component
 *
 * A keyboard-accessible, debounced, full-text search input that searches
 * across vehicles, inventory items, and session purchases simultaneously.
 *
 * Features:
 *   - Debounced input (300 ms) via useDebounce
 *   - Dropdown result list grouped by section
 *   - Highlighted matched text in each result label
 *   - Keyboard navigation: ↑ ↓ Enter Escape
 *   - Click-outside closes the dropdown
 *   - Navigates to the result's target page on selection
 *   - Reads vehicles + inventory from TanStack Query cache
 *   - Reads session purchases from sessionStorage
 *
 * Designed to sit in the top Navbar or any layout header.
 *
 * @example
 * ```tsx
 * // Inside Navbar
 * <GlobalSearch placeholder="Search vehicles, inventory…" />
 * ```
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import {
  buildGlobalResults,
  SearchResult,
  highlightMatch,
  HighlightSegment,
} from '../../utils/search';
import { useVehicles } from '../../features/vehicles/hooks/useVehicles';
import { useInventory } from '../../features/inventory/hooks/useInventory';
import { PurchaseDTO } from '../../features/purchases/types/purchase.types';
import { paths } from '../../routes/paths';

// ── Session purchase reader ────────────────────────────────────────────────

const SESSION_KEY = 'dealerflow_session_purchases';

function readSessionPurchases(): PurchaseDTO[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PurchaseDTO[]) : [];
  } catch {
    return [];
  }
}

// ── Section label map ──────────────────────────────────────────────────────

const SECTION_LABEL: Record<SearchResult['section'], string> = {
  vehicle:   'Vehicles',
  inventory: 'Inventory',
  purchase:  'Purchases',
};

const SECTION_ICON: Record<SearchResult['section'], React.ReactNode> = {
  vehicle: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  inventory: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  purchase: (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
};

// ── Highlighted text renderer ──────────────────────────────────────────────

function HighlightedLabel({
  segments,
}: {
  segments: HighlightSegment[];
}) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className="bg-transparent font-semibold text-blue-600"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface GlobalSearchProps {
  /** Input placeholder text */
  placeholder?: string;
  /** Max results to show before truncating (default 8) */
  maxResults?: number;
  /** Additional wrapper className */
  className?: string;
}

/**
 * GlobalSearch
 *
 * Debounced, keyboard-navigable search across vehicles, inventory, and
 * session purchases. Results are grouped by section with subtle headers.
 */
export function GlobalSearch({
  placeholder = 'Search vehicles, inventory…',
  maxResults = 8,
  className = '',
}: GlobalSearchProps) {
  const navigate = useNavigate();

  // ── Data sources ──────────────────────────────────────────────────────────
  const { data: vehicles = [] } = useVehicles();
  const { data: inventoryData } = useInventory();
  const inventoryItems = inventoryData?.items ?? [];

  const [purchases] = useState<PurchaseDTO[]>(() => readSessionPurchases());

  // ── Search state ──────────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Compute results ───────────────────────────────────────────────────────
  const allResults = buildGlobalResults(
    debouncedQuery,
    vehicles,
    inventoryItems,
    purchases,
    (id) => paths.vehicleDetail(id),
    paths.inventory
  ).slice(0, maxResults);

  // ── Open / close logic ────────────────────────────────────────────────────
  useEffect(() => {
    if (debouncedQuery.trim() && allResults.length > 0) {
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, allResults.length]);

  // Close on click-outside
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // ── Selection ─────────────────────────────────────────────────────────────
  const selectResult = useCallback(
    (result: SearchResult) => {
      setQuery('');
      setIsOpen(false);
      setActiveIndex(-1);
      navigate(result.href);
    },
    [navigate]
  );

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : allResults.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && allResults[activeIndex]) {
          selectResult(allResults[activeIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // ── Scroll active item into view ──────────────────────────────────────────
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | null;
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // ── Section grouping ──────────────────────────────────────────────────────
  const grouped: { section: SearchResult['section']; results: SearchResult[] }[] =
    [];
  for (const result of allResults) {
    const last = grouped[grouped.length - 1];
    if (last && last.section === result.section) {
      last.results.push(result);
    } else {
      grouped.push({ section: result.section, results: [result] });
    }
  }

  // Flat index so keyboard nav works across sections
  const flatResults = grouped.flatMap((g) => g.results);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="global-search-listbox"
    >
      {/* Input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          id="global-search"
          type="search"
          role="searchbox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="global-search-listbox"
          aria-activedescendant={
            activeIndex >= 0
              ? `gsr-${flatResults[activeIndex]?.key}`
              : undefined
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (debouncedQuery.trim() && allResults.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul
            ref={listRef}
            id="global-search-listbox"
            role="listbox"
            aria-label="Search results"
            className="max-h-80 overflow-y-auto py-1"
          >
            {grouped.map((group) => (
              <li key={group.section} role="presentation">
                {/* Section header */}
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {SECTION_ICON[group.section]}
                  {SECTION_LABEL[group.section]}
                </div>

                {/* Results in this section */}
                <ul role="group" aria-label={SECTION_LABEL[group.section]}>
                  {group.results.map((result) => {
                    const flatIdx = flatResults.indexOf(result);
                    const isActive = flatIdx === activeIndex;
                    const segments = highlightMatch(result.label, debouncedQuery);

                    return (
                      <li
                        key={result.key}
                        id={`gsr-${result.key}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        onClick={() => selectResult(result)}
                        className={`flex cursor-pointer flex-col gap-0.5 px-4 py-2.5 transition-colors ${
                          isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm text-gray-900">
                          <HighlightedLabel segments={segments} />
                        </span>
                        {result.sublabel && (
                          <span className="text-xs text-gray-400">
                            {result.sublabel}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-400">
            {allResults.length} result{allResults.length !== 1 ? 's' : ''} ·{' '}
            <kbd className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs">↑↓</kbd>{' '}
            navigate ·{' '}
            <kbd className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs">Enter</kbd>{' '}
            select ·{' '}
            <kbd className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs">Esc</kbd>{' '}
            close
          </div>
        </div>
      )}
    </div>
  );
}
