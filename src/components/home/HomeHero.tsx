import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 bg-canvas text-foreground transition-colors duration-150">
      
      {/* Lighter Shade of Ember Gradient Background (Matching Reference) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Dark Mode: Atmospheric glowing ambient stage gradient */}
        <div className="hidden dark:block absolute inset-0">
          {/* Layer 1: Wide ambient wash across upper screen */}
          <div 
            className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[150%] h-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 65% at 50% 10%, rgba(232, 128, 74, 0.45) 0%, rgba(210, 86, 17, 0.22) 35%, rgba(150, 55, 10, 0.08) 65%, transparent 85%)'
            }}
          />
          {/* Layer 2: Core luminous glow in lighter shade of primary ember (#e8804a / #f58c55) */}
          <div 
            className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-full h-[85%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 55% at 50% 12%, rgba(245, 138, 80, 0.58) 0%, rgba(232, 128, 74, 0.38) 35%, rgba(210, 86, 17, 0.12) 60%, transparent 80%)'
            }}
          />
          {/* Layer 3: Top-center highlight bloom */}
          <div 
            className="absolute -top-[8%] left-1/2 -translate-x-1/2 w-[60%] max-w-[800px] h-[55%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 55% 45% at 50% 10%, rgba(255, 160, 105, 0.42) 0%, rgba(232, 128, 74, 0.2) 45%, transparent 75%)',
              filter: 'blur(28px)'
            }}
          />
        </div>

        {/* Light Mode: Subtle warm lighter-ember radial glow */}
        <div className="block dark:hidden absolute inset-0">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[130%] h-[90%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232, 128, 74, 0.16) 0%, rgba(232, 128, 74, 0.06) 45%, transparent 75%)'
            }}
          />
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] max-w-[750px] h-[45%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245, 138, 80, 0.2) 0%, rgba(232, 128, 74, 0.08) 50%, transparent 80%)',
              filter: 'blur(20px)'
            }}
          />
        </div>
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


