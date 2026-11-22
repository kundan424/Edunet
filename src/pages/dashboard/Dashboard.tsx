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
  ExternalLink,
  TrendingUp
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
      <div className="w-full max-w-[1280px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-2 border-ember/20 border-t-[#4F46E5] rounded-full animate-spin" />
        <span className="font-sans text-lg font-medium text-foreground">Loading Dashboard...</span>
        <span className="font-sans text-xs text-muted">
          {user.role === 'STUDENT' ? 'Student Dashboard' : user.role === 'INSTRUCTOR' ? 'Instructor Dashboard' : 'Admin Dashboard'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1280px] mx-auto py-16 px-4">
        <div className="bg-card rounded-[10px] p-8 border border-[#DC2626]/30 shadow-xs max-w-xl mx-auto flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xl font-semibold text-foreground">Failed to load dashboard</h2>
          <p className="font-sans text-xs text-muted leading-relaxed">
            {(error as any)?.message || 'Unable to retrieve dashboard metrics.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2.5 rounded-full bg-ember hover:bg-ember/90 text-xs font-medium text-white transition-colors"
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
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioTag: 'Student Dashboard',
      primaryActionLabel: 'Explore Courses',
      primaryActionPath: '/courses'
    },
    INSTRUCTOR: {
      headline: 'Instructor Studio & Course Management',
      subtext: 'Manage authored courses, review student enrollments, and evaluate submitted assignments.',
      badgeTitle: 'Instructor',
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioTag: 'Instructor Portal',
      primaryActionLabel: '+ Create Course',
      primaryActionPath: '/instructor/courses/create'
    },
    ADMIN: {
      headline: 'Admin Portal & System Overview',
      subtext: 'Platform management: review instructor courses, manage users, and platform settings.',
      badgeTitle: 'Platform Administrator',
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioTag: 'Admin Console',
      primaryActionLabel: 'Review Courses',
      primaryActionPath: '/admin/courses'
    }
  }[user.role];

  return (
    <div className="flex flex-col w-full max-w-[1360px] mx-auto pb-20 text-foreground bg-canvas">
      {/* ── Context & Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-rule text-xs font-sans text-muted">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-ember transition-colors">Edunet</Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span>{roleConfig.folioTag}</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="text-foreground font-medium">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Session:</span>
          <span className="bg-wash text-ember border border-rule px-2.5 py-0.5 rounded-full text-[11px] font-medium">
            Academic Term 2026
          </span>
        </div>
      </div>

      {/* ── Top Header Hero Banner ── */}
      <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-sans text-2xl sm:text-3xl text-foreground font-semibold tracking-[-0.015em]">
              {roleConfig.headline}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${roleConfig.badgeBg} ${roleConfig.badgeText} border ${roleConfig.badgeBorder} text-xs font-medium`}>
              {roleConfig.badgeTitle}
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            {roleConfig.subtext}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            to="/profile"
            className="px-4 py-2 rounded-lg bg-card hover:bg-canvas text-foreground text-xs sm:text-sm font-medium transition-colors border border-rule"
          >
            Profile &amp; Credentials
          </Link>
          <Link
            to={roleConfig.primaryActionPath}
            className="px-5 py-2 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{roleConfig.primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>

      {/* ── 4-Card Primary KPI Metric Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* STUDENT METRICS */}
        {isStudent && (
          <>
            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none hover:border-ember/40 transition-colors flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Enrolled Courses
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <BookOpen className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
                {liveTotalEnrolled}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <span>{liveActiveCoursesCount} currently active</span>
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none hover:border-ember/40 transition-colors flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Lessons Completed
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Play className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
                {liveCompletedLessons}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <span>of {liveTotalLessons} total lessons</span>
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none hover:border-ember/40 transition-colors flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Quizzes Passed
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#16A34A]">
                  <Award className="w-4 h-4 text-[#16A34A]" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium tracking-tight">
                {studentData?.quizzesPassed || 0}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <span>Avg score: {studentData?.averageQuizScore ? `${studentData.averageQuizScore.toFixed(0)}%` : 'N/A'}</span>
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none hover:border-ember/40 transition-colors flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Overall Progress
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <TrendingUp className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-ember font-medium tracking-tight">
                {liveOverallProgress}%
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <span>{liveCompletedCourses} courses completed</span>
              </span>
            </div>
          </>
        )}

        {/* INSTRUCTOR METRICS */}
        {isInstructor && (
          <>
            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Total Students
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Users className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                {instructorData?.totalEnrolledStudents || 0}
              </span>
              <span className="text-xs text-muted">
                Active students across all courses
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Total Revenue
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#16A34A]">
                  <DollarSign className="w-4 h-4 text-[#16A34A]" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                ${instructorData?.totalRevenue ? instructorData.totalRevenue.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-muted">
                Total course sales earnings
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  My Courses
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Layers className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                {instructorData?.totalCoursesOwned || 0}
              </span>
              <span className="text-xs text-muted">
                {instructorData?.publishedCourses || 0} published · {instructorData?.draftCourses || 0} drafts
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Average Rating
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Star className="w-4 h-4 text-ember fill-[#F59E0B]" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-ember font-medium">
                ★ {instructorData?.averageRating ? instructorData.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="text-xs text-muted">
                From {instructorData?.totalCourseReviews || 0} student reviews
              </span>
            </div>
          </>
        )}

        {/* ADMIN METRICS */}
        {isAdmin && (
          <>
            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Total Users
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Users className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                {adminData?.users.total || 0}
              </span>
              <span className="text-xs text-muted">
                {adminData?.users.instructors || 0} instructors · {adminData?.users.students || 0} students
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Total Sales
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#16A34A]">
                  <DollarSign className="w-4 h-4 text-[#16A34A]" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                ${adminData?.payments.totalAmount ? adminData.payments.totalAmount.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-muted">
                {adminData?.payments.totalSuccessful || 0} transactions completed
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Total Courses
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <BookOpen className="w-4 h-4 text-ember" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-foreground font-medium">
                {adminData?.courses.total || 0}
              </span>
              <span className="text-xs text-muted">
                {adminData?.courses.published || 0} published in catalog
              </span>
            </div>

            <div className="bg-card rounded-[10px] p-5 sm:p-6 border border-rule shadow-none flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted font-medium">
                  Platform Rating
                </span>
                <div className="w-8 h-8 rounded-lg bg-wash flex items-center justify-center text-ember">
                  <Star className="w-4 h-4 text-ember fill-[#F59E0B]" />
                </div>
              </div>
              <span className="font-sans text-3xl sm:text-4xl text-ember font-medium">
                ★ {adminData?.reviews.averageRating ? adminData.reviews.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="text-xs text-muted">
                {adminData?.reviews.total || 0} student reviews received
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Two-Column Lower Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Action Focus */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* STUDENT: Continue Learning */}
          {isStudent && (
            <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-lg sm:text-xl text-foreground font-semibold">
                    Continue Learning
                  </h2>
                  <span className="font-sans text-xs text-muted">
                    Pick up where you left off in your enrolled courses.
                  </span>
                </div>
                <Link
                  to="/learn"
                  className="text-xs font-sans text-ember hover:text-[#3730A3] font-medium flex items-center gap-1"
                >
                  <span>All Enrolled</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {studentCourses && studentCourses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {studentCourses.map(item => {
                    const isCompleted = (item.progressPercentage || 0) >= 100;
                    return (
                      <div
                        key={item.courseId}
                        className="p-4 sm:p-5 rounded-lg bg-card hover:bg-canvas border border-rule hover:border-ember/40 shadow-none transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-sans text-base font-semibold text-foreground truncate">
                              {item.courseTitle}
                            </span>
                            {isCompleted ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] text-[11px] font-medium">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule text-[11px] font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                          {item.lastLessonTitle && !isCompleted && (
                            <span className="text-xs text-muted truncate font-sans">
                              Next: {item.lastLessonTitle}
                            </span>
                          )}
                          {/* Progress Bar (Using Amber Accent for in-progress as specified by user) */}
                          <div className="w-full max-w-xs bg-[#E2E8F0] rounded-full h-2 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-[#16A34A]' : 'bg-ember'}`}
                              style={{ width: `${item.progressPercentage || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isCompleted ? (
                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] text-xs font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                              <span>100% Complete</span>
                            </span>
                            <Link
                              to={`/courses/${item.courseId}`}
                              className="px-3.5 py-1.5 rounded-lg bg-card hover:bg-canvas text-foreground text-xs font-medium border border-rule transition-colors flex items-center gap-1.5"
                            >
                              <span>Details</span>
                              <ExternalLink className="w-3 h-3 text-muted" />
                            </Link>
                          </div>
                        ) : (
                          <Link
                            to={item.lastLessonId ? `/learn/${item.courseId}?lessonId=${item.lastLessonId}` : `/learn/${item.courseId}`}
                            className="px-4 py-2 rounded-lg bg-ember text-white hover:bg-ember/90 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto active:scale-[0.98]"
                          >
                            <Play className="w-3 h-3 text-white fill-white" />
                            <span>Resume ({item.progressPercentage || 0}%)</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-lg border border-dashed border-rule bg-card text-center flex flex-col items-center justify-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-wash flex items-center justify-center text-ember">
                    <BookOpen className="w-5 h-5 text-ember" />
                  </div>
                  <span className="font-sans text-base font-semibold text-foreground">No Active Courses</span>
                  <p className="font-sans text-xs text-muted max-w-sm leading-relaxed">
                    Browse the course catalog to enroll in video lessons, quizzes, and practical assignments.
                  </p>
                  <Link
                    to="/courses"
                    className="mt-2 px-5 py-2 rounded-lg bg-ember text-white text-xs font-medium hover:bg-ember/90 transition-colors"
                  >
                    Explore Course Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* INSTRUCTOR: Recent Courses */}
          {isInstructor && (
            <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-lg sm:text-xl text-foreground font-semibold">
                    My Courses
                  </h2>
                  <span className="font-sans text-xs text-muted">
                    Your recent courses created on Edunet.
                  </span>
                </div>
                <Link
                  to="/instructor/courses"
                  className="text-xs font-sans text-ember hover:text-[#3730A3] font-medium flex items-center gap-1"
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
                        className="p-4 rounded-lg bg-card hover:bg-canvas border border-rule hover:border-ember/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-sans text-base font-semibold text-foreground truncate">
                              {course.title}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-wash text-ember border border-rule text-[11px] font-medium">
                              {course.publishStatus}
                            </span>
                          </div>
                          <span className="text-xs text-muted">
                            {course.studentCount} enrolled students · {course.category || 'General'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <Link
                            to={`/instructor/courses/${resolvedCourseId}`}
                            className="px-3.5 py-1.5 rounded-lg bg-card hover:bg-canvas text-foreground text-xs font-medium border border-rule hover:border-ember/40 transition-colors cursor-pointer"
                          >
                            Edit Course
                          </Link>
                          <Link
                            to={`/courses/${resolvedCourseId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-wash hover:bg-[#E0E7FF] text-ember text-xs font-medium border border-rule transition-colors cursor-pointer"
                          >
                            Preview
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-lg border border-dashed border-rule bg-card text-center flex flex-col items-center justify-center gap-2.5">
                  <Layers className="w-8 h-8 text-muted" />
                  <span className="font-sans text-base font-semibold text-foreground">No Courses Created Yet</span>
                  <p className="font-sans text-xs text-muted max-w-sm leading-relaxed">
                    Begin creating your first course with lessons, quizzes, and resources.
                  </p>
                  <Link
                    to="/instructor/courses/create"
                    className="mt-2 px-5 py-2 rounded-lg bg-ember text-white text-xs font-medium hover:bg-ember/90 transition-colors"
                  >
                    + Create First Course
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ADMIN: Action Required Board */}
          {isAdmin && (
            <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-lg sm:text-xl text-foreground font-semibold">
                    Pending Approvals &amp; Moderation
                  </h2>
                  <span className="font-sans text-xs text-muted">
                    Pending instructor applications and course reviews.
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-wash text-[#D97706] border border-[#FDE68A] font-medium">
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pending Instructors Card */}
                <div className="p-5 rounded-lg bg-card border border-rule hover:border-ember/40 transition-colors flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-wash border border-rule flex items-center justify-center text-ember shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-sans text-muted font-medium">Instructor Applications</span>
                      <span className="font-sans text-2xl font-semibold text-foreground mt-0.5">
                        {adminData?.instructors.pending || 0} Pending
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/instructors"
                    className="w-full py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 text-xs font-medium text-center transition-colors"
                  >
                    Review Applications →
                  </Link>
                </div>

                {/* Pending Course Moderation Card */}
                <div className="p-5 rounded-lg bg-card border border-rule hover:border-ember/40 transition-colors flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-wash border border-rule flex items-center justify-center text-ember shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-sans text-muted font-medium">Course Moderation</span>
                      <span className="font-sans text-2xl font-semibold text-foreground mt-0.5">
                        {adminData?.courses.pendingApproval || 0} Pending Review
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/courses"
                    className="w-full py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 text-xs font-medium text-center transition-colors"
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
            <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <span className="font-sans text-base font-semibold text-foreground">Quiz &amp; Assignment Progress</span>
                <Award className="w-4 h-4 text-ember" />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Quizzes Attempted</span>
                  <span className="font-sans font-semibold text-foreground">{studentData?.quizzesAttempted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Quizzes Passed</span>
                  <span className="font-sans font-semibold text-[#16A34A]">{studentData?.quizzesPassed || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Assignments Submitted</span>
                  <span className="font-sans font-semibold text-foreground">{studentData?.assignmentsSubmitted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Assignments Graded</span>
                  <span className="font-sans font-semibold text-foreground">{studentData?.assignmentsGraded || 0}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-rule">
                <Link
                  to="/learn"
                  className="w-full py-2.5 rounded-lg bg-wash hover:bg-[#E0E7FF] text-ember text-xs font-medium text-center block transition-colors border border-rule"
                >
                  Go to My Learning
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUCTOR: Recent Enrollments & Review Feed */}
          {isInstructor && (
            <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <span className="font-sans text-base font-semibold text-foreground">Recent Student Activity</span>
                <Clock className="w-4 h-4 text-muted" />
              </div>

              <div className="flex flex-col gap-3">
                {instructorData?.recentEnrollments && instructorData.recentEnrollments.length > 0 ? (
                  instructorData.recentEnrollments.slice(0, 4).map((act, actIdx) => {
                    const rawDate = act.createdAt || act.timestamp;
                    const activityDescription = act.description || (act.studentName ? `${act.studentName} enrolled in ${act.courseTitle}` : 'Student enrolled in course');
                    return (
                      <div key={act.id || act.referenceId || `enr-${actIdx}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-rule last:border-0 last:pb-0">
                        <span className="font-medium text-foreground leading-snug">
                          {activityDescription}
                        </span>
                        <span className="text-[11px] text-muted">
                          {formatCohortDate(rawDate)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-muted italic">No recent enrollments recorded.</span>
                )}

                {/* Also render recent reviews if present */}
                {instructorData?.recentReviews && instructorData.recentReviews.length > 0 && (
                  <div className="pt-3 border-t border-rule flex flex-col gap-3">
                    <span className="text-xs font-sans text-muted font-medium">
                      Recent Student Reviews
                    </span>
                    {instructorData.recentReviews.slice(0, 3).map((rev, revIdx) => (
                      <div key={rev.id || rev.courseId || `rev-${revIdx}`} className="flex flex-col gap-1 text-xs pb-2 border-b border-rule last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {rev.reviewerName || rev.studentName || 'Student'}
                          </span>
                          <span className="text-ember font-sans text-xs">★ {rev.rating}</span>
                        </div>
                        <span className="text-muted text-[11px] truncate">{rev.courseTitle}</span>
                        {rev.comment && (
                          <p className="text-[11px] text-muted italic line-clamp-1">"{rev.comment}"</p>
                        )}
                        <span className="text-[10px] text-muted">
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
            <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-rule">
                <span className="font-sans text-base font-semibold text-foreground">Platform Activity Log</span>
                <Shield className="w-4 h-4 text-ember" />
              </div>

              <div className="flex flex-col gap-3">
                {adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                  adminData.recentActivity.slice(0, 4).map(act => (
                    <div key={`act-${act.referenceId}-${act.type}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-rule last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-ember uppercase">{act.type}</span>
                        <span className="text-[11px] text-muted">
                          {formatCohortDate(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-foreground text-xs leading-snug">{act.description}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted italic">All systems active and normal.</span>
                )}
              </div>
            </div>
          )}

          {/* Platform Info Footnote */}
          <div className="p-5 rounded-[10px] bg-card border border-rule shadow-none flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">
              Security &amp; Access
            </span>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Logged in securely. Course progress and certificate completion records are synchronized automatically with your verified account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
