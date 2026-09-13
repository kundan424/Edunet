import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { CourseReviewRequest } from './types';

export const reviewKeys = {
  all: ['reviews'] as const,
  course: (courseId: string) => [...reviewKeys.all, courseId] as const,
  coursePage: (courseId: string, page: number, size: number) => [...reviewKeys.course(courseId), page, size] as const,
};

export const useCourseReviews = (courseId: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: reviewKeys.coursePage(courseId, page, size),
    queryFn: () => api.getCourseReviews(courseId, page, size),
    enabled: !!courseId,
  });
};

export const useCreateReview = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseReviewRequest) => api.createReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
  });
};

export const useUpdateReview = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string, data: CourseReviewRequest }) => api.updateReview(courseId, reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
  });
};

export const useDeleteReview = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => api.deleteReview(courseId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
  });
};
