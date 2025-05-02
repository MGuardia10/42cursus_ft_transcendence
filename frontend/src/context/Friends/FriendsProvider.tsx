/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useState,
	useEffect,
	ReactNode,
	useCallback,
  } from 'react';
import { FriendsContext } from '@/context/Friends/FriendsContext';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { FriendStatus, FriendsApiResponse, Friend } from '@/types/friendsContext';
  
export const FriendsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	/* useAuth hook to obtain user id */
	const { user, isAuthenticated } = useAuth();

	/* useLanguage hook */
	const { t } = useLanguage();

	/* useState to manage friends, pending requests, loading state and error messages */
	const [friends, setFriends] = useState<Friend[]>([]);
	const [pending, setPending] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);
	// const [error, setError] = useState<string | null>(null);
	
	/* API base URL */
	const API = import.meta.env.VITE_USER_API_BASEURL_EXTERNAL;
	
	/* Function to refresh friends and pending requests */
	// const refreshFriends = useCallback(async () => {

	// 	// Check if user is authenticated and has user's data
	// 	if (!isAuthenticated || !user) return;

	// 	// Set loading and error states
	// 	setLoading(true);

	// 	// Fetch friends and pending requests
	// 	try {
	// 		const res = await fetch(`${API}/friends/${user.id}`, {
	// 			credentials: 'include'
	// 		});

	// 		// Check if response is ok
	// 		if (!res.ok) throw new Error('Error loading friends');

	// 		const data: FriendsApiResponse[] = await res.json();

	// 		const friendsPromises = data.map(async (item) =>{

	// 			// Get friend id
	// 			const friendId = ( item.user_a === Number(user.id) ) ? item.user_b : item.user_a;

	// 			try {

	// 				// Get alias
	// 				const data = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${friendId}`, {
	// 					credentials: 'include',
	// 					headers: {
	// 						'Access-Control-Allow-Origin': `${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}`,
	// 					},
	// 				});
				
	// 				if (!data.ok) throw new Error('Error loading friends');
	// 				const { alias } = (await data.json());

	// 				// Get avatar
	// 				const avatarRes = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${friendId}/avatar`, {
	// 					credentials: 'include',
	// 					headers: {
	// 						'Access-Control-Allow-Origin': `${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}`,
	// 					},
	// 				});
	// 				const avatarBlob = await avatarRes.blob();
	// 				const avatarUrl = URL.createObjectURL(avatarBlob);
					
	// 				// Create friend object
	// 				const friend: Friend = {
	// 					id: friendId,
	// 					alias,
	// 					from: item.user_a,
	// 					to: item.user_b,
	// 					status: item.status,
	// 					avatar: avatarUrl,
	// 				};

	// 				// return object
	// 				return friend;

	// 			} catch {
	// 				return null;
	// 			}
				
	// 		});

	// 		// Resolve all promises and filter out null values and status
	// 		const friendsData = (await Promise.all(friendsPromises)).filter((friend): friend is Friend => 
	// 			friend !== null && friend.status === FriendStatus.Accepted);
	// 		const pendingData = (await Promise.all(friendsPromises)).filter((friend): friend is Friend => 
	// 			friend !== null && friend.status === FriendStatus.Pending);

	// 		// Set friends and pending requests state
	// 		setFriends(friendsData);
	// 		setPending(pendingData);

	// 	} catch (err: any) {

	// 		// check this part later
	// 		setError(err.message || 'Error');
	// 	} finally {

	// 		// Set loading state to false
	// 		setLoading(false);
	// 	}
	// }, [API, isAuthenticated, user]);

	const refreshFriends = useCallback(async () => {
		if (!isAuthenticated || !user) return;
		setLoading(true);
		try {
		  const res = await fetch(`${API}/friends/${user.id}`, {
			credentials: 'include',
		  });
		  if (!res.ok) throw new Error('Error loading friends');
		  const data: FriendsApiResponse[] = await res.json();
	
		  const items = await Promise.all(
			data.map(async (item) => {
			  const friendId =
				item.user_a === Number(user.id) ? item.user_b : item.user_a;
	
			  // fetch alias
			  const aliasRes = await fetch(`${API}/${friendId}`, {
				credentials: 'include',
			  });
			  if (!aliasRes.ok) throw new Error('Error loading friend alias');
			  const { alias } = await aliasRes.json();
	
			  // fetch avatar
			  const avatarRes = await fetch(`${API}/${friendId}/avatar`, {
				credentials: 'include',
			  });
			  let avatarUrl: string | undefined;
			  if (avatarRes.ok) {
				const blob = await avatarRes.blob();
				avatarUrl = URL.createObjectURL(blob);
			  }
	
			  return {
				id:     friendId,
				alias,
				avatar: avatarUrl,
				from:   item.user_a,
				to:     item.user_b,
				status: item.status as FriendStatus,
			  } as Friend;
			})
		  );
	
		  setFriends(items.filter((f) => f.status === FriendStatus.Accepted));
		  setPending(items.filter((f) => f.status === FriendStatus.Pending));
		} catch {
		  // Silencioso: falla la carga de amigos
		} finally {
		  setLoading(false);
		}
	  }, [API, isAuthenticated, user]);
	
	/* Function to send a friend request */
	const sendRequest = useCallback( async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
		
		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user)
			return { ok: false, message: t('notifications_friend_request_error') };
		
		// Send request and wait for response
		try {
		  const res = await fetch(`${API}/friend`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: user.id,
				to: toUserId
			}),
		  });

		  // Check if response is ok
		  if (!res.ok) {
			  if (res.status === 409) {
				  throw new Error(t('notifications_friend_request_already_sent'));
			  } else if (res.status === 400) {
			  	throw new Error(t('notifications_friend_request_already_friends'));
			  } else {
				  throw new Error(t('notifications_friend_request_error'));
			  }
		  }

		  return { ok: true };

		} catch (err: any) {
			return { ok: false, message: err.message || t('notifications_friend_request_error') };
		}
	  },
	  [API, isAuthenticated, user, t],
	);
	
	/* Function to accept a friend request */
	const acceptRequest = useCallback( async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {
		
		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user)
			return { ok: false, message: t('notifications_friend_request_error') };

		// Send accepted request and wait for response
		try {
			const res = await fetch(`${API}/friend`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					from: user.id,
					to: toUserId,
				}),
			});

			// Check if response is ok
			if (!res.ok) {
				if (res.status === 409) {
					throw new Error(t('notifications_friend_request_already_sent'));
				} else if (res.status === 400) {
					throw new Error(t('notifications_friend_request_already_friends'));
				} else {
					throw new Error(t('notifications_friend_request_error'));
				}
			}
			
			return { ok: true };
		} catch (err: any) {
			return { ok: false, message: err.message || t('notifications_friend_request_error') };
		}
	}, [API, isAuthenticated, user, t]);
	
	/* Function to decline a friend request */
	const declineRequest = useCallback( async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {

		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user)
			return { ok: false, message: t('notifications_friend_request_error') };

		// Send declined request and wait for response
		try {
			const res = await fetch(`${API}/friends`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					from: user.id,
					to: toUserId,
				}),
			});

			// Check if response is ok
			if (!res.ok) {
				if (res.status === 404) {
					throw new Error(t('notifications_friend_request_not_found_1'));
				} else {
					throw new Error(t('notifications_friend_request_error'));
				}
			}

			return { ok: true };
		} catch (err: any) {
			return { ok: false, message: err.message || t('notifications_friend_request_error') };
		}
	  },
	  [API, isAuthenticated, user, t],
	);
	
	/* Function to remove a friend */
	const removeFriend = useCallback( async (toUserId: number): Promise<{ ok: boolean; message?: string }> => {

		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user)
			return { ok: false, message: t('notifications_friend_request_error') };
		// Send request to remove friend and wait for response
		try {
			const res = await fetch(`${API}/friends`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					from: user.id,
					to: toUserId,
				}),
			});

			// Check if response is ok
			if (!res.ok) {
				if (res.status === 404) {
					throw new Error(t('notifications_friend_request_not_found_2'));
				} else {
					throw new Error(t('notifications_friend_request_error'));
				}
			}

			return { ok: true };
			
		} catch (err: any) {
			return { ok: false, message: err.message || t('notifications_friend_request_error') };
		}
	  },
	  [API, isAuthenticated, user, t],
	);
  
	// Initial fetch of friends and pending requests
	useEffect(() => {
	  refreshFriends();
	}, [refreshFriends]);
  
	return (
	  <FriendsContext.Provider
		value={{
		  friends,
		  pending,
		  loading,
		  refreshFriends,
		  sendRequest,
		  acceptRequest,
		  declineRequest,
		  removeFriend,
		}}
	  >
		{children}
	  </FriendsContext.Provider>
	);
};
  