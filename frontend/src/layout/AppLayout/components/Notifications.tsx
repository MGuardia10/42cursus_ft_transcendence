import { useState } from "react";
import { MdOutlineNotifications } from "react-icons/md";

const Notifications: React.FC = () => {

	const [showNotifications, setShowNotifications] = useState(false);

	return (
		<div 
			className="hover:cursor-pointer"
			onClick={() => setShowNotifications(!showNotifications)}
			>
			<MdOutlineNotifications className='text-2xl hover:cursor-pointer' />
		</div>
	);
};

export default Notifications;