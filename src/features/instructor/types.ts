import type { CourseDifficulty, PublishStatus, LessonType } from '../courses/types';

export interface CourseSummaryDTO {
  id: string;
  title: string;
  category: string;
  difficulty: CourseDifficulty;
  price: number | null;
  publishStatus: PublishStatus;
  rating: number | null;
  studentCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface RecentActivityDTO {
  id: string;
  courseTitle: string;
  studentName: string;
  activityType: string;
  timestamp: string;
}

export interface RecentReviewDTO {
  id: string;
  courseTitle: string;
  studentName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface InstructorDashboardResponse {
  totalCoursesOwned: number;
  draftCourses: number;
  pendingApprovalCourses: number;
  publishedCourses: number;
  archivedCourses: number;
  
  totalEnrolledStudents: number;
  totalCourseReviews: number;
  averageRating: number;
  
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  
  totalAssignmentSubmissions: number;
  totalGradedAssignments: number;
  
  totalRevenue: number | null;
  currency: string | null;
  
  recentCourses: CourseSummaryDTO[];
  recentEnrollments: RecentActivityDTO[];
  recentReviews: RecentReviewDTO[];
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  category?: string;
  difficulty?: CourseDifficulty;
  price?: number;
  thumbnailUrl?: string;
}

export interface CourseUpdateRequest extends CourseCreateRequest {}

export interface CourseResponse {
  id: string;
  instructorId: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: CourseDifficulty | null;
  price: number | null;
  thumbnailUrl: string | null;
  publishStatus: PublishStatus;
  rating: number | null;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SectionRequest {
  title: string;
  description?: string;
  displayOrder: number;
}

export interface SectionResponse {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LessonRequest {
  title: string;
  description?: string;
  lessonType: LessonType;
  displayOrder: number;
  durationSeconds?: number;
}

export interface LessonResponse {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;
  lessonType: LessonType;
  displayOrder: number;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SectionCurriculumResponse {
  section: SectionResponse;
  lessons: LessonResponse[];
}

export interface CourseCurriculumResponse {
  course: CourseResponse;
  sections: SectionCurriculumResponse[];
}

export interface MediaAssetDto {
  id: string;
  lessonId: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  durationSeconds: number | null;
  processingStatus: string;
  createdAt: string;
  updatedAt: string;
}
