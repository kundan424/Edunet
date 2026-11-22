import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { Curriculum } from '../../components/course/Curriculum';
import { VideoLesson } from '../../components/ui/VideoLesson';
import { TextLesson } from '../../components/ui/TextLesson';
import { QuizLesson } from '../../components/student/QuizLesson';
import { AssignmentLesson } from '../../components/student/AssignmentLesson';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Play,
  FileText,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ListChecks,
  Search,
  ExternalLink,
  MessageSquare,
  Edit3,
  Download,
  Send,
  HelpCircle,
  X
} from 'lucide-react';
import type { CourseLearningResponse, CourseProgressResponse, LessonLearningDTO, SectionLearningDTO } from '../../features/learning/types';

interface DiscussionThread {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  timeAgo: string;
  content: string;
}

export function LearningWorkspace() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const urlLessonId = searchParams.get('lessonId');
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(urlLessonId || null);
  
  // Interactive View: 'lesson' | 'quiz'
  const [activeView, setActiveView] = useState<'lesson' | 'quiz'>('lesson');

  // Workspace UI states
  const [zenMode, setZenMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerTab, setDrawerTab] = useState<'qa' | 'notes'>('qa');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  // Persistent student scratchpad notes per course
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(`lumina_notes_${courseId}`) || 
      `# Course Study Notes\n- Key concepts and takeaways\n- Implementation notes and code snippets\n- Quiz and assignment reminders`;
  });

  // Local completed lessons for immediate dynamic progress synchronization
  const [localCompleted, setLocalCompleted] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`lumina_completed_lessons_${courseId}`) || '[]');
    } catch {
      return [];
    }
  });

  // Default interactive QA threads
  const [qaThreads, setQaThreads] = useState<DiscussionThread[]>([
    {
      id: 'qa-1',
      author: 'Prof. Elena Rostova',
      role: 'Lead Faculty',
      timestamp: '@Module Review',
      timeAgo: '2 hrs ago',
      content: 'Make sure to review the core architecture invariants before attempting the knowledge assessment.'
    },
    {
      id: 'qa-2',
      author: 'Julian Thorne',
      role: 'Teaching Fellow',
      timestamp: '@Lesson Concepts',
      timeAgo: 'Yesterday',
      content: 'Refer back to the primary readings if you need clarity on the data serialization checkpoints.'
    }
  ]);

  // Queries
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery<CourseLearningResponse>({
    queryKey: ['learn', courseId],
    queryFn: () => api.get(`/api/v1/courses/${courseId}/learn`),
    enabled: !!courseId
  });

  const { data: progress, isLoading: progressLoading } = useQuery<CourseProgressResponse>({
    queryKey: ['progress', courseId],
    queryFn: () => api.get(`/api/v1/courses/${courseId}/progress`),
    enabled: !!courseId
  });

  // Initialization: Set active lesson on first load
  useEffect(() => {
    if (urlLessonId) {
      setActiveLessonId(urlLessonId);
    } else if (!activeLessonId && course && course.sections.length > 0) {
      if (progress?.lastAccessedLessonId) {
        setActiveLessonId(progress.lastAccessedLessonId);
      } else {
        const firstLesson = course.sections[0]?.lessons[0];
        if (firstLesson) setActiveLessonId(firstLesson.id);
      }
    }
  }, [course, progress, activeLessonId, urlLessonId]);

  // Mutations
  const progressMutation = useMutation({
    mutationFn: ({ lessonId, positionSeconds, completed }: { lessonId: string; positionSeconds: number; completed?: boolean }) => 
      api.post(`/api/v1/courses/${courseId}/lessons/${lessonId}/progress`, { positionSeconds, completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    }
  });

  // Derived state
  const serverCompleted = progress?.lessonProgress
    ?.filter(p => p.status === 'COMPLETED')
    ?.map(p => p.lessonId) || [];

  const completedLessonIds = Array.from(new Set([...serverCompleted, ...localCompleted]));

  let activeLesson: LessonLearningDTO | null = null;
  let activeSectionInfo: { section: SectionLearningDTO; sectionIndex: number; lessonIndex: number } | null = null;

  if (course) {
    for (let sIdx = 0; sIdx < course.sections.length; sIdx++) {
      const section = course.sections[sIdx];
      const lIdx = section.lessons.findIndex(l => l.id === activeLessonId);
      if (lIdx !== -1) {
        activeLesson = section.lessons[lIdx];
        activeSectionInfo = { section, sectionIndex: sIdx, lessonIndex: lIdx };
        break;
      }
    }
  }

  // Navigation helpers
  const allLessons = course ? course.sections.flatMap((s, sIdx) =>
    s.lessons.map((l, lIdx) => ({ ...l, sectionIndex: sIdx, lessonIndex: lIdx, sectionTitle: s.title }))
  ) : [];
  const currentFlatIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const prevLesson = currentFlatIndex > 0 ? allLessons[currentFlatIndex - 1] : null;
  const nextLesson = currentFlatIndex < allLessons.length - 1 ? allLessons[currentFlatIndex + 1] : null;

  // Search for any quiz lesson in current section or course for the Quiz tab
  const quizLesson = activeSectionInfo?.section.lessons.find(l => l.lessonType === 'QUIZ') ||
    allLessons.find(l => l.lessonType === 'QUIZ') ||
    activeLesson;

  // Automatically switch view based on selected lesson type
  useEffect(() => {
    if (activeLesson) {
      if (activeLesson.lessonType === 'QUIZ') {
        setActiveView('quiz');
      } else {
        setActiveView('lesson');
      }
    }
  }, [activeLesson]);

  if (courseLoading || progressLoading) return <LoadingState message="Preparing your learning workspace..." />;
  if (courseError || !course) return <ErrorState title="Course Unavailable" message="We couldn't load the learning workspace for this course." />;

  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const completionPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : (progress?.completionPercentage ?? 0);

  // Handlers
  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
    progressMutation.mutate({ lessonId, positionSeconds: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonComplete = (targetLessonId?: string) => {
    const idToComplete = targetLessonId || activeLesson?.id;
    if (!idToComplete) return;

    // 1. Immediately update local completed state
    const updated = Array.from(new Set([...completedLessonIds, idToComplete]));
    setLocalCompleted(updated);
    localStorage.setItem(`lumina_completed_lessons_${courseId}`, JSON.stringify(updated));

    // 2. Persist course-level dynamic progress in localStorage
    const total = allLessons.length;
    const pct = total > 0 ? Math.round((updated.length / total) * 100) : 0;
    localStorage.setItem(`lumina_course_progress_${courseId}`, JSON.stringify({
      courseId,
      completedCount: updated.length,
      totalLessons: total,
      percentage: pct
    }));

    // 3. Dispatch progress mutation to backend
    progressMutation.mutate({ lessonId: idToComplete, positionSeconds: 99999, completed: true });
    api.post(`/api/v1/courses/${courseId}/lessons/${idToComplete}/complete`).catch(() => {});

    // 4. Invalidate related queries so other views update
    queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  };

  const handleVideoProgress = (positionSeconds: number) => {
    if (activeLesson) {
      progressMutation.mutate({ lessonId: activeLesson.id, positionSeconds });
    }
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    if (courseId) {
      localStorage.setItem(`lumina_notes_${courseId}`, text);
    }
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleExportNotes = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newThread: DiscussionThread = {
      id: `qa-${Date.now()}`,
      author: 'You (Scholar)',
      role: 'Student',
      timestamp: `@${activeLesson ? activeLesson.title : 'General'}`,
      timeAgo: 'Just now',
      content: newQuestion.trim()
    };

    setQaThreads(prev => [newThread, ...prev]);
    setNewQuestion('');
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'Video Lecture';
      case 'TEXT': return 'Reading Lesson';
      case 'QUIZ': return 'Knowledge Assessment';
      case 'ASSIGNMENT': return 'Practical Assignment';
      default: return 'Lesson';
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Play className="w-3.5 h-3.5" />;
      case 'TEXT': return <FileText className="w-3.5 h-3.5" />;
      case 'QUIZ': return <ListChecks className="w-3.5 h-3.5" />;
      case 'ASSIGNMENT': return <ShieldCheck className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  // Filtered sections for instant search in sidebar
  const filteredSections = searchQuery.trim()
    ? course.sections.map(section => ({
        ...section,
        lessons: section.lessons.filter(l => 
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) || section.lessons.length > 0
      )
    : course.sections;

  const isCurrentLessonComplete = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  return (
    <div className="w-full flex-1 flex flex-col font-sans">
      
      {/* ===================================================================== */}
      {/* 1. WORKSPACE SUB-HEADER (Minimalist Focus Header directly below Global) */}
      {/* ===================================================================== */}
      <div className="bg-card border-b border-rule sticky top-0 sm:top-16 z-30 shadow-none mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1540px] mx-auto h-12 flex items-center justify-between gap-4">
          
          {/* Navigation Escape & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/learn"
              className="px-2.5 py-1 rounded-lg bg-canvas hover:bg-wash border border-rule text-xs font-mono text-foreground transition-colors flex items-center gap-1.5 shrink-0 font-medium"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Dashboard</span>
            </Link>
            
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            
            <div className="hidden sm:flex items-center gap-2 text-xs truncate">
              <span className="font-semibold text-foreground truncate max-w-[200px] lg:max-w-[280px]">
                {course.title}
              </span>
              {activeSectionInfo && (
                <>
                  <span className="text-[#CBD5E1]">/</span>
                  <span className="text-muted shrink-0 font-mono">
                    Module {String(activeSectionInfo.sectionIndex + 1).padStart(2, '0')}
                  </span>
                </>
              )}
              {activeLesson && (
                <>
                  <span className="text-[#CBD5E1]">/</span>
                  <span className="text-ember font-mono font-semibold truncate max-w-[240px]">
                    {activeLesson.title}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Micro Progress Bar & Workspace Utilities */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Dynamic Progress Tracker */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-xs font-mono text-muted">
                {completionPct}% · {completedCount} / {totalLessons} Complete
              </span>
              <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ember rounded-full transition-all duration-500" 
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Workspace Utility Toggles */}
            <div className="flex items-center gap-1 border-l border-rule pl-3">
              <button
                type="button"
                onClick={() => setZenMode(!zenMode)}
                className={`px-2 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                  zenMode ? 'text-ember font-semibold bg-wash' : 'text-muted hover:text-foreground hover:bg-canvas'
                }`}
                title="Toggle Zen Full Width"
              >
                {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Zen Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-1 rounded-md text-muted hover:text-foreground hover:bg-canvas transition-colors cursor-pointer"
                title="Workspace Help & Shortcuts"
              >
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-canvas text-foreground rounded border border-rule">?</kbd>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. WORKSPACE BODY (Split Stage: 9 cols Main Stage + 3 cols Sidebar)     */}
      {/* ===================================================================== */}
      <div className="flex-1 w-full max-w-[1540px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── MAIN STAGE (expanded to 12 in Zen Mode) ── */}
          <div className={`${zenMode ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-5 transition-all duration-300 w-full`}>
            
            {/* ── Dynamic Lesson Content & Quiz Switcher Tabs ── */}
            {activeLesson && (
              <div className="bg-card rounded-[10px] p-1.5 border border-rule flex items-center justify-between gap-1 overflow-x-auto shadow-none">
                <div className="flex items-center gap-1 min-w-max">
                  
                  {/* Tab 1: Lesson Content */}
                  <button
                    type="button"
                    onClick={() => setActiveView('lesson')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeView === 'lesson'
                        ? 'bg-ember text-white font-semibold'
                        : 'text-muted hover:text-foreground hover:bg-wash'
                    }`}
                  >
                    {getLessonTypeIcon(activeLesson.lessonType)}
                    <span>[{getLessonTypeLabel(activeLesson.lessonType)}]</span>
                  </button>

                  {/* Tab 2: Graded Quiz */}
                  <button
                    type="button"
                    onClick={() => setActiveView('quiz')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeView === 'quiz'
                        ? 'bg-ember text-white font-semibold'
                        : 'text-muted hover:text-foreground hover:bg-wash'
                    }`}
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>[✓ Graded Quiz]</span>
                  </button>

                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 pr-2 shrink-0">
                  {isCurrentLessonComplete ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-green-50 text-[#16A34A] font-semibold border border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Verified Complete</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-wash text-ember font-semibold border border-rule flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse"></span>
                      <span>In Progress</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Main Lesson Stage Card ── */}
            <div className="bg-card rounded-[10px] border border-rule shadow-none overflow-hidden">
              {!activeLessonId || !activeLesson ? (
                <div className="p-12 sm:p-16 text-center flex flex-col items-center justify-center gap-4 bg-canvas">
                  <div className="w-14 h-14 rounded-[10px] bg-wash flex items-center justify-center text-ember">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans text-lg font-bold text-foreground">Select a Lesson</h3>
                    <p className="font-sans text-xs text-muted max-w-sm mx-auto">
                      Choose an active lecture, reading, or assessment from the syllabus sidebar to begin learning.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  
                  {/* VIEW 1: LESSON CONTENT */}
                  {activeView === 'lesson' ? (
                    <div className="p-5 sm:p-6 lg:p-7 w-full">
                      {activeLesson.lessonType === 'VIDEO' ? (
                        <VideoLesson 
                          courseId={courseId as string}
                          lessonId={activeLesson.id}
                          title={activeLesson.title}
                          onComplete={() => handleLessonComplete(activeLesson?.id)}
                          onProgress={handleVideoProgress}
                        />
                      ) : activeLesson.lessonType === 'TEXT' ? (
                        <TextLesson 
                          title={activeLesson.title}
                          content={activeLesson.description}
                          onComplete={() => handleLessonComplete(activeLesson?.id)}
                        />
                      ) : activeLesson.lessonType === 'ASSIGNMENT' ? (
                        <AssignmentLesson 
                          courseId={courseId as string}
                          lessonId={activeLesson.id}
                          title={activeLesson.title}
                          onComplete={() => handleLessonComplete(activeLesson?.id)}
                        />
                      ) : activeLesson.lessonType === 'QUIZ' ? (
                        <QuizLesson 
                          courseId={courseId as string}
                          quizId={activeLesson.id}
                          title={activeLesson.title}
                          onComplete={() => handleLessonComplete(activeLesson?.id)}
                        />
                      ) : activeLesson.lessonType === 'RESOURCE' ? (
                        <div className="p-10 text-center flex flex-col items-center gap-4 bg-card rounded-[10px] border border-rule shadow-none max-w-xl mx-auto">
                          <div className="w-12 h-12 rounded-lg bg-wash border border-rule flex items-center justify-center text-ember">
                            <Download className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="font-sans text-lg font-bold text-foreground">{activeLesson.title}</h3>
                            <p className="font-sans text-xs text-muted leading-relaxed">
                              {activeLesson.description || 'Supplementary course files, reference notes, and downloadable assets.'}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const response = await api.get(`/api/v1/courses/${courseId}/lessons/${activeLesson.id}/media`, { responseType: 'blob' });
                                  const blob = response as unknown as Blob;
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${activeLesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-resource`;
                                  document.body.appendChild(a);
                                  a.click();
                                  a.remove();
                                  window.URL.revokeObjectURL(url);
                                  handleLessonComplete(activeLesson?.id);
                                } catch {
                                  alert('Could not download resource file or no file attached yet.');
                                }
                              }}
                              className="px-5 py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-semibold transition-colors shadow-none flex items-center gap-2 cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download Attached Resource</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLessonComplete(activeLesson?.id)}
                              className="px-5 py-2.5 rounded-[10px] bg-canvas hover:bg-wash text-foreground text-xs font-semibold transition-all border border-rule cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center flex flex-col items-center gap-3 bg-canvas rounded-[10px] border border-rule">
                          <FileText className="w-8 h-8 text-muted" />
                          <h3 className="font-sans text-base font-bold text-foreground">{activeLesson.title}</h3>
                          <p className="font-sans text-xs text-muted">
                            {activeLesson.description || 'This lesson material is currently being prepared.'}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* VIEW 2: GRADED QUIZ */
                    <div className="p-5 sm:p-6 lg:p-7 w-full">
                      <QuizLesson 
                        courseId={courseId as string}
                        quizId={quizLesson?.id || activeLesson.id}
                        title={quizLesson?.title || `${activeLesson.title} — Assessment`}
                        onComplete={() => handleLessonComplete(quizLesson?.id || activeLesson?.id)}
                      />
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* ── INTERACTIVE BOTTOM DOCK (Lesson Paging & Actions) ── */}
            <div className="bg-card rounded-[10px] border border-rule p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-none">
              
              {/* Paging Left */}
              {prevLesson ? (
                <button
                  type="button"
                  onClick={() => handleLessonClick(prevLesson.id)}
                  className="px-3.5 py-2 rounded-lg bg-canvas hover:bg-wash text-foreground border border-rule text-xs font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">← Previous ({prevLesson.title})</span>
                </button>
              ) : (
                <div className="text-xs font-mono text-muted self-start sm:self-auto">
                  First lesson in syllabus
                </div>
              )}

              {/* Center Downloadable Assets Pill */}
              <div className="flex items-center gap-1.5 bg-canvas px-3 py-1.5 rounded-lg border border-rule text-[11px] font-mono text-foreground">
                <span className="text-muted pr-1 hidden md:inline">Syllabus Unit:</span>
                <span className="text-foreground font-semibold">{activeLesson ? getLessonTypeLabel(activeLesson.lessonType) : 'Lesson'}</span>
                <span className="text-[#CBD5E1]">•</span>
                <Link to={`/courses/${courseId}`} className="text-ember hover:text-[#3730A3] transition-colors flex items-center gap-1 font-medium">
                  <span>Course Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Paging Right / Completion Action */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleLessonComplete(activeLesson?.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isCurrentLessonComplete 
                      ? 'bg-green-50 text-[#16A34A] border-green-200 font-semibold'
                      : 'bg-canvas hover:bg-wash text-foreground border-rule'
                  }`}
                  title="Mark lesson verified complete"
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentLessonComplete ? 'text-[#16A34A]' : 'text-muted'}`} />
                  <span>{isCurrentLessonComplete ? 'Verified Done' : 'Mark Complete'}</span>
                </button>

                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLessonComplete(activeLesson?.id);
                      handleLessonClick(nextLesson.id);
                    }}
                    className="px-4 py-2 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-semibold font-mono transition-colors flex items-center gap-1.5 shadow-none cursor-pointer group"
                  >
                    <span>Next Lesson →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLessonComplete(activeLesson?.id)}
                    className="px-4 py-2 rounded-lg bg-ember hover:bg-ember/90 text-foreground text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-none cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                    <span>Complete Full Course</span>
                  </button>
                )}
              </div>

            </div>

            {/* ── EXPANDABLE DRAWER TABS (Q&A Discussion & Markdown Scratchpad) ── */}
            <div className="bg-card rounded-[10px] border border-rule p-5 space-y-4 shadow-none">
              <div className="flex items-center justify-between border-b border-rule pb-3 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setDrawerTab('qa')}
                    className={`pb-1 flex items-center gap-1.5 cursor-pointer transition-colors ${
                      drawerTab === 'qa'
                        ? 'text-ember border-b-2 border-ember font-bold'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Lesson Q&amp;A Discussion ({qaThreads.length} Threads)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDrawerTab('notes')}
                    className={`pb-1 flex items-center gap-1.5 cursor-pointer transition-colors ${
                      drawerTab === 'notes'
                        ? 'text-ember border-b-2 border-ember font-bold'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Private Student Scratchpad</span>
                    {notesSaved && (
                      <span className="text-[10px] text-[#16A34A] font-mono font-semibold">Auto-saved</span>
                    )}
                  </button>
                </div>

                {drawerTab === 'notes' && (
                  <button
                    type="button"
                    onClick={handleExportNotes}
                    className="text-[11px] font-mono text-ember hover:text-[#3730A3] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export Notes (.md)</span>
                  </button>
                )}
              </div>

              {/* Drawer Content A: Discussion Threads */}
              {drawerTab === 'qa' ? (
                <div className="space-y-3">
                  {qaThreads.map((thread) => (
                    <div key={thread.id} className="p-3.5 rounded-[10px] bg-canvas border border-rule space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{thread.author}</span>
                          <span className="px-2 py-0.5 rounded-md bg-wash border border-rule text-ember font-mono text-[10px] font-semibold">
                            {thread.role}
                          </span>
                          <span className="text-[11px] font-mono text-muted">{thread.timestamp}</span>
                        </div>
                        <span className="text-[11px] font-mono text-muted">{thread.timeAgo}</span>
                      </div>
                      <p className="text-xs text-muted font-sans leading-relaxed">
                        "{thread.content}"
                      </p>
                    </div>
                  ))}

                  {/* Ask Question Input */}
                  <form onSubmit={handleAddQuestion} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask faculty or peer researchers a question about this module..."
                      className="flex-1 bg-canvas border border-rule rounded-[10px] px-4 py-2 text-xs text-foreground placeholder-[#64748B] focus:outline-none focus:border-ember font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-[10px] bg-ember hover:bg-ember/90 text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Drawer Content B: Scratchpad Markdown Notes */
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={6}
                    className="w-full bg-canvas border border-rule rounded-[10px] p-3.5 text-xs font-mono text-foreground focus:outline-none focus:border-ember resize-y placeholder:text-muted"
                    placeholder="# Markdown study notes for this course..."
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                    <span>Markdown formatted · Preserved in browser local storage</span>
                    <button
                      type="button"
                      onClick={handleExportNotes}
                      className="px-3 py-1.5 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export Course Notes (.md)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── CURRICULUM SIDEBAR (Expanded to Left: 4 cols / 33.3% - Right Side) ── */}
          <div className={`${zenMode ? 'hidden' : 'lg:col-span-4'} bg-card rounded-[10px] border border-rule p-4 space-y-4 shadow-none transition-all duration-300 w-full lg:sticky lg:top-24`}>
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Curriculum Syllabus
              </h3>
              <span className="text-[11px] font-mono text-ember font-semibold">
                {completedCount} / {totalLessons} Done
              </span>
            </div>

            {/* Instant Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter lectures, readings, or quizzes..."
                className="w-full bg-canvas border border-rule rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-[#64748B] focus:outline-none focus:border-ember font-sans"
              />
              <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Curriculum Accordion */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {filteredSections.length > 0 ? (
                <Curriculum 
                  sections={filteredSections} 
                  completedLessonIds={completedLessonIds}
                  activeLessonId={activeLessonId || undefined}
                  onLessonClick={handleLessonClick}
                />
              ) : (
                <div className="p-4 text-center text-xs font-mono text-muted">
                  No lessons matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Accreditation Footer Card */}
            <div className="pt-3 border-t border-rule flex items-center justify-between text-[11px] font-mono text-muted">
              <span className="flex items-center gap-1 text-[#16A34A] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Course Track
              </span>
              <span>{course.sections.length} Modules</span>
            </div>

          </div>

        </div>
      </div>

      {/* ── Shortcuts Modal Helper ── */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-[10px] border border-rule p-6 max-w-md w-full shadow-none space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-ember" />
                <h3 className="font-sans text-base font-bold text-foreground">
                  Workspace Quick Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="text-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-foreground">
              <div className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-rule">
                <span>Toggle Zen Full-Width Mode</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-rule">Click Zen Mode</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-rule">
                <span>Switch to Graded Quiz</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-rule">Click Quiz Tab</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-rule">
                <span>Save Scratchpad Notes</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-rule">Auto-saved</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-rule">
                <span>Filter Curriculum Modules</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-rule">Search bar</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-canvas border border-rule">
                <span>Mark Progress &amp; Next</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-rule">Next button</kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="w-full py-2.5 rounded-[10px] bg-ember text-white text-xs font-mono font-semibold hover:bg-ember/90 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
