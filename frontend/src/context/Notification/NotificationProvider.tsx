import React, { ReactNode, useState } from 'react';
import { Notification } from '@/types/notification';
import { NotificationContext } from '@/context/Notification/NotificationContext';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
		const newNotification: Notification = {
			id: Date.now(),
			message,
			type,
		};
		setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
	};

	const removeNotification = (id: number) => {
		setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
			{children}
		</NotificationContext.Provider>
	);
};