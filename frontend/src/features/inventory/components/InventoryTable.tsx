/**
 * InventoryTable Component
 *
 * Production-ready Enterprise SaaS data table for inventory management.
 * Features:
 * - Full column set: Vehicle (Thumbnail + Name), Image, VIN, Manufacturer, Model, Quantity, Price, Inventory Value, Status, Updated, Actions
 * - Paginated view with customizable items per page (10, 25, 50)
 * - Click-to-copy VIN helper with feedback
 * - Inline actions for "View Detail", "Update Stock", and "History"
 * - Mobile card view for smaller viewports
 * - Framer Motion row animations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { InventoryItemDTO } from '../types/inventory.types';
import { StockBadge } from './StockBadge';
import { StockUpdateModal } from './StockUpdateModal';
import { InventoryHistoryModal } from './InventoryHistoryModal';
import { paths } from '../../../routes/paths';
import { Eye, Edit3, History, Copy, Check, Car, ChevronLeft, ChevronRight } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItemDTO[];
  isLoading?: boolean;
}

const SKELETON_ROWS = 6;

export function InventoryTable({ items, isLoading = false }: InventoryTableProps) {
  const navigate = useNavigate();
  const [updateModalTarget, setUpdateModalTarget] = useState<InventoryItemDTO | null>(null);
  const [historyModalTarget, setHistoryModalTarget] = useState<InventoryItemDTO | null>(null);
  const [copiedVin, setCopiedVin] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  const handleCopyVin = (vin: string) => {
    navigator.clipboard.writeText(vin);
    setCopiedVin(vin);
    toast.success('VIN copied to clipboard');
    setTimeout(() => setCopiedVin(null), 2000);
  };

  const TABLE_HEADERS = [
    'Vehicle',
    'Image',
    'VIN',
    'Manufacturer',
    'Model',
    'Quantity',
    'Price',
    'Inventory Value',
    'Status',
    'Updated',
    'Actions',
  ];

  return (
    <>
      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: TABLE_HEADERS.length }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 w-16 rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEADERS.length} className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Car className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">No inventory records found</h3>
                    <p className="mt-1 text-xs text-slate-500">Try adjusting your search criteria or active filters.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {paginatedItems.map((item, index) => {
                    const v = item.vehicle;
                    const vehicleLabel = v
                      ? `${v.year ? v.year + ' ' : ''}${v.make} ${v.model}`.trim()
                      : (item as any).make
                      ? `${(item as any).year ? (item as any).year + ' ' : ''}${(item as any).make} ${(item as any).model}`.trim()
                      : 'Unknown Vehicle';
                    const price = v?.price ?? (item as any).price ?? 0;
                    const priceFormatted = price > 0
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
                      : '—';
                    const qty = typeof item.quantity === 'number' ? item.quantity : (item as any).stockQuantity ?? 0;
                    const inventoryValueFormatted = price > 0
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price * qty)
                      : '—';
                    const dateObj = item.updatedAt ? new Date(item.updatedAt) : null;
                    const updatedDateStr = dateObj && !isNaN(dateObj.getTime())
                      ? dateObj.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently';

                    const rowKey = item.id || item.vehicleId || `row-${index}`;

                    return (
                      <motion.tr
                        key={rowKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group transition-colors hover:bg-slate-50/60"
                      >
                        {/* Vehicle Name */}
                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-900">
                          {v ? (
                            <button
                              type="button"
                              onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                              className="text-left font-bold text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              {vehicleLabel}
                            </button>
                          ) : (
                            <span>{vehicleLabel}</span>
                          )}
                        </td>

                        {/* Image Thumbnail */}
                        <td className="px-4 py-3.5">
                          {v?.imageUrl ? (
                            <img
                              src={v.imageUrl}
                              alt={vehicleLabel}
                              className="h-10 w-14 rounded-lg object-cover border border-slate-200 shadow-2xs transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400 border border-slate-200/60">
                              <Car className="h-4 w-4" />
                            </div>
                          )}
                        </td>

                        {/* VIN */}
                        <td className="px-4 py-3.5">
                          {v?.vin ? (
                            <button
                              type="button"
                              onClick={() => handleCopyVin(v.vin)}
                              title="Click to copy VIN"
                              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/60 bg-slate-50 px-2 py-1 font-mono text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <span>{v.vin}</span>
                              {copiedVin === v.vin ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          ) : (
                            <span className="font-mono text-xs text-slate-400">—</span>
                          )}
                        </td>

                        {/* Manufacturer */}
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{v?.make ?? '—'}</td>

                        {/* Model */}
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{v?.model ?? '—'}</td>

                        {/* Quantity */}
                        <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{item.quantity}</td>

                        {/* Price */}
                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-900">{priceFormatted}</td>

                        {/* Inventory Value */}
                        <td className="px-4 py-3.5 text-xs font-bold text-emerald-700">{inventoryValueFormatted}</td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StockBadge quantity={item.quantity} available={item.available} reserved={item.reserved} />
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-500">{updatedDateStr}</td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {v && (
                              <button
                                type="button"
                                onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                                title="View Vehicle Details"
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setUpdateModalTarget(item)}
                              title="Update Stock Quantity"
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                              Update Stock
                            </button>

                            <button
                              type="button"
                              onClick={() => setHistoryModalTarget(item)}
                              title="View Stock History Logs"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              <History className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid View */}
        <div className="lg:hidden p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
              </div>
            ))
          ) : paginatedItems.length === 0 ? (
            <div className="py-12 text-center">
              <Car className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">No inventory records found</p>
            </div>
          ) : (
            paginatedItems.map((item) => {
              const v = item.vehicle;
              const vehicleLabel = v ? `${v.year} ${v.make} ${v.model}` : 'Unknown Vehicle';
              return (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {v?.imageUrl ? (
                        <img src={v.imageUrl} alt={vehicleLabel} className="h-12 w-16 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Car className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900">{vehicleLabel}</p>
                        <p className="font-mono text-[11px] text-slate-400">{v?.vin ?? '—'}</p>
                      </div>
                    </div>
                    <StockBadge quantity={item.quantity} available={item.available} reserved={item.reserved} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-slate-400">Quantity:</span>{' '}
                      <span className="font-bold text-slate-900">{item.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Price:</span>{' '}
                      <span className="font-semibold text-slate-900">${v?.price?.toLocaleString() ?? '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setUpdateModalTarget(item)}
                      className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white text-center hover:bg-blue-700 transition-colors"
                    >
                      Update Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryModalTarget(item)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      History
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 gap-3">
            {/* Page Size & Result Counter */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>per page</span>
              </div>

              <span className="hidden sm:inline text-slate-400">|</span>

              <span>
                Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-slate-900">{Math.min(startIndex + pageSize, items.length)}</span> of{' '}
                <span className="font-semibold text-slate-900">{items.length}</span> items
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <span className="px-2 text-xs font-semibold text-slate-700">
                {safeCurrentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {updateModalTarget && (
        <StockUpdateModal
          item={updateModalTarget}
          onClose={() => setUpdateModalTarget(null)}
        />
      )}

      {/* History Modal */}
      {historyModalTarget && (
        <InventoryHistoryModal
          item={historyModalTarget}
          onClose={() => setHistoryModalTarget(null)}
        />
      )}
    </>
  );
}
