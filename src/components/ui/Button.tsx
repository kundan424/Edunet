import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PillButton({ children, className, ...props }: PillButtonProps) {
  return (
    <button
      className={cn(
        "rounded-none border border-action-border bg-action-bg text-action-text",
        "font-sans text-sm font-normal",
        "px-6 py-2.5 sm:px-7 sm:py-3",
        "hover:bg-ember hover:border-ember hover:text-white transition-colors duration-150 ease-in-out cursor-pointer",
        "focus:outline-none focus:ring-1 focus:ring-ember",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostLink({ children, className, href }: { children: ReactNode, className?: string, href?: string }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      className={cn(
        "font-sans text-sm font-medium text-foreground hover:text-ember inline-flex items-center gap-1 group cursor-pointer transition-colors",
        className
      )}
    >
      {children}
      <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
    </Tag>
  );
}
