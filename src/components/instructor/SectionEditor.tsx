import React, { useState } from 'react';
import type { SectionCurriculumResponse } from '../../features/instructor/types';
import { PillButton } from '../ui/Button';
import { useUpdateSection, useDeleteSection, useCreateLesson } from '../../features/instructor/queries';
import { LessonEditor } from './LessonEditor';

interface Props {
  courseId: string;
  sectionData: SectionCurriculumResponse;
  isEditable: boolean;
  index: number;
}

export function SectionEditor({ courseId, sectionData, isEditable, index }: Props) {
  const { section, lessons } = sectionData;
  const updateSection = useUpdateSection(courseId);
  const deleteSection = useDeleteSection(courseId);
  const createLesson = useCreateLesson(courseId);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE'>('VIDEO');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateSection.mutate(
      { sectionId: section.id, data: { title: editTitle, displayOrder: section.displayOrder } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (lessons.length > 0) {
      alert('Please delete all lessons in this section first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection.mutate(section.id);
    }
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    createLesson.mutate(
      { sectionId: section.id, data: { title: newLessonTitle, lessonType: newLessonType, displayOrder: lessons.length } },
      {
        onSuccess: () => {
          setNewLessonTitle('');
          setIsAddingLesson(false);
          setIsExpanded(true);
        }
      }
    );
  };

  return (
    <div className="border border-midnight-ink bg-white flex flex-col group transition-all">
      {/* Section Header */}
      <div className="bg-cream-paper flex items-center justify-between p-3 border-b border-midnight-ink sticky top-0 z-10">
        <div className="flex items-center gap-3 font-bold text-sm sm:text-base">
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-6 h-6 flex items-center justify-center border border-midnight-ink hover:bg-black/10">
            {isExpanded ? '−' : '+'}
          </button>
          <span>Section {index + 1}:</span>
          {!isEditing && <span>{section.title}</span>}
        </div>
        
        {isEditable && !isEditing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="text-xs font-bold hover:underline">Edit</button>
            <button onClick={handleDelete} className="text-xs font-bold text-ember-red hover:underline ml-2">Delete</button>
          </div>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleUpdate} className="p-4 border-b border-midnight-ink flex flex-col gap-3 bg-white">
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="border border-midnight-ink px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal-blue"
            autoFocus
          />
          <div className="flex gap-2">
            <PillButton type="button" onClick={() => { setIsEditing(false); setEditTitle(section.title); }} className="bg-transparent hover:bg-black/10 !py-1 !text-xs">Cancel</PillButton>
            <PillButton type="submit" disabled={updateSection.isPending} className="!py-1 !text-xs">Save</PillButton>
          </div>
        </form>
      )}

      {/* Lessons List */}
      {isExpanded && (
        <div className="flex flex-col">
          {lessons.map((lesson, lIndex) => (
            <LessonEditor 
              key={lesson.id} 
              courseId={courseId} 
              sectionId={section.id} 
              lesson={lesson} 
              isEditable={isEditable} 
              index={lIndex} 
            />
          ))}

          {isAddingLesson && isEditable ? (
            <form onSubmit={handleAddLesson} className="p-4 border-t border-midnight-ink flex flex-col gap-3 bg-black/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  placeholder="Lesson title"
                  className="flex-grow border border-midnight-ink px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal-blue bg-white"
                  autoFocus
                />
                <select 
                  value={newLessonType} 
                  onChange={e => setNewLessonType(e.target.value as any)}
                  className="border border-midnight-ink px-3 py-2 text-sm focus:outline-none bg-white appearance-none rounded-none"
                >
                  <option value="VIDEO">Video</option>
                  <option value="TEXT">Text</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="RESOURCE">Resource</option>
                </select>
              </div>
              <div className="flex gap-2">
                <PillButton type="button" onClick={() => setIsAddingLesson(false)} className="bg-transparent hover:bg-black/10 !py-1 !text-xs">Cancel</PillButton>
                <PillButton type="submit" disabled={createLesson.isPending} className="!py-1 !text-xs">Save Lesson</PillButton>
              </div>
            </form>
          ) : (
            isEditable && (
              <button 
                onClick={() => setIsAddingLesson(true)} 
                className="text-left px-10 py-3 text-sm font-bold text-gray-500 hover:text-signal-blue hover:bg-black/5 transition-colors border-t border-midnight-ink border-dashed flex items-center gap-2"
              >
                + Add Lesson
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
