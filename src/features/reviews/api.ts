import { api } from '../../lib/api';
import type { CourseReviewRequest, CourseReviewResponse, Page } from './types';

export const getCourseReviews = (courseId: string, page = 0, size = 20) =>
  api.get<any, Page<CourseReviewResponse>>(`/api/v1/courses/${courseId}/reviews?page=${page}&size=${size}`);

export const createReview = (courseId: string, data: CourseReviewRequest) =>
  api.post<any, CourseReviewResponse>(`/api/v1/courses/${courseId}/reviews`, data);

export const updateReview = (courseId: string, reviewId: string, data: CourseReviewRequest) =>
  api.put<any, CourseReviewResponse>(`/api/v1/courses/${courseId}/reviews/${reviewId}`, data);

export const deleteReview = (courseId: string, reviewId: string) =>
  api.delete<any, void>(`/api/v1/courses/${courseId}/reviews/${reviewId}`);
