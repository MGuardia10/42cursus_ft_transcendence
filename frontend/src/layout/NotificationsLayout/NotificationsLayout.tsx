import NotificationItem from '@/layout/NotificationsLayout/components/NotificationItem';
import { useNotification } from '@/hooks/useNotification';

const NotificationsLayout = () => {
	const { notifications } = useNotification();
  
	return (
	  <div className="fixed top-15 right-4 sm:right-8 md:right-10 z-50">
		{notifications.map((notification) => (
		  <NotificationItem key={notification.id} notification={notification} />
		))}
	  </div>
	);
  };
  
  export default NotificationsLayout;