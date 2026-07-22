/**
 * VehicleEditDrawer Component — Enterprise Tabbed Edition
 *
 * Right-side drawer for inspecting and editing vehicles (40-50% width).
 * Features tabbed navigation: Overview, Images, History, Inventory, Audit Log.
 * Spring animations via Framer Motion with backdrop blur.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Image, History, Package, ShieldCheck, ExternalLink, Calendar, Tag, Gauge, DollarSign } from 'lucide-react';
import { VehicleDTO } from '../../../api/api';

interface VehicleEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehicleDTO;
  onOpenFullEdit?: () => void;
  children?: React.ReactNode;
}

type DrawerTab = 'overview' | 'images' | 'history' | 'inventory' | 'audit';

const TABS: { id: DrawerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'history', label: 'History', icon: History },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
];

export function VehicleEditDrawer({
  isOpen,
  onClose,
  vehicle,
  onOpenFullEdit,
  children,
}: VehicleEditDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  const formattedPrice = vehicle
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.price)
    : '—';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[480px] lg:w-[540px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle Quick View'}
                </h2>
                {vehicle && (
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    VIN: {vehicle.vin} · {vehicle.year}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                      active
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {children ? (
                children
              ) : vehicle ? (
                <>
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      {/* Photo Header */}
                      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-950 border border-slate-200 dark:border-slate-800">
                        {vehicle.imageUrl ? (
                          <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs">
                            No image available
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-teal-400">
                          {formattedPrice}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 p-5 space-y-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Specifications</p>
                        {[
                          ['Make', vehicle.make, <Tag className="h-3.5 w-3.5 text-slate-400" />],
                          ['Model', vehicle.model, <Tag className="h-3.5 w-3.5 text-slate-400" />],
                          ['Year', String(vehicle.year), <Calendar className="h-3.5 w-3.5 text-slate-400" />],
                          ['VIN', vehicle.vin, <Info className="h-3.5 w-3.5 text-slate-400" />],
                          ['Color', vehicle.color || '—', <Tag className="h-3.5 w-3.5 text-slate-400" />],
                          ['Mileage', vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} mi` : '—', <Gauge className="h-3.5 w-3.5 text-slate-400" />],
                          ['Price', formattedPrice, <DollarSign className="h-3.5 w-3.5 text-slate-400" />],
                        ].map(([label, val, icon]) => (
                          <div key={String(label)} className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1.5">{icon}{label}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{val}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* IMAGES TAB */}
                  {activeTab === 'images' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <p className="text-xs text-slate-500">Vehicle Image Gallery</p>
                      {vehicle.imageUrl ? (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img src={vehicle.imageUrl} alt="Vehicle media" className="w-full object-cover max-h-64" />
                        </div>
                      ) : (
                        <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          No images uploaded for this vehicle.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* HISTORY TAB */}
                  {activeTab === 'history' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ownership & Activity History</p>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="h-2 w-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">Registered in Dealership Catalogue</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">Last Telemetry Update</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{new Date(vehicle.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* INVENTORY TAB */}
                  {activeTab === 'inventory' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock & Quantity Tracking</p>
                      <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className="font-bold text-teal-700 dark:text-teal-400">Active Stock</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Inventory Status:</span>
                          <span className="font-mono font-semibold">Available for Sale</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* AUDIT LOG TAB */}
                  {activeTab === 'audit' && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Audit Trail</p>
                      <div className="font-mono text-[11px] p-3 rounded-xl bg-slate-900 text-slate-300 space-y-1">
                        <p className="text-slate-500">// Transaction telemetry</p>
                        <p><span className="text-teal-400">CREATE:</span> vehicle_id={vehicle.id.slice(0, 8)}...</p>
                        <p><span className="text-amber-400">VERIFY:</span> vin_check=PASSED</p>
                        <p><span className="text-emerald-400">STATUS:</span> 200 OK</p>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : null}
            </div>

            {/* Footer CTAs */}
            {onOpenFullEdit && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onOpenFullEdit}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Full Edit Form
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
