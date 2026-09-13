export type CourseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PublishStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE';

export interface PublicLessonResponse {
  id: string;
  title: string;
  description: string;
  lessonType: LessonType;
  displayOrder: number;
  durationSeconds?: number;
}

export interface PublicSectionResponse {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  lessons: PublicLessonResponse[];
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: CourseDifficulty;
  price: number | null;
  thumbnailUrl: string | null;
  rating: number | null;
  studentCount: number | null;
  reviewCount: number | null;
  instructorId: string;
  instructorName: string;
  instructorBio: string | null;
  instructorExpertise: string[] | null;
  sections: PublicSectionResponse[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CourseSummaryResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: CourseDifficulty;
  price: number | null;
  thumbnailUrl: string | null;
  rating: number | null;
  studentCount: number | null;
  reviewCount: number | null;
  instructorId: string;
  instructorName: string;
}
