/**
 * DashboardLayout Component
 *
 * Main authenticated application shell.
 *
 * Breakpoint strategy:
 *   < lg   (mobile / tablet)
 *     – Sidebar is off-screen; a full-height drawer slides in over a backdrop
 *       when the user taps the hamburger in the Navbar.
 *   ≥ lg   (desktop)
 *     – Sidebar is fixed on the left (w-64). The main content column has
 *       ml-64 so it never slides under the sidebar.
 *
 * Why lg instead of md?
 *   768 px (md) is a common tablet portrait width. Showing a 256 px fixed
 *   sidebar at that width leaves only 512 px for content — too cramped for
 *   data-heavy pages. Using lg (1024 px) gives the sidebar room to breathe
 *   and keeps the tablet experience clean.
 *
 * Accessibility:
 *   – skip-to-content anchor rendered before all navigation.
 *   – Backdrop has aria-hidden="true"; it is a visual affordance only.
 *   – Mobile sidebar uses aria-modal="true" and is labelled.
 *   – Body scroll is locked while the mobile drawer is open.
 */

import { useState, useEffect } from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';
import { SkipToContent } from '../components/accessibility/SkipToContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Close the drawer when the viewport grows past the lg breakpoint
  // (avoids leaving an open drawer when the user rotates to landscape)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* ── Accessibility: skip link ──────────────────────────────────── */}
      <SkipToContent targetId="main-content" />

      {/* ── Desktop sidebar (fixed, always visible at lg+) ───────────── */}
      <aside
        aria-label="Main navigation"
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col"
      >
        <Sidebar />
      </aside>

      {/* ── Mobile / tablet drawer overlay ───────────────────────────── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={[
          'fixed inset-0 z-30 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={closeSidebar}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation sidebar"
        className={[
          'fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw]',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* ── Main content column ───────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">

        {/* Sticky top navbar */}
        <Navbar
          pageTitle={pageTitle}
          onMenuClick={toggleSidebar}
        />

        {/* Scrollable page content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
