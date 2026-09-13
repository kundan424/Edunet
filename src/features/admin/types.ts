

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface InstructorProfileResponse {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  expertise: string | null;
  verificationStatus: VerificationStatus;
}

export interface CourseRejectionRequest {
  reason: string;
}

export interface AdminDashboardResponse {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  instructors: {
    unverified: number;
    pending: number;
    verified: number;
    rejected: number;
  };
  courses: {
    draft: number;
    pendingApproval: number;
    published: number;
    archived: number;
    total: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  payments: {
    totalSuccessful: number;
    totalAmount: number;
    currency: string;
  };
  reviews: {
    total: number;
    averageRating: number;
  };
  assignments: {
    totalSubmissions: number;
    gradedSubmissions: number;
  };
  quizzes: {
    totalAttempts: number;
    passedAttempts: number;
  };
  recentActivity: Array<{
    id: string;
    courseTitle: string;
    studentName: string;
    activityType: string;
    timestamp: string;
  }>;
}
