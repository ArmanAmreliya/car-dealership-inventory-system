/**
 * Navbar Component
 *
 * Top navigation bar with user menu and logout action.
 * Displays page title and mobile menu toggle.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header';

interface NavbarProps {
  pageTitle?: string;
  onMenuClick?: () => void;
}

/**
 * Navbar Component
 *
 * Top navigation bar with:
 * - Mobile menu toggle
 * - Page title
 * - User menu dropdown
 * - Logout action
 *
 * @param pageTitle - Page title to display in header
 * @param onMenuClick - Callback for mobile menu toggle
 */
export function Navbar({ pageTitle, onMenuClick }: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left side - Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-gray-500 md:hidden"
            aria-label="Toggle menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right side - User menu */}
          <div className="flex items-center gap-4 ml-auto">
            {/* User Info */}
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}

            {/* User Menu Button */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User menu"
              >
                <span className="text-lg font-semibold text-gray-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  {/* Menu Header */}
                  <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header with page title */}
      <Header title={pageTitle} />

      {/* Close dropdown when clicking outside */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
