import { motion } from 'framer-motion';
import { Brain, Target, Zap, FileText, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';

const aiFeatures = [
  {
    icon: Brain,
    title: 'Smart Stock Prediction',
    description: 'AI analyzes market trends and historical data to predict optimal inventory levels.',
  },
  {
    icon: Target,
    title: 'Dynamic Pricing Engine',
    description: 'Automatically adjust prices based on demand, competition, and market conditions.',
  },
  {
    icon: Zap,
    title: 'Lead Scoring',
    description: 'Prioritize leads with AI-powered probability scoring and follow-up recommendations.',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description: 'Generate comprehensive reports with AI-driven insights and recommendations.',
  },
];

export function AIFeatures() {
  return (
    <section id="ai" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="ARTIFICIAL INTELLIGENCE"
          title="AI that understands your dealership"
          description="Leverage machine learning to optimize inventory, pricing, and customer engagement with DealerFlow's intelligent automation."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="primary" size="lg" href="/register">
            Explore AI Features
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
