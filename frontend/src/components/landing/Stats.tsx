import { StatCard } from './StatCard';
import { Car, Zap, TrendingUp, HeadphonesIcon } from 'lucide-react';

const stats = [
  {
    value: '50,000+',
    label: 'Vehicles Managed',
    description: 'Across our dealer network',
    icon: Car,
  },
  {
    value: '99.9%',
    label: 'Platform Uptime',
    description: 'Enterprise-grade reliability',
    icon: Zap,
  },
  {
    value: '40%',
    label: 'Time Saved',
    description: 'On average operations',
    icon: TrendingUp,
  },
  {
    value: '24/7',
    label: 'Expert Support',
    description: 'Always available to help',
    icon: HeadphonesIcon,
  },
];

export function Stats() {
  return (
    <section id="stats" className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
