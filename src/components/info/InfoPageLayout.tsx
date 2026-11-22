import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen pb-24 bg-canvas text-foreground transition-colors duration-150">
      {/* Header section */}
      <div className="w-full bg-card border-b border-rule pt-20 pb-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-[860px] mx-auto flex flex-col gap-3">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-ember hover:underline w-fit mb-2">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="superset-eyebrow">
            <span className="w-1.5 h-1.5 rounded-none bg-ember" />
            <span>DOCUMENTATION &amp; PLATFORM POLICY</span>
          </div>
          <h1 className="font-sans text-3xl md:text-4xl lg:text-[44px] font-medium tracking-[-0.025em] text-foreground leading-[1.15]">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Content section: 10px rounded card, 1px hairline border */}
      <div className="w-full px-4 sm:px-6 md:px-8 mt-10">
        <div className="max-w-[860px] mx-auto bg-card rounded-[10px] border border-rule p-8 md:p-12 shadow-none font-sans text-muted leading-relaxed space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-sans text-xl font-medium text-foreground border-b border-rule pb-2.5 tracking-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-muted font-normal text-sm sm:text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}
