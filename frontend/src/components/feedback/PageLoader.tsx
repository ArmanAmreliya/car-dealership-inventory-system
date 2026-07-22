import { Loader } from './Loader';

interface PageLoaderProps {
  label?: string;
  showBrand?: boolean;
  variant?: 'overlay' | 'fullscreen';
  className?: string;
}

export function PageLoader({
  label = 'Loading workspace…',
  showBrand = false,
  variant = 'overlay',
  className = '',
}: PageLoaderProps) {
  const base =
    variant === 'fullscreen'
      ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] text-white'
      : 'absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md dark:bg-slate-950/90';

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={`${base} ${className}`}
    >
      {showBrand && (
        <div className="mb-4 flex items-center gap-2.5">
          <img src="/car-logo.png" alt="DealerFlow" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            DealerFlow
          </span>
        </div>
      )}

      {/* Animated Car GIF */}
      <img
        src="/car-gif.gif"
        alt="Loading..."
        className="h-20 w-auto object-contain drop-shadow-md"
      />

      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {label}
      </p>
    </div>
  );
}

export function AppInitLoader() {
  return (
    <div
      role="status"
      aria-label="Initialising DealerFlow"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] text-white"
    >
      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-3">
        <img src="/car-logo.png" alt="DealerFlow" className="h-10 w-10 object-contain drop-shadow-lg" />
        <span className="text-2xl font-bold tracking-tight text-white font-sans">
          DealerFlow
        </span>
      </div>

      {/* Animated Car GIF */}
      <div className="relative flex flex-col items-center">
        <img
          src="/car-gif.gif"
          alt="Loading application..."
          className="h-28 w-auto object-contain drop-shadow-xl"
        />
        <div className="h-1.5 w-32 rounded-full bg-slate-800 overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-teal-500 to-mint-400 animate-pulse w-3/4" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-wide uppercase text-teal-400">
          Loading workspace...
        </p>
      </div>
    </div>
  );
}

export function RouteLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className="flex min-h-64 flex-col items-center justify-center gap-3 py-16"
    >
      <img src="/car-gif.gif" alt="Loading" className="h-16 w-auto object-contain" />
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

