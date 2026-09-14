import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function DisplayHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h1 className={cn("font-degular-display text-[48px] sm:text-[64px] md:text-[50px] lg:text-20 leading-heading md:leading-display tracking-display font-bold text-midnight-ink wrap-break-word", className)}>
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={cn("font-degular-display text-[32px] sm:text-[40px] md:text-heading-sm leading-[1.2] md:leading-heading-sm tracking-heading-sm font-bold text-midnight-ink wrap-break-word", className)}>
      {children}
    </h2>
  );
}

export function BodyText({ children, className, maxWidth = true }: { children: ReactNode, className?: string, maxWidth?: boolean }) {
  return (
    <p className={cn("font-usual text-caption md:text-body leading-[1.6] md:leading-body font-normal text-midnight-ink", maxWidth && "max-w-[480px]", className)}>
      {children}
    </p>
  );
}
