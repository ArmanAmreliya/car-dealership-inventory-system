/**
 * VehicleDetailsCard Component — Premium Enterprise Edition
 *
 * Displays a complete, formatted summary of a single vehicle record.
 * Uses a Stripe-inspired card layout with:
 *   - Gradient header with large price badge
 *   - Grid of labelled data fields with subtle backgrounds
 *   - Metadata footer with record ID and timestamps
 */

import { VehicleDTO } from '../../../api/api';

interface VehicleDetailsCardProps {
  vehicle: VehicleDTO;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const formatMileage = (mileage: number): string =>
  `${new Intl.NumberFormat('en-US').format(mileage)} mi`;

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const COLOR_MAP: Record<string, string> = {
  red: '#EF4444', blue: '#3B82F6', black: '#0F172A', white: '#F1F5F9',
  gray: '#94A3B8', grey: '#94A3B8', silver: '#CBD5E1', green: '#22C55E',
  yellow: '#EAB308', orange: '#F97316', purple: '#A855F7', brown: '#92400E',
  gold: '#D97706', beige: '#D4C5A9', navy: '#1E3A5F', maroon: '#7F1D1D',
};

export function VehicleDetailsCard({ vehicle }: VehicleDetailsCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              VIN: <span className="font-mono tracking-wider text-slate-300">{vehicle.vin}</span>
            </p>
          </div>

          <span className="shrink-0 inline-flex items-center rounded-2xl bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 px-5 py-2.5 text-xl font-bold text-emerald-400">
            {formatPrice(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-8">
        <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Vehicle Details</h3>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Make" value={vehicle.make} />
          <DetailField label="Model" value={vehicle.model} />
          <DetailField label="Year" value={String(vehicle.year)} />

          <DetailField
            label="Price"
            value={formatPrice(vehicle.price)}
            valueClassName="text-emerald-600 font-bold"
          />

          {vehicle.mileage !== undefined && vehicle.mileage !== null && (
            <DetailField label="Mileage" value={formatMileage(vehicle.mileage)} />
          )}

          {vehicle.color && (
            <DetailField
              label="Color"
              value={vehicle.color}
              renderValue={(v) => (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                    style={{ background: COLOR_MAP[v.toLowerCase()] ?? '#94A3B8' }}
                  />
                  <span className="capitalize font-semibold">{v}</span>
                </span>
              )}
            />
          )}

          <DetailField
            label="VIN"
            value={vehicle.vin}
            valueClassName="font-mono text-sm tracking-widest"
          />
        </dl>
      </div>

      {/* Metadata footer */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-8 py-5">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Record ID</span>
            <p className="mt-0.5 font-mono text-xs text-slate-500 select-all">{vehicle.id}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Created</span>
            <p className="mt-0.5 text-xs text-slate-600">{formatDate(vehicle.createdAt)}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last Updated</span>
            <p className="mt-0.5 text-xs text-slate-600">{formatDate(vehicle.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Field ─────────────────────────────────────────────────────────────

interface DetailFieldProps {
  label: string;
  value: string;
  valueClassName?: string;
  renderValue?: (value: string) => React.ReactNode;
}

function DetailField({ label, value, valueClassName = '', renderValue }: DetailFieldProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3.5">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</dt>
      <dd className={`text-base font-semibold text-slate-900 ${valueClassName}`}>
        {renderValue ? renderValue(value) : value}
      </dd>
    </div>
  );
}
