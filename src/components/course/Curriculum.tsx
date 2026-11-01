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
    if (isCompleted) return <CheckCircle2 size={15} className="text-[#3c8254] shrink-0" />;
    switch (type) {
      case 'VIDEO': return <Play size={14} className="text-[#d97757] shrink-0" />;
      case 'TEXT': return <FileText size={14} className="text-[#7b7974] shrink-0" />;
      default: return <FileText size={14} className="text-[#7b7974] shrink-0" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header controls for expanding/collapsing all */}
      <div className="flex items-center justify-between text-xs text-[#7b7974] font-mono px-1">
        <span>{sections.length} Modules · Click any module to view lessons</span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[#d97757] hover:underline cursor-pointer font-medium"
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
            className="border border-[#e7e6e1] bg-[#ffffff] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden transition-all"
          >
            {/* Section Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left bg-[#ffffff] hover:bg-[#efeeeb]/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#d97757] font-semibold bg-[#efeeeb] px-2 py-0.5 rounded">
                    Module {String(sIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#7b7974] font-mono">
                    {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                <h3 className="font-heading text-base sm:text-lg text-[#121212] font-semibold leading-snug">
                  {section.title}
                </h3>
                {('description' in section) && section.description && (
                  <p className="font-body text-xs text-[#7b7974] leading-relaxed mt-0.5">
                    {section.description}
                  </p>
                )}
              </div>

              <ChevronDown 
                className={`w-4 h-4 text-[#7b7974] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#121212]' : ''
                }`}
              />
            </button>
            
            {/* Lessons List */}
            {isOpen && (
              <div className="flex flex-col border-t border-[#e7e6e1] divide-y divide-[#e7e6e1]/70 bg-[#f8f8f6]/50">
                {section.lessons.map((lesson, lIdx) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isActive = lesson.id === activeLessonId;
                  const isClickable = !!onLessonClick;

                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => isClickable && onLessonClick(lesson.id)}
                      className={`flex items-start justify-between gap-3 p-3 sm:px-4 sm:py-3 font-body text-xs transition-colors
                        ${isClickable ? 'cursor-pointer hover:bg-[#efeeeb] group' : ''}
                        ${isActive ? 'bg-[#efeeeb] font-medium text-[#121212]' : 'text-[#373734]'}
                      `}
                    >
                      <div className="flex items-start gap-2.5 grow min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {getIcon(lesson.lessonType, isCompleted)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#121212] group-hover:text-[#000000] truncate text-xs">
                            {sIdx + 1}.{lIdx + 1} {lesson.title}
                          </span>
                          {lesson.description && !isClickable && (
                            <span className="text-[11px] text-[#7b7974] mt-0.5 line-clamp-1">
                              {lesson.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {('durationSeconds' in lesson) && lesson.durationSeconds ? (
                        <span className="text-[11px] font-mono text-[#7b7974] shrink-0 mt-0.5">
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
