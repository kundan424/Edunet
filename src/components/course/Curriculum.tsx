import { Play, FileText, CheckCircle } from 'lucide-react';
import type { PublicSectionResponse, LessonType } from '../../features/courses/types';
import type { SectionLearningDTO } from '../../features/learning/types';

interface CurriculumProps {
  sections: (PublicSectionResponse | SectionLearningDTO)[];
  completedLessonIds?: string[];
  activeLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
}

export function Curriculum({ sections, completedLessonIds = [], activeLessonId, onLessonClick }: CurriculumProps) {
  const getIcon = (type: LessonType, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle size={18} className="text-signal-blue shrink-0" />;
    switch (type) {
      case 'VIDEO': return <Play size={18} className="opacity-50 shrink-0" />;
      case 'TEXT': return <FileText size={18} className="opacity-50 shrink-0" />;
      default: return <FileText size={18} className="opacity-50 shrink-0" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, sIdx) => (
        <div key={section.id} className="border border-midnight-ink bg-cream-paper flex flex-col">
          <div className="p-4 sm:p-6 border-b border-midnight-ink bg-midnight-ink/5">
            <h3 className="font-degular-display text-xl sm:text-2xl font-bold text-midnight-ink">
              Section {sIdx + 1}: {section.title}
            </h3>
            {('description' in section) && section.description && (
              <p className="font-usual text-sm opacity-80 mt-2">{section.description}</p>
            )}
          </div>
          
          <div className="flex flex-col">
            {section.lessons.map((lesson, lIdx) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isActive = lesson.id === activeLessonId;
              const isClickable = !!onLessonClick;

              return (
                <div 
                  key={lesson.id} 
                  onClick={() => isClickable && onLessonClick(lesson.id)}
                  className={`flex items-start gap-4 p-4 sm:p-6 border-b last:border-b-0 border-midnight-ink font-usual 
                    ${isClickable ? 'cursor-pointer hover:bg-midnight-ink hover:text-cream-paper transition-colors group' : ''}
                    ${isActive ? 'bg-signal-blue text-cream-paper' : ''}
                  `}
                >
                  <div className={`mt-1 ${isActive ? 'text-cream-paper' : 'text-midnight-ink group-hover:text-cream-paper'}`}>
                    {getIcon(lesson.lessonType, isCompleted)}
                  </div>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span className="font-bold text-base sm:text-lg break-words">
                      {lIdx + 1}. {lesson.title}
                    </span>
                    {lesson.description && !isClickable && ( // Only show desc in public view to save space in workspace
                      <span className="text-sm opacity-80 mt-1 line-clamp-2 break-words">
                        {lesson.description}
                      </span>
                    )}
                  </div>
                  {/* PublicLessonResponse has durationSeconds, LessonLearningDTO currently doesn't based on backend DTO */}
                  {('durationSeconds' in lesson) && lesson.durationSeconds ? (
                    <span className="text-xs sm:text-sm font-bold opacity-70 shrink-0 mt-1">
                      {formatDuration(lesson.durationSeconds)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
