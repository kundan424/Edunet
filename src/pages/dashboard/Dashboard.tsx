import { useAuth } from '../../auth/AuthProvider';
import { useStudentDashboard } from '../../features/dashboard/queries';
import { useInstructorDashboard } from '../../features/instructor/queries';
import { useAdminDashboard } from '../../features/admin/queries';
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
  ChevronRight
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const role = user.role;
  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';

  // Role queries (enabled conditionally to prevent unauthorized 403s)
  const { 
    data: studentData, 
    isLoading: studentLoading,
    error: studentError 
  } = useStudentDashboard({ enabled: isStudent });

  const { 
    data: instructorData, 
    isLoading: instructorLoading,
    error: instructorError 
  } = useInstructorDashboard({ enabled: isInstructor });

  const { 
    data: adminData, 
    isLoading: adminLoading,
    error: adminError 
  } = useAdminDashboard({ enabled: isAdmin });

  const isLoading = (isStudent && studentLoading) || (isInstructor && instructorLoading) || (isAdmin && adminLoading);
  const error = (isStudent && studentError) || (isInstructor && instructorError) || (isAdmin && adminError);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#121212]/20 border-t-[#121212] rounded-full animate-spin" />
        <span className="font-heading text-lg text-[#121212]">Loading Institutional Console...</span>
        <span className="font-mono text-xs text-[#7b7974]">LUM-DASHBOARD-{user.role}</span>
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
          <h2 className="font-heading text-xl text-[#121212]">Failed to load dashboard console</h2>
          <p className="font-body text-xs text-[#7b7974] leading-relaxed">
            {(error as any)?.message || 'Unable to retrieve real-time institutional metrics.'}
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
      subtext: 'Track your ongoing monograph reading, lab defenses, and curriculum milestones.',
      badgeTitle: 'Academic Scholar • Fellow',
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      dotColor: 'bg-[#373734]',
      folioTag: 'STUDENT FOLIO',
      primaryActionLabel: 'Explore New Curricula',
      primaryActionPath: '/courses'
    },
    INSTRUCTOR: {
      headline: 'Faculty Studio & Curriculum Command',
      subtext: 'Manage authored curricula, review cohort enrollments, and evaluate incoming lab defenses.',
      badgeTitle: 'Faculty Senior Fellow',
      badgeBg: 'bg-[#faecd8]',
      badgeText: 'text-[#8c501e]',
      dotColor: 'bg-[#d97757]',
      folioTag: 'FACULTY GUILD',
      primaryActionLabel: '+ Initiate Course',
      primaryActionPath: '/instructor/courses/create'
    },
    ADMIN: {
      headline: 'Senate Governance & Institutional Registry',
      subtext: 'Executive platform oversight: faculty accreditation, staged syllabus review, and user moderation.',
      badgeTitle: 'Consortium Registrar • Senate Level 4',
      badgeBg: 'bg-[#121212]',
      badgeText: 'text-[#f8f8f6]',
      dotColor: 'bg-[#d97757]',
      folioTag: 'SENATE COMMAND',
      primaryActionLabel: 'Audit Staged Courses',
      primaryActionPath: '/admin/courses'
    }
  }[role];

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-20">
      {/* ── Context & Guild Sub-nav ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#e7e6e1] text-xs font-mono text-[#7b7974]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#121212] transition-colors">Consortium Console</Link>
          <span>/</span>
          <span>{roleConfig.folioTag}</span>
          <span>/</span>
          <span className="text-[#121212] font-semibold">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9c9a92]">
          <span>Institutional Term:</span>
          <span className="bg-[#efeeeb] text-[#121212] px-2 py-0.5 rounded font-bold">
            Academic Term 2026 • Lumina Consortium
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
                  Enrolled Curricula
                </span>
                <BookOpen className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {studentData?.totalEnrolledCourses || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>{studentData?.activeCourses || 0} currently active</span>
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Active Modules
                </span>
                <Play className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {studentData?.totalLessonsCompleted || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>of {studentData?.totalLessonsInEnrolledCourses || 0} lessons total</span>
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Defenses Passed
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
                  Syllabus Progress
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                {studentData?.overallCourseCompletionPercentage || 0}%
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] flex items-center gap-1 pt-1">
                <span>{studentData?.completedCourses || 0} monographs certified</span>
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
                  Total Scholars
                </span>
                <Users className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {instructorData?.totalEnrolledStudents || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                Active learners across all cohorts
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Net Royalties
                </span>
                <DollarSign className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                ${instructorData?.totalRevenue ? instructorData.totalRevenue.toFixed(2) : '0.00'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                95% Author royalty settlement
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Authored Curricula
                </span>
                <Layers className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {instructorData?.totalCoursesOwned || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {instructorData?.publishedCourses || 0} live • {instructorData?.draftCourses || 0} drafts
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Cohort Evaluation
                </span>
                <Star className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                ★ {instructorData?.averageRating ? instructorData.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                From {instructorData?.totalCourseReviews || 0} peer evaluations
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
                  Platform Scholars
                </span>
                <Users className="w-4 h-4 text-[#9c9a92]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {adminData?.users.total || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.users.instructors || 0} faculty • {adminData?.users.students || 0} scholars
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Consortium Revenue
                </span>
                <DollarSign className="w-4 h-4 text-[#4b7a47]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                ${adminData?.payments.totalAmount ? adminData.payments.totalAmount.toFixed(2) : '0.00'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.payments.totalSuccessful || 0} settlements audited
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Registered Curricula
                </span>
                <BookOpen className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#121212] font-normal">
                {adminData?.courses.total || 0}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.courses.published || 0} published across catalog
              </span>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
                  Catalog Rating
                </span>
                <Star className="w-4 h-4 text-[#d97757]" />
              </div>
              <span className="font-heading text-3xl sm:text-4xl text-[#d97757] font-normal">
                ★ {adminData?.reviews.averageRating ? adminData.reviews.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="font-mono text-[10px] text-[#7b7974] pt-1">
                {adminData?.reviews.total || 0} peer evaluations audited
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Two-Column Lower Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Primary Action Focus */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* STUDENT: Continue Learning Monograph Queue */}
          {isStudent && (
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    Continue Learning Monograph Queue
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Pick up where you left off across your active syllabus enrollments.
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

              {studentData?.continueLearning && studentData.continueLearning.length > 0 ? (
                <div className="flex flex-col gap-3.5">
                  {studentData.continueLearning.map(item => (
                    <div
                      key={item.courseId}
                      className="p-4 rounded-xl bg-[#f8f8f6] hover:bg-[#efeeeb]/70 border border-[#e7e6e1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <span className="font-heading text-base text-[#121212] truncate">
                          {item.courseTitle}
                        </span>
                        {item.lastLessonTitle && (
                          <span className="font-mono text-[11px] text-[#7b7974] truncate">
                            Next: {item.lastLessonTitle}
                          </span>
                        )}
                        {/* Progress Bar */}
                        <div className="w-full max-w-xs bg-[#e7e6e1] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-[#121212] h-1.5 rounded-full"
                            style={{ width: `${item.progressPercentage || 0}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to={`/learn/${item.courseId}`}
                        className="px-4 py-2 rounded-xl bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Play className="w-3 h-3 text-[#d97757]" />
                        <span>Resume ({item.progressPercentage || 0}%)</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-[#e7e6e1] bg-[#f8f8f6] text-center flex flex-col items-center justify-center gap-2.5">
                  <BookOpen className="w-8 h-8 text-[#9c9a92]" />
                  <span className="font-heading text-base text-[#121212]">No Active Learning Queue</span>
                  <p className="font-body text-xs text-[#7b7974] max-w-sm leading-relaxed">
                    Browse the curriculum catalog to enroll in peer-reviewed monographs and formal verification defenses.
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

          {/* INSTRUCTOR: Recent Authored Curricula */}
          {isInstructor && (
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    Authored Curricula &amp; Monographs
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Your recent syllabi staged in the consortium registry.
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
                  {instructorData.recentCourses.map(course => (
                    <div
                      key={course.id}
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
                          {course.studentCount} enrolled learners • {course.category || 'General Discipline'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <Link
                          to={`/instructor/courses/${course.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#e7e6e1] text-[#121212] font-body text-xs font-medium border border-[#e7e6e1] shadow-2xs"
                        >
                          Edit Syllabus
                        </Link>
                        <Link
                          to={`/courses/${course.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7b7974] hover:text-[#121212]"
                        >
                          Preview
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-[#e7e6e1] bg-[#f8f8f6] text-center flex flex-col items-center justify-center gap-2.5">
                  <Layers className="w-8 h-8 text-[#9c9a92]" />
                  <span className="font-heading text-base text-[#121212]">No Curricula Initiated Yet</span>
                  <p className="font-body text-xs text-[#7b7974] max-w-sm leading-relaxed">
                    Begin structuring your first monograph syllabus with peer evaluation rubrics.
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
                    Senate Action Required Board
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Pending candidate faculty accreditations and staged syllabus moderation.
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
                      <span className="text-xs font-mono uppercase text-[#7b7974] font-semibold">Faculty Accreditation</span>
                      <span className="font-heading text-2xl text-[#121212] mt-0.5">
                        {adminData?.instructors.pending || 0} Pending
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/instructors"
                    className="w-full py-2 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium text-center shadow-xs"
                  >
                    Review Faculty Profiles →
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
                        {adminData?.courses.pendingApproval || 0} Awaiting PR
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/admin/courses"
                    className="w-full py-2 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black text-xs font-medium text-center shadow-xs"
                  >
                    Audit Staged Curricula →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Secondary Feed & Dispatch Overview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* STUDENT: Comprehension Defenses Status */}
          {isStudent && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Evaluation Defenses</span>
                <Award className="w-4 h-4 text-[#d97757]" />
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Quizzes Attempted</span>
                  <span className="font-mono font-bold text-[#121212]">{studentData?.quizzesAttempted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#373734]">Defenses Passed</span>
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
                  View Full Scholar Folio
                </Link>
              </div>
            </div>
          )}

          {/* INSTRUCTOR: Recent Enrollments & Review Feed */}
          {isInstructor && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Cohort Activity Feed</span>
                <Clock className="w-4 h-4 text-[#9c9a92]" />
              </div>

              <div className="flex flex-col gap-3">
                {instructorData?.recentEnrollments && instructorData.recentEnrollments.length > 0 ? (
                  instructorData.recentEnrollments.slice(0, 4).map(act => (
                    <div key={`enr-${act.id}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#e7e6e1]/60 last:border-0 last:pb-0">
                      <span className="font-semibold text-[#121212]">{act.studentName}</span>
                      <span className="text-[#7b7974] text-[11px] truncate">enrolled in {act.courseTitle}</span>
                      <span className="font-mono text-[10px] text-[#9c9a92] pt-0.5">{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#7b7974] italic">No new cohort enrollments recorded.</span>
                )}
              </div>
            </div>
          )}

          {/* ADMIN: Platform Activity Stream */}
          {isAdmin && (
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e7e6e1]">
                <span className="font-heading text-base text-[#121212]">Consortium Audit Feed</span>
                <Shield className="w-4 h-4 text-[#d97757]" />
              </div>

              <div className="flex flex-col gap-3">
                {adminData?.recentActivity && adminData.recentActivity.length > 0 ? (
                  adminData.recentActivity.slice(0, 4).map(act => (
                    <div key={`act-${act.referenceId}-${act.type}`} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#e7e6e1]/60 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#373734]">{act.type}</span>
                        <span className="font-mono text-[10px] text-[#9c9a92]">
                          {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-[#121212] text-xs leading-snug">{act.description}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#7b7974] italic">All systems audited. Zero security anomalies.</span>
                )}
              </div>
            </div>
          )}

          {/* Institutional Charter Footnote */}
          <div className="p-4 rounded-2xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7974] font-semibold">
              Restricted Console
            </span>
            <p className="font-body text-xs text-[#7b7974] leading-relaxed">
              Authenticated under Lumina Consortium Charter §14. Folio sessions are cryptographically logged for institutional accreditation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
