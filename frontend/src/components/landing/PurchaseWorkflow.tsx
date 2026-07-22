import { motion } from 'framer-motion';
import { FileText, DollarSign, User, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { MockupWrapper } from './MockupWrapper';

export function PurchaseWorkflow() {
  return (
    <section id="purchases" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              overline="PURCHASE WORKFLOW"
              title="Streamline every deal from inquiry to delivery"
              description="Accelerate your sales process with AI-assisted pricing, automated documentation, and seamless deal management."
            />
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Automated deal documentation and contract generation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">AI-powered pricing and finance recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Customer portal for transparent deal tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Smart deal probability scoring and follow-up automation</span>
              </li>
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="md">
                Learn More
              </Button>
              <Button variant="primary" size="md" href="/register">
                Start Free Trial
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MockupWrapper>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Deal #DF-2024-0847</h3>
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                    In Progress
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Customer</div>
                    <div className="text-sm font-semibold text-neutral-900">John Smith</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Vehicle</div>
                    <div className="text-sm font-semibold text-neutral-900">2024 Camry</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Status</div>
                    <div className="text-sm font-semibold text-accent-600">78% Complete</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-900">Deal Summary</span>
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Vehicle Price</span>
                      <span className="font-medium text-neutral-900">$32,500</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Trade-In</span>
                      <span className="font-medium text-neutral-900">-$8,000</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Down Payment</span>
                      <span className="font-medium text-neutral-900">$5,000</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-semibold">
                      <span className="text-neutral-900">Total Due</span>
                      <span className="text-primary-600">$19,500</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">AI Deal Analysis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs opacity-90">Deal probability: 87%</p>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">High Confidence</span>
                  </div>
                </div>
              </div>
            </MockupWrapper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
