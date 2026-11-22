import { HomeHero } from '../components/home/HomeHero';
import { PartnerMarquee } from '../components/home/PartnerMarquee';
import { FeaturedCourses } from '../components/home/FeaturedCourses';
import { CapabilityChapters } from '../components/home/CapabilityChapters';
import { CapabilitySelector } from '../components/home/CapabilitySelector';
import { ProofStoriesSection } from '../components/home/ProofStoriesSection';
import { OpenTestimonialSection } from '../components/home/OpenTestimonialSection';
import { SecurityAssuranceSection } from '../components/home/SecurityAssuranceSection';
import { FaqSection } from '../components/home/FaqSection';
import { AtmosphericClosingSection } from '../components/home/AtmosphericClosingSection';

export function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-canvas text-foreground transition-colors duration-150">
      {/* 1. First Screen: Rail-lit product opening with stage lighting & dark window mockup */}
      <HomeHero />

      {/* 2. Monochrome Logo Grid: Institutional Alliances */}
      <PartnerMarquee />

      {/* 3. Featured Courses Catalog: 10px cards, mono tags, burnt orange badges */}
      <FeaturedCourses />

      {/* 4. Alternating Capability Stages: 64px split, 500px measure, 128px spacing */}
      <CapabilityChapters />

      {/* 5. Platform Workflows: Terminal Sandbox, Assessment & Studio */}
      <CapabilitySelector />

      {/* 6. Voices Wall: 3 columns, 16px gap, 0px radius masonry-style proof */}
      <ProofStoriesSection />

      {/* 7. People Editorial: 28px quotation chapter */}
      <OpenTestimonialSection />

      {/* 8. Reassurance Chapter: 3 tiles, 2px radius, technical seal */}
      <SecurityAssuranceSection />

      {/* 9. Split Questions: 1:1.5 ratio, 80px gap, clean ruled rows */}
      <FaqSection />

      {/* 10. Practical Closing Call: 48px statement & 576px Utility Panel with tabs */}
      <AtmosphericClosingSection />
    </div>
  );
}
