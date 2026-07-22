import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryItemDTO } from '../types/inventory.types';
import { StockUpdateModal } from './StockUpdateModal';
import { paths } from '../../../routes/paths';
import { getVehicleImage } from '../../../utils/vehicleImage';
import {
  Car,
  Edit,
  Eye,
  ShoppingBag,
  Gauge,
  Tag,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';

interface InventoryCardViewProps {
  items: InventoryItemDTO[];
  isLoading?: boolean;
  onEditItem?: (item: InventoryItemDTO) => void;
}

export function InventoryCardView({ items, isLoading = false, onEditItem }: InventoryCardViewProps) {
  const navigate = useNavigate();
  const [updateModalTarget, setUpdateModalTarget] = useState<InventoryItemDTO | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-2xs"
          >
            <div className="aspect-16/9 w-full rounded-xl bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-10 w-full rounded-xl bg-slate-200/80" />
          </div>
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
        <h3 className="text-base font-bold text-slate-900">No vehicles match your search</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Try resetting your filter parameters or search term to discover vehicles in inventory.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const v = item.vehicle;
            const yearStr = v?.year || (item as any).year || '';
            const makeStr = v?.make || (item as any).make || 'Vehicle';
            const modelStr = v?.model || (item as any).model || '';
            const trimStr = (v as any)?.trim || (item as any).trim || '';
            const titleLabel = `${yearStr} ${makeStr} ${modelStr}`.trim();
            const price = v?.price ?? (item as any).price ?? 0;
            const salePrice = (v as any)?.salePrice || (item as any).salePrice || (price > 0 ? price * 0.92 : 0);
            const mileage = v?.mileage || (item as any).mileage || 0;
            const vinStr = v?.vin || (item as any).vin || item.vehicleId.slice(0, 10);
            const quantity = typeof item.quantity === 'number' ? item.quantity : (item as any).stockQuantity ?? 0;
            const isAvailable = item.available && quantity > 0;
            const imageUrl = getVehicleImage(v || (item as any));

            const formatCurrency = (amt: number) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(amt);

            const rowKey = item.id || item.vehicleId || `card-${index}`;

            return (
              <motion.div
                key={rowKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.25) }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  {/* Dominant 16:9 Vehicle Image */}
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-950">
                    <img
                      src={imageUrl}
                      alt={titleLabel}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                    {/* Left: Mint Status Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                          isAvailable
                            ? 'bg-[#55E6D9] text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-slate-950' : 'bg-slate-400'}`} />
                        {isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </div>

                    {/* Right: Quantity Badge */}
                    <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs border border-white/10">
                      <Package className="h-3 w-3 text-[#55E6D9]" />
                      <span>{quantity} in stock</span>
                    </div>

                    {/* Image Nav Arrows Overlay (Simulated Gallery Nav) */}
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); }}
                        className="rounded-full bg-slate-950/60 p-1 text-white hover:bg-slate-950 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); }}
                        className="rounded-full bg-slate-950/60 p-1 text-white hover:bg-slate-950 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-4 space-y-3">
                    {/* Header: Title & Trim */}
                    <div>
                      <h3 className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
                        {titleLabel}
                      </h3>
                      {trimStr && (
                        <p className="text-xs font-semibold text-slate-500 line-clamp-1">{trimStr}</p>
                      )}
                    </div>

                    {/* Spec Row: Mileage & VIN */}
                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5 font-medium">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{mileage > 0 ? `${mileage.toLocaleString()} mi` : '0 mi'}</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <Tag className="h-3 w-3 text-slate-400 shrink-0" />
                        <span title={vinStr}>{vinStr.slice(0, 10)}...</span>
                      </div>
                    </div>

                    {/* Price Section: Sale Price Bold + Strikethrough Price */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        {salePrice > 0 && salePrice < price && (
                          <span className="text-xs font-medium text-slate-400 line-through mr-2">
                            {formatCurrency(price)}
                          </span>
                        )}
                        <span className="text-base font-black tracking-tight text-slate-950">
                          {price > 0 ? formatCurrency(salePrice > 0 ? salePrice : price) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="border-t border-slate-100 bg-slate-50/60 p-2.5 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditItem?.(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-[#55E6D9] hover:border-slate-900 transition-all shadow-2xs"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpdateModalTarget(item)}
                    title="Stock Quantity"
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    Stock ({quantity})
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                    title="Purchase / View Details"
                    className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(paths.vehicleDetail(item.vehicleId))}
                    title="View Vehicle"
                    className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Stock Quantity Stepper Modal */}
      {updateModalTarget && (
        <StockUpdateModal
          item={updateModalTarget}
          onClose={() => setUpdateModalTarget(null)}
        />
      )}
    </>
  );
}
