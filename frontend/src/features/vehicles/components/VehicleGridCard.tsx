/**
 * VehicleGridCard Component
 *
 * Large responsive card with 16:9 vehicle image.
 * Visual-first design with photography dominating the UI.
 * Follows neutral + teal accent design system.
 */

import { useNavigate } from 'react-router-dom';
import { VehicleDTO } from '../../../api/api';
import { paths } from '../../../routes/paths';
import { Eye, Edit, Package } from 'lucide-react';

interface VehicleGridCardProps {
  vehicle: VehicleDTO;
  onEditRequest?: (vehicle: VehicleDTO) => void;
  onInventoryRequest?: (vehicle: VehicleDTO) => void;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatMileage = (n: number) =>
  `${new Intl.NumberFormat('en-US').format(n)} mi`;

export function VehicleGridCard({ vehicle, onEditRequest, onInventoryRequest }: VehicleGridCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-neutral-300">
      {/* 16:9 Vehicle Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100">
            <Package className="h-12 w-12 text-neutral-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur-sm shadow-sm">
            {vehicle.year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header: Make/Model + Price */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-neutral-900 truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-neutral-400 tracking-wider truncate">
              {vehicle.vin}
            </p>
          </div>
          <span className="shrink-0 text-lg font-bold text-accent-600">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
          {vehicle.mileage != null && (
            <span className="font-medium">{formatMileage(vehicle.mileage)}</span>
          )}
          {vehicle.color && (
            <span className="capitalize">{vehicle.color}</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(vehicle.id))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          {onEditRequest && (
            <button
              type="button"
              onClick={() => onEditRequest(vehicle)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-50 px-3 py-2 text-sm font-medium text-accent-700 hover:bg-accent-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
          {onInventoryRequest && (
            <button
              type="button"
              onClick={() => onInventoryRequest(vehicle)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Package className="h-4 w-4" />
              Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
