import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Car, Package, ShoppingCart } from 'lucide-react';

interface BottomNavItem {
  label: string;
  href: string;
  exact?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', exact: true, icon: LayoutDashboard },
  { label: 'Vehicles', href: '/vehicles', icon: Car },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Purchases', href: '/purchases', icon: ShoppingCart },
];

export function BottomNavigation() {
  const location = useLocation();

  const isActive = (item: BottomNavItem): boolean => {
    if (item.href === '/dashboard' && location.pathname === '/') return true;
    if (item.exact) return location.pathname === item.href;
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-4 left-4 right-4 z-40 lg:hidden pointer-events-auto"
    >
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-popover backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <ul className="flex items-center justify-around">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <li key={item.href} className="relative flex-1">
                <Link
                  to={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-colors ${
                    active
                      ? 'text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 rounded-xl bg-teal-50 dark:bg-teal-950/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="relative z-10 text-[11px] leading-tight">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
