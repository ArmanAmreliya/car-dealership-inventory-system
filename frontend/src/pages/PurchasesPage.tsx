/**
 * PurchasesPage Component
 *
 * Enterprise SaaS vehicle purchase workspace designed from scratch.
 * Design Philosophy: Linear / Stripe Dashboard / Apple
 * Focus:
 * - High visual hierarchy with generous whitespace
 * - Full content area width
 * - Instant debounced search & filter bar
 * - Responsive gallery grid of available vehicles
 * - 50/50 Split Preview for selected vehicle
 * - Stripe-like Purchase Summary card with 1-click confirmation
 * - Smooth Framer Motion animations & session history log
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { VehicleDTO } from '../api/api';
import { PurchaseDTO } from '../features/purchases/types/purchase.types';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useCreatePurchase, extractPurchaseError } from '../features/purchases/hooks/useCreatePurchase';
import { VehicleSelectionCard } from '../features/purchases/components/VehicleSelectionCard';
import { SelectedVehiclePreview } from '../features/purchases/components/SelectedVehiclePreview';
import { PurchaseOrderSummaryCard } from '../features/purchases/components/PurchaseOrderSummaryCard';
import { PurchaseSuccessReceipt } from '../features/purchases/components/PurchaseSuccessReceipt';
import { PurchaseTable } from '../features/purchases/components/PurchaseTable';
import { paths } from '../routes/paths';
import {
  Search,
  Filter,
  RotateCcw,
  Car,
  ShoppingBag,
  History,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

const SESSION_KEY = 'dealerflow_session_purchases';

function loadSessionPurchases(): PurchaseDTO[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PurchaseDTO[]) : [];
  } catch {
    return [];
  }
}

function saveSessionPurchases(purchases: PurchaseDTO[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(purchases));
  } catch {
    // sessionStorage fallback
  }
}

export function PurchasesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Query & Mutation Hooks ──────────────────────────────────────────────
  const {
    data: availableVehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    refetch: refetchVehicles,
  } = useVehicles({ availability: true });

  const { mutate: executePurchase, isPending: isPurchasing } = useCreatePurchase();

  // ── State Management ────────────────────────────────────────────────────
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(null);
  const [completedPurchase, setCompletedPurchase] = useState<PurchaseDTO | null>(null);
  const [purchases, setPurchases] = useState<PurchaseDTO[]>(() => loadSessionPurchases());
  const [activeTab, setActiveTab] = useState<'purchase' | 'history'>('purchase');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<string>('all');

  // Vehicle Map for history table enrichment
  const vehicleMap = useMemo(
    () => Object.fromEntries(availableVehicles.map((v) => [v.id, v])),
    [availableVehicles]
  );

  // Accept incoming receipt from navigation state if any
  useEffect(() => {
    const state = location.state as { purchase?: PurchaseDTO } | null;
    if (state?.purchase) {
      addPurchase(state.purchase);
      setCompletedPurchase(state.purchase);
      navigate(paths.purchases, { replace: true, state: null });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addPurchase = useCallback((receipt: PurchaseDTO) => {
    setPurchases((prev) => {
      if (prev.some((p) => p.id === receipt.id)) return prev;
      const updated = [receipt, ...prev];
      saveSessionPurchases(updated);
      return updated;
    });
  }, []);

  // ── Unique Manufacturers & Years for Dropdowns ──────────────────────────
  const uniqueMakes = useMemo(() => {
    const makes = new Set<string>();
    availableVehicles.forEach((v) => makes.add(v.make));
    return Array.from(makes).sort();
  }, [availableVehicles]);

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    availableVehicles.forEach((v) => years.add(v.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [availableVehicles]);

  // ── Filtered Vehicles Computation ───────────────────────────────────────
  const filteredVehicles = useMemo(() => {
    return availableVehicles.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const haystack = `${v.year} ${v.make} ${v.model} ${v.vin}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (selectedMake !== 'all' && v.make.toLowerCase() !== selectedMake.toLowerCase()) {
        return false;
      }
      if (selectedYear !== 'all' && String(v.year) !== selectedYear) {
        return false;
      }
      if (priceMax !== 'all') {
        const maxVal = parseInt(priceMax, 10);
        if (v.price > maxVal) return false;
      }
      return true;
    });
  }, [availableVehicles, searchQuery, selectedMake, selectedYear, priceMax]);

  // ── Purchase Submission Handler ─────────────────────────────────────────
  const handleConfirmPurchase = () => {
    if (!selectedVehicle) return;

    executePurchase(
      { vehicleId: selectedVehicle.id },
      {
        onSuccess: (receipt) => {
          const enrichedReceipt: PurchaseDTO = {
            ...receipt,
            vehicle: selectedVehicle,
          };
          addPurchase(enrichedReceipt);
          setCompletedPurchase(enrichedReceipt);
          toast.success(`Purchased ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`);
        },
        onError: (err) => {
          const pe = extractPurchaseError(err);
          toast.error(pe?.message || 'Failed to complete purchase. Please try again.');
        },
      }
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSelectedYear('all');
    setPriceMax('all');
  };

  return (
    <DashboardLayout pageTitle="Vehicle Acquisition">
      <div className="mx-auto max-w-[1440px] p-6 md:p-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Vehicle</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
                <Sparkles className="h-3 w-3 text-blue-500" />
                Live Stock Acquisition
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Acquire available vehicles directly into inventory with instant order placement and stock sync.
            </p>
          </div>

          {/* Tab View Switcher */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('purchase');
                setCompletedPurchase(null);
              }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'purchase'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Acquire Vehicle
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Session History ({purchases.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Acquisition Workflow */}
        {activeTab === 'purchase' && (
          <>
            {/* Success State View */}
            {completedPurchase ? (
              <PurchaseSuccessReceipt
                purchase={completedPurchase}
                vehicle={completedPurchase.vehicle || vehicleMap[completedPurchase.vehicleId]}
                onReset={() => {
                  setCompletedPurchase(null);
                  setSelectedVehicle(null);
                }}
                onViewHistory={() => setActiveTab('history')}
              />
            ) : (
              <div className="space-y-8">
                {/* Search Bar & Filter Controls */}
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  {/* Large Search Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by VIN, Make, Model, or Year (e.g. 2024 Toyota Camry)..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdowns Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pr-2 border-r border-slate-200">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <span>Filters</span>
                      </div>

                      {/* Manufacturer */}
                      <select
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="all">All Manufacturers</option>
                        {uniqueMakes.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>

                      {/* Year */}
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="all">All Model Years</option>
                        {uniqueYears.map((yr) => (
                          <option key={yr} value={String(yr)}>
                            {yr}
                          </option>
                        ))}
                      </select>

                      {/* Price Ceiling */}
                      <select
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="all">Max Price: Any</option>
                        <option value="30000">Under $30,000</option>
                        <option value="50000">Under $50,000</option>
                        <option value="75000">Under $75,000</option>
                      </select>
                    </div>

                    {/* Reset Button */}
                    {(searchQuery || selectedMake !== 'all' || selectedYear !== 'all' || priceMax !== 'all') && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected Vehicle & Summary Workspace */}
                <AnimatePresence>
                  {selectedVehicle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          Vehicle Acquisition Workspace
                        </h2>
                        <button
                          type="button"
                          onClick={() => setSelectedVehicle(null)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          Deselect & Return to Gallery
                        </button>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                        {/* Selected Preview (Left 7 cols) */}
                        <div className="xl:col-span-8">
                          <SelectedVehiclePreview vehicle={selectedVehicle} />
                        </div>

                        {/* Order Summary (Right 4 cols) */}
                        <div className="xl:col-span-4">
                          <PurchaseOrderSummaryCard
                            vehicle={selectedVehicle}
                            isPending={isPurchasing}
                            onConfirm={handleConfirmPurchase}
                            onCancel={() => setSelectedVehicle(null)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vehicle Gallery Header */}
                <div className="flex items-center justify-between border-t border-slate-200/80 pt-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Available Vehicle Catalog</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select a vehicle card below to review details and initiate purchase.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {filteredVehicles.length} Vehicles Available
                  </span>
                </div>

                {/* Loading State Skeleton */}
                {vehiclesLoading && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4"
                      >
                        <div className="h-44 w-full rounded-xl bg-slate-100" />
                        <div className="h-4 w-2/3 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-100" />
                        <div className="h-10 w-full rounded-xl bg-slate-200/80" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Error State */}
                {vehiclesError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-rose-600 shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold">Failed to load catalog</h3>
                        <p className="text-xs text-rose-700 mt-0.5">
                          Unable to retrieve available vehicles from the dealership server.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => refetchVehicles()}
                      className="rounded-xl bg-rose-100 px-4 py-2 text-xs font-bold text-rose-800 hover:bg-rose-200 transition-colors"
                    >
                      Retry Catalog
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!vehiclesLoading && !vehiclesError && filteredVehicles.length === 0 && (
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Car className="h-7 w-7 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No available vehicles match your search</h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Try adjusting your active search query or filter selections above.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear Search & Filters
                    </button>
                  </div>
                )}

                {/* Gallery Grid */}
                {!vehiclesLoading && !vehiclesError && filteredVehicles.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleSelectionCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={selectedVehicle?.id === vehicle.id}
                        onSelect={(v) => {
                          setSelectedVehicle(v);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Session Purchase History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Session Purchase Log</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review transactions completed during your current dealership session.
                </p>
              </div>
            </div>

            <PurchaseTable purchases={purchases} vehicleMap={vehicleMap} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
