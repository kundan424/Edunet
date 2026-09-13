import React, { useState } from 'react';
import type { LessonResponse } from '../../features/instructor/types';
import { PillButton } from '../ui/Button';
import { useUpdateLesson, useDeleteLesson } from '../../features/instructor/queries';
import { MediaUploader } from './MediaUploader';

interface Props {
  courseId: string;
  sectionId: string;
  lesson: LessonResponse;
  isEditable: boolean;
  index: number;
}

export function LessonEditor({ courseId, sectionId, lesson, isEditable, index }: Props) {
  const updateLesson = useUpdateLesson(courseId);
  const deleteLesson = useDeleteLesson(courseId);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editDescription, setEditDescription] = useState(lesson.description || '');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateLesson.mutate(
      { 
        sectionId, 
        lessonId: lesson.id, 
        data: { 
          title: editTitle, 
          description: editDescription,
          lessonType: lesson.lessonType,
          displayOrder: lesson.displayOrder 
        } 
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lesson? This cannot be undone.')) {
      deleteLesson.mutate({ sectionId, lessonId: lesson.id });
    }
  };

  const typeIcons: Record<string, string> = {
    VIDEO: '▶',
    TEXT: 'T',
    QUIZ: '?',
    ASSIGNMENT: 'A',
    RESOURCE: 'R'
  };

  return (
    <div className="flex flex-col border-t border-midnight-ink hover:bg-black/5 transition-colors group">
      <div className="flex items-start justify-between p-3 pl-10">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono w-4 mt-1 opacity-60 text-center">{typeIcons[lesson.lessonType] || '•'}</span>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">Lesson {index + 1}: {lesson.title}</span>
            {lesson.lessonType === 'VIDEO' && (
              <span className="text-xs opacity-60">
                {lesson.durationSeconds ? `${Math.round(lesson.durationSeconds / 60)} min` : 'No media attached'}
              </span>
            )}
          </div>
        </div>

        {isEditable && !isEditing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
            <button onClick={() => setIsEditing(true)} className="text-xs font-bold hover:underline">Edit</button>
            <button onClick={handleDelete} className="text-xs font-bold text-ember-red hover:underline ml-2">Delete</button>
          </div>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleUpdate} className="p-4 pl-10 border-t border-midnight-ink border-dashed flex flex-col gap-3 bg-white m-2 border">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="border border-midnight-ink px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase">Description (Optional)</label>
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="border border-midnight-ink px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal-blue min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <PillButton type="button" onClick={() => { setIsEditing(false); setEditTitle(lesson.title); }} className="bg-transparent hover:bg-black/10 !py-1 !text-xs">Cancel</PillButton>
            <PillButton type="submit" disabled={updateLesson.isPending} className="!py-1 !text-xs">Save Details</PillButton>
          </div>
          
          {lesson.lessonType === 'VIDEO' && (
            <div className="mt-4 pt-4 border-t border-midnight-ink">
              <h5 className="text-xs font-bold uppercase mb-2">Video Media</h5>
              <MediaUploader courseId={courseId} lessonId={lesson.id} hasMedia={!!lesson.durationSeconds} />
            </div>
          )}
          
          {lesson.lessonType === 'QUIZ' && (
            <div className="mt-4 pt-4 border-t border-midnight-ink flex flex-col gap-2">
              <h5 className="text-xs font-bold uppercase mb-2">Quiz Content</h5>
              <PillButton 
                type="button" 
                onClick={() => window.location.href = `/instructor/courses/${courseId}/quiz/${lesson.id}`}
                className="bg-transparent hover:bg-black/10 w-full justify-center !py-2 !text-xs"
              >
                Manage Quiz Questions & Settings
              </PillButton>
            </div>
          )}

          {lesson.lessonType === 'ASSIGNMENT' && (
            <div className="mt-4 pt-4 border-t border-midnight-ink flex flex-col gap-2">
              <h5 className="text-xs font-bold uppercase mb-2">Assignment Content</h5>
              <PillButton 
                type="button" 
                onClick={() => window.location.href = `/instructor/courses/${courseId}/assignment/${lesson.id}`}
                className="bg-transparent hover:bg-black/10 w-full justify-center !py-2 !text-xs"
              >
                Manage Assignment Details
              </PillButton>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
