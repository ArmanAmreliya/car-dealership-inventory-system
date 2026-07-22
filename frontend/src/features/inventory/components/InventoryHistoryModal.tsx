/**
 * InventoryHistoryModal Component
 *
 * Displays movement audit logs and stock adjustment history for a vehicle.
 */

import { useState, useEffect } from 'react';
import { InventoryItemDTO, StockMovement } from '../types/inventory.types';
import { getStockHistoryForInventory } from '../utils/stockHistory';
import { StockBadge } from './StockBadge';
import { X, History, TrendingUp, TrendingDown, Clock, FileText } from 'lucide-react';

interface InventoryHistoryModalProps {
  item: InventoryItemDTO;
  onClose: () => void;
}

export function InventoryHistoryModal({ item, onClose }: InventoryHistoryModalProps) {
  const [history, setHistory] = useState<StockMovement[]>([]);

  useEffect(() => {
    setHistory(getStockHistoryForInventory(item.id));
  }, [item.id]);

  const vehicleLabel = item.vehicle
    ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}`
    : item.vehicleId;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 id="history-modal-title" className="text-base font-bold text-slate-900">
                  Stock Movement History
                </h2>
                <p className="text-xs text-slate-500 font-medium">{vehicleLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current Summary Banner */}
          <div className="bg-slate-50/70 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StockBadge quantity={item.quantity} available={item.available} />
              <span className="text-xs font-semibold text-slate-600">
                Current Stock: <span className="text-slate-900 font-bold">{item.quantity} units</span>
              </span>
            </div>
            {item.vehicle && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                Price: ${item.vehicle.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Movement Logs Timeline */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {history.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No stock changes recorded yet</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                  Future stock updates for this vehicle will automatically appear in this audit log.
                </p>
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {history.map((record) => {
                  const isIncrease = record.change > 0;
                  const dateStr = new Date(record.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <div key={record.id} className="relative pl-9">
                      {/* Timeline Node */}
                      <div
                        className={`absolute left-2.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white shadow-xs ${
                          isIncrease ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />

                      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {isIncrease ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <TrendingUp className="h-3.5 w-3.5" /> +{record.change} units
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                <TrendingDown className="h-3.5 w-3.5" /> {record.change} units
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-700">{record.reason}</span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">{dateStr}</span>
                        </div>

                        <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
                          <span>Quantity changed: </span>
                          <span className="font-semibold text-slate-500">{record.previousQuantity}</span>
                          <span>&rarr;</span>
                          <span className="font-bold text-slate-900">{record.newQuantity} units</span>
                        </div>

                        {record.notes && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="italic">{record.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-right">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close History
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
