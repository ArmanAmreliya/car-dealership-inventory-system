import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
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

        {/* Center: Animated Car GIF & Testimonial */}
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
              Automotive Commercial Platform
            </span>
            <blockquote className="text-sm font-medium leading-relaxed italic text-slate-300">
              "DealerFlow transformed our multi-location dealership operation with real-time stock control and instant acquisition workflows."
            </blockquote>
            <p className="text-xs font-bold text-teal-400">Áine Cantwell — Trade Cars Ireland</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 font-medium relative z-10">
          © 2026 DealerFlow Systems Inc. All rights reserved.
        </p>
      </div>

      {/* Right Panel: Register Form */}
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

        {/* Form Container */}
        <div className="mx-auto w-full max-w-[380px] space-y-8 my-auto">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Dealership Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Get instant access to inventory control and dealership management tools.
            </p>
          </div>

          <RegisterForm onSuccess={handleRegisterSuccess} />

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {/* Footer info */}
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

