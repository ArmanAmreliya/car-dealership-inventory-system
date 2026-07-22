import { motion } from 'framer-motion';

const logos = [
  { name: 'AutoNation', color: 'text-neutral-400' },
  { name: 'CarMax', color: 'text-neutral-400' },
  { name: 'Sonic Automotive', color: 'text-neutral-400' },
  { name: 'Lithia Motors', color: 'text-neutral-400' },
  { name: 'Group 1 Automotive', color: 'text-neutral-400' },
  { name: 'Asbury Automotive', color: 'text-neutral-400' },
];

export function TrustedBy() {
  return (
    <section id="trusted" className="py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
            Trusted by dealerships nationwide
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 lg:gap-16"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-center gap-2"
            >
              <div className={`w-8 h-8 rounded bg-neutral-100 ${logo.color} flex items-center justify-center`}>
                <span className="text-xs font-bold">{logo.name.substring(0, 2)}</span>
              </div>
              <span className={`text-lg font-semibold ${logo.color}`}>{logo.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
