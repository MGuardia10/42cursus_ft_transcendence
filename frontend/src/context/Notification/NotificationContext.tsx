import { createContext } from 'react';
import { NotificationContextProps } from '@/types/notification';

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);
