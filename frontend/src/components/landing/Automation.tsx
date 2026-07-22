import { motion } from 'framer-motion';
import { Bot, Bell, MessageSquare, Zap } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { MockupWrapper } from './MockupWrapper';

export function Automation() {
  return (
    <section id="automation" className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              overline="AUTOMATION"
              title="Automate workflows and never miss a lead"
              description="Set up intelligent automation for follow-ups, notifications, and routine tasks. Let DealerFlow handle the busy work while you focus on closing deals."
            />
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Automated lead follow-ups with personalized messaging</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Smart notifications for inventory and pricing changes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Multi-channel communication automation (email, SMS, chat)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3 h-3 text-accent-600" />
                </div>
                <span className="text-neutral-700">Custom workflow triggers and conditional logic</span>
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
                  <h3 className="text-sm font-semibold text-neutral-900">Automation Rules</h3>
                  <button className="text-xs text-primary-600 font-medium">+ Add Rule</button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-sm font-medium text-neutral-900">New Lead Follow-up</span>
                      </div>
                      <div className="w-10 h-5 bg-success rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500">Send personalized email 2 hours after lead creation</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-sm font-medium text-neutral-900">Low Stock Alert</span>
                      </div>
                      <div className="w-10 h-5 bg-success rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500">Notify when stock drops below 3 units</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neutral-300" />
                        <span className="text-sm font-medium text-neutral-900">Price Adjustment</span>
                      </div>
                      <div className="w-10 h-5 bg-neutral-200 rounded-full relative">
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500">Auto-adjust prices based on competitor data</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold">AI Suggestions</span>
                  </div>
                  <p className="text-xs opacity-90">
                    2 new automation patterns detected from your workflow
                  </p>
                </div>
              </div>
            </MockupWrapper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
