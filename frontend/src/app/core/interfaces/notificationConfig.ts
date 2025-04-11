import { NotificationData } from './notificationData';

export interface NotificationConfig {
  data: NotificationData;
  duration: number;
  position?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'bottom';
  };
}
