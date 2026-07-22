import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { MockupWrapper } from './MockupWrapper';

const rotatingWords = ['Enterprise', 'Independent', 'Multi-location'];

export function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!mediaQuery.matches) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary-700">Trusted by 500+ dealership professionals</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
              <span className="block">{rotatingWords[currentWordIndex] || 'Enterprise'}</span>
              <span className="block text-primary-600">dealership platform</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-neutral-600 max-w-xl">
              Modernize your dealership operations with AI-powered inventory management, 
              intelligent analytics, and seamless workflow automation.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="group">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
              <Button variant="primary" size="lg" href="/register">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
            
            <motion.a variants={itemVariants} href="#features" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Features <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MockupWrapper className="bg-gradient-to-br from-neutral-50 to-neutral-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">DF</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">Dashboard</div>
                        <div className="text-xs text-neutral-500">Real-time insights</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-medium">
                        AI Active
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-neutral-900">247</div>
                      <div className="text-xs text-neutral-500">Vehicles</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-accent-600">12</div>
                      <div className="text-xs text-neutral-500">Low Stock</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-primary-600">$1.2M</div>
                      <div className="text-xs text-neutral-500">Inventory Value</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-900">Recent Activity</span>
                      <span className="text-xs text-neutral-500">Last 24h</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span className="text-neutral-600">Vehicle added: 2024 Toyota Camry</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-2 h-2 bg-accent-500 rounded-full" />
                        <span className="text-neutral-600">AI suggestion: Price adjustment for Ford F-150</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="text-neutral-600">Purchase completed: VIN 5YJ3E1</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-xs">✨</span>
                      </div>
                      <span className="text-sm font-semibold">AI Insight</span>
                    </div>
                    <p className="text-xs opacity-90">
                      Based on market trends, consider increasing stock of SUVs by 15% this quarter.
                    </p>
                  </div>
                </div>
              </MockupWrapper>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                  <span className="text-accent-600">📈</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">+23%</div>
                  <div className="text-xs text-neutral-500">Sales this month</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600">⚡</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">40% faster</div>
                  <div className="text-xs text-neutral-500">Deal processing</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
