import { useQuery } from '@tanstack/react-query';
import * as api from './api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  student: () => [...dashboardKeys.all, 'student'] as const,
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.student(),
    queryFn: api.getStudentDashboard,
  });
};
