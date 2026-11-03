import React, { useState } from 'react';
import type { SectionCurriculumResponse } from '../../features/instructor/types';
import { useUpdateSection, useDeleteSection, useCreateLesson } from '../../features/instructor/queries';
import { LessonEditor } from './LessonEditor';
import {
  GripVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Play,
  FileText,
  HelpCircle,
  Paperclip,
  Award,
  Check,
  X
} from 'lucide-react';

interface Props {
  courseId: string;
  sectionData: SectionCurriculumResponse;
  isEditable: boolean;
  index: number;
  forceExpanded?: boolean;
}

export function SectionEditor({ courseId, sectionData, isEditable, index, forceExpanded }: Props) {
  const { section, lessons } = sectionData;
  const updateSection = useUpdateSection(courseId);
  const deleteSection = useDeleteSection(courseId);
  const createLesson = useCreateLesson(courseId);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('20 minutes');
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'TEXT' | 'QUIZ' | 'RESOURCE' | 'ASSIGNMENT'>('VIDEO');

  // Handle external expand/collapse triggers
  React.useEffect(() => {
    if (forceExpanded !== undefined) {
      setIsExpanded(forceExpanded);
    }
  }, [forceExpanded]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateSection.mutate(
      { sectionId: section.id, data: { title: editTitle.trim(), displayOrder: section.displayOrder } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (lessons.length > 0) {
      alert('This section contains lessons. Please remove or relocate all lessons before deleting the section container.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Section ${index + 1}: "${section.title}"?`)) {
      deleteSection.mutate(section.id);
    }
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    // Parse duration estimate into seconds if given as number
    let durationSeconds: number | undefined;
    const match = newLessonDuration.match(/\d+/);
    if (match) {
      durationSeconds = parseInt(match[0], 10) * 60;
    }

    createLesson.mutate(
      { 
        sectionId: section.id, 
        data: { 
          title: newLessonTitle.trim(), 
          lessonType: newLessonType, 
          displayOrder: lessons.length,
          durationSeconds: durationSeconds || 900
        } 
      },
      {
        onSuccess: () => {
          setNewLessonTitle('');
          setNewLessonDuration('20 minutes');
          setIsAddingLesson(false);
          setIsExpanded(true);
        }
      }
    );
  };

  // Compute total duration of the section
  const totalDurationSecs = lessons.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalDurationSecs / 60) || (lessons.length * 15);

  return (
    <article className="bg-[#ffffff] rounded-2xl shadow-xs border border-[#e7e6e1] overflow-hidden transition-all">
      {/* ── Section Header ── */}
      <div className="p-4 sm:px-6 flex items-center justify-between gap-4 bg-[#ffffff]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="material-symbols-outlined text-[#9c9a92] cursor-grab hover:text-[#121212] select-none" title="Drag to reorder section">
            <GripVertical className="w-4 h-4" />
          </span>

          <div className="w-7 h-7 rounded-full bg-[#efeeeb] text-[#373734] flex items-center justify-center font-mono text-xs font-semibold shrink-0">
            {index + 1}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="px-2.5 py-1 text-sm font-body border border-[#121212] rounded bg-[#f8f8f6] focus:outline-none w-full"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={updateSection.isPending}
                  className="p-1 rounded bg-[#121212] text-[#f8f8f6] hover:bg-black"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(false); setEditTitle(section.title); }}
                  className="p-1 rounded bg-[#efeeeb] text-[#7b7974] hover:text-[#121212]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl text-[#121212] truncate font-normal">
                  {section.title}
                </h2>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[#9c9a92] hover:text-[#121212] p-1 rounded transition-colors"
                    title="Edit section title"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#7b7974] pt-0.5">
              <span>{lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
              <span>•</span>
              <span>~{totalMinutes} min</span>
              <span>•</span>
              <span className="text-[#9c9a92]">Module Stratum {index + 1}</span>
            </div>
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isEditable && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteSection.isPending}
              className="text-[#9c9a92] hover:text-[#ba1a1a] p-2 rounded-lg hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-[#efeeeb] text-[#121212] hover:bg-[#e7e6e1] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Section Lessons List & Add Form ── */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6 flex flex-col gap-3">
          {lessons.length === 0 && !isAddingLesson && (
            <div className="p-6 rounded-xl border border-dashed border-[#e7e6e1] text-center flex flex-col items-center justify-center gap-2 bg-[#f8f8f6]">
              <span className="font-body text-xs text-[#7b7974]">No lessons added to this module yet.</span>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium shadow-xs transition-all cursor-pointer"
                >
                  + Add First Lesson
                </button>
              )}
            </div>
          )}

          {lessons.map((lesson, lessonIndex) => (
            <LessonEditor
              key={lesson.id}
              courseId={courseId}
              sectionId={section.id}
              lesson={lesson}
              isEditable={isEditable}
              index={lessonIndex}
            />
          ))}

          {/* ── Inline "Add Lesson to Section" Form ── */}
          {isAddingLesson && isEditable ? (
            <div className="mt-2 bg-[#f8f8f6] rounded-xl p-4 sm:p-5 border border-[#e7e6e1] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-heading text-base sm:text-lg text-[#121212] font-normal">
                  Add Lesson to Section {index + 1}
                </span>
                <span className="font-mono text-[11px] text-[#9c9a92]">
                  Position {lessons.length + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* Title Input */}
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#373734] font-semibold">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={e => setNewLessonTitle(e.target.value)}
                    placeholder="e.g., Lesson 2.4: Benchmarking Rollout Latencies across Ray Clusters"
                    className="w-full px-3 py-2 rounded-lg bg-[#ffffff] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212]"
                    autoFocus
                  />
                </div>

                {/* Duration Estimator */}
                <div className="md:col-span-4 flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#373734] font-semibold">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(e.target.value)}
                    placeholder="e.g., 25 minutes"
                    className="w-full px-3 py-2 rounded-lg bg-[#ffffff] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:outline-none focus:border-[#121212]"
                  />
                </div>

                {/* Lesson Modality Selector Pills */}
                <div className="md:col-span-12 flex flex-col gap-2 pt-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#373734] font-semibold">
                    Lesson Modality
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setNewLessonType('VIDEO')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        newLessonType === 'VIDEO'
                          ? 'bg-[#121212] text-[#f8f8f6] shadow-xs'
                          : 'bg-[#ffffff] hover:bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>VIDEO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewLessonType('TEXT')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        newLessonType === 'TEXT'
                          ? 'bg-[#121212] text-[#f8f8f6] shadow-xs'
                          : 'bg-[#ffffff] hover:bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>TEXT MONOGRAPH</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewLessonType('QUIZ')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        newLessonType === 'QUIZ'
                          ? 'bg-[#121212] text-[#f8f8f6] shadow-xs'
                          : 'bg-[#ffffff] hover:bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>QUIZ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewLessonType('RESOURCE')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        newLessonType === 'RESOURCE'
                          ? 'bg-[#121212] text-[#f8f8f6] shadow-xs'
                          : 'bg-[#ffffff] hover:bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]'
                      }`}
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>RESOURCE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewLessonType('ASSIGNMENT')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        newLessonType === 'ASSIGNMENT'
                          ? 'bg-[#121212] text-[#f8f8f6] shadow-xs'
                          : 'bg-[#ffffff] hover:bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>ASSIGNMENT</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Adding Lesson */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e7e6e1]">
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#7b7974] hover:bg-[#efeeeb] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  disabled={createLesson.isPending || !newLessonTitle.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#d97757] hover:bg-[#c26243] text-[#ffffff] font-body text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {createLesson.isPending ? 'Adding Lesson...' : `Add Lesson to Section ${index + 1}`}
                </button>
              </div>
            </div>
          ) : (
            isEditable && (
              <button
                type="button"
                onClick={() => setIsAddingLesson(true)}
                className="mt-1 w-full py-2.5 rounded-xl border border-dashed border-[#e7e6e1] hover:border-[#121212] hover:bg-[#f8f8f6] text-xs font-medium text-[#7b7974] hover:text-[#121212] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson to Section {index + 1}</span>
              </button>
            )
          )}
        </div>
      )}
    </article>
  );
}
