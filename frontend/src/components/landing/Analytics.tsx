import { motion } from 'framer-motion';
import { LineChart, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { MockupWrapper } from './MockupWrapper';

export function Analytics() {
  return (
    <section id="analytics" className="py-20 lg:py-24 bg-neutral-50">
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
                  <h3 className="text-sm font-semibold text-neutral-900">Performance Dashboard</h3>
                  <select className="text-xs border border-neutral-200 rounded px-2 py-1">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-xs text-neutral-500">Revenue</span>
                    </div>
                    <div className="text-xl font-bold text-neutral-900">$1.2M</div>
                    <div className="text-xs text-success">+23% vs last month</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-primary-600" />
                      <span className="text-xs text-neutral-500">Units Sold</span>
                    </div>
                    <div className="text-xl font-bold text-neutral-900">47</div>
                    <div className="text-xs text-success">+12% vs last month</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-3">
                    <LineChart className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-900">Sales Trend</span>
                  </div>
                  <div className="h-24 flex items-end gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 mt-2">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-3">
                    <PieChart className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-900">Sales by Category</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary-500" />
                      <span className="text-xs text-neutral-600 flex-1">SUVs</span>
                      <span className="text-xs font-medium">42%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-accent-500" />
                      <span className="text-xs text-neutral-600 flex-1">Sedans</span>
                      <span className="text-xs font-medium">31%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-secondary-500" />
                      <span className="text-xs text-neutral-600 flex-1">Trucks</span>
                      <span className="text-xs font-medium">27%</span>
                    </div>
                  </div>
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
              overline="ANALYTICS"
              title="Data-driven insights for smarter decisions"
              description="Transform your dealership data into actionable intelligence with comprehensive dashboards, real-time reporting, and predictive analytics."
            />
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <LineChart className="w-3 h-3 text-secondary-600" />
                </div>
                <span className="text-neutral-700">Real-time sales performance and revenue tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-3 h-3 text-secondary-600" />
                </div>
                <span className="text-neutral-700">Inventory turnover and aging analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PieChart className="w-3 h-3 text-secondary-600" />
                </div>
                <span className="text-neutral-700">Customer segmentation and buying patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-secondary-600" />
                </div>
                <span className="text-neutral-700">Predictive forecasting and trend analysis</span>
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
