/**
 * Header Component
 *
 * Page-level sub-header that shows the current page title and
 * an optional breadcrumb trail.
 *
 * Placed immediately below the Navbar inside the main content column.
 * Auto-generates a title from the current route when none is provided.
 */

import { useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  /** Explicit page title — falls back to route-derived title */
  title?: string;
  /** Optional breadcrumb items rendered before the title */
  breadcrumbs?: { label: string; href?: string }[];
}

/** Map of known route segments → display names */
const ROUTE_LABELS: Record<string, string> = {
  dashboard:  'Dashboard',
  vehicles:   'Vehicles',
  inventory:  'Inventory',
  purchases:  'Purchases',
  new:        'New',
  edit:       'Edit',
};

function deriveTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length || segments[0] === 'dashboard') return 'Dashboard';
  const last = segments[segments.length - 1];
  return ROUTE_LABELS[last] ?? (last.charAt(0).toUpperCase() + last.slice(1));
}

/**
 * Header
 *
 * Renders a slim page-title bar with optional breadcrumb navigation.
 * The title is visually lighter than an h1 to keep visual hierarchy clear
 * while still being semantically meaningful.
 */
export function Header({ title, breadcrumbs }: HeaderProps) {
  const location = useLocation();
  const pageTitle = title ?? deriveTitle(location.pathname);

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-1">
          <ol className="flex items-center gap-1.5 text-xs text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-gray-600 transition-colors dark:hover:text-gray-200"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Page title */}
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
        {pageTitle}
      </h1>
    </div>
  );
}
