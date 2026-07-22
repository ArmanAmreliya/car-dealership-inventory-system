import { motion } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { MockupWrapper } from './MockupWrapper';

export function Inventory() {
  return (
    <section id="inventory" className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <MockupWrapper>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Vehicle Details</h3>
                  <span className="text-xs text-neutral-500">VIN: 5YJ3E1EA8JF123456</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Make</div>
                    <div className="text-sm font-semibold text-neutral-900">Toyota</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Model</div>
                    <div className="text-sm font-semibold text-neutral-900">Camry</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Year</div>
                    <div className="text-sm font-semibold text-neutral-900">2024</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <div className="text-xs text-neutral-500 mb-1">Price</div>
                    <div className="text-sm font-semibold text-neutral-900">$32,500</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-900">Stock Status</span>
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      Available
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Quantity</span>
                      <span className="font-medium text-neutral-900">5 units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Reserved</span>
                      <span className="font-medium text-neutral-900">2 units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Available</span>
                      <span className="font-medium text-success">3 units</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-semibold">AI Price Insight</span>
                  </div>
                  <p className="text-xs opacity-90">
                    Market analysis suggests optimal price range: $31,000 - $34,000
                  </p>
                </div>
              </div>
            </MockupWrapper>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <SectionHeading
              overline="INVENTORY"
              title="Real-time stock tracking and availability management"
              description="Monitor inventory levels, set automated reorder alerts, and ensure your stock data is always accurate across all channels."
            />
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Track stock quantities in real-time with automatic updates</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Low stock alerts and automated reorder notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Availability status synced across all sales channels</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">AI-powered pricing recommendations based on market data</span>
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
        </div>
      </div>
    </section>
  );
}
