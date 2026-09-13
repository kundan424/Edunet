import { api } from '../../lib/api';
import type { 
  AssignmentResponse, AssignmentCreateRequest,
  StudentSubmissionResponse, AssignmentSubmissionRequest,
  InstructorSubmissionResponse, GradeSubmissionRequest
} from './types';

// Instructor Authoring
export const getInstructorAssignment = (courseId: string, lessonId: string) =>
  api.get<any, AssignmentResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/assignment`);

export const createAssignment = (courseId: string, lessonId: string, data: AssignmentCreateRequest) =>
  api.post<any, AssignmentResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/assignment`, data);

export const updateAssignment = (courseId: string, lessonId: string, data: AssignmentCreateRequest) =>
  api.put<any, AssignmentResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/assignment`, data);

export const deleteAssignment = (courseId: string, lessonId: string) =>
  api.delete<any, void>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/assignment`);

// Instructor Grading
export const getSubmissions = (courseId: string, assignmentId: string) =>
  api.get<any, InstructorSubmissionResponse[]>(`/api/v1/instructors/courses/${courseId}/assignments/${assignmentId}/submissions`);

export const getSubmission = (courseId: string, assignmentId: string, submissionId: string) =>
  api.get<any, InstructorSubmissionResponse>(`/api/v1/instructors/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`);

export const gradeSubmission = (courseId: string, assignmentId: string, submissionId: string, data: GradeSubmissionRequest) =>
  api.post<any, InstructorSubmissionResponse>(`/api/v1/instructors/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, data);

// Student
export const getStudentAssignment = (courseId: string, lessonId: string) =>
  api.get<any, AssignmentResponse>(`/api/v1/courses/${courseId}/lessons/${lessonId}/assignment`);

export const submitAssignment = (courseId: string, lessonId: string, data: AssignmentSubmissionRequest) =>
  api.post<any, StudentSubmissionResponse>(`/api/v1/courses/${courseId}/lessons/${lessonId}/assignment/submissions`, data);

export const getMySubmission = (courseId: string, lessonId: string) =>
  api.get<any, StudentSubmissionResponse>(`/api/v1/courses/${courseId}/lessons/${lessonId}/assignment/submissions/my`);
