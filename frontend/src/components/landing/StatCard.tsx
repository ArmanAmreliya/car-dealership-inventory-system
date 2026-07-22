import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export function StatCard({ value, label, description, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
      )}
      <div className="text-4xl font-bold text-neutral-900 mb-2">{value}</div>
      <div className="text-sm font-semibold text-neutral-700 mb-1">{label}</div>
      {description && (
        <div className="text-xs text-neutral-500">{description}</div>
      )}
    </motion.div>
  );
}
