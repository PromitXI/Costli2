import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Features from './Features';
import Pricing from './Pricing';
import SecurityTrust from './SecurityTrust';
import FAQ from './FAQ';
import CTA from './CTA';
import Footer from './Footer';
import Documentation from './Documentation';
import Contact from './Contact';
import Auth from './Auth';
import { CloudProvider } from '../types';

interface HomeProps {
  onResearch: (prompt: string, provider: CloudProvider) => void;
}

const Home: React.FC<HomeProps> = ({ onResearch }) => {
  return (
    <div className="landing-clean relative min-h-screen text-slate-900 selection:bg-black/10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_78%_26%,rgba(255,255,255,0.75),transparent_34%),linear-gradient(180deg,#f7fafc_0%,#eff3f8_52%,#f5f8fc_100%)]" />
      </div>

      <Navbar />
      <Hero onResearch={onResearch} />
      <HowItWorks />
      <Features />
      <Pricing />
      <Documentation />
      <Contact />
      <Auth />
      <SecurityTrust />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
