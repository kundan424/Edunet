import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function DisplayHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h1 className={cn("font-sans text-3xl sm:text-4xl lg:text-[42px] leading-tight font-medium text-foreground tracking-[-0.025em] wrap-break-word", className)}>
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={cn("font-sans text-2xl sm:text-3xl leading-snug font-medium text-foreground tracking-[-0.025em] wrap-break-word", className)}>
      {children}
    </h2>
  );
}

export function BodyText({ children, className, maxWidth = true }: { children: ReactNode, className?: string, maxWidth?: boolean }) {
  return (
    <p className={cn("font-sans text-sm sm:text-base leading-relaxed font-normal text-muted", maxWidth && "max-w-[500px]", className)}>
      {children}
    </p>
  );
}
