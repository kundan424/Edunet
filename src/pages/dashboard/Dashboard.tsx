import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth/AuthProvider';
import { useStudentDashboard } from '../../features/dashboard/queries';
import { useInstructorDashboard } from '../../features/instructor/queries';
import { useAdminDashboard } from '../../features/admin/queries';
import { api } from '../../lib/api';
import type { Page } from '../../features/courses/types';
import type { EnrollmentResponseDTO } from '../../features/learning/types';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  Star,
  Play,
  ArrowRight,
  Shield,
  ShieldCheck,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

function formatCohortDate(dateString?: string) {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function getCourseLiveProgress(cId: string, backendPct?: number) {
  let storedProg: { completedCount: number; totalLessons: number; percentage: number } | null = null;
  try {
    storedProg = JSON.parse(localStorage.getItem(`lumina_course_progress_${cId}`) || 'null');
  } catch {}

  let storedCompleted: string[] = [];
  try {
    storedCompleted = JSON.parse(localStorage.getItem(`lumina_completed_lessons_${cId}`) || '[]');
  } catch {}

  const completed = storedProg?.completedCount ?? storedCompleted.length;
  const total = storedProg?.totalLessons ?? (completed > 0 ? completed : 6);
  const pct = storedProg?.percentage ?? (backendPct != null && backendPct > 0 ? backendPct : (total > 0 && completed > 0 ? Math.round((completed / total) * 100) : 0));

  return { completed, total, pct };
}

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const role = user?.role;
  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';

  // Role queries (enabled conditionally to prevent unauthorized 403s)
  const { 
    data: studentData, 
    isLoading: studentLoading,
    error: studentError 
  } = useStudentDashboard({ enabled: Boolean(isStudent && user) });

  const { 
    data: instructorData, 
    isLoading: instructorLoading,
    error: instructorError 
  } = useInstructorDashboard({ enabled: Boolean(isInstructor && user) });

  const { 
    data: adminData, 
    isLoading: adminLoading,
    error: adminError 
  } = useAdminDashboard({ enabled: Boolean(isAdmin && user) });

  // Query real student enrollments to combine with continueLearning
  const { data: enrollmentsPage } = useQuery<Page<EnrollmentResponseDTO>>({
    queryKey: ['enrollments'],
    queryFn: () => api.get('/api/v1/enrollments'),
    enabled: Boolean(isStudent && user),
  });

  const realEnrollments = useMemo(() => enrollmentsPage?.content || [], [enrollmentsPage?.content]);

  // Reactive student courses list with live progress synced across workspaces
  const studentCourses = useMemo(() => {
    if (!isStudent) return [];
    
    const backendList = studentData?.continueLearning || [];
    const courseMap = new Map<string, {
      courseId: string;
      courseTitle: string;
      progressPercentage: number;
      lastLessonId: string | null;
      lastLessonTitle: string | null;
    }>();

    // 1. Add backend courses with resolved live progress
    for (const item of backendList) {
      const { pct } = getCourseLiveProgress(item.courseId, item.progressPercentage);
      const effectivePct = Math.max(item.progressPercentage || 0, pct);
      courseMap.set(item.courseId, {
        ...item,
        progressPercentage: effectivePct,
      });
    }

    // 2. Add real enrollments if not already present in continueLearning
    for (const enr of realEnrollments) {
      if (!courseMap.has(enr.courseId)) {
        const { pct } = getCourseLiveProgress(enr.courseId);
        courseMap.set(enr.courseId, {
          courseId: enr.courseId,
          courseTitle: enr.courseTitle || 'Enrolled Course',
          progressPercentage: pct,
          lastLessonId: null,
          lastLessonTitle: null,
        });
      }
    }

    return Array.from(courseMap.values());
  }, [isStudent, studentData?.continueLearning, realEnrollments]);

  // Computed live metrics for student KPI cards
  const liveTotalEnrolled = Math.max(studentData?.totalEnrolledCourses || 0, realEnrollments.length, studentCourses.length);
  const liveCompletedCourses = Math.max(
    studentData?.completedCourses || 0,
    studentCourses.filter(c => c.progressPercentage >= 100).length
  );
  const liveCompletedLessons = Math.max(
    studentData?.totalLessonsCompleted || 0,
    studentCourses.reduce((sum, c) => sum + getCourseLiveProgress(c.courseId).completed, 0)
  );
  const liveTotalLessons = Math.max(
    studentData?.totalLessonsInEnrolledCourses || 0,
    studentCourses.reduce((sum, c) => sum + getCourseLiveProgress(c.courseId).total, 0)
  );
  const liveAvgProgress = studentCourses.length > 0
    ? Math.round(studentCourses.reduce((sum, c) => sum + c.progressPercentage, 0) / studentCourses.length)
    : (studentData?.overallCourseCompletionPercentage || 0);
  const liveOverallProgress = Math.max(studentData?.overallCourseCompletionPercentage || 0, liveAvgProgress);
  const liveActiveCoursesCount = studentCourses.filter(c => c.progressPercentage < 100).length;

  const isLoading = (isStudent && studentLoading) || (isInstructor && instructorLoading) || (isAdmin && adminLoading);
  const error = (isStudent && studentError) || (isInstructor && instructorError) || (isAdmin && adminError);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#121212]/20 border-t-[#121212] rounded-full animate-spin" />
        <span className="font-heading text-lg text-[#121212]">Loading Dashboard...</span>
        <span className="font-mono text-xs text-[#7b7974]">
          {user.role === 'STUDENT' ? 'Student Dashboard' : user.role === 'INSTRUCTOR' ? 'Instructor Dashboard' : 'Admin Dashboard'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-16 px-4">
        <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#ba1a1a]/30 shadow-xs max-w-xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl text-[#121212]">Failed to load dashboard</h2>
          <p className="font-body text-xs text-[#7b7974] leading-relaxed">
            {(error as any)?.message || 'Unable to retrieve dashboard metrics.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-lg bg-[#121212] hover:bg-black text-xs font-medium text-[#f8f8f6]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Role visual identity mapping
  const roleConfig = {
    STUDENT: {
      headline: `Welcome back, ${user.name}`,
      subtext: 'Track your ongoing courses, assignments, quizzes, and learning progress.',
      badgeTitle: 'Student Account',
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      dotColor: 'bg-[#373734]',
      folioTag: 'STUDENT DASHBOARD',
      primaryActionLabel: 'Explore Courses',
      primaryActionPath: '/courses'
    },
    INSTRUCTOR: {
      headline: 'Instructor Studio & Course Management',
      subtext: 'Manage authored courses, review student enrollments, and evaluate submitted assignments.',
      badgeTitle: 'Instructor',
      badgeBg: 'bg-[#faecd8]',
      badgeText: 'text-[#8c501e]',
      dotColor: 'bg-[#d97757]',
      folioTag: 'INSTRUCTOR PORTAL',
      primaryActionLabel: '+ Create Course',
      primaryActionPath: '/instructor/courses/create'
    },
    ADMIN: {
      headline: 'Admin Portal & System Overview',
      subtext: 'Platform management: review instructor courses, manage users, and platform settings.',
      badgeTitle: 'Platform Administrator',
      badgeBg: 'bg-[#121212]',
      badgeText: 'text-[#f8f8f6]',
      dotColor: 'bg-[#d97757]',
      folioTag: 'ADMIN CONSOLE',
      primaryActionLabel: 'Review Courses',
      primaryActionPath: '/admin/courses'
    }
  }[user.role];

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-20">
      {/* ── Context & Sub-nav ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#e7e6e1] text-xs font-mono text-[#7b7974]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#121212] transition-colors">Lumina Learning</Link>
          <span>/</span>
          <span>{roleConfig.folioTag}</span>
          <span>/</span>
          <span className="text-[#121212] font-semibold">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9c9a92]">
          <span>Session:</span>
          <span className="bg-[#efeeeb] text-[#121212] px-2 py-0.5 rounded font-bold">
            Academic Term 2026
          </span>
        </div>
      </div>

      {/* ── Top Header Hero Banner ── */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl text-[#121212] font-normal tracking-tight">
              {roleConfig.headline}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${roleConfig.badgeBg} ${roleConfig.badgeText} font-mono text-[11px] font-bold tracking-wider uppercase`}>
              <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dotColor} ${isInstructor ? 'animate-pulse' : ''}`} />
              {roleConfig.badgeTitle}
            </span>
          </div>
          <p className="font-body text-xs sm:text-sm text-[#7b7974] max-w-2xl leading-relaxed">
            {roleConfig.subtext}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-xs font-medium transition-colors border border-[#e7e6e1]"
          >
            Profile &amp; Credentials
          </Link>
          <Link
            to={roleConfig.primaryActionPath}
            className="px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-black text-[#f8f8f6] text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{roleConfig.primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d97757]" />
          </Link>
        </div>
      </div>

      {/* ── 4-Card Primary KPI Metric Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* STUDENT METRICS */}
        {isStudent && (
          <>
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Enrolled Courses
                </span>
                <BookOpen className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {liveTotalEnrolled}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>{liveActiveCoursesCount} currently active</span>
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Lessons Completed
                </span>
                <Play className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {liveCompletedLessons}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>of {liveTotalLessons} total lessons</span>
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Quizzes Passed
                </span>
                <Award className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {studentData?.quizzesPassed || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>Avg score: {studentData?.averageQuizScore ? `${studentData.averageQuizScore.toFixed(0)}%` : 'N/A'}</span>
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Overall Progress
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                {liveOverallProgress}%
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>{liveCompletedCourses} courses completed</span>
              </span>
            </div>
          </>
        )}

        {/* INSTRUCTOR METRICS */}
        {isInstructor && (
          <>
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Total Students
                </span>
                <Users className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {instructorData?.totalEnrolledStudents || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                Active students across all courses
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Total Revenue
                </span>
                <DollarSign className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                ${instructorData?.totalRevenue ? instructorData.totalRevenue.toFixed(2) : '0.00'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                Total course sales earnings
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  My Courses
                </span>
                <Layers className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {instructorData?.totalCoursesOwned || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {instructorData?.publishedCourses || 0} published • {instructorData?.draftCourses || 0} drafts
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Average Rating
                </span>
                <Star className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                ★ {instructorData?.averageRating ? instructorData.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                From {instructorData?.totalCourseReviews || 0} student reviews
              </span>
            </div>
          </>
        )}

        {/* ADMIN METRICS */}
        {isAdmin && (
          <>
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Total Users
                </span>
                <Users className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {adminData?.users.total || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.users.instructors || 0} instructors • {adminData?.users.students || 0} students
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Total Sales
                </span>
                <DollarSign className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                ${adminData?.payments.totalAmount ? adminData.payments.totalAmount.toFixed(2) : '0.00'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.payments.totalSuccessful || 0} transactions completed
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Total Courses
                </span>
                <BookOpen className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {adminData?.courses.total || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.courses.published || 0} published in catalog
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Platform Rating
                </span>
                <Star className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                ★ {adminData?.reviews.averageRating ? adminData.reviews.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.reviews.total || 0} student reviews received
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Two-Column Lower Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Primary Action Focus */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* STUDENT: Continue Learning */}
          {isStudent && (
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    Continue Learning
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Pick up where you left off in your enrolled courses.
                  </span>
                </div>
                <Link
                  to="/learn"
                  className="text-xs font-mono text-[#d97757] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>All Enrolled</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {studentCourses && studentCourses.length > 0 ? (
                <div className="flex flex-col gap-3.5">
                  {studentCourses.map(item => {
                    const isCompleted = (item.progressPercentage || 0) >= 100;
                    return (
                      <div
                        key={item.courseId}
                        className="p-4 rounded-xl bg-[#f8f8f6] hover:bg-[#efeeeb]/70 border border-[#e7e6e1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-base text-[#121212] truncate">
                              {item.courseTitle}
                            </span>
                            {isCompleted && (
                              <span className="px-2 py-0.5 rounded bg-[#eaf4ea] text-[#245222] font-mono text-[10px] font-bold">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          {item.lastLessonTitle && !isCompleted && (
                            <span className="font-mono text-[11px] text-[#7b7974] truncate">
                              Next: {item.lastLessonTitle}
                            </span>
                          )}
                          {/* Progress Bar */}
                          <div className="w-full max-w-xs bg-[#e7e6e1] rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${isCompleted ? 'bg-[#4b7a47]' : 'bg-[#121212]'}`}
                              style={{ width: `${item.progressPercentage || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* When 100% completed, don't show Resume; show Course Details */}
                        {isCompleted ? (
                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eaf4ea] text-[#245222] font-mono text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#4b7a47]" />
                              <span>100% Complete</span>
                            </span>
                            <Link
                              to={`/courses/${item.courseId}`}
                              className="px-3.5 py-2 rounded-xl bg-[#ffffff] hover:bg-[#efeeeb] text-[#121212] font-body text-xs font-medium border border-[#e7e6e1] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Course Details</span>
                              <ExternalLink className="w-3 h-3 text-[#7b7974]" />
                            </Link>
                          </div>
                        ) : (
                          <Link
                            to={item.lastLessonId ? `/learn/${item.courseId}?lessonId=${item.lastLessonId}` : `/learn/${item.courseId}`}
                            className="px-4 py-2 rounded-xl bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-[#d97757]" />
                            <span>Resume ({item.progressPercentage || 0}%)</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-[#e7e6e1] bg-[#f8f8f6] text-center flex flex-col items-center justify-center gap-2.5">
                  <BookOpen className="w-8 h-8 text-[#9c9a92]" />
                  <span className="font-heading text-base text-[#121212]">No Active Courses</span>
                  <p className="font-body text-xs text-[#7b7974] max-w-sm leading-relaxed">
                    Browse the course catalog to enroll in video lessons, quizzes, and practical assignments.
                  </p>
                  <Link
                    to="/courses"
                    className="mt-2 px-4 py-2 rounded-lg bg-[#121212] text-[#f8f8f6] text-xs font-medium hover:bg-black shadow-xs"
                  >
                    Explore Course Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* INSTRUCTOR: Recent Courses */}
          {isInstructor && (
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    My Courses
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Your recent courses created on Lumina.
                  </span>
                </div>
                <Link
                  to="/instructor/courses"
                  className="text-xs font-mono text-[#d97757] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View All ({instructorData?.recentCourses?.length || 0})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {instructorData?.recentCourses && instructorData.recentCourses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {instructorData.recentCourses.map(course => {
                    const resolvedCourseId = course.id || course.courseId || '';
                    return (
                      <div
                        key={resolvedCourseId || course.title}
                        className="p-4 rounded-xl bg-[#f8f8f6] hover:bg-[#efeeeb]/70 border border-[#e7e6e1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading text-base text-[#121212] truncate">
                              {course.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734] font-mono text-[10px] uppercase font-bold">
                              {course.publishStatus}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#7b7974]">
                            {course.studentCount} enrolled students • {course.category || 'General'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <Link
                            to={`/instructor/courses/${resolvedCourseId}`}
                            className="px-3.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#e7e6e1] text-[#121212] font-body text-xs font-medium border border-[#e7e6e1] shadow-2xs hover:border-[#121212] transition-colors cursor-pointer"
                          >
                            Edit Course
                          </Link>
                          <Link
                            to={`/courses/${resolvedCourseId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-xs font-medium border border-[#e7e6e1] transition-colors cursor-pointer"
                          >
                            Preview
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-[#e7e6e1] bg-[#f8f8f6] text-center flex flex-col items-center justify-center gap-2.5">
                  <Layers className="w-8 h-8 text-[#9c9a92]" />
                  <span className="font-heading text-base text-[#121212]">No Courses Created Yet</span>
                  <p className="font-body text-xs text-[#7b7974] max-w-sm leading-relaxed">
                    Begin creating your first course with lessons, quizzes, and resources.
                  </p>
                  <Link
                    to="/instructor/courses/create"
                    className="mt-2 px-4 py-2 rounded-lg bg-[#121212] text-[#f8f8f6] text-xs font-medium hover:bg-black shadow-xs"
                  >
                    + Create First Course
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ADMIN: Action Required Board */}
          {isAdmin && (
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    Pending Approvals &amp; Moderation
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Pending instructor applications and course reviews.
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#faecd8] text-[#8c501e] font-bold">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pending Instructors Card */}
                <div className="p-5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#d97757] shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono uppercase text-[#7b7974] font-semibold">Instructor Applications</span>
                      <span className="font-heading text-2xl text-[#121212] mt-0.5">
                        {adminData?.instructors.pending || 0} Pending
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/instructors"
                    className="w-full py-2 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium text-center shadow-xs"
                  >
                    Review Applications →
                  </Link>
                </div>

                {/* Pending Course Moderation Card */}
                <div className="p-5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#121212] shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono uppercase text-[#7b7974] font-semibold">Course Moderation</span>
                      <span className="font-heading text-2xl text-[#121212] mt-0.5">
                        {adminData?.courses.pendingApproval || 0} Pending Review
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/courses"
                    className="w-full py-2 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium text-center shadow-xs"
                  >
                    Review Courses →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Secondary Feed & Overview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* STUDENT: Quiz & Assignment Progress */}
          {isStudent && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Quiz &amp; Assignment Progress</span>
                <Award className="w-4 h-4 text-[#d97757]" />
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Quizzes Attempted</span>
                  <span className="font-mono font-bold text-[#121212]">{studentData?.quizzesAttempted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Quizzes Passed</span>
                  <span className="font-mono font-bold text-[#4b7a47]">{studentData?.quizzesPassed || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Assignments Submitted</span>
                  <span className="font-mono font-bold text-[#121212]">{studentData?.assignmentsSubmitted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Assignments Graded</span>
                  <span className="font-mono font-bold text-[#121212]">{studentData?.assignmentsGraded || 0}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e7e6e1]">
                <Link
                  to="/learn"
                  className="w-full py-2 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-xs font-medium text-center block"
                >
                  Go to My Learning
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUCTOR: Recent Enrollments & Review Feed */}
          {isInstructor && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Recent Student Activity</span>
                <Clock className="w-4 h-4 text-[#9c9a92]" />
              </div>

              <div className="flex flex-col gap-3">
                {instructorData?.recentEnrollments && instructorData.recentEnrollments.length > 0 ? (
                  instructorData.recentEnrollments.slice(0, 4).map((act, actIdx) => {
                    const rawDate = act.createdAt || act.timestamp;
                    const activityDescription = act.description || (act.studentName ? `${act.studentName} enrolled in ${act.courseTitle}` : 'Student enrolled in course');
                    return (
                      <div key={act.id || act.referenceId || `enr-${actIdx}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#e7e6e1]/60 last:border-0 last:pb-0">
                        <span className="font-semibold text-[#121212] leading-snug">
                          {activityDescription}
                        </span>
                        <span className="font-mono text-[10px] text-[#9c9a92] pt-0.5">
                          {formatCohortDate(rawDate)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-[#7b7974] italic">No recent enrollments recorded.</span>
                )}

                {/* Also render recent reviews if present */}
                {instructorData?.recentReviews && instructorData.recentReviews.length > 0 && (
                  <div className="pt-3 border-t border-[#e7e6e1] flex flex-col gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7974] font-semibold">
                      Recent Student Reviews
                    </span>
                    {instructorData.recentReviews.slice(0, 3).map((rev, revIdx) => (
                      <div key={rev.id || rev.courseId || `rev-${revIdx}`} className="flex flex-col gap-1 text-xs pb-2 border-b border-[#e7e6e1]/40 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#121212]">
                            {rev.reviewerName || rev.studentName || 'Student'}
                          </span>
                          <span className="text-[#d97757] font-mono text-[10px]">★ {rev.rating}</span>
                        </div>
                        <span className="text-[#7b7974] text-[11px] truncate">{rev.courseTitle}</span>
                        {rev.comment && (
                          <p className="text-[11px] text-[#373734] italic line-clamp-1">"{rev.comment}"</p>
                        )}
                        <span className="font-mono text-[10px] text-[#9c9a92]">
                          {formatCohortDate(rev.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN: Platform Activity Stream */}
          {isAdmin && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Platform Activity Log</span>
                <Shield className="w-4 h-4 text-[#d97757]" />
              </div>

              <div className="flex flex-col gap-3">
                {adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                  adminData.recentActivity.slice(0, 4).map(act => (
                    <div key={`act-${act.referenceId}-${act.type}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#e7e6e1]/60 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#373734]">{act.type}</span>
                        <span className="font-mono text-[10px] text-[#9c9a92]">
                          {formatCohortDate(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#121212] text-xs leading-snug">{act.description}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#7b7974] italic">All systems active and normal.</span>
                )}
              </div>
            </div>
          )}

          {/* Platform Info Footnote */}
          <div className="p-4 rounded-2xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7974] font-semibold">
              Security &amp; Access
            </span>
            <p className="font-body text-xs text-[#7b7974] leading-relaxed">
              Logged in securely. Course progress and certificate completion records are synchronized automatically with your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
