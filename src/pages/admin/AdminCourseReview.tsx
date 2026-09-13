import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminCourseCurriculum, useApproveCourse, useRejectCourse } from '../../features/admin/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { ArrowLeft, PlayCircle, FileText, CheckSquare, FileUp, Link as LinkIcon, User, Star, Users, DollarSign } from 'lucide-react';
import type { LessonType } from '../../features/courses/types';

export function AdminCourseReview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading, error } = useAdminCourseCurriculum(courseId!);
  const approveMutation = useApproveCourse();
  const rejectMutation = useRejectCourse();

  if (isLoading) return <LoadingState message="Loading curriculum for moderation..." />;
  if (error || !data) {
    const errorMsg = (error as any)?.message || 'Failed to load curriculum. The course may not exist or may not be in PENDING_APPROVAL status.';
    return (
      <div className="w-full flex flex-col gap-4">
        <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 mb-6 text-sm font-bold text-midnight-ink hover:text-signal-blue">
          <ArrowLeft size={16} /> Back to pending courses
        </button>
        <ErrorState message={errorMsg} />
      </div>
    );
  }

  const { course, sections } = data;

  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve ' + course.title + '? It will be published immediately.')) {
      approveMutation.mutate(course.id, {
        onSuccess: () => navigate('/admin/courses')
      });
    }
  };

  const submitReject = () => {
    if (selectedRejectId && rejectReason.trim()) {
      rejectMutation.mutate(
        { courseId: selectedRejectId, data: { reason: rejectReason } },
        {
          onSuccess: () => navigate('/admin/courses')
        }
      );
    }
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle size={16} />;
      case 'TEXT': return <FileText size={16} />;
      case 'QUIZ': return <CheckSquare size={16} />;
      case 'ASSIGNMENT': return <FileUp size={16} />;
      case 'RESOURCE': return <LinkIcon size={16} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Moderation Controls */}
      <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 text-sm font-bold text-midnight-ink hover:text-signal-blue">
        <ArrowLeft size={16} /> Back to Pending Courses
      </button>

      <div className="bg-cream-paper border-2 border-midnight-ink p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-warning-yellow border border-midnight-ink px-2 py-1 text-xs font-bold font-usual">PENDING_APPROVAL</span>
              <span className="font-usual text-sm text-gray-500">{course.category} • {course.difficulty}</span>
            </div>
            <h1 className="text-3xl font-display font-black text-midnight-ink leading-tight mb-2">
              {course.title}
            </h1>
            <p className="font-usual text-midnight-ink/80 max-w-2xl">{course.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button 
              className="px-6 py-3 border-2 border-ember-red text-ember-red font-bold hover:bg-ember-red hover:text-white transition-colors"
              onClick={() => { setSelectedRejectId(course.id); setRejectReason(''); }}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              Reject Course
            </button>
            <PillButton 
              className="px-8 py-3 bg-midnight-ink text-white"
              onClick={handleApprove}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {approveMutation.isPending ? 'Approving...' : 'Approve & Publish'}
            </PillButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-midnight-ink/20">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-midnight-ink/60" />
            <span className="font-bold">{course.price ? `$${course.price.toFixed(2)}` : 'Free'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={18} className="text-midnight-ink/60" />
            <span className="font-bold truncate text-sm" title={course.instructorId}>{course.instructorId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-midnight-ink/60" />
            <span className="font-bold">{course.rating ? course.rating.toFixed(1) : 'No rating'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-midnight-ink/60" />
            <span className="font-bold">{course.studentCount} students</span>
          </div>
        </div>
      </div>

      <div>
        <SectionHeading>Course Curriculum</SectionHeading>
        {sections.length === 0 ? (
          <div className="mt-4 border-2 border-midnight-ink p-8 text-center bg-cream-paper">
            <p className="font-bold text-lg mb-2">No sections found.</p>
            <p className="font-usual text-sm">This course is empty and should likely be rejected.</p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {sections.map((sectionData: any, index: number) => (
              <div key={sectionData.section.id} className="border-2 border-midnight-ink bg-white">
                <div className="bg-cream-paper p-4 border-b border-midnight-ink">
                  <h3 className="font-bold text-lg">Section {index + 1}: {sectionData.section.title}</h3>
                  {sectionData.section.description && (
                    <p className="text-sm font-usual mt-1">{sectionData.section.description}</p>
                  )}
                </div>
                <div>
                  {sectionData.lessons.length === 0 ? (
                    <div className="p-4 text-center text-sm font-usual text-gray-500 italic">No lessons in this section.</div>
                  ) : (
                    <ul className="divide-y divide-midnight-ink/10">
                      {sectionData.lessons.map((lesson: any, lIndex: number) => (
                        <li key={lesson.id} className="p-4 hover:bg-black/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="shrink-0 text-midnight-ink/60">
                              {getLessonIcon(lesson.lessonType)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm truncate">{lIndex + 1}. {lesson.title}</p>
                              {lesson.description && (
                                <p className="text-xs font-usual truncate mt-0.5">{lesson.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                            <span className="text-[10px] font-bold px-2 py-1 bg-black/10 rounded-full">{lesson.lessonType}</span>
                            {lesson.durationSeconds ? (
                              <span className="text-xs font-usual font-mono">{Math.floor(lesson.durationSeconds / 60)}:{(lesson.durationSeconds % 60).toString().padStart(2, '0')}</span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-ink/50 p-4">
          <div className="bg-cream-paper p-6 sm:p-8 border-2 border-midnight-ink max-w-md w-full flex flex-col gap-4">
            <h3 className="font-bold text-xl">Reject Course</h3>
            <p className="text-sm font-usual">Please provide a reason for rejecting this course. The instructor will see this message.</p>
            <div>
              <textarea
                className="w-full border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
                rows={4}
                maxLength={1000}
                placeholder="e.g. The audio quality in Section 2 is too low..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <p className="text-xs text-right mt-1 font-mono">{rejectReason.length}/1000</p>
            </div>
            <div className="flex gap-4 mt-2">
              <PillButton 
                className="flex-1 justify-center bg-ember-red text-white hover:bg-ember-red/90"
                onClick={submitReject}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
              </PillButton>
              <button 
                className="flex-1 font-bold text-sm text-gray-600 hover:underline"
                onClick={() => { setSelectedRejectId(null); setRejectReason(''); }}
              >
                Cancel
              </button>
            </div>
            {rejectMutation.isError && (
              <p className="text-xs font-bold text-ember-red mt-2">Error rejecting course.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
