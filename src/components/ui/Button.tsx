import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PillButton({ children, className, ...props }: PillButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full border border-midnight-ink bg-cream-paper text-midnight-ink",
        "font-usual text-[16px] font-bold break-words",
        "px-6 py-3 md:px-[30px] md:py-[14px]",
        "hover:bg-midnight-ink hover:text-cream-paper transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-signal-blue focus:ring-offset-2 focus:ring-offset-cream-paper",
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
        "font-usual text-[16px] font-bold text-midnight-ink inline-flex items-center gap-1 group cursor-pointer",
        className
      )}
    >
      {children}
      <span className="text-xs transition-transform group-hover:translate-x-1">▸</span>
    </Tag>
  );
}
