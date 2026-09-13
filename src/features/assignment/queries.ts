import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { AssignmentCreateRequest, AssignmentSubmissionRequest, GradeSubmissionRequest } from './types';

export const assignmentKeys = {
  all: ['assignment'] as const,
  instructorAssignment: (courseId: string, lessonId: string) => [...assignmentKeys.all, 'instructor', courseId, lessonId] as const,
  studentAssignment: (courseId: string, lessonId: string) => [...assignmentKeys.all, 'student', courseId, lessonId] as const,
  submissions: (courseId: string, assignmentId: string) => [...assignmentKeys.all, 'submissions', courseId, assignmentId] as const,
  submission: (courseId: string, assignmentId: string, submissionId: string) => [...assignmentKeys.submissions(courseId, assignmentId), submissionId] as const,
  mySubmission: (courseId: string, lessonId: string) => [...assignmentKeys.studentAssignment(courseId, lessonId), 'mySubmission'] as const,
};

// Queries
export const useInstructorAssignment = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: assignmentKeys.instructorAssignment(courseId, lessonId),
    queryFn: () => api.getInstructorAssignment(courseId, lessonId),
    retry: 1,
  });
};

export const useStudentAssignment = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: assignmentKeys.studentAssignment(courseId, lessonId),
    queryFn: () => api.getStudentAssignment(courseId, lessonId),
    retry: 1,
  });
};

export const useMySubmission = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: assignmentKeys.mySubmission(courseId, lessonId),
    queryFn: () => api.getMySubmission(courseId, lessonId),
    retry: 1,
  });
};

export const useSubmissions = (courseId: string, assignmentId: string) => {
  return useQuery({
    queryKey: assignmentKeys.submissions(courseId, assignmentId),
    queryFn: () => api.getSubmissions(courseId, assignmentId),
    enabled: !!assignmentId,
  });
};

export const useSubmission = (courseId: string, assignmentId: string, submissionId: string) => {
  return useQuery({
    queryKey: assignmentKeys.submission(courseId, assignmentId, submissionId),
    queryFn: () => api.getSubmission(courseId, assignmentId, submissionId),
    enabled: !!submissionId,
  });
};

// Mutations
export const useCreateAssignment = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentCreateRequest) => api.createAssignment(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.instructorAssignment(courseId, lessonId) }),
  });
};

export const useUpdateAssignment = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentCreateRequest) => api.updateAssignment(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.instructorAssignment(courseId, lessonId) }),
  });
};

export const useDeleteAssignment = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.deleteAssignment(courseId, lessonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.instructorAssignment(courseId, lessonId) }),
  });
};

export const useSubmitAssignment = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentSubmissionRequest) => api.submitAssignment(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.mySubmission(courseId, lessonId) }),
  });
};

export const useGradeSubmission = (courseId: string, assignmentId: string, submissionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GradeSubmissionRequest) => api.gradeSubmission(courseId, assignmentId, submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.submission(courseId, assignmentId, submissionId) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.submissions(courseId, assignmentId) });
    },
  });
};
