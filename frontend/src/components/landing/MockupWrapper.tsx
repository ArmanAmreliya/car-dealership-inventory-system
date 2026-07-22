import React from 'react';
import { motion } from 'framer-motion';

interface MockupWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MockupWrapper({ children, className = '' }: MockupWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`rounded-xl shadow-2xl border border-neutral-200 overflow-hidden bg-neutral-100 ${className}`}
    >
      <div className="bg-neutral-200 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}
