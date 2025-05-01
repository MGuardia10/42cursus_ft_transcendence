/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useState,
	useEffect,
	ReactNode,
	useCallback,
  } from 'react';
import { FriendsContext } from '@/context/Friends/FriendsContext';
import { useAuth } from '@/hooks/useAuth';
import { FriendStatus, FriendsApiResponse, Friend } from '@/types/friendsContext';
  
export const FriendsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	/* useAuth hook to obtain user id */
	const { user, isAuthenticated } = useAuth();

	/* useState to manage friends, pending requests, loading state and error messages */
	const [friends, setFriends] = useState<Friend[]>([]);
	const [pending, setPending] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	/* API base URL */
	const API = import.meta.env.VITE_USER_API_BASEURL_EXTERNAL;
	
	/* Function to refresh friends and pending requests */
	const refreshFriends = useCallback(async () => {

		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user) return;

		// Set loading and error states
		setLoading(true);
		setError(null);

		// Fetch friends and pending requests
		try {
			const res = await fetch(`${API}/friends/${user.id}`, {
				credentials: 'include'
			});

			// Check if response is ok
			if (!res.ok) throw new Error('Error cargando amigos');

			const data: FriendsApiResponse[] = await res.json();

			const friendsPromises = data.map(async (item) =>{

				// Get friend id
				const friendId = ( item.user_a === Number(user.id) ) ? item.user_b : item.user_a;

				try {

					// Get alias
					const data = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${friendId}`, {
						credentials: 'include',
						headers: {
							'Access-Control-Allow-Origin': `${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}`,
						},
					});
				
					if (!data.ok) throw new Error('No autorizado');
					const { alias } = (await data.json());

					// Get avatar
					const avatarRes = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${friendId}/avatar`, {
						credentials: 'include',
						headers: {
							'Access-Control-Allow-Origin': `${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}`,
						},
					});
					const avatarBlob = await avatarRes.blob();
					const avatarUrl = URL.createObjectURL(avatarBlob);
					
					// Create friend object
					const friend: Friend = {
						id: friendId,
						alias,
						from: item.user_a,
						to: item.user_b,
						status: item.status,
						avatar: avatarUrl,
					};

					// return object
					return friend;

				} catch (err) {
					console.error('Error fetching friend data:', err);
					return null;
				}
				
			});

			// Resolve all promises and filter out null values and status
			const friendsData = (await Promise.all(friendsPromises)).filter((friend): friend is Friend => 
				friend !== null && friend.status === FriendStatus.Accepted);
			const pendingData = (await Promise.all(friendsPromises)).filter((friend): friend is Friend => 
				friend !== null && friend.status === FriendStatus.Pending);

			console.log('Friends:', friendsData);
			console.log('Friends:', pendingData);


			// Set friends and pending requests state
			setFriends(friendsData);
			setPending(pendingData);

		} catch (err: any) {

			// check this part later
			setError(err.message || 'Error');
		} finally {

			// Set loading state to false
			setLoading(false);
		}
	}, [API, isAuthenticated, user]);
	
	/* Function to send a friend request */
	const sendRequest = useCallback(
	  async (toUserId: number) => {
		if (!isAuthenticated || !user) return false;
		setError(null);
		try {
		  const res = await fetch(`${API}/users/${user.id}/friends/request`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ toUserId }),
		  });
		  if (!res.ok) throw new Error('No se pudo enviar la solicitud');
		  await refreshFriends();
		  return true;
		} catch (err: any) {
		  console.error('FriendsContext.sendRequest:', err);
		  setError(err.message || 'Error enviando solicitud');
		  return false;
		}
	  },
	  [API, isAuthenticated, user, refreshFriends],
	);
	
	/* Function to accept a friend request */
	const acceptRequest = useCallback( async (toUserId: number) => {
		
		// Check if user is authenticated and has user's data
		if (!isAuthenticated || !user)
			return false;

		// Set error state
		setError(null);

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
			if (!res.ok)
				throw new Error('No se pudo aceptar la solicitud');

			// refresh friends and pending requests
			await refreshFriends();
			return true;
		} catch (err: any) {
			console.error('FriendsContext.acceptRequest:', err);
			setError(err.message || 'Error aceptando solicitud');
			return false;
		}
	}, [API, isAuthenticated, user, refreshFriends]);
	
	/* Function to decline a friend request */
	const declineRequest = useCallback(
	  async (fromUserId: number) => {
		if (!isAuthenticated || !user) return false;
		setError(null);
		try {
		  const res = await fetch(`${API}/users/${user.id}/friends/decline`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fromUserId }),
		  });
		  if (!res.ok) throw new Error('No se pudo rechazar la solicitud');
		  await refreshFriends();
		  return true;
		} catch (err: any) {
		  console.error('FriendsContext.declineRequest:', err);
		  setError(err.message || 'Error rechazando solicitud');
		  return false;
		}
	  },
	  [API, isAuthenticated, user, refreshFriends],
	);
	
	/* Function to remove a friend */
	const removeFriend = useCallback(
	  async (friendId: number) => {
		if (!isAuthenticated || !user) return false;
		setError(null);
		try {
		  const res = await fetch(`${API}/users/${user.id}/friends/${friendId}`, {
			method: 'DELETE',
			credentials: 'include',
		  });
		  if (!res.ok) throw new Error('No se pudo eliminar el amigo');
		  await refreshFriends();
		  return true;
		} catch (err: any) {
		  console.error('FriendsContext.removeFriend:', err);
		  setError(err.message || 'Error eliminando amigo');
		  return false;
		}
	  },
	  [API, isAuthenticated, user, refreshFriends],
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
		  error,
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
  