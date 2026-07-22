import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  /** Called when a nav link is clicked on mobile drawer */
  onClose?: () => void;
  /** Collapsed status callback if managed by layout */
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', exact: true, icon: LayoutDashboard },
    ],
  },
  {
    title: 'MANAGEMENT & OPERATIONS',
    items: [
      { label: 'Vehicles', href: '/vehicles', icon: Car },
      { label: 'Inventory', href: '/inventory', icon: Package },
      { label: 'Purchases', href: '/purchases', icon: ShoppingCart },
    ],
  },
];

export function Sidebar({ onClose, isCollapsed: externalCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  // Internal state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    try {
      return localStorage.getItem('dealerflow_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('dealerflow_sidebar_collapsed', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  const isActive = (item: NavItem): boolean => {
    if (item.href === '/dashboard' && location.pathname === '/') return true;
    if (item.exact) return location.pathname === item.href;
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  };

  return (
    <aside
      className={`relative flex h-full flex-col border-r border-slate-800 bg-[#0B0F19] text-slate-300 transition-all duration-300 ${
        isCollapsed ? 'w-[88px]' : 'w-[280px]'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <img
            src="/car-logo.png"
            alt="DealerFlow Logo"
            className="h-9 w-9 shrink-0 object-contain drop-shadow-md"
          />
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                DealerFlow
                <span className="rounded-md bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">
                  PRO
                </span>
              </span>
            </motion.div>
          )}
        </Link>

        {/* Close button for mobile drawer */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Collapse / Expand Toggle Button (Desktop only) */}
      <button
        type="button"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden lg:flex absolute -right-3.5 top-20 z-50 h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-lg hover:bg-slate-800 hover:text-white transition-transform hover:scale-110"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Primary Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {!isCollapsed ? (
              <h3 className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </h3>
            ) : (
              <div className="h-px bg-slate-800/60 my-2" />
            )}

            <ul role="list" className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                        active
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                          active ? 'text-white scale-105' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {/* Tooltip on Collapsed Hover */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 hidden rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-popover group-hover:block z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pro Badge Card (When Expanded) */}
      {!isCollapsed && (
        <div className="mx-3 mb-4 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 p-4 text-xs">
          <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
            <Sparkles className="h-4 w-4" />
            DealerFlow Enterprise
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Trusted by top automotive dealerships worldwide.
          </p>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t border-slate-800/80 px-5 py-4">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <p className="text-xs font-medium text-slate-500">© 2026 DealerFlow Inc.</p>
          ) : (
            <div className="mx-auto h-2 w-2 rounded-full bg-teal-500" />
          )}
        </div>
      </div>
    </aside>
  );
}

