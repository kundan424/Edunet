import { useRouteError } from 'react-router-dom';
import { SectionHeading, BodyText } from './Typography';
import { PillButton } from './Button';

export function RouteErrorBoundary() {
  const error = useRouteError() as any;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 md:p-24 bg-cream-paper w-full">
      <div className="w-16 h-16 bg-ember-red mb-8 shrink-0 flex items-center justify-center font-bold text-cream-paper text-2xl">!</div>
      <SectionHeading className="mb-4 text-center">Something went wrong</SectionHeading>
      <BodyText className="mb-8 text-center max-w-md">
        {error?.statusText || error?.message || 'An unexpected application error occurred. Please try again or return to the homepage.'}
      </BodyText>
      <PillButton onClick={() => window.location.href = '/'} className="px-8 bg-midnight-ink text-cream-paper hover:bg-signal-blue border-midnight-ink">
        Return Home
      </PillButton>
    </div>
  );
}
