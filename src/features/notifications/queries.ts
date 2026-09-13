import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (unread?: boolean, page?: number, size?: number) => [...notificationKeys.lists(), { unread, page, size }] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
};

export const useNotifications = (unread?: boolean, page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.list(unread, page, size),
    queryFn: () => api.getNotifications(unread, page, size),
  });
};

// Very useful for Header UX to get the unread count efficiently
export const useUnreadNotifications = (enabled = true) => {
  return useQuery({
    queryKey: notificationKeys.list(true, 0, 100),
    queryFn: () => api.getNotifications(true, 0, 100),
    enabled
  });
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => api.getNotification(id),
    enabled: !!id,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markAsRead(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.setQueryData(notificationKeys.detail(id), data);
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};
