import React, { ReactNode, useState, useCallback } from 'react';
import { Notification } from '@/types/notificationContext';
import { NotificationContext } from '@/context/Notification/NotificationContext';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
  
	const addNotification = useCallback((message: string, type: 'success' | 'error') => {
	  const newNotification: Notification = {
		id: Date.now(),
		message,
		type,
	  };
	  setNotifications(prevNotifications => [...prevNotifications, newNotification]);
	}, []);
  
	const removeNotification = useCallback((id: number) => {
	  setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
	}, []);
  
	return (
	  <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
		{children}
	  </NotificationContext.Provider>
	);
  };