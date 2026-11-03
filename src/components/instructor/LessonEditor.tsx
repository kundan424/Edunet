import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonResponse } from '../../features/instructor/types';
import { useUpdateLesson, useDeleteLesson } from '../../features/instructor/queries';
import { MediaUploader } from './MediaUploader';
import {
  Play,
  FileText,
  HelpCircle,
  Paperclip,
  Award,
  GripVertical,
  CheckCircle2,
  ArrowRight,
  Edit2,
  Trash2,
  Upload,
  X
} from 'lucide-react';

interface Props {
  courseId: string;
  sectionId: string;
  lesson: LessonResponse;
  isEditable: boolean;
  index: number;
}

export function LessonEditor({ courseId, sectionId, lesson, isEditable, index }: Props) {
  const navigate = useNavigate();
  const updateLesson = useUpdateLesson(courseId);
  const deleteLesson = useDeleteLesson(courseId);

  const [isEditing, setIsEditing] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
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
          title: editTitle.trim(), 
          description: editDescription.trim() || undefined,
          lessonType: lesson.lessonType,
          displayOrder: lesson.displayOrder 
        } 
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"? This cannot be undone.`)) {
      deleteLesson.mutate({ sectionId, lessonId: lesson.id });
    }
  };

  // Type rendering configurations matching Lumina specification
  const typeConfig = {
    VIDEO: {
      label: 'Video',
      icon: Play,
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      iconBg: 'bg-[#121212]',
      iconColor: 'text-[#f8f8f6]',
      summary: lesson.durationSeconds 
        ? `${Math.round(lesson.durationSeconds / 60)} min runtime • Transcoded & streaming ready` 
        : 'Video upload pending • Standard 1080p profile',
    },
    TEXT: {
      label: 'Monograph',
      icon: FileText,
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      iconBg: 'bg-[#373734]',
      iconColor: 'text-[#f8f8f6]',
      summary: 'KaTeX Markdown supported • ~15 min estimated reading time',
    },
    QUIZ: {
      label: 'Quiz',
      icon: HelpCircle,
      badgeBg: 'bg-[#faecd8]',
      badgeText: 'text-[#8c501e]',
      iconBg: 'bg-[#534b46]',
      iconColor: 'text-[#f8f8f6]',
      summary: 'Auto-graded assessment • Passing threshold calibrated in settings',
    },
    RESOURCE: {
      label: 'Resource Kit',
      icon: Paperclip,
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      iconBg: 'bg-[#373734]',
      iconColor: 'text-[#f8f8f6]',
      summary: lesson.durationSeconds 
        ? 'Supplementary documents / code archive attached' 
        : 'PDF slides, TeX source, or Rust/Python labs pending upload',
    },
    ASSIGNMENT: {
      label: 'Milestone',
      icon: Award,
      badgeBg: 'bg-[#faecd8]',
      badgeText: 'text-[#8c501e]',
      iconBg: 'bg-[#d97757]',
      iconColor: 'text-[#ffffff]',
      summary: 'Graded Milestone • SWE-bench test harness & peer review defense',
    },
  }[lesson.lessonType] || {
    label: lesson.lessonType,
    icon: FileText,
    badgeBg: 'bg-[#eeeeec]',
    badgeText: 'text-[#373734]',
    iconBg: 'bg-[#373734]',
    iconColor: 'text-[#f8f8f6]',
    summary: 'Curriculum asset',
  };

  const IconComponent = typeConfig.icon;

  return (
    <div className="bg-[#efeeeb]/70 hover:bg-[#efeeeb] rounded-xl p-3 sm:p-4 transition-all border border-[#e7e6e1]/60 flex flex-col gap-3 group">
      {/* ── Main Lesson Item Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Icon, Title & Subtitle */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg ${typeConfig.iconBg} ${typeConfig.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
            <IconComponent className="w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-xs sm:text-sm font-semibold text-[#121212] truncate">
                Lesson {index + 1}: {lesson.title}
              </span>
              <span className={`px-2 py-0.5 rounded ${typeConfig.badgeBg} ${typeConfig.badgeText} text-[10px] font-mono uppercase font-bold tracking-wider`}>
                {typeConfig.label}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#7b7974] pt-0.5 flex-wrap">
              {lesson.durationSeconds ? (
                <span className="flex items-center gap-1 text-[#373734] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                  <span>{typeConfig.summary}</span>
                </span>
              ) : (
                <span className="text-[#7b7974]">{typeConfig.summary}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Action 1: Manage Quiz if QUIZ */}
          {lesson.lessonType === 'QUIZ' && (
            <button
              type="button"
              onClick={() => navigate(`/instructor/courses/${courseId}/quiz/${lesson.id}`)}
              className="px-3 py-1 bg-[#121212] text-[#f8f8f6] hover:bg-black rounded-lg text-xs font-body font-medium shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Quiz Questions &amp; Settings</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
            </button>
          )}

          {/* Action 2: Manage Assignment if ASSIGNMENT */}
          {lesson.lessonType === 'ASSIGNMENT' && (
            <button
              type="button"
              onClick={() => navigate(`/instructor/courses/${courseId}/quiz/${lesson.id}`)}
              className="px-3 py-1 bg-[#121212] text-[#f8f8f6] hover:bg-black rounded-lg text-xs font-body font-medium shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Rubric &amp; Harness</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
            </button>
          )}

          {/* Action 3: Video / Resource Attachment Trigger */}
          {(lesson.lessonType === 'VIDEO' || lesson.lessonType === 'RESOURCE') && (
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className="px-2.5 py-1 bg-[#ffffff] hover:bg-[#e7e6e1] text-[#121212] rounded-lg text-xs font-medium border border-[#e7e6e1] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3 text-[#7b7974]" />
              <span>{lesson.durationSeconds ? 'Replace File' : 'Upload File'}</span>
            </button>
          )}

          {/* Action 4: Edit Details */}
          {isEditable && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-lg text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff] transition-colors cursor-pointer"
              title="Edit title & description"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Action 5: Delete */}
          {isEditable && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLesson.isPending}
              className="p-1.5 rounded-lg text-[#9c9a92] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete lesson"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Grip / Drag Indicator */}
          <span className="p-1 text-[#9c9a92] cursor-grab hover:text-[#121212]" title="Reorder lesson">
            <GripVertical className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* ── Media Uploader Drawer ── */}
      {showUploader && (lesson.lessonType === 'VIDEO' || lesson.lessonType === 'RESOURCE') && (
        <div className="pt-3 border-t border-[#e7e6e1] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#121212]">
              {lesson.lessonType === 'VIDEO' ? 'Video Media Master (MP4, WebM)' : 'Supplementary Resource Attachment (PDF, ZIP, RS)'}
            </span>
            <button 
              type="button" 
              onClick={() => setShowUploader(false)}
              className="text-[#9c9a92] hover:text-[#121212] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <MediaUploader 
            courseId={courseId} 
            lessonId={lesson.id} 
            hasMedia={!!lesson.durationSeconds} 
            isResource={lesson.lessonType === 'RESOURCE'} 
          />
        </div>
      )}

      {/* ── In-line Edit Form Drawer ── */}
      {isEditing && (
        <form onSubmit={handleUpdate} className="pt-3 border-t border-[#e7e6e1] flex flex-col gap-3 bg-[#ffffff] p-4 rounded-xl border border-[#e7e6e1] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#121212]">Edit Lesson Details</span>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="text-[#9c9a92] hover:text-[#121212]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#121212]">Title</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#121212]">Description / Notes (Optional)</label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Outline what learners will build or prove in this specific lesson..."
              className="px-3 py-2 rounded-lg bg-[#f8f8f6] text-[#121212] text-xs font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditTitle(lesson.title); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7b7974] hover:bg-[#efeeeb] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateLesson.isPending}
              className="px-4 py-1.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium shadow-xs transition-all disabled:opacity-50"
            >
              {updateLesson.isPending ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
