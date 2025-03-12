import { useContext } from "react";
import { NotificationContextProps } from "@/types/notificationContext";
import { NotificationContext } from "@/context/Notification/NotificationContext";

export const useNotification = (): NotificationContextProps => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within a NotificationProvider');
	}
	return context;
};