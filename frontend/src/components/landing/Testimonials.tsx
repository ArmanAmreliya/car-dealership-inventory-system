import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'General Manager, AutoMax Dealers',
    content: 'DealerFlow transformed how we manage our inventory. The AI insights have helped us optimize our stock levels and increase sales by 30% in just three months.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Owner, Chen Automotive Group',
    content: 'The automation features alone save our team 20+ hours per week. We can now focus on what matters most—serving our customers and closing deals.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Operations Director, Premier Cars',
    content: 'Finally, a platform that understands dealership workflows. The analytics dashboard gives us visibility we never had before. Highly recommend.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          overline="TESTIMONIALS"
          title="Trusted by dealerships nationwide"
          description="See how DealerFlow is helping dealerships of all sizes modernize their operations and drive growth."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6 relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-200" />
                {testimonial.content}
              </p>
              <div>
                <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                <div className="text-sm text-neutral-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
