export type NotificationType = 
  | 'INSTRUCTOR_VERIFIED'
  | 'COURSE_PUBLISHED'
  | 'COURSE_REJECTED'
  | 'PAYMENT_SUCCESS'
  | 'ASSIGNMENT_GRADED'
  | 'QUIZ_COMPLETED'
  | 'COURSE_ENROLLED';

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
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
