export interface Notification {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info';
}

export interface NotificationContextProps {
	notifications: Notification[];
	addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
	removeNotification: (id: number) => void;
}