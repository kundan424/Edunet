import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { CourseRejectionRequest } from './types';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  instructors: {
    pending: () => [...adminKeys.all, 'instructors', 'pending'] as const,
  },
  courses: {
    pending: (page: number, size: number) => [...adminKeys.all, 'courses', 'pending', page, size] as const,
    curriculum: (courseId: string) => [...adminKeys.all, 'courses', courseId, 'curriculum'] as const,
  },
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: api.getAdminDashboard,
  });
};

export const usePendingInstructors = () => {
  return useQuery({
    queryKey: adminKeys.instructors.pending(),
    queryFn: api.getPendingInstructors,
  });
};

export const useVerifyInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.verifyInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.instructors.pending() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
};

export const useRejectInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.rejectInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.instructors.pending() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
};

export const usePendingCourses = (page = 0, size = 20) => {
  return useQuery({
    queryKey: adminKeys.courses.pending(page, size),
    queryFn: () => api.getPendingCourses(page, size),
  });
};

export const useApproveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.approveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all }); // Refresh all pending and dashboard
    },
  });
};

export const useRejectCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CourseRejectionRequest }) => api.rejectCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

export const useAdminCourseCurriculum = (courseId: string) => {
  return useQuery({
    queryKey: adminKeys.courses.curriculum(courseId),
    queryFn: () => api.getAdminCourseCurriculum(courseId),
    enabled: !!courseId,
  });
};

