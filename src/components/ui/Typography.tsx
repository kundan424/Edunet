import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function DisplayHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h1 className={cn("font-degular-display text-3xl sm:text-4xl lg:text-[42px] leading-tight font-bold text-midnight-ink wrap-break-word", className)}>
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={cn("font-degular-display text-2xl sm:text-3xl leading-snug font-bold text-midnight-ink wrap-break-word", className)}>
      {children}
    </h2>
  );
}

export function BodyText({ children, className, maxWidth = true }: { children: ReactNode, className?: string, maxWidth?: boolean }) {
  return (
    <p className={cn("font-usual text-xs sm:text-sm leading-relaxed font-normal text-midnight-ink", maxWidth && "max-w-[480px]", className)}>
      {children}
    </p>
  );
}
