import { HomeHero } from '../components/home/HomeHero';
import { LearningBenefits } from '../components/home/LearningBenefits';
import { FeaturedCourses } from '../components/home/FeaturedCourses';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <HomeHero />
      <div className="w-full mt-24">
        <FeaturedCourses />
      </div>
      <LearningBenefits />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
