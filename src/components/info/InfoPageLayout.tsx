import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen pb-24">
      {/* Header section */}
      <div className="w-full bg-cream-paper border-b border-midnight-ink/10 pt-32 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[800px] mx-auto flex flex-col gap-4">
          <Link to="/" className="text-sm font-bold text-signal-blue hover:underline w-fit mb-4">
            &larr; Back to Home
          </Link>
          <h1 className="font-degular-display text-4xl md:text-5xl font-bold text-midnight-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="font-usual text-lg text-midnight-ink/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Content section */}
      <div className="w-full px-4 sm:px-6 md:px-8 mt-12">
        <div className="max-w-[800px] mx-auto bg-white rounded-2xl border border-midnight-ink/10 p-8 md:p-12 shadow-sm font-usual text-midnight-ink/80 leading-relaxed space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-degular-display text-2xl font-bold text-midnight-ink border-b border-midnight-ink/10 pb-2">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </section>
  );
}
