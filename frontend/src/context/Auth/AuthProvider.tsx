/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useEffect,
	useState,
	ReactNode,
	useCallback,
} from 'react';
import { AuthContext } from '@/context/Auth/AuthContext';
import { User } from '@/types/authContext';
  
  
export const AuthProvider = ({ children }: { children: ReactNode }) => {

	/* useStates for auth provider */
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [logoutError, setLogoutError] = useState<boolean>(false);
	const [deleteError, setdeleteError] = useState<boolean>(false);

	/* Function to refresh actual user */
	const refreshUser = useCallback(async () => {
		try {

			/* Check JWT with /me to obtain language and id */
			const res = await fetch(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/me`, {
				credentials: 'include',
			});

			if (!res.ok)
				throw new Error('No autorizado');

			const { user_id: id, language } = await res.json();
			
			/* Check for user data */
			const data = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}`, {
				credentials: 'include',
			});
			
			if (!data.ok) throw new Error('No autorizado');

			/* extract data from user */
			const { name, alias, email, tfa } = (await data.json());

			/* Refresh avatar */
			const avatarRes = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}/avatar`, {
				credentials: 'include',
				headers: {
					'Access-Control-Allow-Origin': `${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}`,
				},
			});
			const avatarBlob = await avatarRes.blob();
			const avatarUrl = URL.createObjectURL(avatarBlob);
	
			if (user?.avatar) {
				URL.revokeObjectURL(user.avatar);
			}

			/* Set user data */
			setUser({
				id,
				language,
				name,
				alias,
				email,
				tfa: tfa === 0 ? false : true,
				avatar: avatarUrl,
			} as User);
		} catch {
			setUser(null);
			console.warn('User is not authenticated. Redirecting to login...');
		} finally {
			setLoading(false);
		}
	}, []);

	/* Function to login using Google */
	const login = useCallback(() => {
		window.location.assign(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/login`);
	}, []);

	/* Function to logout removing cookie */
	const logout = useCallback(async () => {

		try {
			setLogoutError(false);
			const res = await fetch(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/logout`, {
				credentials: 'include'
			});

			if (!res.ok) {
				throw new Error('Error logging out');
			}

			setUser(null);

		}
		catch (err: any) {
			if (err) setLogoutError(true);
		}
		

	}, []);

	/* Function to delete user */
	const deleteUser = useCallback(async () => {
		
		if (!user) return;

		try {
			setdeleteError(false);

			const res = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${user.id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!res.ok) {
				throw new Error('Error deleting account');
			}
			
			setUser(null);

		} catch (err: any) {
			if (err) setdeleteError(true);
		}


	}, [user]);

	// Refresh user when the component mounts and when the refreshUser function changes
	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	return (
		<AuthContext.Provider
		value={{
			user,
			loading,
			isAuthenticated: !!user,
			login,
			logout,
			deleteUser,
			refreshUser,
			logoutError,
			deleteError,
		}}
		>
		{children}
		</AuthContext.Provider>
	);
};