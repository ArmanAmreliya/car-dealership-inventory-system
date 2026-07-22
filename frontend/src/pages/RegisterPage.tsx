/**
 * Register Page
 *
 * Public route for user registration.
 * Displays registration form and handles post-registration navigation.
 */

import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Car, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 overflow-hidden font-sans">
      {/* Left Panel: Testimonial & Branding */}
      <div className="hidden lg:flex w-[40%] bg-[#1E2D56] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Faint Background Car Watermark */}
        <Car className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-white/5 pointer-events-none select-none rotate-[20deg]" />

        {/* Top: Logo */}
        <Link to="/" className="flex items-center gap-2 group self-start z-10">
          <div className="p-1.5 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 transition-colors">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">DealerFlow</span>
        </Link>

        {/* Middle: Testimonial Quote */}
        <div className="my-auto relative z-10 max-w-sm">
          <span className="text-8xl font-serif text-white/10 absolute -left-6 -top-14 select-none">“</span>
          <p className="text-lg font-medium leading-relaxed italic text-neutral-100">
            "DealerFlow is extremely user friendly. Detailed data for each stock item is all there at the touch of a button."
          </p>
          <div className="mt-8 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-neutral-300">
              AC
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-200">Áine Cantwell</p>
              <p className="text-xs text-neutral-400 font-medium">Trade Cars Ireland</p>
            </div>
          </div>
        </div>

        {/* Bottom footer text */}
        <p className="text-xs text-neutral-400 font-medium relative z-10">
          © 2026 DealerFlow. All rights reserved.
        </p>
      </div>

      {/* Right Panel: Register Form */}
      <div className="flex-1 flex flex-col justify-between bg-white min-h-screen relative p-8 sm:p-12 lg:p-20">
        {/* Mobile-only Logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-blue-600 text-white rounded-lg">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-neutral-900">DealerFlow</span>
          </Link>
        </div>

        {/* Empty placeholder for alignment on desktop */}
        <div className="hidden lg:block"></div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-[380px] space-y-8 my-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Create your account
            </h1>
          </div>

          <RegisterForm onSuccess={handleRegisterSuccess} />

          <p className="text-sm text-neutral-600 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
              Log-In
            </Link>
          </p>
        </div>

        {/* Bottom Badges */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <a href="#appstore" className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-all hover:scale-[1.02] duration-200 shadow-sm w-[136px]">
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.64C13.07 3.41 12.49 4.52 12.64 5.78C13.86 5.87 15.12 5.17 15.97 4.17Z" />
            </svg>
            <div className="text-left leading-none">
              <p className="text-[7.5px] uppercase text-neutral-400 font-medium tracking-wide">Download on the</p>
              <p className="text-[11px] font-semibold mt-0.5">App Store</p>
            </div>
          </a>

          <a href="#googleplay" className="inline-flex items-center gap-2 bg-black text-white px-3.5 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-all hover:scale-[1.02] duration-200 shadow-sm w-[136px]">
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L19.41,12.1L17.87,12.87L16.55,12L17.87,11.33M3,3.15L17.87,10.6L16.55,12L3,3.15M3,20.85L16.55,12L17.87,13.4L3,20.85" />
            </svg>
            <div className="text-left leading-none">
              <p className="text-[7.5px] uppercase text-neutral-400 font-medium tracking-wide">GET IT ON</p>
              <p className="text-[11px] font-semibold mt-0.5">Google Play</p>
            </div>
          </a>
        </div>

        {/* Decorative Floating Help/Chat Button */}
        <button 
          onClick={() => toast.info("Support chat is coming soon!")}
          className="fixed bottom-6 right-6 p-4 bg-[#00C49F] hover:bg-[#00B08F] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 z-50 group"
          aria-label="Support chat"
        >
          <MessageCircle className="w-6 h-6 transition-transform duration-200 group-hover:rotate-6" />
        </button>
      </div>
    </div>
  );
}
