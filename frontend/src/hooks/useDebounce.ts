/**
 * useDebounce Hook
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of silence. Cancels the pending update when the component unmounts.
 *
 * Used by GlobalSearch and any filter bar that fires on every keystroke
 * so expensive queries are not triggered on every character.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default 300 ms)
 *
 * @example
 * ```ts
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 300);
 *
 * // debouncedQuery only changes 300 ms after the user stops typing
 * useEffect(() => {
 *   if (debouncedQuery) search(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
