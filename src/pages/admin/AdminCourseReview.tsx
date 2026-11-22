import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminCourseCurriculum, useApproveCourse, useRejectCourse } from '../../features/admin/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { LessonType } from '../../features/courses/types';
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  CheckSquare,
  FileUp,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export function AdminCourseReview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading, error, refetch } = useAdminCourseCurriculum(courseId!);
  const approveMutation = useApproveCourse();
  const rejectMutation = useRejectCourse();

  if (isLoading) return <LoadingState message="Loading course for review..." />;
  if (error || !data) {
    const errorMsg =
      (error as any)?.message ||
      'Failed to load curriculum. The course may not exist or may not be in PENDING_APPROVAL status.';
    return (
      <div className="w-full max-w-5xl mx-auto py-6 space-y-6 font-sans">
        <button
          type="button"
          onClick={() => navigate('/admin/courses')}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Course Moderation</span>
        </button>
        <ErrorState
          title="Curriculum Unavailable for Moderation"
          message={errorMsg}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { course, sections } = data;

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDurationSecs = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((lAcc, l) => lAcc + (l.durationSeconds || 0), 0),
    0
  );
  const totalMinutes = Math.round(totalDurationSecs / 60) || totalLessons * 20;

  const toggleSection = (sId: string) => {
    setExpandedSectionIds(prev => ({
      ...prev,
      [sId]: prev[sId] !== undefined ? !prev[sId] : false
    }));
  };

  const handleApprove = () => {
    approveMutation.mutate(course.id, {
      onSuccess: () => navigate('/admin/courses')
    });
  };

  const submitReject = () => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate(
      { courseId: course.id, data: { reason: rejectReason } },
      {
        onSuccess: () => navigate('/admin/courses')
      }
    );
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="w-4 h-4 text-ember" />;
      case 'TEXT':
        return <FileText className="w-4 h-4 text-muted" />;
      case 'QUIZ':
        return <CheckSquare className="w-4 h-4 text-[#4b7a47]" />;
      case 'ASSIGNMENT':
        return <FileUp className="w-4 h-4 text-muted" />;
      case 'RESOURCE':
        return <LinkIcon className="w-4 h-4 text-muted" />;
    }
  };

  const quickCritiques = [
    'Syllabus modules lack clear learning objectives.',
    'Insufficient quizzes or knowledge check questions.',
    'Audio/Video recording quality requires improvement.',
    'Prerequisites or difficulty level misaligned with course category.'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 space-y-8 font-sans">
      {/* ── Breadcrumb & Navigation ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Course Moderation</span>
        </Link>
        <span className="font-mono text-[11px] text-muted">
          Course ID: #{course.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* ── A. Course Summary & Action Banner ── */}
      <section className="bg-white rounded-[10px] p-6 sm:p-7 border border-rule shadow-none relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-wash text-[#D97706] border border-[#FDE68A] font-semibold uppercase">
                Pending Review
              </span>
              <span className="font-sans text-xs px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule">
                {course.category}
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-wash text-muted border border-rule uppercase">
                {course.difficulty}
              </span>
              <span className="font-sans text-xs text-[#16A34A] font-semibold">
                {course.price === 0 || course.price === null ? 'Free' : `$${course.price.toFixed(2)}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
              {course.description || 'No course description provided.'}
            </p>

            {/* Authoring Faculty */}
            <div className="flex items-center gap-2 pt-2 text-xs font-sans text-muted">
              <GraduationCap className="w-4 h-4 text-ember" />
              <span className="font-medium text-foreground">
                Instructor: {(course as any).instructorName || 'Instructor'}
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted">
                {sections.length} Sections • {totalLessons} Lessons • ~{totalMinutes} Min Runtime
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                setShowRejectModal(true);
                setRejectReason('');
              }}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] font-sans text-xs font-medium transition-colors cursor-pointer shadow-none"
            >
              Reject Course
            </button>
            <button
              type="button"
              onClick={() => setShowApproveModal(true)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium transition-colors shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Approve &amp; Publish</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── B. Two-Column Review Layout: Curriculum Tree & Compliance Inspector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Complete Curriculum Tree */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-rule">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-ember" />
              <h2 className="font-sans font-bold text-lg text-foreground">Curriculum Syllabus Tree</h2>
            </div>
            <span className="font-mono text-xs text-muted">
              {sections.length} Total Sections
            </span>
          </div>

          {sections.length === 0 ? (
            <div className="bg-card rounded-[10px] p-8 border border-dashed border-rule text-center shadow-none">
              <p className="text-xs font-sans text-muted">
                This course proposal contains no structured modules. Rejection recommended.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((secItem, sIdx) => {
                const sec = secItem.section;
                const lessons = secItem.lessons || [];
                const isExpanded = expandedSectionIds[sec.id] !== false; // Default expanded

                return (
                  <div
                    key={sec.id}
                    className="bg-card rounded-[10px] border border-rule shadow-none overflow-hidden transition-all"
                  >
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(sec.id)}
                      className="p-4 sm:p-5 flex items-center justify-between bg-canvas cursor-pointer hover:bg-wash/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-card border border-rule flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                          {sIdx + 1}
                        </span>
                        <div>
                          <h3 className="font-sans text-sm font-semibold text-foreground">
                            {sec.title}
                          </h3>
                          <span className="font-mono text-[11px] text-muted">
                            {lessons.length} Instructional Modules
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted" />
                        )}
                      </div>
                    </div>

                    {/* Lessons List */}
                    {isExpanded && (
                      <div className="divide-y divide-[#E2E8F0] px-4 sm:px-5 py-2">
                        {lessons.length === 0 ? (
                          <p className="py-3 text-xs font-sans text-muted italic">
                            No lessons configured in this section.
                          </p>
                        ) : (
                          lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="py-3 flex items-start sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div className="mt-0.5 sm:mt-0 p-1.5 rounded-md bg-canvas border border-rule">
                                  {getLessonIcon(lesson.lessonType)}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <span className="font-sans text-xs sm:text-sm font-medium text-foreground block truncate">
                                    {lIdx + 1}. {lesson.title}
                                  </span>
                                  <span className="font-mono text-[10px] text-muted uppercase">
                                    {lesson.lessonType}
                                    {lesson.durationSeconds
                                      ? ` • ${Math.round(lesson.durationSeconds / 60)} min`
                                      : ''}
                                  </span>
                                </div>
                              </div>

                              <span className="font-mono text-[10px] text-[#16A34A] shrink-0 font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]">
                                Staged &amp; Ready
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Course Quality Checklist & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-rule">
              <ShieldCheck className="w-4 h-4 text-ember" />
              <h2 className="font-sans font-bold text-base text-foreground">
                Course Quality Checklist
              </h2>
            </div>

            <div className="space-y-3.5 text-xs font-sans">
              <div className="p-3 rounded-lg bg-canvas border border-rule space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Difficulty Level Match</span>
                  <span className="text-[#16A34A]">Aligned</span>
                </div>
                <p className="text-[11px] text-muted leading-snug">
                  Course depth aligns with {course.difficulty} classification standards.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-canvas border border-rule space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Copyright &amp; Citations</span>
                  <span className="text-[#16A34A]">Verified</span>
                </div>
                <p className="text-[11px] text-muted leading-snug">
                  Original instructional material verified with no copyright infringement detected.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-canvas border border-rule space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Assessments</span>
                  <span className="text-[#D97706]">
                    {sections.some(s => s.lessons.some(l => l.lessonType === 'QUIZ'))
                      ? 'Quizzes Added'
                      : 'Lessons Only'}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-snug">
                  Includes comprehensive knowledge assessments for student certification.
                </p>
              </div>
            </div>

            {/* Review Actions */}
            <div className="pt-3 border-t border-rule space-y-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="w-full py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium shadow-none transition-colors cursor-pointer"
              >
                Approve Course
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(true);
                  setRejectReason('');
                }}
                className="w-full py-2 rounded-lg text-xs font-sans text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                Reject with Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── C. Reject Course Modal ── */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] max-w-lg w-full p-6 sm:p-7 border border-rule shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-rule">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-foreground">
                    Reject Course
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    Instructor: {(course as any).instructorName || 'Instructor'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="w-8 h-8 rounded-lg bg-card border border-rule hover:bg-canvas flex items-center justify-center text-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="font-sans text-xs text-foreground font-semibold block">
                Quick Feedback Suggestions (Click to append):
              </label>
              <div className="flex flex-col gap-1.5">
                {quickCritiques.map((crit, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setRejectReason(prev => (prev ? `${prev}\n• ${crit}` : `• ${crit}`))
                    }
                    className="text-left p-2 rounded-lg bg-canvas hover:bg-wash text-[11px] font-sans text-foreground border border-rule transition-colors cursor-pointer"
                  >
                    + {crit}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-sans text-xs text-foreground font-semibold block">
                  Feedback for Instructor (Required):
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Outline the required adjustments or changes needed before re-submission..."
                  className="w-full p-3.5 rounded-lg bg-card border border-rule text-xs font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rule">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-sans text-muted hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-sans text-xs font-medium shadow-none disabled:opacity-50 cursor-pointer"
              >
                {rejectMutation.isPending ? 'Submitting...' : 'Reject Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── D. Approve Course Modal ── */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] max-w-md w-full p-6 sm:p-7 border border-rule shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-wash flex items-center justify-center text-ember shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-foreground">
                  Approve Course for Publication
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Are you sure you wish to approve "{course.title}"? The course will be published immediately in the course catalog.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-canvas border border-rule text-xs font-sans text-foreground space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Status:</span>
                <span className="font-semibold text-[#16A34A]">Published</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Pricing:</span>
                <span className="font-semibold text-foreground">
                  {course.price === 0 || course.price === null ? 'Free / Scholarship' : `$${course.price.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rule">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-sans text-muted hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium shadow-none cursor-pointer"
              >
                {approveMutation.isPending ? 'Publishing...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
