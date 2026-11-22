import { Play, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PublicSectionResponse, LessonType } from '../../features/courses/types';
import type { SectionLearningDTO } from '../../features/learning/types';

interface CurriculumProps {
  sections: (PublicSectionResponse | SectionLearningDTO)[];
  completedLessonIds?: string[];
  activeLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
}

export function Curriculum({ sections, completedLessonIds = [], activeLessonId, onLessonClick }: CurriculumProps) {
  // Modules default collapsed (not toggled on)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const allOpen = sections.length > 0 && sections.every(s => Boolean(openSections[s.id]));

  const toggleAll = () => {
    if (allOpen) {
      setOpenSections({});
    } else {
      const all: Record<string, boolean> = {};
      sections.forEach(s => { all[s.id] = true; });
      setOpenSections(all);
    }
  };

  const getIcon = (type: LessonType, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle2 size={14} className="text-[#16A34A] shrink-0" />;
    switch (type) {
      case 'VIDEO': return <Play size={13} className="text-ember shrink-0" />;
      case 'TEXT': return <FileText size={13} className="text-muted shrink-0" />;
      default: return <FileText size={13} className="text-muted shrink-0" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
      {/* Header controls for expanding/collapsing all */}
      <div className="flex items-center justify-between text-xs text-muted font-mono px-1 py-0.5 gap-2">
        <span className="truncate">{sections.length} Academic Modules</span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-ember hover:underline cursor-pointer font-medium shrink-0 whitespace-nowrap text-xs"
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {sections.map((section, sIdx) => {
        const isOpen = Boolean(openSections[section.id]);
        const totalLessons = section.lessons?.length || 0;

        return (
          <div 
            key={section.id} 
            className={`rounded-[8px] border transition-colors overflow-hidden ${
              isOpen 
                ? 'border-rule bg-card shadow-none' 
                : 'border-rule bg-card hover:border-ember/40'
            }`}
          >
            {/* Section Accordion Header (Narrowed down compact module container) */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between text-left bg-card hover:bg-canvas transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1 pr-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ember font-semibold bg-wash px-2 py-0.5 rounded border border-rule shrink-0">
                    Module {String(sIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-muted font-mono shrink-0">
                    {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                <h3 className="font-sans text-[13.5px] sm:text-sm text-foreground font-semibold leading-snug line-clamp-1">
                  {section.title}
                </h3>
                {('description' in section) && section.description && (
                  <p className="font-sans text-[11px] text-muted leading-relaxed line-clamp-2 mt-0.5">
                    {section.description}
                  </p>
                )}
              </div>

              <ChevronDown 
                className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${
                  isOpen ? 'rotate-180 text-foreground' : ''
                }`}
              />
            </button>
            
            {/* Lessons List */}
            {isOpen && (
              <div className="flex flex-col border-t border-rule divide-y divide-rule bg-canvas">

                {section.lessons.map((lesson, lIdx) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isActive = lesson.id === activeLessonId;
                  const isClickable = !!onLessonClick;

                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => isClickable && onLessonClick(lesson.id)}
                      className={`flex items-start justify-between gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 font-sans text-xs transition-colors
                        ${isClickable ? 'cursor-pointer hover:bg-wash/60 group' : ''}
                        ${isActive ? 'bg-wash font-medium text-ember' : 'text-foreground'}
                      `}
                    >
                      <div className="flex items-start gap-2.5 grow min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {getIcon(lesson.lessonType, isCompleted)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground group-hover:text-ember truncate text-xs">
                            {sIdx + 1}.{lIdx + 1} {lesson.title}
                          </span>
                          {lesson.description && !isClickable && (
                            <span className="text-[11px] text-muted mt-0.5 line-clamp-1">
                              {lesson.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {('durationSeconds' in lesson) && lesson.durationSeconds ? (
                        <span className="text-[11px] font-mono text-muted shrink-0 mt-0.5">
                          {formatDuration(lesson.durationSeconds)}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
