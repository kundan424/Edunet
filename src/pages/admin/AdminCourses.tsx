import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AdminNav } from '../../layouts/components/AdminNav';
import { usePendingCourses, useApproveCourse, useRejectCourse } from '../../features/admin/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { CourseSummaryResponse } from '../../features/courses/types';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';

export function AdminCourses() {
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const { data: pageData, isLoading, error, refetch } = usePendingCourses(page, pageSize);
  const approveMutation = useApproveCourse();
  const rejectMutation = useRejectCourse();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Quick Action Modal State
  const [actionConfirm, setActionConfirm] = useState<{
    type: 'APPROVE' | 'REJECT';
    course: CourseSummaryResponse;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const courses = pageData?.content || [];

  // Extract categories for filter tabs
  const allCategories = useMemo(() => {
    if (!courses) return [];
    const set = new Set<string>();
    courses.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [courses]);

  // Filter courses by search and category
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.instructorName && c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [courses, searchQuery, selectedCategory]);

  if (isLoading) return <LoadingState message="Accessing Curriculum Moderation Docket..." />;
  if (error || !pageData) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6 space-y-6 font-sans">
        <AdminNav />
        <ErrorState
          title="Moderation Docket Inaccessible"
          message="Failed to load course moderation queue from the academic registry."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const handleConfirmAction = () => {
    if (!actionConfirm) return;
    const { type, course } = actionConfirm;

    if (type === 'APPROVE') {
      approveMutation.mutate(course.id, {
        onSuccess: () => {
          setActionConfirm(null);
        }
      });
    } else {
      if (!rejectReason.trim()) return;
      rejectMutation.mutate(
        { courseId: course.id, data: { reason: rejectReason } },
        {
          onSuccess: () => {
            setActionConfirm(null);
            setRejectReason('');
          }
        }
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 space-y-8 font-sans">
      <AdminNav />

      {/* ── A. Moderation Header & Metrics ── */}
      <section className="bg-white rounded-[10px] p-6 sm:p-7 border border-rule shadow-none relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule font-semibold tracking-wider uppercase">
                Course Moderation
              </span>
              <span className="text-xs font-sans text-muted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                Quality &amp; Publishing Standards
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-foreground tracking-tight">
              Course Moderation &amp; Approvals
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Review submitted courses, evaluate lesson quality, and approve courses for publication on Edunet.
            </p>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto shrink-0 flex-wrap">
            <div className="p-4 rounded-[10px] bg-canvas border border-rule shadow-none flex flex-col min-w-[130px]">
              <span className="font-mono text-[10px] uppercase text-muted font-semibold">
                Pending Review
              </span>
              <span className="font-sans text-2xl font-bold text-ember mt-0.5">
                {pageData.totalElements}
              </span>
              <span className="text-[10px] font-mono text-muted">Courses Awaiting Review</span>
            </div>

            <div className="p-4 rounded-[10px] bg-canvas border border-rule shadow-none flex flex-col min-w-[130px]">
              <span className="font-mono text-[10px] uppercase text-muted font-semibold">
                Review Status
              </span>
              <span className="font-sans text-2xl font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                Active Queue
              </span>
              <span className="text-[10px] font-mono text-muted">Quality Checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Search, Filter & View Controls Bar ── */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search curricula by title, instructor, or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-rule text-xs font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
          />
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-ember text-white font-medium shadow-none'
                  : 'bg-card text-muted hover:bg-canvas hover:text-foreground border border-rule'
              }`}
            >
              All Categories
            </button>
            {allCategories.slice(0, 4).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-ember text-white font-medium shadow-none'
                    : 'bg-card text-muted hover:bg-canvas hover:text-foreground border border-rule'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table / Grid Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-lg bg-canvas border border-rule">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-card text-ember border border-rule shadow-none' : 'text-muted hover:text-foreground'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-card text-ember border border-rule shadow-none' : 'text-muted hover:text-foreground'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── C. Course Moderation Queue View ── */}
      {filteredCourses.length === 0 ? (
        <div className="bg-card rounded-[10px] p-10 text-center border border-rule flex flex-col items-center justify-center gap-4 shadow-none">
          <div className="w-14 h-14 rounded-full bg-canvas border border-rule flex items-center justify-center text-muted">
            <CheckCircle2 className="w-7 h-7 text-[#16A34A]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-sans font-semibold text-xl text-foreground">
              {searchQuery ? 'No Courses Found' : 'Moderation Queue Clear'}
            </h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              {searchQuery
                ? 'No submitted courses matched your search query. Try clearing filters or checking other terms.'
                : 'All submitted courses have been reviewed. The moderation queue is currently clear.'}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-wash hover:bg-[#E0E7FF] text-ember font-sans text-xs font-medium transition-colors cursor-pointer"
            >
              Reset Search Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-card rounded-[10px] border border-rule shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rule bg-canvas">
                  <th className="py-3.5 px-5 font-sans text-xs uppercase font-semibold text-muted tracking-wider">
                    Course
                  </th>
                  <th className="py-3.5 px-4 font-sans text-xs uppercase font-semibold text-muted tracking-wider">
                    Instructor
                  </th>
                  <th className="py-3.5 px-4 font-sans text-xs uppercase font-semibold text-muted tracking-wider">
                    Category &amp; Level
                  </th>
                  <th className="py-3.5 px-4 font-sans text-xs uppercase font-semibold text-muted tracking-wider">
                    Price
                  </th>
                  <th className="py-3.5 px-4 font-sans text-xs uppercase font-semibold text-muted tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 font-sans text-xs uppercase font-semibold text-muted tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-canvas transition-colors">
                    {/* Title & Cover */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-lg bg-wash border border-rule overflow-hidden shrink-0 flex items-center justify-center text-ember">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-ember" />
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0 max-w-sm">
                          <Link
                            to={`/admin/courses/${course.id}/review`}
                            className="font-sans text-sm font-semibold text-foreground hover:text-ember transition-colors line-clamp-1"
                          >
                            {course.title}
                          </Link>
                          <span className="font-mono text-[11px] text-muted block">
                            ID: #{course.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="py-4 px-4 font-sans text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-muted" />
                        <span>{course.instructorName || 'Instructor'}</span>
                      </div>
                    </td>

                    {/* Category & Difficulty */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-sans text-xs text-foreground font-medium">
                          {course.category || 'General Studies'}
                        </span>
                        <span className="font-mono text-[10px] text-muted uppercase">
                          {course.difficulty}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-sans text-xs text-foreground font-semibold">
                      {course.price === 0 || course.price === null ? (
                        <span className="text-[#16A34A]">Free</span>
                      ) : (
                        `$${course.price.toFixed(2)}`
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-wash text-[#D97706] border border-[#FDE68A] whitespace-nowrap">
                        Awaiting Review
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/courses/${course.id}/review`}
                          className="px-3.5 py-1.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium transition-colors shadow-none inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-card rounded-[10px] border border-rule hover:border-ember/40 transition-all p-5 flex flex-col justify-between gap-4 shadow-none group"
            >
              <div className="space-y-3.5">
                {/* Cover & Badges */}
                <div className="w-full h-36 rounded-lg bg-canvas border border-rule overflow-hidden relative flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-ember" />
                  )}
                  <span className="absolute top-2.5 right-2.5 font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-white text-[#D97706] border border-rule">
                    Pending
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-muted">
                    <span>{course.category}</span>
                    <span className="uppercase">{course.difficulty}</span>
                  </div>
                  <h3 className="font-sans text-base font-semibold text-foreground line-clamp-2 group-hover:text-ember transition-colors">
                    {course.title}
                  </h3>
                  <span className="font-sans text-xs text-muted flex items-center gap-1 pt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-muted" />
                    {course.instructorName || 'Instructor'}
                  </span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-rule flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-foreground">
                  {course.price === 0 || course.price === null ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
                <Link
                  to={`/admin/courses/${course.id}/review`}
                  className="px-3.5 py-1.5 rounded-lg bg-ember hover:bg-ember/90 text-white font-sans text-xs font-medium transition-colors shadow-none inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Course</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── D. Pagination Controls ── */}
      {pageData.totalPages > 1 && (
        <section className="flex items-center justify-between pt-4 border-t border-rule">
          <span className="font-mono text-xs text-muted">
            Page {pageData.number + 1} of {pageData.totalPages} ({pageData.totalElements} Courses)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageData.first}
              onClick={() => setPage(p => p - 1)}
              className="px-3.5 py-2 rounded-lg border border-rule bg-card hover:bg-canvas font-sans text-xs text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={pageData.last}
              onClick={() => setPage(p => p + 1)}
              className="px-3.5 py-2 rounded-lg border border-rule bg-card hover:bg-canvas font-sans text-xs text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ── E. Quick Action Confirmation Modal ── */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] max-w-md w-full p-6 border border-rule shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-wash text-ember'
                    : 'bg-[#FEF2F2] text-[#DC2626]'
                }`}
              >
                {actionConfirm.type === 'APPROVE' ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-foreground">
                  {actionConfirm.type === 'APPROVE'
                    ? 'Approve Course Publication'
                    : 'Reject Course'}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {actionConfirm.type === 'APPROVE'
                    ? `Publish "${actionConfirm.course.title}" to the Edunet course catalog immediately?`
                    : `Specify the reason for rejecting "${actionConfirm.course.title}". The instructor will receive this feedback.`}
                </p>
              </div>
            </div>

            {actionConfirm.type === 'REJECT' && (
              <div className="space-y-1.5">
                <label className="font-sans text-xs text-foreground font-semibold">
                  Feedback / Reason for Rejection
                </label>
                <textarea
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Incomplete lesson descriptions, missing video links..."
                  rows={3}
                  className="w-full p-3 rounded-lg bg-card border border-rule text-xs font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-[#DC2626]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-rule">
              <button
                type="button"
                onClick={() => setActionConfirm(null)}
                className="px-4 py-2 rounded-lg text-xs font-sans text-muted hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className={`px-5 py-2 rounded-lg font-sans text-xs font-medium text-white shadow-none cursor-pointer ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-ember hover:bg-ember/90'
                    : 'bg-[#DC2626] hover:bg-[#B91C1C]'
                }`}
              >
                {actionConfirm.type === 'APPROVE'
                  ? approveMutation.isPending
                    ? 'Publishing...'
                    : 'Approve & Publish'
                  : rejectMutation.isPending
                  ? 'Rejecting...'
                  : 'Reject Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
