/**
 * LoginLoadingScreen
 *
 * Full-screen animated loading transition shown after a successful login.
 * Displays the car-gif.gif on a rich dark gradient — no white background —
 * so it looks great in both light and dark themes.
 *
 * Usage: render when `isLoading = true`, unmount after navigation.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoginLoadingScreenProps {
  onComplete: () => void;
  /** Delay in ms before triggering onComplete (default 2000) */
  duration?: number;
}

export function LoginLoadingScreen({ onComplete, duration = 2200 }: LoginLoadingScreenProps) {
  const calledRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <motion.div
      key="login-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #0f172a 40%, #0d1f3c 100%)',
      }}
    >
      {/* Radial glow behind the car */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(20,184,166,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Car GIF — mix-blend-mode to kill any white/matte bg from the gif itself */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Soft glow disc */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-8 rounded-full blur-2xl opacity-50"
          style={{ background: 'radial-gradient(ellipse, #14b8a6 0%, transparent 70%)' }}
        />

        {/* car-gif.gif with multiply/screen blend to remove white background */}
        <img
          src="/car-gif.gif"
          alt="Loading DealerFlow…"
          className="relative z-10 h-40 w-auto object-contain select-none"
          style={{
            mixBlendMode: 'screen',   /* removes white matte on dark bg */
            filter: 'drop-shadow(0 8px 32px rgba(20,184,166,0.35)) brightness(1.08)',
          }}
          draggable={false}
        />

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-2.5">
            <img src="/car-logo.png" alt="" className="h-7 w-7 object-contain opacity-90" />
            <span className="text-2xl font-extrabold tracking-tight text-white">DealerFlow</span>
            <span className="rounded-md bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-bold text-teal-400 border border-teal-500/30 uppercase tracking-wider">
              Pro
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Preparing your workspace…</p>
        </motion.div>

        {/* Animated progress bar */}
        <motion.div className="w-48 h-0.5 rounded-full bg-slate-700/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #14b8a6, #6366f1)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
