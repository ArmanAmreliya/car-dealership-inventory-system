import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { TrustedBy } from '../components/landing/TrustedBy';
import { Stats } from '../components/landing/Stats';
import { VehicleManagement } from '../components/landing/VehicleManagement';
import { Inventory } from '../components/landing/Inventory';
import { PurchaseWorkflow } from '../components/landing/PurchaseWorkflow';
import { Analytics } from '../components/landing/Analytics';
import { AIFeatures } from '../components/landing/AIFeatures';
import { Automation } from '../components/landing/Automation';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main id="main-content">
        <Hero />
        <TrustedBy />
        <Stats />
        <VehicleManagement />
        <Inventory />
        <PurchaseWorkflow />
        <Analytics />
        <AIFeatures />
        <Automation />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
