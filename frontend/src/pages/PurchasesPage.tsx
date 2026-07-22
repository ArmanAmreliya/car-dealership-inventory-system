import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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

  const {
    data: availableVehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    refetch: refetchVehicles,
  } = useVehicles({ availability: true });

  const { mutate: executePurchase, isPending: isPurchasing } = useCreatePurchase();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(null);
  const [completedPurchase, setCompletedPurchase] = useState<PurchaseDTO | null>(null);
  const [purchases, setPurchases] = useState<PurchaseDTO[]>(() => loadSessionPurchases());
  const [activeTab, setActiveTab] = useState<'purchase' | 'history'>('purchase');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<string>('all');

  const vehicleMap = useMemo(
    () => Object.fromEntries(availableVehicles.map((v) => [v.id, v])),
    [availableVehicles]
  );

  useEffect(() => {
    const state = location.state as { purchase?: PurchaseDTO } | null;
    if (state?.purchase) {
      addPurchase(state.purchase);
      setCompletedPurchase(state.purchase);
      navigate(paths.purchases, { replace: true, state: null });
    }
  }, []);

  const addPurchase = useCallback((receipt: PurchaseDTO) => {
    setPurchases((prev) => {
      if (prev.some((p) => p.id === receipt.id)) return prev;
      const updated = [receipt, ...prev];
      saveSessionPurchases(updated);
      return updated;
    });
  }, []);

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Vehicle Acquisition
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 border border-teal-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Checkout Workflow
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Acquire vehicles directly into dealership stock with instant order confirmation and receipts.
          </p>
        </div>

        {/* Tab View Switcher */}
        <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('purchase');
              setCompletedPurchase(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'purchase'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-subtle'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Acquire Vehicle
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-subtle'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Order Log ({purchases.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Acquisition Workflow */}
      {activeTab === 'purchase' && (
        <>
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
              <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search available vehicles by Make, Model, VIN, or Year..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pr-2 border-r border-slate-200 dark:border-slate-800">
                      <Filter className="h-3.5 w-3.5 text-slate-400" />
                      <span>Filter Options</span>
                    </div>

                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="all">All Manufacturers</option>
                      {uniqueMakes.map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="all">All Model Years</option>
                      {uniqueYears.map((yr) => (
                        <option key={yr} value={String(yr)}>
                          {yr}
                        </option>
                      ))}
                    </select>

                    <select
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="all">Max Price: Any</option>
                      <option value="30000">Under $30,000</option>
                      <option value="50000">Under $50,000</option>
                      <option value="75000">Under $75,000</option>
                    </select>
                  </div>

                  {(searchQuery || selectedMake !== 'all' || selectedYear !== 'all' || priceMax !== 'all') && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Vehicle Checkout Workspace */}
              <AnimatePresence>
                {selectedVehicle && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        Selected Order Summary
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle(null)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        Change Vehicle
                      </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                      <div className="xl:col-span-8">
                        <SelectedVehiclePreview vehicle={selectedVehicle} />
                      </div>

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

              {/* Gallery Header */}
              <div className="flex items-center justify-between border-t border-slate-200/80 pt-6 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Vehicles</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any vehicle below to select and generate purchase order.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {filteredVehicles.length} Available
                </span>
              </div>

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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Session Order Audit Log</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official transaction log for purchase orders created in this session.
              </p>
            </div>
          </div>

          <PurchaseTable purchases={purchases} vehicleMap={vehicleMap} />
        </div>
      )}
    </div>
  );
}

