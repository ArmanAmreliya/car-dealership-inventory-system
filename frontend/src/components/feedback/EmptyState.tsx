/**
 * EmptyState Component
 *
 * Generic placeholder rendered when a list or data set is empty.
 * Accepts a title, description, icon, and an optional action button.
 * Three visual variants: default (white card), subtle (dashed border), inline.
 *
 * @example
 * ```tsx
 * // Basic
 * <EmptyState title="No vehicles found" description="Try adjusting your filters." />
 *
 * // With action
 * <EmptyState
 *   title="No vehicles yet"
 *   description="Add your first vehicle to get started."
 *   action={{ label: 'Add Vehicle', onClick: () => navigate('/vehicles/new') }}
 * />
 *
 * // Custom icon
 * <EmptyState
 *   icon={<MyIcon />}
 *   title="Nothing here"
 * />
 * ```
 */

import React from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type Variant = 'default' | 'subtle' | 'inline';

interface ActionProps {
  label: string;
  onClick: () => void;
  /** Button variant (default: "primary") */
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  /** Main heading */
  title: string;
  /** Supporting description */
  description?: string;
  /** Custom icon node. A generic box icon is rendered when omitted. */
  icon?: React.ReactNode;
  /** Primary CTA */
  action?: ActionProps;
  /** Secondary CTA (e.g. "Learn more") */
  secondaryAction?: ActionProps;
  /** Visual variant */
  variant?: Variant;
  /** Additional wrapper className */
  className?: string;
}

// ── Default icon ───────────────────────────────────────────────────────────

function DefaultIcon() {
  return (
    <svg
      className="h-12 w-12 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
}

// ── Variant wrapper classes ────────────────────────────────────────────────

const VARIANT_CLASS: Record<Variant, string> = {
  default: 'rounded-lg border border-gray-200 bg-white shadow-sm',
  subtle:  'rounded-lg border border-dashed border-gray-300 bg-white',
  inline:  '',
};

// ── Action button ──────────────────────────────────────────────────────────

function ActionButton({ label, onClick, variant = 'primary' }: ActionProps) {
  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      {label}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * EmptyState
 *
 * Centred content with icon, heading, description and optional CTAs.
 * Designed to drop into any content area: full pages, table bodies,
 * sidebars, and panels.
 */
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
      className={`flex flex-col items-center justify-center px-6 py-14 text-center ${VARIANT_CLASS[variant]} ${className}`}
    >
      {/* Icon */}
      <div className="mb-4">{icon ?? <DefaultIcon />}</div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}

      {/* Actions */}
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

// ── Domain-specific presets ────────────────────────────────────────────────

interface PresetProps {
  onAction?: () => void;
  className?: string;
}

/** Ready-made empty state for the vehicle list */
export function EmptyVehicles({ onAction, className }: PresetProps) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      }
      title="No vehicles found"
      description="Try adjusting your filters or add a new vehicle to get started."
      action={onAction ? { label: 'Add Vehicle', onClick: onAction } : undefined}
      className={className}
    />
  );
}

/** Ready-made empty state for the inventory page */
export function EmptyInventory({ className }: { className?: string }) {
  return (
    <EmptyState
      title="No inventory items"
      description="Inventory records will appear here once vehicles are added."
      className={className}
    />
  );
}

/** Ready-made empty state for the purchases page */
export function EmptyPurchases({ onAction, className }: PresetProps) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      }
      title="No purchases this session"
      description="Completed purchases will be recorded here."
      action={onAction ? { label: 'Make a Purchase', onClick: onAction } : undefined}
      className={className}
    />
  );
}

/** Ready-made empty state for search results */
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
      icon={
        <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try different keywords or clear the search."
      action={onReset ? { label: 'Clear Search', onClick: onReset, variant: 'secondary' } : undefined}
      variant="subtle"
      className={className}
    />
  );
}
