/**
 * VehicleSelectionCard Component
 *
 * Premium SaaS vehicle selection card for the purchase gallery grid.
 * Design: Linear / Apple / Stripe aesthetic
 * Features:
 * - 45-55% card height for vehicle image thumbnail
 * - Hover zoom effect on image
 * - Status & Availability badges
 * - Key specs (VIN, Year, Mileage, Price)
 * - Large clickable selection target with clear active focus ring
 */

import { motion } from 'framer-motion';
import { VehicleDTO } from '../../../api/api';
import { Car, CheckCircle, ArrowRight, Gauge, Tag } from 'lucide-react';

interface VehicleSelectionCardProps {
  vehicle: VehicleDTO;
  isSelected: boolean;
  onSelect: (vehicle: VehicleDTO) => void;
}

export function VehicleSelectionCard({
  vehicle,
  isSelected,
  onSelect,
}: VehicleSelectionCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedMileage = vehicle.mileage
    ? `${vehicle.mileage.toLocaleString()} mi`
    : 'New / Low mi';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(vehicle)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg shadow-blue-500/5'
          : 'border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Selection Check Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
          <CheckCircle className="h-4 w-4" />
        </div>
      )}

      {/* Image Container (Approximately 45-55% height) */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100/80">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 bg-slate-50">
            <Car className="h-10 w-10 stroke-[1.5]" />
            <span className="mt-1.5 text-xs font-medium text-slate-400">No Image Available</span>
          </div>
        )}

        {/* Year Pill Overlay */}
        <div className="absolute bottom-3 left-3 rounded-md bg-slate-900/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
          {vehicle.year}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {vehicle.make}
            </span>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {vehicle.model}
            </h3>
          </div>
          <span className="text-base font-bold text-slate-900">{formattedPrice}</span>
        </div>

        {/* Spec Items */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-[11px] text-slate-600 truncate" title={vehicle.vin}>
              {vehicle.vin}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1.5 truncate">
            <Gauge className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-600">{formattedMileage}</span>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="mt-5">
          <button
            type="button"
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80'
            }`}
          >
            {isSelected ? 'Vehicle Selected' : 'Select Vehicle'}
            <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
