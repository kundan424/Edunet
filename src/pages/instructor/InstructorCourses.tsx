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
      <div className="w-full bg-card rounded-[10px] px-4 py-1.5 mb-8 border border-rule shadow-none">
        <div className="flex items-center gap-6 overflow-x-auto">
          <Link 
            to="/instructor" 
            className="py-2.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/instructor/courses" 
            className="py-2.5 text-xs sm:text-sm font-medium text-ember relative flex items-center gap-2 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-ember" />
            <span>Courses</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-ember rounded-full" />
          </Link>
          <Link 
            to="/instructor/profile" 
            className="py-2.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Bio</span>
          </Link>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs font-mono text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-ember" />
            <span>Instructor Studio • Edunet</span>
          </div>
        </div>
      </div>

      {/* ── 2. Header Bar: Title, Context, CTAs ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted">
            <span>Instructor Studio</span>
            <span>/</span>
            <span className="text-ember font-semibold">Courses</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl text-foreground tracking-tight font-bold">
            My Courses
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
            Manage your courses, view student enrollments, and track course ratings.
          </p>
        </div>

        {/* Fast Action CTAs */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button 
            type="button"
            onClick={handleExportMetrics}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-card text-foreground hover:bg-canvas transition-colors font-sans text-xs sm:text-sm font-medium border border-rule cursor-pointer shadow-none"
          >
            <Download className="w-4 h-4 text-muted" />
            <span>Export Metrics</span>
          </button>
          <button 
            type="button"
            onClick={() => navigate('/instructor/courses/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 transition-colors shadow-none font-sans text-xs sm:text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* ── 3. Filter & Sorting Bar ── */}
      <div className="bg-card p-2 sm:p-2.5 rounded-[10px] mb-8 border border-rule shadow-none flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button 
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-wash text-ember font-semibold'
                : 'text-muted hover:text-foreground hover:bg-canvas'
            }`}
          >
            All Courses ({counts.all})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('PUBLISHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'PUBLISHED'
                ? 'bg-wash text-ember font-semibold'
                : 'text-muted hover:text-foreground hover:bg-canvas'
            }`}
          >
            Published ({counts.published})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('DRAFT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'DRAFT'
                ? 'bg-wash text-ember font-semibold'
                : 'text-muted hover:text-foreground hover:bg-canvas'
            }`}
          >
            Drafts ({counts.draft})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('PENDING_APPROVAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'PENDING_APPROVAL'
                ? 'bg-wash text-ember font-semibold'
                : 'text-muted hover:text-foreground hover:bg-canvas'
            }`}
          >
            Pending Review ({counts.pending})
          </button>
          <button 
            type="button"
            onClick={() => setActiveFilter('ARCHIVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'ARCHIVED'
                ? 'bg-wash text-ember font-semibold'
                : 'text-muted hover:text-foreground hover:bg-canvas'
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
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground cursor-pointer px-2 py-1"
          >
            <span className="font-mono text-[11px]">Sort:</span>
            <span className="text-foreground font-medium">{sortLabels[sortBy]}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-card rounded-[10px] border border-rule shadow-lg p-1.5 z-30 flex flex-col gap-0.5">
              {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSortBy(key);
                    setIsSortOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    sortBy === key ? 'bg-wash text-ember font-semibold' : 'text-muted hover:bg-canvas hover:text-foreground'
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
        <div className="w-full rounded-[10px] bg-card p-8 sm:p-14 border border-rule shadow-none flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
          <div className="w-16 h-16 rounded-[10px] bg-wash flex items-center justify-center mb-5 relative border border-rule">
            <BookOpen className="w-8 h-8 text-ember" />
          </div>
          <h3 className="font-sans text-2xl font-bold text-foreground mb-2">
            No courses yet
          </h3>
          <p className="font-sans text-xs sm:text-sm text-muted max-w-md mb-6 leading-relaxed">
            Get started by creating your first course and sharing your expertise with students. Edunet provides video streaming, interactive quizzes, and automated credential issuance.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate('/instructor/courses/create')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 transition-colors shadow-none font-sans text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Create Your First Course</span>
            </button>
            <Link 
              to="/about"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-card hover:bg-canvas text-foreground transition-colors font-sans text-xs sm:text-sm font-medium border border-rule shadow-none"
            >
              <FileText className="w-4 h-4 text-muted" />
              <span>View Course Authoring Manual</span>
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-rule flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Full IP Ownership</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-ember" />
              <span>95% Author Royalty</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-ember" />
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
            className="rounded-[10px] bg-card hover:bg-canvas border border-dashed border-rule hover:border-ember transition-all p-7 flex flex-col items-center justify-center text-center cursor-pointer group shadow-none min-h-[360px] relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-[10px] bg-wash group-hover:bg-[#E0E7FF] transition-colors flex items-center justify-center mb-4 border border-rule">
              <FilePlus className="w-7 h-7 text-ember" />
            </div>
            <span className="font-sans text-lg font-bold text-foreground mb-1">
              Draft a New Curriculum
            </span>
            <p className="font-sans text-xs text-muted max-w-xs mb-6 leading-relaxed">
              Assemble modular reading weeks, integrate terminal notebooks, and bind peer-reviewed seminar rubrics.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ember text-white group-hover:bg-ember/90 transition-colors font-sans text-xs font-medium shadow-none">
              <Plus className="w-4 h-4 text-white" />
              <span>Initiate Syllabus</span>
            </span>
            <span className="absolute bottom-3 text-[10px] font-mono text-muted">
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
    <article className="bg-card rounded-[10px] overflow-hidden border border-rule hover:border-ember/40 shadow-none transition-all flex flex-col justify-between group">
      <div>
        {/* 16:9 Thumbnail (Image or Vector Artwork) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-canvas">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <CourseVectorThumbnail course={course} index={index} />
          )}

          {/* Status Pill */}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={course.publishStatus} />
          </div>
        </div>

        {/* Metadata Body */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule text-[10px] font-mono uppercase tracking-wider font-semibold">
              {course.category || 'General Curriculum'}
            </span>
            <span className="text-[10px] font-mono text-muted font-medium uppercase tracking-widest">
              {course.difficulty || 'All Levels'}
            </span>
          </div>

          <h2 className="font-sans text-base font-semibold text-foreground leading-snug line-clamp-2 min-h-[44px] group-hover:text-ember transition-colors">
            {course.title}
          </h2>

          <p className="font-sans text-xs text-muted line-clamp-1">
            {course.description || 'Comprehensive course with video lectures, quizzes, and practical exercises.'}
          </p>

          {/* Metric Divider & Row */}
          <div className="pt-2 border-t border-rule" />
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-3 text-muted font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-muted" />
                <span>{(course.studentCount || 0).toLocaleString()} learners</span>
              </span>
              <span className="flex items-center gap-0.5 text-foreground font-medium">
                <Star className="w-3 h-3 text-ember fill-[#F59E0B]" />
                <span>{course.rating ? course.rating.toFixed(1) : '5.0'}</span>
              </span>
            </div>

            <span className="font-sans font-semibold text-foreground text-xs">
              {course.price !== null && course.price !== undefined ? (course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`) : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-canvas border-t border-rule flex items-center gap-2">
        <button 
          type="button"
          onClick={onEdit}
          className="flex-1 py-2 px-3 rounded-lg bg-ember text-white hover:bg-ember/90 transition-colors flex items-center justify-center gap-1.5 shadow-none text-xs font-medium cursor-pointer"
        >
          {isDraft ? (
            <>
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>Continue Draft</span>
            </>
          ) : isPending ? (
            <>
              <Hourglass className="w-3.5 h-3.5 text-white" />
              <span>View Review</span>
            </>
          ) : isArchived ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>Restore Course</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span>Edit Course</span>
            </>
          )}
        </button>

        <button 
          type="button"
          onClick={onPreview}
          className="flex-1 py-2 px-3 rounded-lg bg-white border border-rule text-foreground hover:bg-canvas transition-colors flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer shadow-none"
        >
          <Eye className="w-3.5 h-3.5 text-muted" />
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
        <IconComp className="w-4 h-4 text-ember" />
        <span className="font-mono text-[11px] text-muted truncate">
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
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] shadow-none">
          PUBLISHED
        </span>
      );
    case 'DRAFT':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-wash text-[#D97706] border border-[#FDE68A] shadow-none">
          DRAFT
        </span>
      );
    case 'PENDING_APPROVAL':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-wash text-ember border border-rule shadow-none">
          PENDING REVIEW
        </span>
      );
    case 'ARCHIVED':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-wash text-muted border border-rule shadow-none">
          ARCHIVED
        </span>
      );
    default:
      return null;
  }
}
