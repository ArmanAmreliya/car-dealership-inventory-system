/**
 * Dashboard Layout Component
 *
 * Main authenticated application shell.
 * Composes Sidebar, Header, and page content area.
 * Provides responsive layout for desktop and mobile.
 */

import { useState } from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

/**
 * DashboardLayout Component
 *
 * Wraps authenticated pages with:
 * - Left sidebar navigation
 * - Top header with title and user info
 * - Main content area
 *
 * @param children - Page content
 * @param pageTitle - Current page title for header
 *
 * @example
 * ```tsx
 * <DashboardLayout pageTitle="Dashboard">
 *   <DashboardPage />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:bg-gray-900">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transition-transform duration-300 ease-in-out transform md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Top navbar */}
        <Navbar
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
