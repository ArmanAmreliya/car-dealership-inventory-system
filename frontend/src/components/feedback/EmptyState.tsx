import React from 'react';
import { Car, Package, ShoppingCart, SearchX } from 'lucide-react';

type Variant = 'default' | 'subtle' | 'inline';

interface ActionProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  action?: ActionProps;
  secondaryAction?: ActionProps;
  variant?: Variant;
  className?: string;
}

function DefaultGraphic() {
  return (
    <div className="relative inline-block">
      <img
        src="/car-gif.gif"
        alt="DealerFlow Empty State"
        className="h-24 w-auto object-contain drop-shadow-md mb-2"
      />
    </div>
  );
}

const VARIANT_CLASS: Record<Variant, string> = {
  default: 'rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-card dark:border-slate-800 dark:bg-slate-900/60',
  subtle:  'rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-8 sm:p-12 dark:border-slate-800 dark:bg-slate-900/30',
  inline:  'p-6',
};

function ActionButton({ label, onClick, variant = 'primary' }: ActionProps) {
  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-subtle hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-teal-700 transition-all"
    >
      {label}
    </button>
  );
}

export function EmptyState({
  title,
  description,
  badge,
  icon,
  action,
  secondaryAction,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${VARIANT_CLASS[variant]} ${className}`}
    >
      <div className="relative mb-4 flex flex-col items-center">
        {icon ?? <DefaultGraphic />}
        {badge && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && <ActionButton {...action} />}
          {secondaryAction && (
            <ActionButton {...secondaryAction} variant="secondary" />
          )}
        </div>
      )}
    </div>
  );
}

interface PresetProps {
  onAction?: () => void;
  className?: string;
}

export function EmptyVehicles({ onAction, className }: PresetProps) {
  return (
    <EmptyState
      icon={
        <div className="flex flex-col items-center">
          <img src="/car-gif.gif" alt="Vehicles" className="h-20 w-auto object-contain mb-1" />
        </div>
      }
      badge="🚗 Fleet Showcase"
      title="No vehicles yet"
      description="Your vehicle catalogue is empty. Register a new vehicle with VIN, photos, and specs to populate your fleet."
      action={onAction ? { label: 'Add New Vehicle', onClick: onAction } : undefined}
      className={className}
    />
  );
}

export function EmptyInventory({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/60 dark:border-amber-900/40 mb-2">
            <Package className="h-7 w-7" />
          </div>
          <img src="/car-gif.gif" alt="Inventory" className="h-14 w-auto object-contain opacity-80" />
        </div>
      }
      badge="📦 Stock Control"
      title="No stock records"
      description="Stock records and inventory tracking will automatically synchronize as vehicles are created."
      className={className}
    />
  );
}

export function EmptyPurchases({ onAction, className }: PresetProps) {
  return (
    <EmptyState
      icon={
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200/60 dark:border-emerald-900/40 mb-2">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <img src="/car-gif.gif" alt="Purchases" className="h-14 w-auto object-contain opacity-80" />
        </div>
      }
      badge="🛒 Purchase Orders"
      title="No purchases yet"
      description="Start a purchase workflow to process customer sales and issue official receipts."
      action={onAction ? { label: 'Create Purchase Order', onClick: onAction } : undefined}
      className={className}
    />
  );
}

export function EmptySearchResults({
  query,
  onReset,
  className,
}: {
  query?: string;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<SearchX className="h-10 w-10 text-slate-400 mb-2" />}
      badge="🔍 Search Telemetry"
      title={query ? `No matches found for "${query}"` : 'No results found'}
      description="Check for spelling errors or try searching for VIN numbers, manufacturer names, or model years."
      action={onReset ? { label: 'Reset Search', onClick: onReset, variant: 'secondary' } : undefined}
      variant="subtle"
      className={className}
    />
  );
}
