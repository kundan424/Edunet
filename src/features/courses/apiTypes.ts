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
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  thumbnailUrl?: string;
  rating?: number;
  studentCount?: number;
  reviewCount?: number;
  instructorId: string;
  instructorName: string;
}
