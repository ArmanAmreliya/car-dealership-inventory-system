import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, Package, ShoppingCart, ArrowRight, X, Command } from 'lucide-react';
import { useVehicles } from '../../features/vehicles/hooks/useVehicles';
import { useInventory } from '../../features/inventory/hooks/useInventory';
import { buildGlobalResults, SearchResult, highlightMatch } from '../../utils/search';
import { paths } from '../../routes/paths';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: vehicles = [] } = useVehicles();
  const { data: inventoryData } = useInventory();
  const inventoryItems = inventoryData?.items ?? [];

  const results: SearchResult[] = buildGlobalResults(
    query,
    vehicles,
    inventoryItems,
    [],
    (id) => paths.vehicleDetail(id),
    paths.inventory
  ).slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      navigate(href);
    },
    [navigate, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose]);

  const getSectionIcon = (section: SearchResult['section']) => {
    switch (section) {
      case 'vehicle':
        return <Car className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case 'inventory':
        return <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-popover dark:border-slate-800 dark:bg-slate-900 z-10"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-slate-100 px-4 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search vehicles, VIN, make, model, stock..."
                className="w-full bg-transparent px-3 py-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const segments = highlightMatch(item.label, query);

                    return (
                      <div
                        key={item.key}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                          isSelected
                            ? 'bg-teal-50/80 dark:bg-teal-950/40 text-slate-900 dark:text-slate-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                            {getSectionIcon(item.section)}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium leading-tight">
                              {segments.map((seg, i) =>
                                seg.highlight ? (
                                  <span key={i} className="font-semibold text-teal-600 dark:text-teal-400">
                                    {seg.text}
                                  </span>
                                ) : (
                                  <span key={i}>{seg.text}</span>
                                )
                              )}
                            </p>
                            {item.sublabel && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                {item.sublabel}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-slate-400">
                          <span className="text-[11px] capitalize font-mono text-slate-400 dark:text-slate-500">
                            {item.section}
                          </span>
                          {isSelected && <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                <div className="py-12 text-center">
                  <Car className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try searching by VIN, Make, Model, or Stock status
                  </p>
                </div>
              ) : (
                <div className="py-8 px-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Quick Navigation
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <button
                      onClick={() => handleSelect('/vehicles')}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-all text-left"
                    >
                      <Car className="h-4 w-4 text-teal-600" />
                      <div>
                        <p className="font-medium text-xs">All Vehicles</p>
                        <p className="text-[10px] text-slate-400">Browse fleet catalogue</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelect('/inventory')}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 transition-all text-left"
                    >
                      <Package className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="font-medium text-xs">Inventory Control</p>
                        <p className="text-[10px] text-slate-400">Stock health & alerts</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Keyboard Hints */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">ESC</kbd>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
