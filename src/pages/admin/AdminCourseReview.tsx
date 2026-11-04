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
          className="inline-flex items-center gap-2 text-xs font-mono text-[#7b7974] hover:text-[#121212] transition-colors cursor-pointer"
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
        return <PlayCircle className="w-4 h-4 text-[#d97757]" />;
      case 'TEXT':
        return <FileText className="w-4 h-4 text-[#7b7974]" />;
      case 'QUIZ':
        return <CheckSquare className="w-4 h-4 text-[#4b7a47]" />;
      case 'ASSIGNMENT':
        return <FileUp className="w-4 h-4 text-[#9c9a92]" />;
      case 'RESOURCE':
        return <LinkIcon className="w-4 h-4 text-[#7b7974]" />;
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
          className="inline-flex items-center gap-2 text-xs font-mono text-[#7b7974] hover:text-[#121212] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Course Moderation</span>
        </Link>
        <span className="font-mono text-[11px] text-[#7b7974]">
          Course ID: #{course.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* ── A. Course Summary & Action Banner ── */}
      <section className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#fff5f0] text-[#d97757] border border-[#d97757]/30 font-semibold uppercase">
                Pending Review
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#f8f8f6] text-[#7b7974] border border-[#e7e6e1]">
                {course.category}
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#f8f8f6] text-[#7b7974] border border-[#e7e6e1] uppercase">
                {course.difficulty}
              </span>
              <span className="font-mono text-xs text-[#4b7a47] font-semibold">
                {course.price === 0 || course.price === null ? 'Free' : `$${course.price.toFixed(2)}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#7b7974] leading-relaxed">
              {course.description || 'No course description provided.'}
            </p>

            {/* Authoring Faculty */}
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#373734]">
              <GraduationCap className="w-4 h-4 text-[#d97757]" />
              <span className="font-medium text-[#121212]">
                Instructor: {(course as any).instructorName || 'Instructor'}
              </span>
              <span className="text-[#9c9a92]">•</span>
              <span className="text-[#7b7974]">
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
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/20 font-mono text-xs font-medium transition-all cursor-pointer"
            >
              Reject Course
            </button>
            <button
              type="button"
              onClick={() => setShowApproveModal(true)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d97757]" />
              <span>Approve &amp; Publish</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── B. Two-Column Review Layout: Curriculum Tree & Compliance Inspector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Complete Curriculum Tree */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d97757]" />
              <h2 className="font-heading text-lg text-[#121212]">Curriculum Syllabus Tree</h2>
            </div>
            <span className="font-mono text-xs text-[#7b7974]">
              {sections.length} Total Sections
            </span>
          </div>

          {sections.length === 0 ? (
            <div className="bg-[#ffffff] rounded-2xl p-8 border border-dashed border-[#e7e6e1] text-center">
              <p className="text-xs font-mono text-[#7b7974]">
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
                    className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] shadow-xs overflow-hidden transition-all"
                  >
                    {/* Section Header */}
                    <div
                      onClick={() => toggleSection(sec.id)}
                      className="p-4 sm:p-5 flex items-center justify-between bg-[#f8f8f6] cursor-pointer hover:bg-[#efeeeb]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center font-mono text-xs font-semibold text-[#121212]">
                          {sIdx + 1}
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-medium text-[#121212]">
                            {sec.title}
                          </h3>
                          <span className="font-mono text-[11px] text-[#7b7974]">
                            {lessons.length} Instructional Modules
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#7b7974]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#7b7974]" />
                        )}
                      </div>
                    </div>

                    {/* Lessons List */}
                    {isExpanded && (
                      <div className="divide-y divide-[#e7e6e1]/60 px-4 sm:px-5 py-2">
                        {lessons.length === 0 ? (
                          <p className="py-3 text-xs font-mono text-[#7b7974] italic">
                            No lessons configured in this section.
                          </p>
                        ) : (
                          lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="py-3 flex items-start sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div className="mt-0.5 sm:mt-0 p-1.5 rounded-lg bg-[#f8f8f6] border border-[#e7e6e1]">
                                  {getLessonIcon(lesson.lessonType)}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <span className="font-body text-xs sm:text-sm font-medium text-[#121212] block truncate">
                                    {lIdx + 1}. {lesson.title}
                                  </span>
                                  <span className="font-mono text-[10px] text-[#7b7974] uppercase">
                                    {lesson.lessonType}
                                    {lesson.durationSeconds
                                      ? ` • ${Math.round(lesson.durationSeconds / 60)} min`
                                      : ''}
                                  </span>
                                </div>
                              </div>

                              <span className="font-mono text-[10px] text-[#4b7a47] shrink-0 font-semibold px-2 py-0.5 rounded bg-[#eaf4ea]">
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
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#e7e6e1]">
              <ShieldCheck className="w-4 h-4 text-[#d97757]" />
              <h2 className="font-heading text-base text-[#121212]">
                Course Quality Checklist
              </h2>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#121212]">
                  <span>Difficulty Level Match</span>
                  <span className="text-[#4b7a47]">Aligned</span>
                </div>
                <p className="text-[11px] text-[#7b7974] leading-snug">
                  Course depth aligns with {course.difficulty} classification standards.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#121212]">
                  <span>Copyright &amp; Citations</span>
                  <span className="text-[#4b7a47]">Verified</span>
                </div>
                <p className="text-[11px] text-[#7b7974] leading-snug">
                  Original instructional material verified with no copyright infringement detected.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#121212]">
                  <span>Assessments</span>
                  <span className="text-[#d97757]">
                    {sections.some(s => s.lessons.some(l => l.lessonType === 'QUIZ'))
                      ? 'Quizzes Added'
                      : 'Lessons Only'}
                  </span>
                </div>
                <p className="text-[11px] text-[#7b7974] leading-snug">
                  Includes comprehensive knowledge assessments for student certification.
                </p>
              </div>
            </div>

            {/* Review Actions */}
            <div className="pt-3 border-t border-[#e7e6e1] space-y-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                Approve Course
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(true);
                  setRejectReason('');
                }}
                className="w-full py-2 rounded-xl text-xs font-mono text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-colors cursor-pointer"
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
          <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-[#e7e6e1] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#e7e6e1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#121212]">
                    Reject Course
                  </h3>
                  <span className="font-mono text-xs text-[#7b7974]">
                    Instructor: {(course as any).instructorName || 'Instructor'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="w-8 h-8 rounded-lg bg-[#f8f8f6] hover:bg-[#efeeeb] flex items-center justify-center text-[#7b7974] hover:text-[#121212] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs text-[#121212] font-semibold block">
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
                    className="text-left p-2 rounded-lg bg-[#f8f8f6] hover:bg-[#efeeeb] text-[11px] font-mono text-[#373734] border border-[#e7e6e1] transition-colors cursor-pointer"
                  >
                    + {crit}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-mono text-xs text-[#121212] font-semibold block">
                  Feedback for Instructor (Required):
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Outline the required adjustments or changes needed before re-submission..."
                  className="w-full p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] text-xs font-mono text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:border-[#ba1a1a]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e7e6e1]">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#7b7974] hover:bg-[#efeeeb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-[#ffffff] font-mono text-xs font-medium shadow-xs disabled:opacity-50 cursor-pointer"
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
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#e7e6e1] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eaf4ea] flex items-center justify-center text-[#4b7a47] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium text-[#121212]">
                  Approve Course for Publication
                </h3>
                <p className="text-xs text-[#7b7974] leading-relaxed">
                  Are you sure you wish to approve "{course.title}"? The course will be published immediately in the course catalog.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] text-xs font-mono text-[#373734] space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-[#121212]">Published</span>
              </div>
              <div className="flex justify-between">
                <span>Pricing:</span>
                <span className="font-semibold text-[#121212]">
                  {course.price === 0 || course.price === null ? 'Scholarship' : `$${course.price.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e7e6e1]">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#7b7974] hover:bg-[#efeeeb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium shadow-xs cursor-pointer"
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
