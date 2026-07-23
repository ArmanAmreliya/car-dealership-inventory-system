import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Edit3, Calendar, Gauge, Tag } from 'lucide-react';
import { VehicleDTO } from '../../../api/api';
import { paths } from '../../../routes/paths';
import { resolveVehicleImage } from '../../../utils/vehicleImage';
import { useIsAdmin } from '../../../hooks/useIsAdmin';

interface VehicleGridCardProps {
  vehicle: VehicleDTO;
  onEditRequest?: (vehicle: VehicleDTO) => void;
  onInventoryRequest?: (vehicle: VehicleDTO) => void;
  onImageGalleryRequest?: (vehicle: VehicleDTO) => void;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatMileage = (n: number) =>
  `${new Intl.NumberFormat('en-US').format(n)} mi`;

/* ── Status badge logic (derived from vehicle data) ───────────── */
type BadgeVariant = 'available' | 'sold' | 'reserved' | 'low-stock' | 'new-arrival';

interface StatusBadge {
  label: string;
  variant: BadgeVariant;
}

function deriveStatusBadge(vehicle: VehicleDTO): StatusBadge {
  // "New Arrival" if created within the last 7 days
  const createdMs = new Date(vehicle.createdAt).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  if (createdMs > sevenDaysAgo) {
    return { label: 'New Arrival', variant: 'new-arrival' };
  }

  // Default: Available
  return { label: 'Available', variant: 'available' };
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  'available': 'bg-emerald-500/90 text-white',
  'sold': 'bg-slate-600/90 text-white',
  'reserved': 'bg-amber-500/90 text-white',
  'low-stock': 'bg-rose-500/90 text-white',
  'new-arrival': 'bg-violet-500/90 text-white',
};

export function VehicleGridCard({
  vehicle,
  onEditRequest,
  onImageGalleryRequest,
}: VehicleGridCardProps) {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [imgLoaded, setImgLoaded] = useState(false);
  const badge = deriveStatusBadge(vehicle);
  const imageUrl = resolveVehicleImage(vehicle);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card hover:border-teal-500/30 transition-all dark:border-slate-800 dark:bg-slate-900/60"
    >
      {/* 16:9 Hero Image Showcase */}
      <div
        className="relative aspect-[16/9] overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onImageGalleryRequest?.(vehicle)}
      >
        <>
          {/* Shimmer skeleton while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]" style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
          )}
          <img
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        </>

        {/* Status Badge (top-left) */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${BADGE_STYLES[badge.variant]}`}>
            {badge.variant === 'new-arrival' && <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            {badge.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
            <Calendar className="h-3 w-3 text-teal-400" />
            {vehicle.year}
          </span>
        </div>

        {/* Price Tag Overlay (bottom-right) */}
        <div className="absolute bottom-3 right-3 z-20">
          <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-teal-500/30">
            {formatPrice(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400 tracking-wider truncate">
            VIN: {vehicle.vin}
          </p>
        </div>

        {/* Key Attributes Bar */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5">
          {vehicle.mileage != null && (
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="h-3.5 w-3.5 text-slate-400" />
              {formatMileage(vehicle.mileage)}
            </span>
          )}
          {vehicle.color && (
            <span className="flex items-center gap-1.5 capitalize font-medium">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              {vehicle.color}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(vehicle.id))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.97] transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            Inspect
          </button>

          {isAdmin && onEditRequest && (
            <button
              type="button"
              onClick={() => onEditRequest(vehicle)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 px-3 py-2.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-[0.97] transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Quick Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
