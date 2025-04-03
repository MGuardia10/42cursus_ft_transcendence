export interface Notification {
	id: number;
	message: string;
	type: 'success' | 'error';
}

export interface NotificationContextProps {
	notifications: Notification[];
	addNotification: (message: string, type: 'success' | 'error') => void;
	removeNotification: (id: number) => void;
}