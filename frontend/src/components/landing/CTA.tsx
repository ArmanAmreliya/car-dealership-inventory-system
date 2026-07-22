import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function CTA() {
  return (
    <section id="cta" className="py-20 lg:py-24 bg-gradient-to-br from-neutral-900 to-primary-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to modernize your dealership?
          </h2>
          <p className="text-lg lg:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Start your free trial today — no credit card required. See why 500+ dealerships trust DealerFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" href="/register">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="inverse" size="lg" href="#">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
