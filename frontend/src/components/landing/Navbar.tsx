import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Inventory', href: '/vehicles' },
  { label: 'Browse', href: '#categories' },
  { label: 'Brands', href: '#brands' },
  { label: 'Services', href: '#why-choose' },
  { label: 'About', href: '#stats' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <nav
        id="main-navbar"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="DealerFlow home"
            >
              <div className="w-10 h-10 rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/car-logo.png"
                  alt=""
                  className="h-8 w-8 object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span
                className={`text-xl font-bold transition-colors duration-200 ${isScrolled ? 'text-[#111111]' : 'text-[#111111]'
                  }`}
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
              >
                DealerFlow
              </span>
            </Link>

            {/* Center nav links — desktop */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  id={`nav-${link.label.toLowerCase()}`}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-[15px] font-medium transition-colors duration-200 hover:text-[#2563EB] ${isScrolled ? 'text-[#111111]' : 'text-[#111111]'
                    }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right CTA — desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                id="nav-login"
                className="px-5 py-2.5 text-[15px] font-semibold text-[#111111] hover:text-[#2563EB] transition-colors duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                id="nav-get-started"
                className="px-5 py-2.5 text-[15px] font-semibold text-white bg-[#111111] hover:bg-[#2563EB] rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="w-6 h-6 text-[#111111]" />
              ) : (
                <Menu className="w-6 h-6 text-[#111111]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[68px] z-40 bg-white overflow-y-auto md:hidden"
          >
            <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between w-full py-4 px-4 rounded-xl text-left text-lg font-semibold text-[#111111] hover:bg-[#F7F7F7] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                  <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                </button>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-4 text-center text-base font-semibold text-[#111111] border border-[#E5E7EB] rounded-xl hover:bg-[#F7F7F7] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-4 text-center text-base font-semibold text-white bg-[#111111] rounded-xl hover:bg-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
