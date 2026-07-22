import { motion } from 'framer-motion';
import { Search, Filter, Car as CarIcon, Tag } from 'lucide-react';
import { Button } from './Button';
import { SectionHeading } from './SectionHeading';
import { MockupWrapper } from './MockupWrapper';

const SHOWCASE_VEHICLES = [
  { make: 'Ford F-150', year: 2024, vin: '10001', price: 30000, status: 'Available', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80' },
  { make: 'Toyota Camry', year: 2024, vin: '10002', price: 35000, status: 'Available', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80' },
  { make: 'BMW 3 Series', year: 2023, vin: '10003', price: 47000, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
  { make: 'Tesla Model 3', year: 2024, vin: '10004', price: 42000, status: 'Available', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80' },
  { make: 'Honda Civic', year: 2023, vin: '10005', price: 28000, status: 'Available', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80' },
  { make: 'Audi A4', year: 2024, vin: '10006', price: 51000, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80' },
];

export function VehicleManagement() {
  return (
    <section id="vehicles" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              overline="VEHICLE MANAGEMENT"
              title="Manage your entire vehicle catalog in one place"
              description="Track, search, and organize your complete inventory with powerful filtering and real-time availability updates."
            />
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Search className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Advanced search by VIN, make, model, year, and price range</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Filter className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Custom filters for availability, mileage, and condition</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CarIcon className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Complete vehicle records with photos and specifications</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Tag className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-neutral-700">Real-time stock status and availability badges</span>
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <div className="h-10 bg-white rounded-lg border border-neutral-200 flex items-center px-3 gap-2">
                      <Search className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-400">Search vehicles...</span>
                    </div>
                  </div>
                  <button className="h-10 px-4 bg-white rounded-lg border border-neutral-200 flex items-center gap-2 text-sm text-neutral-600">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {SHOWCASE_VEHICLES.map((v) => (
                    <div key={v.vin} className="bg-white rounded-lg p-3 border border-neutral-200 shadow-sm group">
                      <div className="aspect-video rounded mb-2 overflow-hidden">
                        <img
                          src={v.img}
                          alt={v.make}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-xs font-semibold text-neutral-900 mb-1">
                        {v.make} {v.year}
                      </div>
                      <div className="text-xs text-neutral-500 mb-2">VIN: {v.vin}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary-600">
                          ${v.price.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          v.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-neutral-500">Showing 6 of 247 vehicles</span>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 rounded bg-primary-600 text-white flex items-center justify-center text-xs">1</div>
                    <div className="w-8 h-8 rounded bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center text-xs">2</div>
                    <div className="w-8 h-8 rounded bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center text-xs">3</div>
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
