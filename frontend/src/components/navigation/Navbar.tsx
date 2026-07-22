import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  pageTitle?: string;
  onMenuClick?: () => void;
  onOpenSearch?: () => void;
}

export function Navbar({ pageTitle, onMenuClick, onOpenSearch }: NavbarProps) {
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
    : 'DF';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 shadow-subtle backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90">
        {/* Left Side: Mobile Hamburger & Page Title / Breadcrumb */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation sidebar"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand Logo for Mobile Header */}
          <div className="flex items-center gap-2 lg:hidden">
            <img src="/car-logo.png" alt="Logo" className="h-7 w-7 object-contain" />
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              DealerFlow
            </span>
          </div>

          {/* Breadcrumb / Page Title */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400 font-medium">
            <span>DealerFlow</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">
              {pageTitle || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Middle: Global Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2 text-sm text-slate-400 shadow-inner hover:border-slate-300 hover:bg-slate-100/80 transition-all dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate text-xs sm:text-sm">Search vehicles, VIN, inventory...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 shadow-subtle dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white shadow-md shadow-teal-500/20">
                {initials}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                  {user?.name || 'Manager'}
                </span>
                <span className="text-[11px] leading-tight text-slate-400 capitalize">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-popover dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Outside Click Overlay for User Menu */}
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

