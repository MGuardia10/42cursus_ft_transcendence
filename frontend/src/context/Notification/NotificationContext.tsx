import { createContext } from 'react';
import { NotificationContextProps } from '@/types/notificationContext';

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);
