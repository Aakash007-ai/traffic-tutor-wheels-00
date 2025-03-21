import { Button } from '@/components/Button';
import BenefitsSection from '@/components/LandingPage/BenefitsSection';
import CTASection from '@/components/LandingPage/CTASection';
import FeatureSection from '@/components/LandingPage/FeatureSection';
import FloatingCTA from '@/components/LandingPage/FloatingCTA';
import HeroSection from '@/components/LandingPage/HeroSection';
import HowItWorksSection from '@/components/LandingPage/HowItWorksSection';
import { Link } from 'lucide-react';

const Index = () => {
  return (
    <div className='font-nunito bg-[#0f172a] text-white'>
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection />
      <FloatingCTA />
    </div>
  );
};

export default Index;
