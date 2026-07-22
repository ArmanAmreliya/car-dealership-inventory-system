/**
 * SelectedVehiclePreview Component
 *
 * Detailed split preview workspace for the currently selected vehicle.
 * Design: High-contrast split panel (Large Image Left / Specifications Right)
 * Clean, modern SaaS aesthetic.
 */

import { motion } from 'framer-motion';
import { VehicleDTO } from '../../../api/api';
import {
  Car,
  ShieldCheck,
  Zap,
  Fuel,
  Gauge,
  Calendar,
  DollarSign,
  Layers,
  FileText,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface SelectedVehiclePreviewProps {
  vehicle: VehicleDTO;
}

export function SelectedVehiclePreview({ vehicle }: SelectedVehiclePreviewProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedMileage = vehicle.mileage
    ? `${vehicle.mileage.toLocaleString()} mi`
    : '0 mi (Factory New)';

  const specs = [
    { label: 'Manufacturer', value: vehicle.make, icon: Car },
    { label: 'Model', value: vehicle.model, icon: Layers },
    { label: 'VIN', value: vehicle.vin, icon: Tag, isMono: true },
    { label: 'Year', value: String(vehicle.year), icon: Calendar },
    { label: 'Mileage', value: formattedMileage, icon: Gauge },
    { label: 'Fuel Type', value: 'Gasoline / Hybrid', icon: Fuel },
    { label: 'Transmission', value: 'Automatic (CVT/8-Speed)', icon: Zap },
    { label: 'Price', value: formattedPrice, icon: DollarSign, isHighlight: true },
    { label: 'Stock Status', value: 'Available in Inventory', icon: ShieldCheck, isBadge: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Left Section: Large Image Preview */}
        <div className="relative lg:col-span-6 bg-slate-900 flex items-center justify-center overflow-hidden min-h-[280px] lg:min-h-full">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <Car className="h-16 w-16 stroke-[1.2] text-slate-600" />
              <span className="mt-2 text-xs font-semibold text-slate-400">High Resolution Asset</span>
            </div>
          )}

          {/* Status Overlay Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-xs font-bold text-white shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Ready for Purchase
          </div>
        </div>

        {/* Right Section: Specifications & Detail Grid */}
        <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Selected Vehicle
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Listing Price</span>
                <p className="text-xl font-bold text-slate-900">{formattedPrice}</p>
              </div>
            </div>

            {/* Spec Matrix Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
              {specs.map((spec) => {
                const IconComponent = spec.icon;
                return (
                  <div key={spec.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <IconComponent className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{spec.label}</span>
                    </div>
                    {spec.isBadge ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <CheckCircle2 className="h-3 w-3" />
                        {spec.value}
                      </span>
                    ) : (
                      <p
                        className={`text-sm font-bold truncate ${
                          spec.isHighlight
                            ? 'text-blue-600'
                            : spec.isMono
                            ? 'font-mono text-slate-700 text-xs'
                            : 'text-slate-800'
                        }`}
                      >
                        {spec.value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Description Note */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-700 mb-1">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>Vehicle Overview</span>
              </div>
              <p className="leading-relaxed text-slate-500">
                Fully inspected {vehicle.year} {vehicle.make} {vehicle.model} ready for instant dealership stock acquisition and sales floor allocation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
