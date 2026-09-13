import { api } from '../../lib/api';
import type { 
  AdminDashboardResponse, 
  InstructorProfileResponse, 
  CourseRejectionRequest 
} from './types';
import type { Page, CourseSummaryResponse } from '../courses/types';
import type { CourseCurriculumResponse } from '../instructor/types';

// Dashboard
export const getAdminDashboard = () => 
  api.get<any, AdminDashboardResponse>('/api/v1/dashboard/admin');

// Instructor Verification
export const getPendingInstructors = () => 
  api.get<any, InstructorProfileResponse[]>('/api/v1/admin/instructors/pending');

export const verifyInstructor = (instructorId: string) => 
  api.post<any, void>(`/api/v1/admin/instructors/${instructorId}/verify`, {});

export const rejectInstructor = (instructorId: string) => 
  api.post<any, void>(`/api/v1/admin/instructors/${instructorId}/reject`, {});

// Course Moderation
export const getPendingCourses = (page = 0, size = 20) => 
  api.get<any, Page<CourseSummaryResponse>>(`/api/v1/admin/courses/pending?page=${page}&size=${size}`);

export const approveCourse = (courseId: string) => 
  api.post<any, void>(`/api/v1/admin/courses/${courseId}/approve`, {});

export const rejectCourse = (courseId: string, data: CourseRejectionRequest) => 
  api.post<any, void>(`/api/v1/admin/courses/${courseId}/reject`, data);

export const getAdminCourseCurriculum = (courseId: string) => 
  api.get<any, CourseCurriculumResponse>(`/api/v1/admin/courses/${courseId}/curriculum`);
