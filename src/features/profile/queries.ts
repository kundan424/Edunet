import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export const profileKeys = {
  all: ['profile'] as const,
  emailPrefs: () => [...profileKeys.all, 'emailPrefs'] as const,
};

export const useEmailPreferences = () => {
  return useQuery({
    queryKey: profileKeys.emailPrefs(),
    queryFn: api.getEmailPreferences,
  });
};

export const useUpdateEmailPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateEmailPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.emailPrefs() });
    },
  });
};
