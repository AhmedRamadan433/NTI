export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  timezone: string;
}
