import { HomeHero } from '../components/home/HomeHero';
import { PartnerMarquee } from '../components/home/PartnerMarquee';
import { FeaturedCourses } from '../components/home/FeaturedCourses';
import { LearningBenefits } from '../components/home/LearningBenefits';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { EnterpriseSection } from '../components/home/EnterpriseSection';
import { FaqSection } from '../components/home/FaqSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-bone-parchment">
      {/* 2. Hero Section (Coursera + Lumina Warm Editorial) */}
      <HomeHero />

      {/* 3. Institutional Partner Marquee */}
      <PartnerMarquee />

      {/* 4. Degree & Professional Certificate Catalog Pathways */}
      <FeaturedCourses />

      {/* 5. Goal-Oriented Learning Tracks (Outcome Framework) */}
      <LearningBenefits />

      {/* 6. Learner Testimonials & Alumni Stories */}
      <TestimonialsSection />

      {/* 7. Enterprise & Academic Standards Band */}
      <EnterpriseSection />

      {/* 8. Frequently Addressed Questions Accordion */}
      <FaqSection />

      {/* 9. Final Dispatch CTA Card */}
      <FinalCtaSection />
    </div>
  );
}
