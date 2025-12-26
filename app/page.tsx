import { HeroSection } from '@/components/ui/event/hero-section';
import { ValuePropositionSection } from '@/components/ui/event/value-proposition-section';
import { ExperienceSection } from '@/components/ui/event/experience-section';
import { TargetAudienceSection } from '@/components/ui/event/target-audience-section';
import { PricingSection } from '@/components/ui/event/pricing-section';
import { FinalCTASection } from '@/components/ui/event/final-cta-section';
import { Footer } from '@/components/ui/event/footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ValuePropositionSection />
      <ExperienceSection />
      <TargetAudienceSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
