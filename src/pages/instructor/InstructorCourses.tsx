import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInstructorCourses } from '../../features/instructor/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { CourseResponse } from '../../features/instructor/types';
import type { PublishStatus } from '../../features/courses/types';
import {
  LayoutDashboard,
  BookOpen,
  User,
  Download,
  Plus,
  Star,
  Users,
  Edit3,
  Eye,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Terminal,
  Network,
  Cpu,
  FilePlus,
  Hourglass,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';

export function InstructorCourses() {
  const { data: courses = [], isLoading, error } = useInstructorCourses();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'ALL' | PublishStatus>('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'students' | 'rating'>('updated');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter counts
  const counts = useMemo(() => {
    return {
      all: courses.length,
      published: courses.filter(c => c.publishStatus === 'PUBLISHED').length,
      draft: courses.filter(c => c.publishStatus === 'DRAFT').length,
      pending: courses.filter(c => c.publishStatus === 'PENDING_APPROVAL').length,
      archived: courses.filter(c => c.publishStatus === 'ARCHIVED').length,
    };
  }, [courses]);

  // Filtered & sorted courses
  const filteredCourses = useMemo(() => {
    let result = activeFilter === 'ALL'
      ? [...courses]
      : courses.filter(c => c.publishStatus === activeFilter);

    result.sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'students') {
        return (b.studentCount || 0) - (a.studentCount || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

    return result;
  }, [courses, activeFilter, sortBy]);

  // Export metrics to CSV
  const handleExportMetrics = () => {
    if (courses.length === 0) {
      alert('No course metrics available to export.');
      return;
    }

    const headers = ['Course ID', 'Title', 'Category', 'Difficulty', 'Status', 'Price (USD)', 'Enrolled Students', 'Rating', 'Created At'];
    const rows = courses.map(c => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category || 'N/A'}"`,
      `"${c.difficulty || 'N/A'}"`,
      `"${c.publishStatus}"`,
      c.price !== null ? c.price.toFixed(2) : '0.00',
      c.studentCount || 0,
      c.rating !== null ? c.rating.toFixed(2) : 'N/A',
      `"${new Date(c.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lumina_instructor_course_metrics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortLabels = {
    updated: 'Recently Updated',
    created: 'Newest First',
    students: 'Most Enrolled',
    rating: 'Highest Rated'
  };

  if (isLoading) return <LoadingState message="Loading your courses..." />;
  if (error) return <ErrorState message="Failed to load instructor courses." onRetry={() => window.location.reload()} />;

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-12">
      {/* ── 1. Sub-Navigation ── */}
      <div className="w-full bg-[#ffffff]/70 backdrop-blur-sm rounded-xl px-4 py-1.5 mb-8 border border-[#e7e6e1] shadow-xs">
        <div className="flex items-center gap-6 overflow-x-auto">
          <Link 
            to="/instructor" 
            className="py-2.5 text-xs sm:text-sm font-medium text-[#7b7974] hover:text-[#121212] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/instructor/courses" 
            className="py-2.5 text-xs sm:text-sm font-medium text-[#121212] relative flex items-center gap-2 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-[#d97757]" />
            <span>Courses</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#121212] rounded-full" />
          </Link>
          <Link 
            to="/instructor/profile" 
            className="py-2.5 text-xs sm:text-sm font-medium text-[#7b7974] hover:text-[#121212] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Bio</span>
          </Link>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs font-mono text-[#7b7974]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#d97757]" />
            <span>Instructor Studio • Lumina Learning</span>
          </div>
        </div>
      </div>

      {/* ── 2. Header Bar: Title, Context, CTAs ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#7b7974]">
            <span>Instructor Studio</span>
            <span>/</span>
            <span className="text-[#d97757] font-medium">Courses</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#121212] tracking-tight font-normal">
            My Courses
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] max-w-xl leading-relaxed">
            Manage your courses, view student enrollments, and track course ratings.
          </p>
        </div>

        {/* Fast Action CTAs */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button 
            type="button"
            onClick={handleExportMetrics}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#efeeeb] text-[#373734] hover:text-[#121212] hover:bg-[#e7e6e1] transition-all font-body text-xs sm:text-sm font-medium border border-[#e7e6e1] cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#7b7974]" />
            <span>Export Metrics</span>
          </button>
          <button 
            type="button"
            onClick={() => navigate('/instructor/courses/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black transition-all shadow-sm font-body text-xs sm:text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#d97757]" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* ── 3. Filter & Sorting Bar ── */}
      <div className="bg-[#ffffff] p-2 sm:p-2.5 rounded-xl mb-8 border border-[#e7e6e1] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button 
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-[#efeeeb] text-[#121212] font-semibold'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]/60'
            }`}
          >
            All Courses ({counts.all})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('PUBLISHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'PUBLISHED'
                ? 'bg-[#efeeeb] text-[#121212] font-semibold'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]/60'
            }`}
          >
            Published ({counts.published})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('DRAFT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'DRAFT'
                ? 'bg-[#efeeeb] text-[#121212] font-semibold'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]/60'
            }`}
          >
            Drafts ({counts.draft})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('PENDING_APPROVAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'PENDING_APPROVAL'
                ? 'bg-[#efeeeb] text-[#121212] font-semibold'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]/60'
            }`}
          >
            Pending Review ({counts.pending})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('ARCHIVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'ARCHIVED'
                ? 'bg-[#efeeeb] text-[#121212] font-semibold'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]/60'
            }`}
          >
            Archived ({counts.archived})
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="relative ml-auto sm:ml-0">
          <button 
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 text-xs text-[#7b7974] hover:text-[#121212] cursor-pointer px-2 py-1"
          >
            <span className="font-mono text-[11px]">Sort:</span>
            <span className="text-[#121212] font-medium">{sortLabels[sortBy]}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#ffffff] rounded-xl border border-[#e7e6e1] shadow-lg p-1.5 z-30 flex flex-col gap-0.5">
              {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSortBy(key);
                    setIsSortOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    sortBy === key ? 'bg-[#efeeeb] text-[#121212] font-semibold' : 'text-[#7b7974] hover:bg-[#efeeeb]/50 hover:text-[#121212]'
                  }`}
                >
                  {sortLabels[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Main Course Grid ── */}
      {courses.length === 0 ? (
        /* Dedicated Empty State Component */
        <div className="w-full rounded-2xl bg-[#ffffff] p-8 sm:p-14 border border-[#e7e6e1] shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
          <div className="w-20 h-20 rounded-full bg-[#efeeeb] flex items-center justify-center mb-5 relative border border-[#e7e6e1]">
            <BookOpen className="w-9 h-9 text-[#121212]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d97757] ring-4 ring-[#ffffff]" />
          </div>
          <h3 className="font-heading text-2xl text-[#121212] mb-2 font-normal">
            No courses yet
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] max-w-md mb-6 leading-relaxed">
            Get started by creating your first course and sharing your expertise with students. Lumina provides collaborative seminar rooms, inline TeX rendering, and automated credential issuance.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate('/instructor/courses/create')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black transition-all shadow-sm font-body text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#d97757]" />
              <span>+ Create Your First Course</span>
            </button>
            <Link 
              to="/about"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#373734] transition-all font-body text-xs sm:text-sm font-medium border border-[#e7e6e1]"
            >
              <FileText className="w-4 h-4" />
              <span>View Course Authoring Manual</span>
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-[#e7e6e1] flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#7b7974]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3c8254]" />
              <span>Full IP Ownership</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d97757]" />
              <span>95% Author Royalty</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#121212]" />
              <span>Continuous Peer Review</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course, index) => (
            <CourseRegistryCard 
              key={course.id} 
              course={course} 
              index={index}
              onEdit={() => navigate(`/instructor/courses/${course.id}`)}
              onPreview={() => navigate(`/courses/${course.id}`)}
            />
          ))}

          {/* Interactive Placeholder Slot: Draft a New Curriculum */}
          <div 
            onClick={() => navigate('/instructor/courses/create')}
            className="rounded-2xl bg-[#ffffff]/60 hover:bg-[#ffffff] border border-dashed border-[#b7b7b5] hover:border-[#121212] transition-all p-7 flex flex-col items-center justify-center text-center cursor-pointer group shadow-xs hover:shadow-md min-h-[380px] relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-full bg-[#efeeeb] group-hover:bg-[#e7e6e1] transition-colors flex items-center justify-center mb-4 shadow-xs border border-[#e7e6e1]">
              <FilePlus className="w-7 h-7 text-[#d97757] group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-heading text-xl text-[#121212] mb-1 font-medium">
              Draft a New Curriculum
            </span>
            <p className="font-body text-xs text-[#7b7974] max-w-xs mb-6 leading-relaxed">
              Assemble modular reading weeks, integrate terminal notebooks, and bind peer-reviewed seminar rubrics.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#121212] text-[#f8f8f6] group-hover:bg-black transition-colors font-body text-xs font-medium shadow-xs">
              <Plus className="w-4 h-4 text-[#d97757]" />
              <span>Initiate Syllabus</span>
            </span>
            <span className="absolute bottom-3 text-[10px] font-mono text-[#9c9a92]">
              Takes ~5 minutes to configure fundamentals
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Course Registry Card Component ──
interface CourseRegistryCardProps {
  course: CourseResponse;
  index: number;
  onEdit: () => void;
  onPreview: () => void;
}

function CourseRegistryCard({ course, index, onEdit, onPreview }: CourseRegistryCardProps) {
  const isDraft = course.publishStatus === 'DRAFT';
  const isPending = course.publishStatus === 'PENDING_APPROVAL';
  const isArchived = course.publishStatus === 'ARCHIVED';

  return (
    <article className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e7e6e1] shadow-xs hover:shadow-md hover:border-[#121212]/30 transition-all flex flex-col justify-between group">
      <div>
        {/* 16:9 Thumbnail (Image or Vector Artwork) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e8e8e6]">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <CourseVectorThumbnail course={course} index={index} />
          )}

          {/* Floating Status Pill */}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={course.publishStatus} />
          </div>
        </div>

        {/* Metadata Body */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734] text-[10px] font-mono uppercase tracking-wider font-medium">
              {course.category || 'General Curriculum'}
            </span>
            <span className="text-[10px] font-mono text-[#7b7974] font-medium uppercase tracking-widest">
              {course.difficulty || 'All Levels'}
            </span>
          </div>

          <h2 className="font-heading text-[16px] font-semibold text-[#121212] leading-snug line-clamp-2 min-h-[44px] group-hover:text-[#d97757] transition-colors">
            {course.title}
          </h2>

          <p className="font-body text-xs text-[#7b7974] line-clamp-1">
            {course.description || 'Comprehensive course with video lectures, quizzes, and practical exercises.'}
          </p>

          {/* Metric Divider & Row */}
          <div className="pt-2 bg-gradient-to-r from-transparent via-[#e7e6e1] to-transparent h-[1px]" />
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-3 text-[#7b7974] font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#7b7974]" />
                <span>{(course.studentCount || 0).toLocaleString()} learners</span>
              </span>
              <span className="flex items-center gap-0.5 text-[#121212] font-medium">
                <Star className="w-3 h-3 text-[#d97757] fill-[#d97757]" />
                <span>{course.rating ? course.rating.toFixed(1) : '5.0'}</span>
              </span>
            </div>

            <span className="font-body font-semibold text-[#121212] text-xs">
              {course.price !== null && course.price !== undefined ? (course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`) : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#efeeeb]/70 border-t border-[#e7e6e1] flex items-center gap-2">
        <button 
          type="button"
          onClick={onEdit}
          className="flex-1 py-2 px-3 rounded-lg bg-[#ffffff] text-[#121212] hover:bg-[#f8f8f6] transition-all flex items-center justify-center gap-1.5 border border-[#e7e6e1] shadow-xs text-xs font-medium cursor-pointer"
        >
          {isDraft ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-[#d97757]" />
              <span>Continue Draft</span>
            </>
          ) : isPending ? (
            <>
              <Hourglass className="w-3.5 h-3.5 text-[#d97757]" />
              <span>View Review</span>
            </>
          ) : isArchived ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-[#7b7974]" />
              <span>Restore Course</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-[#d97757]" />
              <span>Edit Course</span>
            </>
          )}
        </button>

        <button 
          type="button"
          onClick={onPreview}
          className="flex-1 py-2 px-3 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#ffffff]/60 transition-all flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>
    </article>
  );
}

// ── Vector Thumbnail Graphic Generator (When no image uploaded) ──
function CourseVectorThumbnail({ course, index }: { course: CourseResponse; index: number }) {
  const styles = [
    {
      bg: 'from-[#121212] to-[#262624]',
      icon: Network,
      tag: 'Protocol Series',
      subtitle: 'Distributed Consensus & Raft'
    },
    {
      bg: 'from-[#1a211e] to-[#121413]',
      icon: Terminal,
      tag: 'Software Engineering',
      subtitle: 'Formal Methods & Invariant Specs'
    },
    {
      bg: 'from-[#262422] to-[#171615]',
      icon: Cpu,
      tag: 'Cognitive Models',
      subtitle: 'Neural Policy & Heuristic Trees'
    },
    {
      bg: 'from-[#1f1d1b] to-[#2e2621]',
      icon: Layers,
      tag: 'Kernel Core',
      subtitle: 'eBPF Probes & Runtime Isolation'
    }
  ];

  const theme = styles[index % styles.length];
  const IconComp = theme.icon;

  return (
    <div className={`w-full h-full bg-gradient-to-br ${theme.bg} p-5 flex flex-col justify-between relative overflow-hidden text-[#f8f8f6]`}>
      {/* Background Graphic Lines */}
      <svg className="absolute -right-6 -bottom-6 w-44 h-44 opacity-20 text-[#f8f8f6]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 100 100">
        <circle cx="25" cy="30" r="8" />
        <circle cx="75" cy="25" r="8" />
        <circle cx="60" cy="75" r="10" />
        <circle cx="25" cy="80" r="6" />
        <line x1="26" y1="34" x2="54" y2="70" strokeDasharray="3 3" />
        <line x1="74" y1="28" x2="26" y2="30" />
        <line x1="75" y1="31" x2="63" y2="67" />
      </svg>

      <div className="flex items-center justify-between z-10">
        <span className="font-mono text-[10px] text-[#b7b7b5] uppercase tracking-widest">
          {course.category || theme.tag}
        </span>
      </div>

      <div className="z-10 flex items-center gap-2">
        <IconComp className="w-4 h-4 text-[#d97757]" />
        <span className="font-mono text-[11px] text-[#9c9a92] truncate">
          {theme.subtitle}
        </span>
      </div>
    </div>
  );
}

// ── Status Pill Badge ──
function StatusBadge({ status }: { status: PublishStatus }) {
  switch (status) {
    case 'PUBLISHED':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
          PUBLISHED
        </span>
      );
    case 'DRAFT':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
          DRAFT
        </span>
      );
    case 'PENDING_APPROVAL':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-orange-50 text-orange-800 border border-orange-200 shadow-xs">
          PENDING REVIEW
        </span>
      );
    case 'ARCHIVED':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-xs">
          ARCHIVED
        </span>
      );
    default:
      return null;
  }
}
