/**
 * Login Page
 *
 * Public route for user authentication.
 * Displays login form and handles post-login navigation.
 */

import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] overflow-hidden font-sans">
      {/* Left Hero Panel: Brand & Animated Car Graphic */}
      <div className="hidden lg:flex w-[45%] bg-[#0B0F19] text-white flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        {/* Top Logo */}
        <Link to="/" className="flex items-center gap-3 group self-start z-10">
          <img src="/car-logo.png" alt="DealerFlow" className="h-9 w-9 object-contain drop-shadow-md" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              DealerFlow
              <span className="rounded-md bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Center: Animated Car GIF & Enterprise Value Prop */}
        <div className="my-auto relative z-10 max-w-md space-y-6">
          <div className="relative flex justify-center">
            <img
              src="/car-gif.gif"
              alt="DealerFlow Animation"
              className="h-44 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="space-y-3 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-400 border border-teal-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted by 10,000+ Automotive Dealerships
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Inventory Management & Real-time Analytics
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Complete stock control, acquisition workflows, and inventory tracking built for high-performance automotive teams.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 font-medium relative z-10">
          © 2026 DealerFlow Systems Inc. All rights reserved.
        </p>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 min-h-screen relative p-8 sm:p-12 lg:p-20">
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/car-logo.png" alt="DealerFlow" className="h-8 w-8 object-contain" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              DealerFlow
            </span>
          </Link>
        </div>

        <div className="hidden lg:block" />

        {/* Login Form Container */}
        <div className="mx-auto w-full max-w-[380px] space-y-8 my-auto">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enter your credentials to access your dealership workspace.
            </p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Don't have a dealership account?{' '}
            <Link to="/register" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        {/* Mobile Badges */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="text-center text-[11px] font-medium text-slate-400">
            DealerFlow Management Platform v2.4
          </div>
        </div>

        {/* Support floating button */}
        <button
          onClick={() => toast.info('Support chat is coming soon!')}
          className="fixed bottom-6 right-6 p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl shadow-popover transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none z-50 group"
          aria-label="Support chat"
        >
          <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:rotate-6" />
        </button>
      </div>
    </div>
  );
}
