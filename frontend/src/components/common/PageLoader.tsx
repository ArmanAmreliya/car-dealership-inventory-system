interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading DealerFlow…' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-50 p-2 shadow-inner ring-1 ring-slate-100">
        <img
          src="/car.gif"
          alt="Loading vehicle data"
          className="h-20 w-20 object-contain"
        />
      </div>
      <p className="text-sm font-semibold text-slate-800 tracking-tight">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Fetching latest dealership inventory</p>
    </div>
  );
}
