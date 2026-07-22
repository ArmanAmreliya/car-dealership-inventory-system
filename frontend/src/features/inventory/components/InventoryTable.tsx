import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryItemDTO } from '../types/inventory.types';
import { paths } from '../../../routes/paths';
import { resolveVehicleImage } from '../../../utils/vehicleImage';
import { Edit, Eye, Car } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItemDTO[];
  isLoading?: boolean;
  onEditItem?: (item: InventoryItemDTO) => void;
}

export function InventoryTable({ items, isLoading = false, onEditItem }: InventoryTableProps) {
  const navigate = useNavigate();
  const [featuredMap, setFeaturedMap] = useState<Record<string, boolean>>({});

  const toggleFeatured = (id: string) => {
    setFeaturedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs animate-pulse space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 w-full rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Car className="h-7 w-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No inventory entries found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          No vehicles in your inventory match the current filter selection.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3.5 w-10">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-0" />
              </th>
              <th scope="col" className="px-4 py-3.5">Photo</th>
              <th scope="col" className="px-4 py-3.5">Year</th>
              <th scope="col" className="px-4 py-3.5">Make</th>
              <th scope="col" className="px-4 py-3.5">Model</th>
              <th scope="col" className="px-4 py-3.5">Trim</th>
              <th scope="col" className="px-4 py-3.5">Mileage</th>
              <th scope="col" className="px-4 py-3.5">Price</th>
              <th scope="col" className="px-4 py-3.5">Sale Price</th>
              <th scope="col" className="px-4 py-3.5">Arrival Date</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5 text-center">Featured</th>
              <th scope="col" className="px-4 py-3.5 text-center">Notes</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const v = item.vehicle;
                const year = v?.year || (item as any).year || '—';
                const make = v?.make || (item as any).make || '—';
                const model = v?.model || (item as any).model || '—';
                const trim = (v as any)?.trim || (item as any).trim || '—';
                const mileage = v?.mileage || (item as any).mileage;
                const mileageStr = mileage ? mileage.toLocaleString() : '—';
                const price = v?.price ?? (item as any).price ?? 0;
                const salePrice = (v as any)?.salePrice || (item as any).salePrice || (price > 0 ? price * 0.92 : 0);
                const quantity = item.quantity ?? 0;
                const isAvailable = item.available && quantity > 0;
                const imageUrl = resolveVehicleImage(v || (item as any));

                const dateObj = item.updatedAt ? new Date(item.updatedAt) : null;
                const arrivalStr = dateObj && !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
                  : '03/02/2026';

                const formatCurrency = (amt: number) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(amt);

                const rowKey = item.id || item.vehicleId || `table-row-${index}`;
                const isFeatured = featuredMap[rowKey] ?? (v as any)?.isFeatured ?? false;

                return (
                  <motion.tr
                    key={rowKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-0" />
                    </td>

                    {/* Photo */}
                    <td className="px-4 py-3">
                      <div className="h-10 w-14 overflow-hidden rounded-lg bg-slate-900 border border-slate-200/60 shadow-2xs">
                        <img src={imageUrl} alt={model} className="h-full w-full object-cover" />
                      </div>
                    </td>

                    {/* Year */}
                    <td className="px-4 py-3 font-bold text-slate-900">{year}</td>

                    {/* Make */}
                    <td className="px-4 py-3 font-bold text-slate-900 uppercase tracking-tight">{make}</td>

                    {/* Model */}
                    <td className="px-4 py-3 font-extrabold text-slate-900 uppercase tracking-tight">{model}</td>

                    {/* Trim */}
                    <td className="px-4 py-3 text-slate-500 font-medium">{trim}</td>

                    {/* Mileage */}
                    <td className="px-4 py-3 text-slate-600 font-mono">{mileageStr}</td>

                    {/* Price (Strikethrough) */}
                    <td className="px-4 py-3 text-slate-400 line-through">
                      {price > 0 ? formatCurrency(price) : '—'}
                    </td>

                    {/* Sale Price (Bold) */}
                    <td className="px-4 py-3 font-black text-slate-950">
                      {price > 0 ? formatCurrency(salePrice > 0 ? salePrice : price) : '—'}
                    </td>

                    {/* Arrival Date */}
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{arrivalStr}</td>

                    {/* Status Pill */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isAvailable
                            ? 'bg-[#55E6D9]/20 text-slate-950 border border-[#55E6D9]'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </td>

                    {/* Featured Toggle Switch */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(rowKey)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isFeatured ? 'bg-slate-900' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isFeatured ? 'translate-x-4 bg-[#55E6D9]' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3 text-center text-slate-400">—</td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditItem?.(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-[#55E6D9] hover:border-slate-900 transition-colors shadow-2xs"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                          title="View Vehicle"
                          className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
