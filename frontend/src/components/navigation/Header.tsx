/**
 * Header Component
 *
 * Top header bar displaying page title and location information.
 * Placed below the navbar.
 */

import { useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

/**
 * Header Component
 *
 * Displays the current page title and breadcrumbs.
 * Auto-generates title from route if not provided.
 *
 * @param title - Optional custom page title
 */
export function Header({ title }: HeaderProps) {
  const location = useLocation();

  // Generate title from route pathname
  const getPageTitle = () => {
    if (title) return title;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (!pathSegments.length || pathSegments[0] === 'dashboard') {
      return 'Dashboard';
    }

    const segment = pathSegments[0];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {getPageTitle()}
      </h2>
    </div>
  );
}
