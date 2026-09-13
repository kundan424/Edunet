export interface CourseReviewRequest {
  rating: number;
  comment?: string;
}

export interface CourseReviewResponse {
  id: string;
  courseId: string;
  userId: string;
  studentDisplayName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
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
