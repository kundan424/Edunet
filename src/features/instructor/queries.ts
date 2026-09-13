import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { 
  CourseCreateRequest, 
  CourseUpdateRequest, 
  SectionRequest, 
  LessonRequest 
} from './types';

// Keys
export const instructorKeys = {
  all: ['instructor'] as const,
  dashboard: () => [...instructorKeys.all, 'dashboard'] as const,
  courses: () => [...instructorKeys.all, 'courses'] as const,
  course: (id: string) => [...instructorKeys.courses(), id] as const,
  curriculum: (id: string) => [...instructorKeys.course(id), 'curriculum'] as const,
};

// Queries
export const useInstructorDashboard = () => {
  return useQuery({
    queryKey: instructorKeys.dashboard(),
    queryFn: api.getInstructorDashboard,
  });
};

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: instructorKeys.courses(),
    queryFn: api.getInstructorCourses,
  });
};

export const useCourseCurriculum = (courseId: string) => {
  return useQuery({
    queryKey: instructorKeys.curriculum(courseId),
    queryFn: () => api.getCourseCurriculum(courseId),
    enabled: !!courseId,
  });
};

// Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseCreateRequest) => api.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.courses() });
    },
  });
};

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseUpdateRequest) => api.updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: instructorKeys.courses() });
    },
  });
};

export const useSubmitCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.submitCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: instructorKeys.courses() });
    },
  });
};

export const useCreateSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SectionRequest) => api.createSection(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useUpdateSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string; data: SectionRequest }) => 
      api.updateSection(courseId, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sectionId: string) => api.deleteSection(courseId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useCreateLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string; data: LessonRequest }) => 
      api.createLesson(courseId, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useUpdateLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, lessonId, data }: { sectionId: string; lessonId: string; data: LessonRequest }) => 
      api.updateLesson(courseId, sectionId, lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useDeleteLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, lessonId }: { sectionId: string; lessonId: string }) => 
      api.deleteLesson(courseId, sectionId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useUploadMedia = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, file }: { lessonId: string; file: File }) => 
      api.uploadLessonMedia(courseId, lessonId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useDeleteMedia = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => api.deleteLessonMedia(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.curriculum(courseId) });
    },
  });
};

export const useInstructorProfile = () => {
  return useQuery({
    queryKey: [...instructorKeys.all, 'profile'],
    queryFn: api.getInstructorProfile,
  });
};

export const useUpdateInstructorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { bio: string, expertise: string }) => api.updateInstructorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...instructorKeys.all, 'profile'] });
    },
  });
};

export const useRequestVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.requestVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...instructorKeys.all, 'profile'] });
    },
  });
};

