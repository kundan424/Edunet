import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="pt-12 sm:pt-16 pb-16 lg:pb-24 border-b border-[#e7e6e1] w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Accreditation Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efeeeb] text-[#7b7974] font-body text-xs tracking-wider uppercase mb-5 border border-[#e7e6e1]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] inline-block animate-pulse"></span>
            <span className="font-medium text-[#373734]">Accredited Academic Consortium · Fall 2026 Enrollment</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] text-[#121212] tracking-tight mb-4 font-semibold">
            Learn without limits.
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[#373734] text-sm sm:text-base leading-relaxed max-w-2xl mb-7">
            Lumina partners with foundational research institutions—including <span className="text-[#121212] font-medium">MIT CSAIL</span>, <span className="text-[#121212] font-medium">Stanford AI Lab</span>, <span className="text-[#121212] font-medium">Cambridge Systems Group</span>, and <span className="text-[#121212] font-medium">Max Planck Institute</span>—to deliver verifiable degrees, professional specializations, and audited computing masterclasses.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link 
              to="/courses"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] font-medium text-xs sm:text-sm hover:bg-[#000000] transition-colors shadow-sm"
            >
              Explore Degrees &amp; Certificates
            </Link>
            <Link 
              to="/courses"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] font-medium text-xs sm:text-sm transition-colors border border-[#e7e6e1]"
            >
              <PlayCircle className="w-4 h-4 text-[#d97757]" />
              <span>Try 80+ Free Courses</span>
            </Link>
          </div>

          {/* Hero Trust Bullets */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-[#e7e6e1] w-full max-w-2xl">
            <div>
              <div className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">100%</div>
              <div className="text-[11px] text-[#7b7974] mt-0.5">Online &amp; Self-Paced</div>
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">ECTS / US</div>
              <div className="text-[11px] text-[#7b7974] mt-0.5">Accredited Credits</div>
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl text-[#121212] font-semibold">4.89 / 5</div>
              <div className="text-[11px] text-[#7b7974] mt-0.5">From 142k+ Evaluated Labs</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
