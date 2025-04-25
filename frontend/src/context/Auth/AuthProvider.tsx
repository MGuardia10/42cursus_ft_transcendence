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

	/* Function to refresh actual user */
	const refreshUser = useCallback(async () => {
		try {

			/* Check JWT with /me to obtain language and id */
			const res = await fetch(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/me`, {
				credentials: 'include',
			});

			if (!res.ok) throw new Error('No autorizado');

			const { user_id: id, language } = await res.json();
			
			/* Check for user data */
			const data = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}`, {
				credentials: 'include',
			});
			
			if (!data.ok) throw new Error('No autorizado');

			/* extract data from user */
			const { name, email, tfa } = (await data.json());

			/* Set user data */
			setUser({
				id,
				language,
				name,
				email,
				tfa: tfa === 0 ? false : true,
				avatar: `${ import.meta.env.VITE_USER_API_BASEURL_EXTERNAL }/${id}/avatar`,
			} as User);
		} catch {
			setUser(null);
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
		await fetch(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/logout`, {
			credentials: 'include'
		});

		setUser(null);
	}, []);

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
			refreshUser,
		}}
		>
		{children}
		</AuthContext.Provider>
	);
};