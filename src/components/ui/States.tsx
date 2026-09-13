import { PillButton } from './Button';
import { SectionHeading, BodyText } from './Typography';

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-24 text-midnight-ink">
      <div className="w-12 h-12 border-4 border-midnight-ink border-t-signal-blue rounded-full animate-spin mb-6 shrink-0"></div>
      <SectionHeading className="text-xl sm:text-2xl text-center">{message}</SectionHeading>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: { title?: string, message?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start justify-center p-6 sm:p-8 md:p-16 border-2 border-midnight-ink bg-cream-paper max-w-2xl mx-auto my-8 md:my-12 w-full">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ember-red mb-6 sm:mb-8 shrink-0"></div>
      <SectionHeading className="mb-4 text-2xl sm:text-3xl break-words w-full">{title}</SectionHeading>
      {message && <BodyText className="mb-6 sm:mb-8 w-full break-words">{message}</BodyText>}
      {onRetry && <PillButton onClick={onRetry} className="w-full sm:w-auto text-center justify-center">Try Again</PillButton>}
    </div>
  );
}

export function EmptyState({ title = "Nothing to see here", message, actionLabel, onAction }: { title?: string, message?: string, actionLabel?: string, onAction?: () => void }) {
  return (
    <div className="flex flex-col items-start p-6 sm:p-8 md:p-16 border border-midnight-ink bg-transparent max-w-2xl mx-auto my-8 md:my-12 w-full">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-saffron-yellow mb-6 sm:mb-8 shrink-0"></div>
      <SectionHeading className="mb-4 text-2xl sm:text-3xl break-words w-full">{title}</SectionHeading>
      {message && <BodyText className="mb-6 sm:mb-8 w-full break-words">{message}</BodyText>}
      {actionLabel && onAction && <PillButton onClick={onAction} className="w-full sm:w-auto text-center justify-center">{actionLabel}</PillButton>}
    </div>
  );
}
