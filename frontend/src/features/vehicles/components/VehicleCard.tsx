/**
 * VehicleCard Component — Premium Enterprise Edition
 *
 * Mobile-first card representation of a single vehicle.
 * Uses subtle gradients, micro-animations on hover,
 * and a clean data layout inspired by Linear/Stripe dashboards.
 */

import { useNavigate } from 'react-router-dom';
import { VehicleDTO } from '../../../api/api';
import { paths } from '../../../routes/paths';

interface VehicleCardProps {
  vehicle: VehicleDTO;
  onDeleteRequest: (vehicle: VehicleDTO) => void;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatMileage = (n: number) =>
  `${new Intl.NumberFormat('en-US').format(n)} mi`;

const COLOR_MAP: Record<string, string> = {
  red: '#EF4444', blue: '#3B82F6', black: '#0F172A', white: '#F1F5F9',
  gray: '#94A3B8', grey: '#94A3B8', silver: '#CBD5E1', green: '#22C55E',
  yellow: '#EAB308', orange: '#F97316', purple: '#A855F7', brown: '#92400E',
  gold: '#D97706', beige: '#D4C5A9', navy: '#1E3A5F', maroon: '#7F1D1D',
};

export function VehicleCard({ vehicle, onDeleteRequest }: VehicleCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="p-5">
        {/* Header: Make/Model + Price */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-slate-400 tracking-wider truncate">
              {vehicle.vin}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Year</span>
            <span className="text-sm font-semibold text-slate-800">{vehicle.year}</span>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Color</span>
            {vehicle.color ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
                  style={{ background: COLOR_MAP[vehicle.color.toLowerCase()] ?? '#94A3B8' }}
                />
                <span className="capitalize font-medium">{vehicle.color}</span>
              </span>
            ) : (
              <span className="text-sm text-slate-300">—</span>
            )}
          </div>

          {vehicle.mileage != null && (
            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Mileage</span>
              <span className="text-sm font-semibold text-slate-800">{formatMileage(vehicle.mileage)}</span>
            </div>
          )}

          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Make</span>
            <span className="text-sm font-semibold text-slate-800">{vehicle.make}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(paths.vehicleDetail(vehicle.id))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View
          </button>
          <button
            type="button"
            onClick={() => navigate(paths.vehicleEdit(vehicle.id))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(vehicle)}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
