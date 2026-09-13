import { api } from '../../lib/api';

export interface EmailPreferenceDTO {
  emailNotificationsEnabled: boolean;
}

export const getEmailPreferences = () => 
  api.get<any, EmailPreferenceDTO>('/api/v1/users/me/email-preferences');

export const updateEmailPreferences = (data: EmailPreferenceDTO) => 
  api.put<any, EmailPreferenceDTO>('/api/v1/users/me/email-preferences', data);
