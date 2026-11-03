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

      {/* ── A. Senate Governance Header & Metrics ── */}
      <section className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#121212] text-[#ffffff] font-semibold tracking-wider uppercase">
                Curriculum Senate
              </span>
              <span className="text-xs font-mono text-[#7b7974] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d97757]" />
                Institutional Peer Review Standard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#121212] tracking-tight">
              Curriculum Moderation &amp; Peer Review Docket
            </h1>
            <p className="text-xs sm:text-sm text-[#7b7974] leading-relaxed">
              Audit submitted monographs, evaluate syllabus rigor, verify instructional integrity, and clear courses for global consortium publication.
            </p>
          </div>

          {/* Metric Stats */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto shrink-0 flex-wrap">
            <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col min-w-[130px]">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">
                Pending Audits
              </span>
              <span className="font-serif text-2xl font-normal text-[#d97757] mt-0.5">
                {pageData.totalElements}
              </span>
              <span className="text-[10px] font-mono text-[#9c9a92]">Monographs Staged</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col min-w-[130px]">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">
                Senate Standard
              </span>
              <span className="font-serif text-2xl font-normal text-[#121212] mt-0.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4b7a47]"></span>
                Active Quorum
              </span>
              <span className="text-[10px] font-mono text-[#9c9a92]">Accreditation Cleared</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Search, Filter & View Controls Bar ── */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9a92]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search curricula by title, instructor, or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#ffffff] border border-[#e7e6e1] text-xs font-mono text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:border-[#121212] transition-colors"
          />
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#121212] text-[#ffffff] font-semibold'
                  : 'bg-[#f8f8f6] text-[#7b7974] hover:bg-[#efeeeb] hover:text-[#121212] border border-[#e7e6e1]'
              }`}
            >
              All Categories
            </button>
            {allCategories.slice(0, 4).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#121212] text-[#ffffff] font-semibold'
                    : 'bg-[#f8f8f6] text-[#7b7974] hover:bg-[#efeeeb] hover:text-[#121212] border border-[#e7e6e1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table / Grid Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#ffffff] text-[#121212] shadow-2xs' : 'text-[#9c9a92] hover:text-[#121212]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#ffffff] text-[#121212] shadow-2xs' : 'text-[#9c9a92] hover:text-[#121212]'
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
        <div className="bg-[#ffffff] rounded-2xl p-12 text-center border border-[#e7e6e1] flex flex-col items-center justify-center gap-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#f8f8f6] border border-[#e7e6e1] flex items-center justify-center text-[#7b7974]">
            <CheckCircle2 className="w-7 h-7 text-[#4b7a47]" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="font-serif text-xl text-[#121212]">
              {searchQuery ? 'No Monographs Found' : 'Curriculum Queue Clear'}
            </h3>
            <p className="text-xs text-[#7b7974] leading-relaxed">
              {searchQuery
                ? 'No submitted curricula matched your search query. Try clearing filters or checking other terms.'
                : 'All submitted course curricula have been audited and evaluated. The Senate moderation queue is currently clear.'}
            </p>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] font-mono text-xs transition-colors cursor-pointer"
            >
              Reset Search Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7e6e1] bg-[#f8f8f6]/70">
                  <th className="py-3.5 px-5 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider">
                    Curriculum Monograph
                  </th>
                  <th className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider">
                    Authoring Faculty
                  </th>
                  <th className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider">
                    Discipline &amp; Rigor
                  </th>
                  <th className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider">
                    Tuition / Grant
                  </th>
                  <th className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 font-mono text-[10px] uppercase font-bold text-[#7b7974] tracking-wider text-right">
                    Senate Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e6e1]">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-[#f8f8f6]/50 transition-colors">
                    {/* Title & Cover */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#efeeeb] border border-[#e7e6e1] overflow-hidden shrink-0 flex items-center justify-center text-[#7b7974]">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#9c9a92]" />
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0 max-w-sm">
                          <Link
                            to={`/admin/courses/${course.id}/review`}
                            className="font-serif text-base font-medium text-[#121212] hover:text-[#d97757] transition-colors line-clamp-1"
                          >
                            {course.title}
                          </Link>
                          <span className="font-mono text-[11px] text-[#7b7974] block">
                            ID: #{course.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="py-4 px-4 font-mono text-xs text-[#373734]">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-[#9c9a92]" />
                        <span>{course.instructorName || 'Consortium Fellow'}</span>
                      </div>
                    </td>

                    {/* Category & Difficulty */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-[#121212] font-medium">
                          {course.category || 'General Studies'}
                        </span>
                        <span className="font-mono text-[10px] text-[#7b7974] uppercase">
                          {course.difficulty}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-mono text-xs text-[#121212] font-semibold">
                      {course.price === 0 || course.price === null ? (
                        <span className="text-[#4b7a47]">Scholarship / Free</span>
                      ) : (
                        `$${course.price.toFixed(2)}`
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-[#fff5f0] text-[#d97757] border border-[#d97757]/30 whitespace-nowrap">
                        Awaiting Peer Review
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/courses/${course.id}/review`}
                          className="px-3.5 py-1.5 rounded-lg bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Audit</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
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
              className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] hover:border-[#b7b7b5] transition-all p-5 flex flex-col justify-between gap-4 shadow-xs group"
            >
              <div className="space-y-3.5">
                {/* Cover & Badges */}
                <div className="w-full h-36 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] overflow-hidden relative flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-[#9c9a92]" />
                  )}
                  <span className="absolute top-2.5 right-2.5 font-mono text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-[#ffffff]/90 text-[#d97757] border border-[#e7e6e1] backdrop-blur-xs">
                    Pending
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[#7b7974]">
                    <span>{course.category}</span>
                    <span className="uppercase">{course.difficulty}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#121212] line-clamp-2 group-hover:text-[#d97757] transition-colors">
                    {course.title}
                  </h3>
                  <span className="font-mono text-xs text-[#7b7974] flex items-center gap-1 pt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#9c9a92]" />
                    {course.instructorName || 'Consortium Fellow'}
                  </span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-[#e7e6e1] flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#121212]">
                  {course.price === 0 || course.price === null ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
                <Link
                  to={`/admin/courses/${course.id}/review`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#121212] hover:bg-black text-[#ffffff] font-mono text-xs font-medium transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Audit Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── D. Pagination Controls ── */}
      {pageData.totalPages > 1 && (
        <section className="flex items-center justify-between pt-4 border-t border-[#e7e6e1]">
          <span className="font-mono text-xs text-[#7b7974]">
            Page {pageData.number + 1} of {pageData.totalPages} ({pageData.totalElements} Curricula)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageData.first}
              onClick={() => setPage(p => p - 1)}
              className="px-3.5 py-2 rounded-xl border border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb] font-mono text-xs text-[#121212] transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={pageData.last}
              onClick={() => setPage(p => p + 1)}
              className="px-3.5 py-2 rounded-xl border border-[#e7e6e1] bg-[#ffffff] hover:bg-[#efeeeb] font-mono text-xs text-[#121212] transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
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
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 border border-[#e7e6e1] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-[#eaf4ea] text-[#4b7a47]'
                    : 'bg-[#ffdad6]/50 text-[#ba1a1a]'
                }`}
              >
                {actionConfirm.type === 'APPROVE' ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-[#121212]">
                  {actionConfirm.type === 'APPROVE'
                    ? 'Approve Monograph Publication'
                    : 'Decline Course Curriculum'}
                </h3>
                <p className="text-xs text-[#7b7974] leading-relaxed">
                  {actionConfirm.type === 'APPROVE'
                    ? `Publish "${actionConfirm.course.title}" to the global Consortium academic catalog immediately?`
                    : `Specify the rationale for declining "${actionConfirm.course.title}". The instructor will receive this peer review critique.`}
                </p>
              </div>
            </div>

            {actionConfirm.type === 'REJECT' && (
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-[#121212] font-semibold">
                  Peer Review Critique / Reason for Declination
                </label>
                <textarea
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Incomplete syllabus modules, insufficient reference citations..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] text-xs font-mono text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:border-[#ba1a1a]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e7e6e1]">
              <button
                type="button"
                onClick={() => setActionConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#7b7974] hover:bg-[#efeeeb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className={`px-5 py-2 rounded-xl font-mono text-xs font-medium text-[#ffffff] shadow-xs cursor-pointer ${
                  actionConfirm.type === 'APPROVE'
                    ? 'bg-[#121212] hover:bg-black'
                    : 'bg-[#ba1a1a] hover:bg-[#93000a]'
                }`}
              >
                {actionConfirm.type === 'APPROVE'
                  ? approveMutation.isPending
                    ? 'Publishing...'
                    : 'Approve & Disseminate'
                  : rejectMutation.isPending
                  ? 'Declining...'
                  : 'Decline Monograph'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
