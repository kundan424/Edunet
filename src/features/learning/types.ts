import type { LessonType } from '../courses/types';

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface EnrollmentResponseDTO {
  id: string;
  courseId: string;
  courseTitle: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export interface LessonLearningDTO {
  id: string;
  title: string;
  description: string;
  lessonType: LessonType;
  displayOrder: number;
}

export interface SectionLearningDTO {
  id: string;
  title: string;
  displayOrder: number;
  lessons: LessonLearningDTO[];
}

export interface CourseLearningResponse {
  id: string;
  title: string;
  description: string;
  sections: SectionLearningDTO[];
}

export interface LessonProgressResponse {
  lessonId: string;
  status: ProgressStatus;
  lastPositionSeconds: number;
  maxPositionSeconds: number;
  completedAt?: string;
}

export interface CourseProgressResponse {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  lastAccessedLessonId?: string;
  lastAccessedAt?: string;
  lessonProgress: LessonProgressResponse[];
}

export interface ProgressUpdateRequest {
  positionSeconds: number;
}
