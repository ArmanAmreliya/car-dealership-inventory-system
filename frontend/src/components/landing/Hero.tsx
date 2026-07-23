import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';

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

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 80;

export function Hero() {
	const [query, setQuery] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	/** Navigate to a protected route, redirecting through login if needed */
	const goProtected = (path: string) => {
		if (!isAuthenticated) {
			navigate(paths.login, { state: { from: { pathname: path } } });
			return;
		}
		navigate(path);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const trimmed = query.trim();

		// ── Validation ──────────────────────────────────────────────────────
		if (trimmed.length === 0) {
			setError('Please enter a make, model or VIN to search.');
			return;
		}
		if (trimmed.length < MIN_QUERY_LENGTH) {
			setError(`Search must be at least ${MIN_QUERY_LENGTH} characters.`);
			return;
		}
		if (trimmed.length > MAX_QUERY_LENGTH) {
			setError(`Search query is too long (max ${MAX_QUERY_LENGTH} characters).`);
			return;
		}
		if (!/^[a-zA-Z0-9\s\-\/]+$/.test(trimmed)) {
			setError('Only letters, numbers, spaces, hyphens and slashes are allowed.');
			return;
		}

		// ── Auth guard ──────────────────────────────────────────────────────
		const destination = `/vehicles?search=${encodeURIComponent(trimmed)}`;
		goProtected(destination);
	};

	const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		if (error) setError(null); // clear error on typing
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
					className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-white sm:text-xl"
					style={{
						fontFamily: "'Inter', sans-serif",
						textShadow: '0 3px 20px rgba(0, 0, 0, 0.85)',
					}}
				>
					Browse thousands of premium vehicles from trusted dealerships across the country.
				</motion.p>

				{/* ── Search form ─────────────────────────────────────────────── */}
				<motion.div
					custom={0.3}
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="mb-3 w-full max-w-2xl"
				>
					<form
						onSubmit={handleSearch}
						noValidate
						className={`flex w-full items-center overflow-hidden rounded-[24px] border bg-white/90 backdrop-blur-md shadow-[0_24px_70px_rgba(17,17,17,0.18)] transition-all duration-200 ${
							error
								? 'border-rose-400 ring-2 ring-rose-400/30'
								: 'border-white/80 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20'
						}`}
						role="search"
					>
						<label htmlFor="hero-search" className="sr-only">
							Search by make, model or VIN
						</label>
						<input
							id="hero-search"
							type="search"
							value={query}
							onChange={handleQueryChange}
							placeholder="Search by make, model or VIN"
							maxLength={MAX_QUERY_LENGTH}
							aria-invalid={!!error}
							aria-describedby={error ? 'hero-search-error' : undefined}
							className="min-w-0 flex-1 bg-transparent px-6 py-1 text-base font-medium text-[#111111] placeholder-[#6B7280] outline-none"
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
					</form>

					{/* Validation / auth error message */}
					<AnimatePresence>
						{error && (
							<motion.p
								id="hero-search-error"
								role="alert"
								initial={{ opacity: 0, y: -6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								transition={{ duration: 0.18 }}
								className="mt-2.5 flex items-center justify-center gap-1.5 text-sm font-semibold text-rose-600"
								style={{ textShadow: '0 1px 6px rgba(255,255,255,0.9)' }}
							>
								<AlertCircle className="h-4 w-4 shrink-0" />
								{error}
							</motion.p>
						)}
					</AnimatePresence>

					{/* Sign-in nudge for unauthenticated visitors */}
					{!isAuthenticated && !error && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-white/80"
							style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
						>
							<LogIn className="h-3.5 w-3.5 shrink-0" />
							Sign in required to search and browse inventory
						</motion.p>
					)}
				</motion.div>

				{/* ── CTAs ────────────────────────────────────────────────────── */}
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
						onClick={() => goProtected(paths.vehicles)}
						className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(17,17,17,0.28)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#2563EB] active:scale-[0.97]"
						style={{ fontFamily: "'Inter', sans-serif" }}
					>
						<Search className="h-4 w-4" />
						{isAuthenticated ? 'Search' : 'Sign In to Search'}
					</button>
					<button
						id="hero-browse-cta"
						type="button"
						onClick={() => goProtected(paths.vehicles)}
						className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/85 px-8 py-4 text-base font-semibold text-[#111111] shadow-[0_12px_34px_rgba(17,17,17,0.14)] transition-all duration-200 hover:scale-[1.03] hover:bg-white active:scale-[0.97]"
						style={{ fontFamily: "'Inter', sans-serif" }}
					>
						Browse Inventory
						<ArrowRight className="h-4 w-4" />
					</button>
				</motion.div>

				{/* ── Stats ───────────────────────────────────────────────────── */}
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
