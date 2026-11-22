import { CheckCircle2, BookOpen, Clock } from 'lucide-react';

interface TextLessonProps {
  title: string;
  content: string;
  onComplete: () => void;
}

export function TextLesson({ title, content, onComplete }: TextLessonProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Lesson Reading Header */}
      <div className="pb-4 border-b border-rule flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-ember font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reading Lesson &amp; Notes</span>
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-semibold text-foreground leading-snug">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted font-mono mt-0.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Reading Material · Self-Paced Review</span>
        </div>
      </div>

      {/* Lesson Body Text */}
      <div className="bg-wash/50 rounded-[10px] p-6 sm:p-8 border border-rule/80">
        <div className="prose max-w-none text-muted font-body text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>

      {/* Completion Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-rule">
        <span className="text-xs text-muted font-mono">
          Finished reading? Confirm comprehension to update course progress.
        </span>
        
        <button
          type="button"
          onClick={onComplete}
          className="px-5 py-2.5 rounded-[10px] bg-card hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer self-end sm:self-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3c8254]" />
          <span>Mark as Completed</span>
        </button>
      </div>

    </div>
  );
}
