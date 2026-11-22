import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 bg-gradient-to-b from-white via-white to-canvas dark:from-canvas-subtle dark:via-canvas dark:to-canvas text-foreground transition-colors duration-150">
      
      {/* Luminous White Gradient Stage Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top-down white radial highlight for light mode */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[550px] pointer-events-none opacity-90 dark:opacity-0"
          style={{
            background: 'radial-gradient(ellipse 75% 65% at 50% 0%, #ffffff 0%, rgba(255, 255, 255, 0.85) 50%, rgba(240, 242, 245, 0.35) 85%, transparent 100%)'
          }}
        />
        {/* Soft subtle warm accent wash */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] h-[380px] rounded-full pointer-events-none opacity-40 dark:opacity-20"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(210, 86, 17, 0.05) 0%, transparent 80%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Minimal Centered Hero Content */}
        <div className="flex flex-col items-center text-center max-w-[820px] mx-auto">
          
          {/* Top Pill Announcement: "New" badge + text + arrow (No version specification) */}
          <Link
            to="/courses"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-rule/80 bg-white/90 dark:bg-wash text-xs sm:text-sm text-foreground/90 hover:border-ember/40 transition-colors group mb-8 shadow-xs backdrop-blur-xs"
          >
            <span className="bg-ember text-white text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
              New
            </span>
            <span className="font-normal text-muted group-hover:text-foreground transition-colors">
              Interactive worktree sandboxes &amp; verified tracks
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-ember group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Reduced Font-Size Centered Headline with Orange Accent Ending */}
          <h1 className="font-sans font-medium text-3xl sm:text-4xl lg:text-[48px] leading-[1.18] tracking-[-0.025em] text-foreground mb-6">
            The learning platform that builds real engineering craft.{' '}
            <span className="text-ember">Then proves it.</span>
          </h1>

          {/* Minimal Subtitle */}
          <p className="font-sans font-normal text-base sm:text-lg leading-relaxed text-muted max-w-[580px] mb-10">
            Edunet keeps engineering education hands-on, for both modern builders and software teams.
          </p>

          {/* Two Modified CTA Buttons (Pill styling matching blog.png) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary Pill Button: Explore All Courses */}
            <Link
              to="/courses"
              className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-foreground text-canvas font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary Pill Button: View Certifications */}
            <Link
              to="/courses?search=Certificate"
              className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-muted-surface hover:bg-rule/40 border border-rule/80 text-foreground font-medium text-sm sm:text-base flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Award className="w-4 h-4 text-ember" />
              <span>View Certifications</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}


