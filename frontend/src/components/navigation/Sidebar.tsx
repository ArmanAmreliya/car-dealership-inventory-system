/**
 * Sidebar Navigation Component
 *
 * Left navigation panel for authenticated users.
 * Contains links to main dashboard features.
 */

import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
}

interface NavLink {
  label: string;
  href: string;
  icon: string;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Vehicles', href: '/vehicles', icon: '🚗' },
  { label: 'Inventory', href: '/inventory', icon: '📦' },
];

/**
 * Sidebar Component
 *
 * Responsive navigation sidebar with:
 * - Logo / branding
 * - Navigation links with active state
 * - Mobile close callback
 *
 * @param onClose - Callback to close mobile sidebar
 */
export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">DealerFlow</h1>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              isActive(link.href)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2026 DealerFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
