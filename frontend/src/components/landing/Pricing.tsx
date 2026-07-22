import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';

const plans = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for independent dealers',
    features: [
      'Up to 100 vehicles',
      'Basic inventory management',
      'Standard analytics',
      'Email support',
      '1 user account',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: 249,
    description: 'For growing dealerships',
    features: [
      'Up to 500 vehicles',
      'Advanced inventory tools',
      'AI-powered insights',
      'Priority support',
      '5 user accounts',
      'Custom reports',
      'API access',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 599,
    description: 'For multi-location operations',
    features: [
      'Unlimited vehicles',
      'Full automation suite',
      'Advanced AI & ML',
      'Dedicated account manager',
      'Unlimited users',
      'Custom integrations',
      'White-label options',
      'SLA guarantee',
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="PRICING"
          title="Simple, transparent pricing"
          description="Choose the plan that fits your dealership. All plans include a 14-day free trial with no credit card required."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl p-6 border ${
                plan.popular ? 'border-primary-500 shadow-lg relative' : 'border-neutral-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-neutral-900">${plan.price}</span>
                  <span className="text-neutral-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                size="md"
                className="w-full"
                href="/register"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
