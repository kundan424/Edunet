export type SubmissionStatus = 'SUBMITTED' | 'GRADED' | 'RETURNED';

// Shared DTOs
export interface AssignmentResponse {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  maxScore: number;
  dueAt: string | null;
  createdAt: string;
}

// Instructor DTOs
export interface AssignmentCreateRequest {
  title: string;
  instructions: string;
  maxScore: number;
  dueAt?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
}

export interface InstructorSubmissionResponse {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
}

// Student DTOs
export interface AssignmentSubmissionRequest {
  submissionText: string;
}

export interface StudentSubmissionResponse {
  id: string;
  assignmentId: string;
  submissionText: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
}
