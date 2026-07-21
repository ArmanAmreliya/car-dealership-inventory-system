/**
 * Navbar Component
 *
 * Top navigation bar — sits above the main content area in DashboardLayout.
 * Renders the mobile/tablet hamburger, an optional search slot, theme toggle
 * slot, and the user avatar dropdown.
 *
 * Breakpoint strategy (matches DashboardLayout):
 *   < lg   → sidebar is hidden; hamburger is visible
 *   ≥ lg   → sidebar is fixed; hamburger is hidden
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header';

interface NavbarProps {
  pageTitle?: string;
  onMenuClick?: () => void;
}

// ── Hamburger icon ─────────────────────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// ── User avatar button ─────────────────────────────────────────────────────

interface AvatarButtonProps {
  initials: string;
  onClick: () => void;
  isOpen: boolean;
}

function AvatarButton({ initials, onClick, isOpen }: AvatarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open user menu"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white ring-2 ring-transparent hover:ring-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all"
    >
      {initials}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * Navbar
 *
 * Renders a 64-px-tall top bar containing:
 *   Left  : hamburger (hidden at lg+) | DealerFlow wordmark (mobile only)
 *   Right : user info snippet (sm+) | avatar + dropdown
 *
 * Followed immediately by the <Header> page-title bar.
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

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <>
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 dark:border-gray-700 dark:bg-gray-800">

        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Hamburger — only visible on mobile / tablet (< lg) */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <HamburgerIcon />
          </button>

          {/* Wordmark — only visible on mobile where the sidebar is hidden */}
          <span className="text-base font-bold tracking-tight text-gray-900 lg:hidden dark:text-white">
            DealerFlow
          </span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* User info snippet — hidden on xs */}
          {user && (
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                {user.name}
              </span>
              <span className="mt-0.5 text-xs leading-none text-gray-400 dark:text-gray-500">
                {user.email}
              </span>
            </div>
          )}

          {/* Avatar + dropdown */}
          <div className="relative">
            <AvatarButton
              initials={initials}
              onClick={() => setUserMenuOpen((o) => !o)}
              isOpen={userMenuOpen}
            />

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {/* User info (shown on mobile where snippet is hidden) */}
                <div className="border-b border-gray-100 px-4 py-3 sm:hidden dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{user?.email}</p>
                </div>

                {/* Role badge */}
                {user?.role && (
                  <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                )}

                {/* Sign out */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-400"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Page title bar ─────────────────────────────────────────────── */}
      <Header title={pageTitle} />

      {/* Close dropdown on outside click */}
      {userMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
