import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_IMAGE = '/bmw-760i-xdrive-2023-07-1652911620.avif';

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
			className="relative flex h-screen min-h-[680px] w-full flex-col items-center justify-center overflow-hidden px-4 pt-[68px]"
			aria-label="Hero section"
		>
			<div className="absolute inset-0 z-0">
				<img
					src={HERO_IMAGE}
					alt="Premium BMW sports car in a luxury showroom"
					className="h-full w-full object-cover object-center brightness-[0.98] saturate-100"
					loading="eager"
					decoding="async"
				/>
				<div className="absolute inset-0 bg-white/10" />
				<div className="absolute inset-0 bg-black/18" />
				<div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(255,255,255,0.28)]" />
			</div>

			<div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
				<motion.h1
					custom={0.1}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="mb-5 text-5xl font-black leading-[1.04] tracking-[-0.04em] text-[#111111] sm:text-6xl lg:text-[72px]"
					style={{ fontFamily: "'Inter', sans-serif" }}
				>
					Find Your Perfect Car
				</motion.h1>

				<motion.p
					custom={0.2}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-[#1F2937] sm:text-xl"
					style={{ fontFamily: "'Inter', sans-serif" }}
				>
					Browse thousands of premium vehicles from trusted dealerships across the country.
				</motion.p>

				<motion.form
					custom={0.3}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					onSubmit={handleSearch}
					className="mb-12 flex w-full max-w-2xl items-center overflow-hidden rounded-[24px] border border-white/80 bg-white/90 backdrop-blur-md shadow-[0_24px_70px_rgba(17,17,17,0.18)]"
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
						className="min-w-0 flex-1 bg-transparent px-6 text-base font-medium text-[#111111] placeholder-[#6B7280] outline-none"
						style={{ fontFamily: "'Inter', sans-serif" }}
						autoComplete="off"
					/>
					<button
						type="submit"
						id="hero-search-btn"
						className="m-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white transition-all duration-200 hover:scale-105 hover:bg-[#2563EB] active:scale-95"
						aria-label="Search vehicles"
					>
						<Search className="h-5 w-5" />
					</button>
				</motion.form>

				<motion.div
					custom={0.4}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="mb-16 flex flex-col items-center gap-4 sm:flex-row"
				>
					<button
						id="hero-search-cta"
						type="button"
						onClick={() => navigate('/vehicles')}
						className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(17,17,17,0.28)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#2563EB] active:scale-[0.97]"
						style={{ fontFamily: "'Inter', sans-serif" }}
					>
						<Search className="h-4 w-4" />
						Search
					</button>
					<button
						id="hero-browse-cta"
						type="button"
						onClick={() => navigate('/vehicles')}
						className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/85 px-8 py-4 text-base font-semibold text-[#111111] shadow-[0_12px_34px_rgba(17,17,17,0.14)] transition-all duration-200 hover:scale-[1.03] hover:bg-white active:scale-[0.97]"
						style={{ fontFamily: "'Inter', sans-serif" }}
					>
						Browse Inventory
						<ArrowRight className="h-4 w-4" />
					</button>
				</motion.div>

				<motion.div
					custom={0.55}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="flex flex-wrap items-center justify-center gap-8 rounded-[24px] border border-white/80 bg-white/60 px-6 py-4 backdrop-blur-sm shadow-[0_20px_60px_rgba(17,17,17,0.12)] sm:gap-14"
				>
					{stats.map((stat, i) => (
						<div
							key={stat.label}
							className={`flex min-w-[120px] flex-col items-center ${
								i > 0 ? 'sm:border-l sm:border-[#111111]/15 sm:pl-14' : ''
							}`}
						>
							<span
								className="text-2xl font-black text-[#111111] sm:text-3xl"
								style={{ fontFamily: "'Inter', sans-serif" }}
							>
								{stat.value}
							</span>
							<span
								className="mt-1 text-sm font-medium text-[#111111]/70"
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
