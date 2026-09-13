import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { Curriculum } from '../../components/course/Curriculum';
import { VideoLesson } from '../../components/ui/VideoLesson';
import { TextLesson } from '../../components/ui/TextLesson';
import { QuizLesson } from '../../components/student/QuizLesson';
import { AssignmentLesson } from '../../components/student/AssignmentLesson';
import type { CourseLearningResponse, CourseProgressResponse, LessonLearningDTO } from '../../features/learning/types';

export function LearningWorkspace() {
  const { courseId } = useParams<{ courseId: string }>();
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

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
    if (!activeLessonId && course && course.sections.length > 0) {
      if (progress?.lastAccessedLessonId) {
        setActiveLessonId(progress.lastAccessedLessonId);
      } else {
        const firstLesson = course.sections[0]?.lessons[0];
        if (firstLesson) setActiveLessonId(firstLesson.id);
      }
    }
  }, [course, progress, activeLessonId]);

  // Mutations
  const progressMutation = useMutation({
    mutationFn: ({ lessonId, positionSeconds }: { lessonId: string, positionSeconds: number }) => 
      api.post(`/api/v1/courses/${courseId}/lessons/${lessonId}/progress`, { positionSeconds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
    }
  });

  if (courseLoading || progressLoading) return <LoadingState message="Setting up your workspace..." />;
  if (courseError || !course) return <ErrorState title="Course Unavailable" message="We couldn't load the learning workspace." />;

  // Derived state
  const completedLessonIds = progress?.lessonProgress
    .filter(p => p.status === 'COMPLETED')
    .map(p => p.lessonId) || [];
  
  let activeLesson: LessonLearningDTO | null = null;
  for (const section of course.sections) {
    const found = section.lessons.find(l => l.id === activeLessonId);
    if (found) {
      activeLesson = found;
      break;
    }
  }

  // Handlers
  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
    // Send a 0 progress to update last accessed
    progressMutation.mutate({ lessonId, positionSeconds: 0 });
  };

  const handleLessonComplete = () => {
    if (activeLesson) {
      // Sending a large number to ensure it triggers completion, or just 100 for texts
      progressMutation.mutate({ lessonId: activeLesson.id, positionSeconds: 99999 });
    }
  };

  const handleVideoProgress = (positionSeconds: number) => {
    if (activeLesson) {
      progressMutation.mutate({ lessonId: activeLesson.id, positionSeconds });
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 w-full">
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 border-b border-midnight-ink pb-8">
        <h1 className="font-degular-display text-2xl md:text-3xl lg:text-4xl font-bold text-midnight-ink break-words">
          {course.title}
        </h1>
        {progress && (
          <div className="flex items-center gap-4 w-full max-w-md">
            <span className="font-usual font-bold text-sm shrink-0">
              {progress.completionPercentage.toFixed(0)}% Complete
            </span>
            <div className="w-full h-3 bg-midnight-ink/10 rounded-full overflow-hidden border border-midnight-ink shrink-0">
              <div 
                className="h-full bg-signal-blue transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col w-full">
          {!activeLessonId || !activeLesson ? (
            <div className="p-12 text-center border border-midnight-ink bg-cream-paper">
              <BodyText>Please select a lesson from the curriculum to begin.</BodyText>
            </div>
          ) : (
            <div className="w-full">
              {activeLesson.lessonType === 'VIDEO' ? (
                <VideoLesson 
                  courseId={courseId as string}
                  lessonId={activeLesson.id}
                  title={activeLesson.title}
                  onComplete={handleLessonComplete}
                  onProgress={handleVideoProgress}
                />
              ) : activeLesson.lessonType === 'TEXT' ? (
                <TextLesson 
                  title={activeLesson.title}
                  content={activeLesson.description}
                  onComplete={handleLessonComplete}
                />
              ) : activeLesson.lessonType === 'QUIZ' ? (
                <QuizLesson 
                  courseId={courseId as string}
                  quizId={activeLesson.id}
                  title={activeLesson.title}
                  onComplete={handleLessonComplete}
                />
              ) : activeLesson.lessonType === 'ASSIGNMENT' ? (
                <AssignmentLesson 
                  courseId={courseId as string}
                  lessonId={activeLesson.id}
                  title={activeLesson.title}
                  onComplete={handleLessonComplete}
                />
              ) : (
                <div className="p-12 text-center border border-midnight-ink bg-saffron-yellow/20">
                  <SectionHeading className="mb-4 text-2xl">{activeLesson.title}</SectionHeading>
                  <BodyText>This lesson type ({activeLesson.lessonType}) is not supported in the current learning workspace.</BodyText>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Curriculum */}
        <div className="lg:col-span-1 flex flex-col gap-6 w-full lg:sticky lg:top-28">
          <SectionHeading className="text-xl sm:text-2xl">Course Content</SectionHeading>
          <div className="max-h-[70vh] overflow-y-auto border border-midnight-ink scrollbar-thin">
            <Curriculum 
              sections={course.sections} 
              completedLessonIds={completedLessonIds}
              activeLessonId={activeLessonId || undefined}
              onLessonClick={handleLessonClick}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
