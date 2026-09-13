import { api } from '../../lib/api';
import type { 
  InstructorDashboardResponse, 
  CourseCreateRequest, 
  CourseUpdateRequest, 
  CourseResponse,
  CourseCurriculumResponse,
  SectionRequest,
  SectionResponse,
  LessonRequest,
  LessonResponse,
  MediaAssetDto
} from './types';

// Profile
export const getInstructorProfile = () => 
  api.get<any, any>('/api/v1/instructors/profile');

export const updateInstructorProfile = (data: { bio: string, expertise: string }) => 
  api.post<any, any>('/api/v1/instructors/profile', data);

export const requestVerification = () => 
  api.post<any, void>('/api/v1/instructors/verification', {});

// Dashboard
export const getInstructorDashboard = () => 
  api.get<any, InstructorDashboardResponse>('/api/v1/dashboard/instructor');

// Courses
export const getInstructorCourses = () => 
  api.get<any, CourseResponse[]>('/api/v1/instructors/courses');

export const getInstructorCourse = (courseId: string) => 
  api.get<any, CourseResponse>(`/api/v1/instructors/courses/${courseId}`);

export const createCourse = (data: CourseCreateRequest) => 
  api.post<any, CourseResponse>('/api/v1/instructors/courses', data);

export const updateCourse = (courseId: string, data: CourseUpdateRequest) => 
  api.put<any, CourseResponse>(`/api/v1/instructors/courses/${courseId}`, data);

export const submitCourse = (courseId: string) => 
  api.post<any, void>(`/api/v1/instructors/courses/${courseId}/submit`);

// Curriculum
export const getCourseCurriculum = (courseId: string) => 
  api.get<any, CourseCurriculumResponse>(`/api/v1/instructors/courses/${courseId}/curriculum`);

// Sections
export const createSection = (courseId: string, data: SectionRequest) => 
  api.post<any, SectionResponse>(`/api/v1/instructors/courses/${courseId}/sections`, data);

export const updateSection = (courseId: string, sectionId: string, data: SectionRequest) => 
  api.put<any, SectionResponse>(`/api/v1/instructors/courses/${courseId}/sections/${sectionId}`, data);

export const deleteSection = (courseId: string, sectionId: string) => 
  api.delete<any, void>(`/api/v1/instructors/courses/${courseId}/sections/${sectionId}`);

// Lessons
export const createLesson = (courseId: string, sectionId: string, data: LessonRequest) => 
  api.post<any, LessonResponse>(`/api/v1/instructors/courses/${courseId}/sections/${sectionId}/lessons`, data);

export const updateLesson = (courseId: string, sectionId: string, lessonId: string, data: LessonRequest) => 
  api.put<any, LessonResponse>(`/api/v1/instructors/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, data);

export const deleteLesson = (courseId: string, sectionId: string, lessonId: string) => 
  api.delete<any, void>(`/api/v1/instructors/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);

// Media
export const uploadLessonMedia = (courseId: string, lessonId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<any, MediaAssetDto>(
    `/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/media`, 
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const deleteLessonMedia = (courseId: string, lessonId: string) => 
  api.delete<any, void>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/media`);
