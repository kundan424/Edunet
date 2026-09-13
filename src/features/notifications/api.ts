import { api } from '../../lib/api';
import type { NotificationResponse, Page } from './types';

export const getNotifications = (unread?: boolean, page = 0, size = 20) => {
  const url = `/api/v1/notifications?page=${page}&size=${size}${unread !== undefined ? `&unread=${unread}` : ''}`;
  // Based on the controller, getNotifications returns Page<NotificationResponse> directly
  return api.get<any, Page<NotificationResponse>>(url);
};

export const getNotification = (id: string) =>
  api.get<any, NotificationResponse>(`/api/v1/notifications/${id}`);

export const markAsRead = (id: string) =>
  api.patch<any, NotificationResponse>(`/api/v1/notifications/${id}/read`, {});

export const markAllAsRead = () =>
  api.patch<any, void>(`/api/v1/notifications/read-all`, {});
