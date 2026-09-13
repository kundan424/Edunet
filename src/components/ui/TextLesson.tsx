import { PillButton } from './Button';
import { SectionHeading, BodyText } from './Typography';

interface TextLessonProps {
  title: string;
  content: string; // We map DTO description to content
  onComplete: () => void;
}

export function TextLesson({ title, content, onComplete }: TextLessonProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <SectionHeading className="text-2xl sm:text-3xl border-b border-midnight-ink pb-6">{title}</SectionHeading>
      
      {/* Assuming standard text content for MVP. 
          Future phases could inject a markdown parser or rich text renderer here. */}
      <div className="prose max-w-none">
        <BodyText className="whitespace-pre-wrap">{content}</BodyText>
      </div>
      
      <div className="flex justify-end mt-12 border-t border-midnight-ink pt-8">
        <PillButton onClick={onComplete} className="px-8 bg-signal-blue text-cream-paper border-signal-blue hover:bg-midnight-ink hover:text-cream-paper hover:border-midnight-ink">
          Mark as Completed
        </PillButton>
      </div>
    </div>
  );
}
