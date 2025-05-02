import { IoPersonAddSharp, IoPersonRemoveSharp } from "react-icons/io5";
// import { CgSandClock } from "react-icons/cg";

import { useNotification } from '@/hooks/useNotification';
import { useLanguage } from '@/hooks/useLanguage';
import { SearchUser, SearchProps } from "@/types/friendsContext";
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/hooks/useAuth';

const UserSearchItem: React.FC<SearchProps> = ({ user, onSelect }) => {

	/* useLanguage Hook */
	const { t } = useLanguage();

	/* useAuth hook */
	const { user: loggedUser } = useAuth();
	
	/* useNotification Hook */
	const { addNotification } = useNotification();

	/* useFriends hook */
	const { sendRequest, removeFriend, refreshFriends, friends, pending } = useFriends();
	
	/* Function to handle send request to a user */
	const handleAddFriend = async (friend: SearchUser) => {

		// send request to add friend
		const { ok, message } = await sendRequest(friend.id);

		if (!ok) {
			// add notification of error
			addNotification(`${message}`, 'error');
			return ;
		}

		// refresh friends and pending requests
		await refreshFriends();

		// add notification of success
		addNotification(t("notifications_friend_request"), 'success');
	};
	
	/* Function to remove a friend request */
	const handleRemoveFriend = async (friend: SearchUser) => {

		// send request to remove friend
		const { ok, message } = await removeFriend(friend.id);

		if (!ok) {
			// add notification of error
			addNotification(`${message}`, 'error');
			return ;
		}

		// refresh friends and pending requests
		await refreshFriends();

		// add notification of success
		addNotification(t("notifications_friend_remove"), 'success');
	};

	return (
	<li 
		className="flex items-center justify-between py-3 px-4 border-b border-gray-700 last:border-none cursor-pointer hover:bg-background-primary rounded-xs p-2 transition-all duration-300"
		onClick={() => onSelect(user)}
	>
		<div className="flex items-center gap-2">
			<img
				src={`${ import.meta.env.VITE_USER_API_BASEURL_EXTERNAL }/${user.id}/avatar`}
				alt={user.name}
				className="w-8 h-8 border-2 border-text-tertiary rounded-full object-cover"
			/>
			<p className="text-gray-200 text-sm md:text-base">{user.alias}</p>
		</div>

		{/* Buttons */}
		{
			(friends.some((friend) => friend.id === user.id) || pending.some((friend) => friend.to === user.id))
			? (
				// Button to remove friend / decline request (except for logged user)
				( Number(loggedUser?.id) != user.id ) && 
				<button
					className="bg-red-700/80 p-2 rounded-xs hover:bg-red-600 transition-all duration-300 cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						handleRemoveFriend(user);
					}}
				>
					<IoPersonRemoveSharp className="text-sm md:text-base font-bold" />
				</button>)
			: (
				// Button to send / accept a friend request
				( Number(loggedUser?.id) != user.id ) &&
				<button
					className="bg-text-tertiary p-2 rounded-xs hover:bg-text-secondary transition-all duration-300 cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						handleAddFriend(user);
					}}
				>
					<IoPersonAddSharp className="text-sm md:text-base font-bold" />
				</button>)
		}
	</li>
	);
};


export default UserSearchItem;
