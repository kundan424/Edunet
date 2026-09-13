import { api } from '../../lib/api';
import type { StudentDashboardResponse } from './types';

export const getStudentDashboard = () =>
  api.get<any, StudentDashboardResponse>(`/api/v1/dashboard/student`);
