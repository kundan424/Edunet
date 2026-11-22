import React, { useState } from 'react';
import type { SectionCurriculumResponse } from '../../features/instructor/types';
import { useCreateSection } from '../../features/instructor/queries';
import { SectionEditor } from './SectionEditor';
import {
  Folder,
  Play,
  Clock,
  Award,
  Plus,
  ChevronsUpDown,
  ChevronsDownUp,
  MoveVertical,
  Info,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface Props {
  courseId: string;
  sections: SectionCurriculumResponse[];
  isEditable: boolean;
  onOpenBasicInfo?: () => void;
}

export function CurriculumBuilder({ courseId, sections, isEditable, onOpenBasicInfo }: Props) {
  const createSection = useCreateSection(courseId);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [forceExpanded, setForceExpanded] = useState<boolean | undefined>(undefined);
  const [reorderMode, setReorderMode] = useState(false);

  // Compute aggregate metrics
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalSeconds = sections.reduce((acc, s) => {
    return acc + s.lessons.reduce((lAcc, l) => lAcc + (l.durationSeconds || 0), 0);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const runtimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes || totalLessons * 15}m`;

  const assessmentsCount = sections.reduce((acc, s) => {
    return acc + s.lessons.filter(l => l.lessonType === 'QUIZ' || l.lessonType === 'ASSIGNMENT').length;
  }, 0);

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createSection.mutate(
      { title: newTitle.trim(), displayOrder: sections.length },
      {
        onSuccess: () => {
          setNewTitle('');
          setIsAdding(false);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Top Overview Stats & Quick Actions Bar ── */}
      <div className="bg-card rounded-[10px] p-4 sm:p-5 border border-rule shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Stat Pills with Hairline Separation */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-wash text-foreground">
            <Folder className="w-4 h-4 text-muted" />
            <span className="font-body text-xs sm:text-sm font-semibold">{sections.length}</span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Sections</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-wash text-foreground">
            <Play className="w-4 h-4 text-muted" />
            <span className="font-body text-xs sm:text-sm font-semibold">{totalLessons}</span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Lessons Total</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-wash text-foreground">
            <Clock className="w-4 h-4 text-muted" />
            <span className="font-body text-xs sm:text-sm font-semibold">{runtimeStr}</span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Runtime</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-wash text-foreground">
            <Award className="w-4 h-4 text-ember" />
            <span className="font-body text-xs sm:text-sm font-semibold">{assessmentsCount}</span>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Assessments</span>
          </div>
        </div>

        {/* Global Builder Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setForceExpanded(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-wash text-muted font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
            <span>Expand All</span>
          </button>

          <button
            type="button"
            onClick={() => setForceExpanded(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-wash text-muted font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ChevronsDownUp className="w-3.5 h-3.5" />
            <span>Collapse All</span>
          </button>

          <button
            type="button"
            onClick={() => setReorderMode(!reorderMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              reorderMode ? 'bg-card text-[#f8f8f6]' : 'hover:bg-wash text-muted'
            }`}
          >
            <MoveVertical className="w-3.5 h-3.5" />
            <span>Reorder Mode</span>
          </button>

          {isEditable && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card hover:bg-black text-[#f8f8f6] font-body text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Section</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Course Overview Banner ── */}
      <div className="bg-wash/70 rounded-[10px] p-4 border border-rule flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-card border border-rule flex items-center justify-center text-ember shadow-xs shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
            <span className="font-semibold text-foreground">Curriculum Standard:</span> Structure each section with video lectures, reading notes, and quizzes or assignments to test student understanding.
          </p>
        </div>

        {onOpenBasicInfo && (
          <button
            type="button"
            onClick={onOpenBasicInfo}
            className="text-xs font-mono uppercase tracking-wider text-ember hover:underline shrink-0 font-semibold cursor-pointer hidden sm:flex items-center gap-1"
          >
            <span>Review Course Metadata</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Vertical Section Stack ── */}
      <div className="flex flex-col gap-5">
        {sections.map((sectionData, index) => (
          <SectionEditor
            key={sectionData.section.id}
            courseId={courseId}
            sectionData={sectionData}
            isEditable={isEditable}
            index={index}
            forceExpanded={forceExpanded}
          />
        ))}

        {/* ── Empty State Showcase ── */}
        {sections.length === 0 && !isAdding && (
          <div className="p-10 rounded-[10px] border-2 border-dashed border-rule bg-card flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-wash flex items-center justify-center text-muted">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <span className="font-sans text-lg sm:text-xl text-foreground">No Curriculum Added Yet</span>
              <p className="font-body text-xs text-muted leading-relaxed">
                Add your first course section (e.g., Introduction, Core Fundamentals) to begin organizing lessons, quizzes, and resources.
              </p>
            </div>
            {isEditable && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="mt-1 px-4 py-2 rounded-lg bg-card text-[#f8f8f6] hover:bg-black font-body text-xs font-medium shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-ember" />
                <span>+ Add First Section</span>
              </button>
            )}
          </div>
        )}

        {/* ── Inline New Section Card Form ── */}
        {isAdding && isEditable && (
          <form onSubmit={handleAddSection} className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-xs flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-rule">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-card text-[#f8f8f6] flex items-center justify-center text-xs font-mono font-bold">
                  {sections.length + 1}
                </span>
                <span className="font-sans text-lg text-foreground">Create New Section</span>
              </div>
              <span className="text-[11px] font-mono text-muted">Position {sections.length + 1}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Section Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g., Selection, Expansion, and Simulation Mechanics"
                className="px-3.5 py-2.5 rounded-[10px] bg-wash text-foreground text-xs sm:text-sm font-body border border-rule focus:bg-card focus:border-rule focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-muted hover:bg-wash transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createSection.isPending || !newTitle.trim()}
                className="px-5 py-2 rounded-lg bg-card text-[#f8f8f6] hover:bg-black font-body text-xs font-medium shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {createSection.isPending ? 'Saving Section...' : 'Save Section'}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Append Section Button */}
        {!isAdding && sections.length > 0 && isEditable && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-3.5 rounded-[10px] border border-dashed border-rule hover:border-rule hover:bg-card text-xs font-medium text-muted hover:text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-ember" />
            <span>+ Add New Section</span>
          </button>
        )}
      </div>
    </div>
  );
}
