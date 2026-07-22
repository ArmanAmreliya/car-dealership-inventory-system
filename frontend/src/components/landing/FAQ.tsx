import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const faqs = [
  {
    question: 'How long is the free trial?',
    answer: 'We offer a 14-day free trial with full access to all features. No credit card is required to start, and you can cancel at any time.',
  },
  {
    question: 'Can I import my existing inventory?',
    answer: 'Yes, DealerFlow supports CSV and Excel imports. Our team can also assist with migrating data from your current system during onboarding.',
  },
  {
    question: 'What integrations do you support?',
    answer: 'We integrate with popular DMS systems, accounting software, payment processors, and third-party marketplaces. Custom integrations are available for Enterprise plans.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level encryption, regular security audits, and comply with industry data protection standards. Your data is backed up daily.',
  },
  {
    question: 'How does the AI pricing work?',
    answer: 'Our AI analyzes market data, competitor pricing, demand trends, and your historical sales to recommend optimal pricing. You maintain full control and can override suggestions.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate billing adjustments.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about DealerFlow. Can't find your answer? Contact our support team."
          align="center"
        />
        
        <div className="space-y-4 mt-12">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-neutral-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-neutral-900">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-neutral-600 text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
