import React from 'react';

type Variant = 'default' | 'subtle' | 'inline';

interface ActionProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: ActionProps;
  secondaryAction?: ActionProps;
  variant?: Variant;
  className?: string;
}

function DefaultGraphic() {
  return (
    <img
      src="/car-gif.gif"
      alt="DealerFlow Empty State"
      className="h-24 w-auto object-contain drop-shadow-md mb-2"
    />
  );
}

const VARIANT_CLASS: Record<Variant, string> = {
  default: 'rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900/60',
  subtle:  'rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30',
  inline:  '',
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
  icon,
  action,
  secondaryAction,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${VARIANT_CLASS[variant]} ${className}`}
    >
      <div className="mb-3">{icon ?? <DefaultGraphic />}</div>

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
      icon={<DefaultGraphic />}
      title="No vehicles found"
      description="Adjust your search criteria or add a new vehicle to your dealership catalogue."
      action={onAction ? { label: 'Add New Vehicle', onClick: onAction } : undefined}
      className={className}
    />
  );
}

export function EmptyInventory({ className }: { className?: string }) {
  return (
    <EmptyState
      icon={<DefaultGraphic />}
      title="No inventory records"
      description="Inventory records and stock tracking will automatically populate as vehicles are created."
      className={className}
    />
  );
}

export function EmptyPurchases({ onAction, className }: PresetProps) {
  return (
    <EmptyState
      icon={<DefaultGraphic />}
      title="No purchase orders"
      description="Start a purchase workflow to select vehicles and generate official purchase order receipts."
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
      icon={<DefaultGraphic />}
      title={query ? `No matches found for "${query}"` : 'No results found'}
      description="Check for spelling errors or try searching for VIN numbers, manufacturer names, or model years."
      action={onReset ? { label: 'Reset Search', onClick: onReset, variant: 'secondary' } : undefined}
      variant="subtle"
      className={className}
    />
  );
}

