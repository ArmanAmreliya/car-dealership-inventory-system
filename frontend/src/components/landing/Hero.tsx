import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_IMAGE =
  '/bmw-760i-xdrive-2023-07-1652911620.avif';

const stats = [
  { value: '15,000+', label: 'Vehicles' },
  { value: '500+', label: 'Dealerships' },
  { value: '99%', label: 'Customer Satisfaction' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

export function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
    navigate(`/vehicles${params}`);
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[680px] flex flex-col items-center justify-center overflow-hidden px-4 pt-[68px]"
      aria-label="Hero section"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Premium BMW sports car in a luxury showroom"
          className="w-full h-full object-cover object-center brightness-110 saturate-[0.9]"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-white/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.24)_38%,rgba(255,255,255,0.42)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/48 to-transparent" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h1
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-[72px] font-black text-[#050505] leading-[1.04] mb-5"
          style={{
            fontFamily: "'Inter', sans-serif",
            textShadow:
              '0 3px 28px rgba(255,255,255,0.92), 0 1px 1px rgba(255,255,255,0.75)',
          }}
        >
          Find Your Perfect Car
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-[#111111] max-w-xl mb-10 leading-relaxed font-medium"
          style={{
            fontFamily: "'Inter', sans-serif",
            textShadow: '0 2px 18px rgba(255,255,255,0.88)',
          }}
        >
          Browse thousands of premium vehicles from trusted dealerships across the country.
        </motion.p>

        {/* Glass search bar */}
        <motion.form
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex items-center gap-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_24px_70px_rgba(17,17,17,0.18)] border border-white overflow-hidden mb-12"
          role="search"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search by make, model or VIN
          </label>
          <input
            id="hero-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model or VIN"
            className="min-w-0 flex-1 h-16 px-6 bg-transparent text-[#111111] text-base placeholder-[#6B7280] outline-none font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
            autoComplete="off"
          />
          <button
            type="submit"
            id="hero-search-btn"
            className="m-2 h-12 w-12 flex items-center justify-center bg-[#050505] hover:bg-[#2563EB] rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg"
            aria-label="Search vehicles"
          >
            <Search className="w-5 h-5" />
          </button>
        </motion.form>

        {/* CTA buttons */}
        <motion.div
          custom={0.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button
            id="hero-search-cta"
            type="button"
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#050505] text-white text-base font-semibold rounded-xl hover:bg-[#2563EB] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-[0_16px_40px_rgba(17,17,17,0.28)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            id="hero-browse-cta"
            type="button"
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm text-[#111111] text-base font-semibold rounded-xl hover:bg-white border border-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-[0_12px_34px_rgba(17,17,17,0.14)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Browse Inventory
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          custom={0.55}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 rounded-2xl border border-white/80 bg-white/55 px-6 py-4 backdrop-blur-sm shadow-[0_20px_60px_rgba(17,17,17,0.12)]"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex min-w-[120px] flex-col items-center ${
                i > 0 ? 'sm:border-l sm:border-[#111111]/15 sm:pl-14' : ''
              }`}
            >
              <span
                className="text-2xl sm:text-3xl font-black text-[#050505]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.value}
              </span>
              <span
                className="text-sm text-[#111111]/70 mt-1 font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
