import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { QuizCreateRequest, QuestionCreateRequest, QuizSubmitRequest } from './types';

// Keys
export const quizKeys = {
  all: ['quiz'] as const,
  instructorQuiz: (courseId: string, lessonId: string) => [...quizKeys.all, 'instructor', courseId, lessonId] as const,
  studentQuiz: (courseId: string, quizId: string) => [...quizKeys.all, 'student', courseId, quizId] as const,
  attempts: (courseId: string, quizId: string) => [...quizKeys.studentQuiz(courseId, quizId), 'attempts'] as const,
  activeAttempt: (courseId: string, quizId: string) => [...quizKeys.attempts(courseId, quizId), 'active'] as const,
};

// Queries
export const useInstructorQuiz = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: quizKeys.instructorQuiz(courseId, lessonId),
    queryFn: () => api.getInstructorQuiz(courseId, lessonId),
    retry: 1, // Don't retry much if it's 404 (needs to be created)
  });
};

export const useStudentQuizDetails = (courseId: string, quizId: string) => {
  return useQuery({
    queryKey: quizKeys.studentQuiz(courseId, quizId),
    queryFn: () => api.getStudentQuizDetails(courseId, quizId),
    enabled: !!quizId,
  });
};

export const useActiveAttempt = (courseId: string, quizId: string) => {
  return useQuery({
    queryKey: quizKeys.activeAttempt(courseId, quizId),
    queryFn: () => api.getActiveAttempt(courseId, quizId),
    enabled: !!quizId,
    retry: 1, // Might not exist
  });
};

export const useAttemptHistory = (courseId: string, quizId: string) => {
  return useQuery({
    queryKey: quizKeys.attempts(courseId, quizId),
    queryFn: () => api.getAttemptHistory(courseId, quizId),
    enabled: !!quizId,
  });
};

// Mutations (Instructor)
export const useCreateQuiz = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizCreateRequest) => api.createQuiz(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.instructorQuiz(courseId, lessonId) }),
  });
};

export const useUpdateQuiz = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizCreateRequest) => api.updateQuiz(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.instructorQuiz(courseId, lessonId) }),
  });
};

export const useAddQuestion = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionCreateRequest) => api.addQuestion(courseId, lessonId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.instructorQuiz(courseId, lessonId) }),
  });
};

export const useUpdateQuestion = (courseId: string, lessonId: string, questionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionCreateRequest) => api.updateQuestion(courseId, lessonId, questionId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.instructorQuiz(courseId, lessonId) }),
  });
};

export const useDeleteQuestion = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => api.deleteQuestion(courseId, lessonId, questionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.instructorQuiz(courseId, lessonId) }),
  });
};

// Mutations (Student)
export const useStartAttempt = (courseId: string, quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.startQuizAttempt(courseId, quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.activeAttempt(courseId, quizId) });
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(courseId, quizId) });
    },
  });
};

export const useSubmitAttempt = (courseId: string, quizId: string, attemptId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizSubmitRequest) => api.submitQuizAttempt(courseId, quizId, attemptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.activeAttempt(courseId, quizId) });
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(courseId, quizId) });
    },
  });
};
