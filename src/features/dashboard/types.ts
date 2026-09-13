export interface ContinueLearningDTO {
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  lastLessonId: string | null;
  lastLessonTitle: string | null;
  lastPositionSeconds: number | null;
  updatedAt: string | null;
}

export interface StudentDashboardResponse {
  totalEnrolledCourses: number;
  activeCourses: number;
  completedCourses: number;
  overallCourseCompletionPercentage: number;
  
  totalLessonsCompleted: number;
  totalLessonsInEnrolledCourses: number;
  overallLessonCompletionPercentage: number;
  
  quizzesAttempted: number;
  quizzesPassed: number;
  averageQuizScore: number;
  
  assignmentsSubmitted: number;
  assignmentsGraded: number;
  averageAssignmentScore: number;
  
  unreadNotificationCount: number;
  
  continueLearning: ContinueLearningDTO[];
}
