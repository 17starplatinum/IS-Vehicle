export type NotificationLevel = 'success' | 'info' | 'warn' | 'error';

export interface NotificationAction {
  label: string;
  callback?: () => void;
  id?: string;
}

export interface NotificationItem {
  id: string;
  level: NotificationLevel;
  title?: string;
  message: string;
  ttl?: number | null;
  actions?: NotificationAction[];
  createdAt?: number;
  sticky?: boolean;
  payload?: any;
}
