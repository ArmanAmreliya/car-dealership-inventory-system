import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Car, FileText, ShoppingBag, Wrench, MessageSquare, Globe, Share2, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
    isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-neutral-200' : 'bg-transparent'
  }`;

  const megaMenuContent = (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white border border-neutral-200 shadow-2xl rounded-b-xl border-t-[3px] border-t-blue-600 z-50 overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-neutral-100 p-5 bg-white">
        {/* Left Column */}
        <div className="space-y-4 pr-4">
          <a href="#vehicles" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Stock Management</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Taxonomy, photo editing & valuations.</p>
            </div>
          </a>

          <a href="#sales" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Sales & Invoicing</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Offers/proposals, eSign & payments.</p>
            </div>
          </a>

          <a href="#checkout" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Checkout & Deal Builder</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Omni-channel sales collaboration.</p>
            </div>
          </a>

          <a href="#reconditioning" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Automotive Reconditioning</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Organise your vehicle preparation.</p>
            </div>
          </a>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pl-4">
          <a href="#communication" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Leads & Communication</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Live chat, SMS, WhatsApp & CRM.</p>
            </div>
          </a>

          <a href="#websites" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Dealership Websites</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Modern, responsive & SEO optimised.</p>
            </div>
          </a>

          <a href="#social" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Social Media Automation</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Post automatically to social networks.</p>
            </div>
          </a>

          <a href="#features-list" className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-neutral-50/85 transition-all duration-200 group">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <List className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">Software Features List</h4>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Complete software feature list.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <nav className={navClasses} aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-neutral-900 flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[20px] bg-white/90 shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/car-logo.png"
                  alt="DealerFlow"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">DealerFlow</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 font-medium">Home</a>
              <div 
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button 
                  className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 font-medium"
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  Features <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                </button>
                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {megaMenuContent}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 font-medium">Pricing</a>
              <a href="#faq" className="text-sm text-neutral-600 hover:text-neutral-900 font-medium">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/register">
                <button className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                  Try Free
                </button>
              </Link>
              <Link to="/login">
                <button className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                  Log-In
                </button>
              </Link>
            </div>
            <button
              className="md:hidden rounded-full p-2 text-neutral-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 bg-white z-40 md:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <a href="#" className="block text-lg text-neutral-900 font-medium">Home</a>
              <div>
                <button className="flex items-center gap-2 text-lg text-neutral-900 w-full text-left font-medium">
                  Features <ChevronDown className="w-5 h-5" />
                </button>
                <div className="ml-4 mt-2 space-y-2 border-l border-neutral-100 pl-4">
                  <a href="#vehicles" className="block text-neutral-600 py-1">Stock Management</a>
                  <a href="#sales" className="block text-neutral-600 py-1">Sales & Invoicing</a>
                  <a href="#checkout" className="block text-neutral-600 py-1">Checkout & Deal Builder</a>
                  <a href="#reconditioning" className="block text-neutral-600 py-1">Automotive Reconditioning</a>
                  <a href="#communication" className="block text-neutral-600 py-1">Leads & Communication</a>
                  <a href="#websites" className="block text-neutral-600 py-1">Dealership Websites</a>
                  <a href="#social" className="block text-neutral-600 py-1">Social Media Automation</a>
                  <a href="#features-list" className="block text-neutral-600 py-1">Software Features List</a>
                </div>
              </div>
              <a href="#pricing" className="block text-lg text-neutral-900 font-medium">Pricing</a>
              <a href="#faq" className="block text-lg text-neutral-900 font-medium">FAQ</a>
              <div className="pt-4 space-y-3">
                <Link to="/register" className="block w-full">
                  <button className="w-full py-3 text-center text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-full transition-all duration-200 shadow-sm">
                    Try Free
                  </button>
                </Link>
                <Link to="/login" className="block w-full">
                  <button className="w-full py-3 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200 shadow-sm">
                    Log-In
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
