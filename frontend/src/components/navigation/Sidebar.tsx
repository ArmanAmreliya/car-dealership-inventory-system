/**
 * Sidebar Navigation Component
 *
 * Left navigation panel for authenticated users.
 * Contains links to main dashboard features.
 * Uses SVG icons for cross-platform consistency.
 */

import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  /** Called when a nav link is clicked on mobile (closes the drawer) */
  onClose?: () => void;
}

// ── Nav link definitions ───────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  /** Matches sub-routes too when true */
  exact?: boolean;
  icon: React.ReactNode;
}

function DashboardIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function InventoryIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function PurchasesIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', exact: true,  icon: <DashboardIcon /> },
  { label: 'Vehicles',  href: '/vehicles',                icon: <VehicleIcon /> },
  { label: 'Inventory', href: '/inventory',               icon: <InventoryIcon /> },
  { label: 'Purchases', href: '/purchases',               icon: <PurchasesIcon /> },
];

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Sidebar
 *
 * Fixed-width navigation panel used at lg+ breakpoints.
 * On smaller screens it slides in as a drawer triggered by DashboardLayout.
 *
 * Accessibility:
 *   - nav landmark with aria-label
 *   - aria-current="page" on the active link
 *   - Focus ring on all interactive elements
 */
export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (item: NavItem): boolean => {
    if (item.href === '/dashboard' && location.pathname === '/') return true;
    if (item.exact) return location.pathname === item.href;
    return (
      location.pathname === item.href ||
      location.pathname.startsWith(item.href + '/')
    );
  };

  return (
    <div className="flex h-full flex-col bg-gray-900">

      {/* Brand / logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 px-5">
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <VehicleIcon />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            DealerFlow
          </span>
        </div>

        {/* Close button — visible only when rendered as a drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Primary navigation */}
      <nav
        aria-label="Primary navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul role="list" className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500',
                  ].join(' ')}
                >
                  {/* Icon */}
                  <span
                    className={[
                      'transition-colors',
                      active
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white',
                    ].join(' ')}
                  >
                    {item.icon}
                  </span>

                  {item.label}

                  {/* Active indicator dot */}
                  {active && (
                    <span
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-white opacity-75"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-800 px-5 py-3">
        <p className="text-xs text-gray-500">© 2026 DealerFlow</p>
      </div>
    </div>
  );
}
