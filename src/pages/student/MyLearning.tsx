import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  Flame,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';
import { useStudentDashboard } from '../../features/dashboard/queries';
import { useAuth } from '../../auth/AuthProvider';
import { api } from '../../lib/api';
import { LoadingState, ErrorState } from '../../components/ui/States';
import type { Page } from '../../features/courses/types';
import type { EnrollmentResponseDTO } from '../../features/learning/types';

export function MyLearning() {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashLoading, error: dashError, refetch } = useStudentDashboard();
  const [showCiLogs, setShowCiLogs] = useState(false);

  // Query real user enrollments
  const { data: enrollmentsPage, isLoading: enrollLoading } = useQuery<Page<EnrollmentResponseDTO>>({
    queryKey: ['enrollments'],
    queryFn: () => api.get('/api/v1/enrollments'),
  });

  if (dashLoading || enrollLoading) return <LoadingState message="Loading your academic dashboard..." />;
  if (dashError) return <ErrorState title="Failed to load dashboard" message="We couldn't retrieve your learning data." onRetry={() => refetch()} />;

  // Default curated curriculum tracks matching Lumina Consortium standards
  const defaultCourses = [
    {
      courseId: 'eee8a2dcd67a4bbe9781d4645e684cb1',
      courseTitle: 'Autonomous Reasoning & Swarms',
      code: 'CS-334A',
      institution: 'Stanford AI Lab',
      subtitle: 'Distributed systems, memory safety & concurrent tree search',
      nextLesson: 'Lesson 2.1 — Fault Isolation & System Architecture',
      defaultProgress: 0,
      totalModules: 6,
    },
    {
      courseId: 'cambridge-consensus',
      courseTitle: 'Byzantine Fault Tolerant Consensus',
      code: '6.824-DIST',
      institution: 'MIT PDOS',
      subtitle: 'TLA+ state machine verification, Raft invariants & Paxos split-brain mitigations',
      nextLesson: 'Lesson 1.3 — Formal Verification in TLA+',
      defaultProgress: 0,
      totalModules: 8,
    },
    {
      courseId: 'stanford-llm',
      courseTitle: 'Large Language Model Systems, Alignment & Reasoning Engines',
      code: 'CS-324',
      institution: 'Stanford AI Lab',
      subtitle: 'Transformer math, speculative decoding, RLHF/DPO algorithms & distributed inference',
      nextLesson: 'Lesson 3.2 — Speculative Token Planning',
      defaultProgress: 0,
      totalModules: 5,
    },
    {
      courseId: 'formal-methods',
      courseTitle: 'Formal Methods, TLA+ Verification & Cryptographic Protocols',
      code: 'MIT-6.875',
      institution: 'MIT CSAIL',
      subtitle: 'State-space model checking, zero-knowledge proof primitives & formal invariants',
      nextLesson: 'Lesson 1.1 — State-Space Bounds',
      defaultProgress: 0,
      totalModules: 6,
    }
  ];

  // Helper to resolve live course progress from localStorage or backend
  const getCourseLiveProgress = (cId: string, backendPct?: number) => {
    let storedProg: { completedCount: number; totalLessons: number; percentage: number } | null = null;
    try {
      storedProg = JSON.parse(localStorage.getItem(`lumina_course_progress_${cId}`) || 'null');
    } catch {}

    let storedCompleted: string[] = [];
    try {
      storedCompleted = JSON.parse(localStorage.getItem(`lumina_completed_lessons_${cId}`) || '[]');
    } catch {}

    const completed = storedProg?.completedCount ?? storedCompleted.length;
    const total = storedProg?.totalLessons ?? 6;
    const pct = storedProg?.percentage ?? (backendPct != null && backendPct > 0 ? backendPct : (total > 0 && completed > 0 ? Math.round((completed / total) * 100) : 0));

    return { completed, total, pct };
  };

  const realEnrollments = enrollmentsPage?.content || [];

  // Build reactive continue courses list
  const continueCourses = realEnrollments.length > 0
    ? realEnrollments.map((enr, idx) => {
        const backendMatch = dashboard?.continueLearning?.find(c => c.courseId === enr.courseId);
        const fallback = defaultCourses[idx % defaultCourses.length];
        const { completed, total, pct } = getCourseLiveProgress(enr.courseId, backendMatch?.progressPercentage);

        return {
          courseId: enr.courseId,
          courseTitle: enr.courseTitle || fallback.courseTitle,
          code: fallback.code,
          institution: fallback.institution,
          subtitle: fallback.subtitle,
          nextLesson: backendMatch?.lastLessonTitle || fallback.nextLesson,
          progressPercentage: pct,
          completedModules: completed,
          totalModules: total,
          resumeLabel: pct > 0 ? 'Resume Lesson' : 'Start Course'
        };
      })
    : (dashboard?.continueLearning && dashboard.continueLearning.length > 0)
      ? dashboard.continueLearning.map((c, idx) => {
          const fallback = defaultCourses[idx % defaultCourses.length];
          const { completed, total, pct } = getCourseLiveProgress(c.courseId, c.progressPercentage);

          return {
            courseId: c.courseId,
            courseTitle: c.courseTitle || fallback.courseTitle,
            code: fallback.code,
            institution: fallback.institution,
            subtitle: fallback.subtitle,
            nextLesson: c.lastLessonTitle || fallback.nextLesson,
            progressPercentage: pct,
            completedModules: completed,
            totalModules: total,
            resumeLabel: pct > 0 ? 'Resume Lesson' : 'Start Course'
          };
        })
      : defaultCourses.map(c => {
          const { completed, total, pct } = getCourseLiveProgress(c.courseId, c.defaultProgress);

          return {
            courseId: c.courseId,
            courseTitle: c.courseTitle,
            code: c.code,
            institution: c.institution,
            subtitle: c.subtitle,
            nextLesson: c.nextLesson,
            progressPercentage: pct,
            completedModules: completed,
            totalModules: total,
            resumeLabel: pct > 0 ? 'Resume Lesson' : 'Start Course'
          };
        });

  const primaryCourse = continueCourses[0];

  // Dynamic Metrics
  const activeCount = continueCourses.length;
  const completedCount = dashboard?.completedCourses || continueCourses.filter(c => c.progressPercentage >= 100).length;
  const totalCompletedLessons = continueCourses.reduce((sum, c) => sum + c.completedModules, 0);

  // Dynamic ECTS credits (6 ECTS per fully completed course, partial for in-progress)
  const earnedEcts = Math.max(0, continueCourses.reduce((sum, c) => sum + Math.round((c.progressPercentage / 100) * 6), 0));
  const totalEctsGoal = 90;
  const ectsPct = Math.min(100, Math.round((earnedEcts / totalEctsGoal) * 100));

  // Dynamic Weekly Study Hours
  const calculatedHours = (Math.max(1.5, totalCompletedLessons * 0.75 + continueCourses.reduce((sum, c) => sum + (c.progressPercentage * 0.05), 0))).toFixed(1);
  const weeklyHoursGoal = 10.0;
  const hoursPct = Math.min(100, Math.round((Number(calculatedHours) / weeklyHoursGoal) * 100));
  const remainingHours = Math.max(0, Number((weeklyHoursGoal - Number(calculatedHours)).toFixed(1)));

  // Helper for student initials
  const getInitials = (name?: string) => {
    if (!name) return 'ER';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const studentInitials = getInitials(user?.name);
  const studentId = user?.id ? `ID: #CS-2026-${user.id.slice(0, 4).toUpperCase()}` : 'ID: #CS-2026-8841';

  return (
    <div className="w-full max-w-[1540px] mx-auto py-2 space-y-8 font-sans">
      
      {/* ========================================================================= */}
      {/* A. Academic Profile Banner (Top Full-Width Card)                          */}
      {/* ========================================================================= */}
      <section className="paper-card p-6 sm:p-7 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Identity & Standing */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-soft-stone border border-chalk flex items-center justify-center font-mono text-xl sm:text-2xl font-semibold text-carbon-ink tracking-wider shadow-xs">
                {studentInitials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-carbon-ink text-paper-white p-1 rounded-full ring-2 ring-paper-white" title="Verified Scholar">
                <CheckCircle2 className="w-3.5 h-3.5 text-paper-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif font-normal text-carbon-ink tracking-tight">
                  {user?.name || 'Elena Rostova'}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-soft-stone border border-chalk text-graphite">
                  {studentId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-soft-stone border border-chalk text-graphite flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay"></span>
                  MSc Distributed Systems Track
                </span>
              </div>

              {/* Consortium Standing & Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-graphite">
                <span className="flex items-center gap-1 text-carbon-ink font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-clay" />
                  Verified Consortium Scholar
                </span>
                <span className="text-mist">•</span>
                <span className="px-2 py-0.5 rounded bg-soft-stone text-graphite border border-chalk font-mono text-[11px]">
                  Academic Standing: In Good Standing
                </span>
                <span className="text-mist">•</span>
                <span className="text-ashen font-serif italic">
                  Stanford AI Lab &amp; MIT PDOS Joint Cohort VIII
                </span>
              </div>
            </div>
          </div>

          {/* Streak & Weekly Study Goal Gauge */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-soft-stone border border-chalk self-stretch lg:self-auto justify-between sm:justify-start shrink-0">
            {/* Streak counter */}
            <div className="flex items-center gap-3 pr-6 border-r border-chalk">
              <div className="w-10 h-10 rounded-lg bg-paper-white border border-chalk flex items-center justify-center text-clay shadow-xs">
                <Flame className="w-5 h-5 fill-clay" />
              </div>
              <div>
                <div className="text-sm font-medium text-carbon-ink flex items-center gap-1">
                  5-Day <span className="text-xs text-clay font-mono">Streak</span>
                </div>
                <div className="text-[11px] text-ashen">Active Study Streak</div>
              </div>
            </div>

            {/* Weekly Study Hours */}
            <div className="space-y-1.5 min-w-[140px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ashen">Weekly Goal</span>
                <span className="font-mono text-carbon-ink font-medium">{calculatedHours} <span className="text-pebble">/ {weeklyHoursGoal.toFixed(1)} hrs</span></span>
              </div>
              <div className="w-full h-2 bg-chalk rounded-full overflow-hidden">
                <div className="h-full bg-carbon-ink rounded-full transition-all duration-500" style={{ width: `${hoursPct}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-ashen">
                <span>{hoursPct}% complete</span>
                <span className="text-graphite font-mono">+{remainingHours} hrs remaining</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* B. Milestone KPI Metric Cards (4-Column Grid)                             */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="paper-card paper-card-hover p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-ashen mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-ashen font-mono">Active Enrolled Courses</span>
            <div className="p-1.5 rounded-lg bg-soft-stone text-carbon-ink border border-chalk">
              <BookOpen className="w-4 h-4 text-carbon-ink" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-serif text-carbon-ink tabular">
              {activeCount}
            </span>
            <span className="text-xs text-ashen">Programs</span>
          </div>
          <p className="text-xs text-clay flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-clay"></span>
            {continueCourses.filter(c => c.progressPercentage < 100).length} modules in flight
          </p>
        </div>

        {/* KPI 2 */}
        <div className="paper-card paper-card-hover p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-ashen mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-ashen font-mono">Completed Credentials</span>
            <div className="p-1.5 rounded-lg bg-soft-stone text-carbon-ink border border-chalk">
              <Award className="w-4 h-4 text-carbon-ink" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-serif text-carbon-ink tabular">
              {completedCount}
            </span>
            <span className="text-xs text-ashen">ECTS Badges</span>
          </div>
          <p className="text-xs text-graphite flex items-center gap-1 font-mono">
            <span className="text-clay">✓</span> Audited &amp; ECTS-timestamped
          </p>
        </div>

        {/* KPI 3 */}
        <div className="paper-card paper-card-hover p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-ashen mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-ashen font-mono">Avg. Assessment Score</span>
            <div className="p-1.5 rounded-lg bg-soft-stone text-carbon-ink border border-chalk">
              <TrendingUp className="w-4 h-4 text-carbon-ink" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-serif text-carbon-ink tabular">
              {dashboard?.averageQuizScore && dashboard.averageQuizScore > 0 
                ? `${dashboard.averageQuizScore.toFixed(1)}%` 
                : '94.2%'}
            </span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-soft-stone text-graphite border border-chalk">+1.8%</span>
          </div>
          <p className="text-xs text-ashen font-mono">
            vs cohort benchmark (92.4%)
          </p>
        </div>

        {/* KPI 4 */}
        <div className="paper-card paper-card-hover p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-ashen mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-ashen font-mono">Transferable ECTS Credits</span>
            <div className="p-1.5 rounded-lg bg-soft-stone text-carbon-ink border border-chalk">
              <GraduationCap className="w-4 h-4 text-carbon-ink" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-serif text-carbon-ink tabular">{earnedEcts} <span className="text-base text-ashen font-normal">/ {totalEctsGoal}</span></span>
            <span className="text-xs text-clay font-mono">ECTS</span>
          </div>
          <div className="w-full h-1.5 bg-chalk rounded-full overflow-hidden mt-1 mb-1">
            <div className="h-full bg-carbon-ink rounded-full transition-all duration-500" style={{ width: `${ectsPct}%` }}></div>
          </div>
          <p className="text-[11px] text-ashen">
            {ectsPct}% toward MSc Degree requirement
          </p>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* C. Main Dashboard 2x2 Asymmetric Bento Grid                               */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT COLUMN (60% / 7 cols): Continue Learning & Peer Feedback ── */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Continue Learning Momentum Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-clay"></span>
                <h2 className="text-xl font-serif font-normal text-carbon-ink tracking-tight">Continue Learning</h2>
                <span className="text-xs text-ashen font-mono font-normal">Active Momentum</span>
              </div>
              <span className="text-xs font-mono text-ashen">{continueCourses.length} Programs</span>
            </div>

            <div className="space-y-4">
              {continueCourses.map((course, idx) => {
                const isFirst = idx === 0;
                return (
                  <div 
                    key={course.courseId}
                    className={`paper-card paper-card-hover p-5 relative overflow-hidden border-l-4 ${
                      isFirst ? 'border-l-carbon-ink' : 'border-l-pebble'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-soft-stone text-graphite border border-chalk">
                            {course.institution}
                          </span>
                          <span className="text-[11px] font-mono text-ashen">{course.code}</span>
                        </div>
                        <h3 className="text-lg font-serif font-medium text-carbon-ink tracking-tight">
                          <Link to={`/learn/${course.courseId}`} className="hover:text-clay transition-colors">
                            {course.courseTitle}
                          </Link>
                        </h3>
                        <p className="text-xs text-graphite font-serif italic">
                          {course.subtitle}
                        </p>
                      </div>

                      {/* Resume CTA */}
                      <Link 
                        to={`/learn/${course.courseId}`}
                        className={`self-start sm:self-center px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                          isFirst 
                            ? 'bg-carbon-ink hover:bg-graphite text-paper-white' 
                            : 'bg-paper-white hover:bg-soft-stone text-carbon-ink border border-chalk'
                        }`}
                      >
                        <span>{course.resumeLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Progress & Contextual Step */}
                    <div className="p-3 rounded-lg bg-soft-stone border border-chalk space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-graphite font-mono text-[11px] truncate max-w-[70%]">
                          <span className="text-clay font-medium">Up next:</span> {course.nextLesson}
                        </span>
                        <span className="font-mono text-ashen text-[11px] shrink-0">
                          {course.progressPercentage}% ({course.completedModules} of {course.totalModules} Modules)
                        </span>
                      </div>
                      
                      {/* Dynamic Progress bar */}
                      <div className="w-full h-1.5 bg-chalk rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-carbon-ink rounded-full transition-all duration-500" 
                          style={{ width: `${course.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Left: Peer Feedback & Evaluated Defenses Drawer */}
          <div className="paper-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-chalk pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-clay" />
                <h3 className="text-sm font-semibold text-carbon-ink tracking-tight">Peer Feedback &amp; Evaluated Defenses</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-soft-stone text-graphite border border-chalk">
                Double-Blind Audited
              </span>
            </div>

            {/* Recent Graded Submission */}
            <div className="p-4 rounded-lg bg-soft-stone border border-chalk space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-carbon-ink">Lab 01: Raft Consensus Leader Election</div>
                  <div className="text-[11px] text-ashen">Course: Byzantine Fault Tolerant Consensus</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-paper-white border border-chalk text-carbon-ink font-mono font-medium text-xs">
                  Grade: A+ (98/100)
                </span>
              </div>

              {/* Peer Quote */}
              <div className="p-3 rounded bg-paper-white border-l-2 border-l-clay text-xs font-serif italic text-graphite">
                “Raft consensus state machine passed all network partition invariants cleanly under 40ms. Code telemetry reflects strict deterministic log compaction.”
                <div className="mt-1.5 text-[11px] font-sans font-normal not-italic text-ashen flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay"></span>
                  Verified Peer Reviewer <span className="font-mono text-graphite">#409</span> (Stanford Fellow)
                </div>
              </div>

              {/* Automated CI Grading Logs Terminal Pill */}
              <button 
                type="button"
                onClick={() => setShowCiLogs(true)}
                className="w-full flex items-center justify-between p-2.5 rounded bg-paper-white border border-chalk hover:border-mist text-xs font-mono text-graphite transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-clay">✓</span>
                  <span className="text-ashen">SWE-bench / QEMU Harness:</span>
                  <span className="text-carbon-ink font-medium">42/42 Tests Passed</span>
                </div>
                <span className="text-[11px] text-ashen group-hover:text-carbon-ink flex items-center gap-1">
                  View CI Logs
                  <ExternalLink className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (40% / 5 cols): Academic Calendar & Credentials ── */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Academic Calendar & Upcoming Deadlines */}
          <div className="paper-card p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-chalk pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-carbon-ink" />
                <h3 className="text-sm font-semibold text-carbon-ink tracking-tight">Calendar &amp; Invariant Deadlines</h3>
              </div>
              <button 
                type="button"
                onClick={() => alert('Calendar synced! All lecture deadlines and live defense hours added to your iCal feed.')}
                className="px-2.5 py-1 rounded bg-soft-stone hover:bg-chalk border border-chalk text-[11px] font-mono text-graphite transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Sync iCal</span>
              </button>
            </div>

            {/* Deadlines List */}
            <div className="space-y-3">
              {/* Urgent Deadline 1 */}
              <div className="p-3.5 rounded-lg bg-soft-stone border border-chalk relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-white text-clay font-medium border border-chalk flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay"></span>
                    Due in 2 Days (Fri, 23:59 UTC)
                  </span>
                  <span className="text-[11px] font-mono text-ashen">Lab 02 Defense</span>
                </div>
                <h4 className="text-xs font-semibold text-carbon-ink mb-1">
                  Zero-Trust Microkernel Sandbox Defense
                </h4>
                <div className="text-[11px] text-ashen mb-3 font-serif italic">
                  Course: {primaryCourse.courseTitle}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-chalk text-[11px]">
                  <span className="text-ashen font-mono">Weight: 20 ECTS Pts</span>
                  <Link 
                    to={`/learn/${primaryCourse.courseId}`}
                    className="text-xs font-mono font-medium text-clay hover:text-carbon-ink flex items-center gap-1"
                  >
                    <span>Submit Repo Invariants →</span>
                  </Link>
                </div>
              </div>

              {/* Live Cohort Event */}
              <div className="p-3.5 rounded-lg bg-soft-stone border border-chalk space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-white text-graphite border border-chalk">
                    Live Colloquium
                  </span>
                  <span className="text-[11px] font-mono text-ashen">Monday, 17:00 UTC</span>
                </div>
                <h4 className="text-xs font-semibold text-carbon-ink">
                  Cohort Office Hours &amp; Live Invariant Q&amp;A
                </h4>
                <div className="text-[11px] text-ashen font-serif italic">
                  Faculty Host: Prof. K. Vikram (Stanford Systems)
                </div>
                <button 
                  type="button"
                  onClick={() => alert('Connecting to Live Faculty Seminar Room...')}
                  className="w-full mt-2 py-2 rounded bg-carbon-ink hover:bg-graphite text-paper-white text-xs font-medium font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-clay animate-pulse"></span>
                  <span>Join Live Room (32 Waiting)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Right: Earned Credentials & ECTS Portfolio */}
          <div className="paper-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-chalk pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-carbon-ink" />
                <h3 className="text-sm font-semibold text-carbon-ink tracking-tight">Earned Credentials &amp; ECTS Portfolio</h3>
              </div>
              <span className="text-[11px] font-mono text-clay">Verifiable</span>
            </div>

            {/* Certificate Card */}
            <div className="p-4 rounded-lg bg-soft-stone border border-chalk space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-ashen uppercase tracking-wider">Accredited Unit</div>
                  <h4 className="text-xs font-semibold text-carbon-ink">Foundations of Formal Verification</h4>
                  <div className="text-[11px] text-ashen font-serif italic">
                    Issued by Cambridge Computer Lab
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-paper-white border border-chalk text-carbon-ink font-mono text-xs font-medium">
                    6.0 ECTS
                  </span>
                  <div className="text-[10px] font-mono text-ashen mt-1">ECTS-2026-992A</div>
                </div>
              </div>

              {/* Action Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-chalk">
                <button 
                  type="button"
                  onClick={() => alert('Official Verified PDF Transcript generated with Cambridge cryptographic stamp.')}
                  className="py-1 px-2 rounded bg-paper-white hover:bg-chalk border border-chalk text-[10px] font-mono text-graphite text-center transition-colors cursor-pointer"
                >
                  PDF Transcript
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Certificate credential added to LinkedIn Profile.')}
                  className="py-1 px-2 rounded bg-paper-white hover:bg-chalk border border-chalk text-[10px] font-mono text-graphite text-center transition-colors cursor-pointer"
                >
                  + LinkedIn
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Verifiable cryptographic badge added to GitHub Readme.')}
                  className="py-1 px-2 rounded bg-paper-white hover:bg-chalk border border-chalk text-[10px] font-mono text-graphite text-center transition-colors cursor-pointer"
                >
                  GitHub Badge
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ── CI Logs Modal ── */}
      {showCiLogs && (
        <div className="fixed inset-0 z-50 bg-carbon-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="paper-card max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-chalk pb-3">
              <div className="flex items-center gap-2">
                <span className="text-clay font-mono font-bold">✓</span>
                <h3 className="font-heading text-base font-semibold text-carbon-ink">
                  Automated CI Grading Harness Logs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCiLogs(false)}
                className="text-ashen hover:text-carbon-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-soft-stone rounded-xl p-4 font-mono text-xs text-graphite space-y-1.5 max-h-64 overflow-y-auto border border-chalk">
              <div className="text-ashen">[0.000s] Initializing QEMU / SWE-bench test environment...</div>
              <div className="text-ashen">[0.015s] Attaching eBPF kprobe telemetry filters...</div>
              <div className="text-carbon-ink">test raft::invariants::leader_election ... <span className="text-clay font-semibold">PASS (14ms)</span></div>
              <div className="text-carbon-ink">test raft::invariants::log_replication ... <span className="text-clay font-semibold">PASS (22ms)</span></div>
              <div className="text-carbon-ink">test raft::invariants::network_partition_split_brain ... <span className="text-clay font-semibold">PASS (38ms)</span></div>
              <div className="text-carbon-ink">test security::memory::guard_fences ... <span className="text-clay font-semibold">PASS (6ms)</span></div>
              <div className="text-ashen pt-1">[0.092s] All 42/42 regression tests passed with zero invariant violations.</div>
              <div className="text-carbon-ink font-semibold pt-1 text-[#3c8254]">Result: Score 98/100 · Grade: A+ Verified.</div>
            </div>

            <button
              type="button"
              onClick={() => setShowCiLogs(false)}
              className="w-full py-2 rounded-xl bg-carbon-ink text-paper-white text-xs font-mono font-medium hover:bg-obsidian cursor-pointer"
            >
              Close Verification Logs
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
