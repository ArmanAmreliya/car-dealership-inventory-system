/**
 * VehicleTable Component — Premium Enterprise Edition
 *
 * A Linear/Stripe-inspired data table for the vehicle list.
 * Features:
 *   - Sortable column headers with animated sort indicators
 *   - Shimmer skeleton loading state
 *   - Glassmorphism-lite empty state
 *   - Responsive: table on md+, card grid on mobile
 *   - Micro-interactions on row hover
 */

import { useState } from 'react';
import { VehicleDTO } from '../../../api/api';
import { VehicleActions } from './VehicleActions';
import { VehicleCard } from './VehicleCard';

const SKELETON_ROWS = 6;

type SortField = 'make' | 'model' | 'year' | 'price';
type SortDir = 'asc' | 'desc';

interface VehicleTableProps {
  vehicles: VehicleDTO[];
  isLoading?: boolean;
  onDeleteRequest: (vehicle: VehicleDTO) => void;
}

// ── Shimmer Skeleton Row ─────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[96, 120, 80, 56, 72, 80, 64].map((w, i) => (
        <td key={i} className="px-5 py-4 whitespace-nowrap">
          <div
            className="h-3.5 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 ring-8 ring-blue-50/60">
            <svg
              className="h-8 w-8 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No vehicles found</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            No vehicles match your current filters. Try adjusting your search or clear filters to see all vehicles.
          </p>
        </div>
      </td>
    </tr>
  );
}

// ── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField; dir: SortDir }) {
  const isActive = field === activeField;
  return (
    <svg
      className={`ml-1.5 inline-block h-3.5 w-3.5 transition-all ${isActive ? 'text-blue-600' : 'text-slate-300'}`}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      {isActive && dir === 'asc' ? (
        <path d="M8 4l4 8H4l4-8z" />
      ) : isActive && dir === 'desc' ? (
        <path d="M8 12l-4-8h8l-4 8z" />
      ) : (
        <>
          <path d="M7 4l-3 5h6L7 4z" opacity={0.4} />
          <path d="M9 12l3-5H6l3 5z" opacity={0.4} />
        </>
      )}
    </svg>
  );
}

// ── Formatters ───────────────────────────────────────────────────────────────

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const formatMileage = (n: number) =>
  `${new Intl.NumberFormat('en-US').format(n)} mi`;

// ── Column Header ────────────────────────────────────────────────────────────

interface ColHeaderProps {
  label: string;
  field?: SortField;
  activeField: SortField;
  dir: SortDir;
  onSort?: (f: SortField) => void;
  align?: 'left' | 'right';
}

function ColHeader({ label, field, activeField, dir, onSort, align = 'left' }: ColHeaderProps) {
  const isActive = field === activeField;
  return (
    <th
      scope="col"
      className={`px-5 py-3.5 text-${align} text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'} ${field ? 'cursor-pointer select-none hover:text-slate-600 transition-colors' : ''}`}
      onClick={() => field && onSort?.(field)}
    >
      {label}
      {field && <SortIcon field={field} activeField={activeField} dir={dir} />}
    </th>
  );
}

// ── Color Dot ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  red: '#EF4444', blue: '#3B82F6', black: '#0F172A', white: '#F1F5F9',
  gray: '#94A3B8', grey: '#94A3B8', silver: '#CBD5E1', green: '#22C55E',
  yellow: '#EAB308', orange: '#F97316', purple: '#A855F7', brown: '#92400E',
  gold: '#D97706', beige: '#D4C5A9', navy: '#1E3A5F', maroon: '#7F1D1D',
};

function ColorDot({ color }: { color: string }) {
  const bg = COLOR_MAP[color.toLowerCase()] ?? '#94A3B8';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full border border-white shadow-sm ring-1 ring-slate-200" style={{ background: bg }} />
      <span className="capitalize">{color}</span>
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function VehicleTable({ vehicles, isLoading = false, onDeleteRequest }: VehicleTableProps) {
  const [sortField, setSortField] = useState<SortField>('make');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...vehicles].sort((a, b) => {
    let av: string | number = a[sortField];
    let bv: string | number = b[sortField];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // ── Mobile card grid ──────────────────────────────────────────────────────
  const mobileView = (
    <div className="md:hidden space-y-3">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded-full bg-slate-200" />
                <div className="h-3 w-28 rounded-full bg-slate-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2.5 w-12 rounded-full bg-slate-200" />
                  <div className="h-4 w-20 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
            <svg className="h-7 w-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or add a new vehicle.</p>
        </div>
      ) : (
        vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} onDeleteRequest={onDeleteRequest} />)
      )}
    </div>
  );

  // ── Desktop table ─────────────────────────────────────────────────────────
  const desktopTable = (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <ColHeader label="VIN" activeField={sortField} dir={sortDir} />
              <ColHeader label="Make" field="make" activeField={sortField} dir={sortDir} onSort={handleSort} />
              <ColHeader label="Model" field="model" activeField={sortField} dir={sortDir} onSort={handleSort} />
              <ColHeader label="Year" field="year" activeField={sortField} dir={sortDir} onSort={handleSort} />
              <ColHeader label="Price" field="price" activeField={sortField} dir={sortDir} onSort={handleSort} align="right" />
              <ColHeader label="Color / Mileage" activeField={sortField} dir={sortDir} />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => <SkeletonRow key={i} />)
            ) : sorted.length === 0 ? (
              <EmptyState />
            ) : (
              sorted.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="group border-b border-slate-50 transition-all duration-150 hover:bg-blue-50/30"
                >
                  {/* VIN */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md tracking-wider">
                      {vehicle.vin}
                    </span>
                  </td>

                  {/* Make */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 text-sm">{vehicle.make}</span>
                  </td>

                  {/* Model */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-slate-700 text-sm">{vehicle.model}</span>
                  </td>

                  {/* Year */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {vehicle.year}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-emerald-600">
                      {formatPrice(vehicle.price)}
                    </span>
                  </td>

                  {/* Color / Mileage */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {vehicle.color ? (
                        <span className="text-xs text-slate-600">
                          <ColorDot color={vehicle.color} />
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                      {vehicle.mileage != null && (
                        <span className="text-xs text-slate-400">{formatMileage(vehicle.mileage)}</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <VehicleActions vehicle={vehicle} onDeleteRequest={onDeleteRequest} compact />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!isLoading && sorted.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{sorted.length}</span> vehicle{sorted.length !== 1 ? 's' : ''}
            {sortField && (
              <> · Sorted by <span className="font-semibold text-slate-600 capitalize">{sortField}</span> ({sortDir})</>
            )}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopTable}
    </>
  );
}
