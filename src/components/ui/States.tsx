import { PillButton } from './Button';
import { SectionHeading, BodyText } from './Typography';

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-24 text-foreground bg-transparent">
      <div className="w-10 h-10 border-2 border-rule border-t-ember rounded-full animate-spin mb-6 shrink-0"></div>
      <SectionHeading className="text-xl sm:text-2xl text-center font-medium">{message}</SectionHeading>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: { title?: string, message?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start justify-center p-6 sm:p-8 md:p-12 border border-rule bg-card rounded-[10px] max-w-2xl mx-auto my-8 md:my-12 w-full shadow-none">
      <div className="w-8 h-8 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 shrink-0 font-mono text-xs font-bold">!</div>
      <SectionHeading className="mb-3 text-xl sm:text-2xl break-words w-full font-medium">{title}</SectionHeading>
      {message && <BodyText className="mb-6 w-full break-words text-muted">{message}</BodyText>}
      {onRetry && <PillButton onClick={onRetry} className="w-full sm:w-auto text-center justify-center">Try Again</PillButton>}
    </div>
  );
}

export function EmptyState({ title = "Nothing to see here", message, actionLabel, onAction }: { title?: string, message?: string, actionLabel?: string, onAction?: () => void }) {
  return (
    <div className="flex flex-col items-start p-6 sm:p-8 md:p-12 border border-rule bg-card rounded-[10px] max-w-2xl mx-auto my-8 md:my-12 w-full shadow-none">
      <div className="w-8 h-8 rounded-none bg-wash border border-rule text-ember flex items-center justify-center mb-5 shrink-0 font-mono text-xs">∅</div>
      <SectionHeading className="mb-3 text-xl sm:text-2xl break-words w-full font-medium">{title}</SectionHeading>
      {message && <BodyText className="mb-6 w-full break-words text-muted">{message}</BodyText>}
      {actionLabel && onAction && <PillButton onClick={onAction} className="w-full sm:w-auto text-center justify-center">{actionLabel}</PillButton>}
    </div>
  );
}
