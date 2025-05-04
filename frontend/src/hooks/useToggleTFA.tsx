/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/authContext';
import { useLanguage } from '@/hooks/useLanguage';

export function useToggleTFA() {

	/* Get userID */
	const { user } = useAuth();
	const { id } = user as User;
	
	/* Get traductions */
	const { t } = useLanguage();

	/* Loading state */
	const [loading, setLoading] = useState(false);
	
	/* Error state */
	const [error, setError] = useState<string | null>(null);

	/* Function to toggle TFA */
	async function toggleTFA(enable: boolean) {
		try {
			setLoading(true);
			setError(null);

			const res = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tfa: enable }),
			});

			if (!res.ok)
				throw new Error(t('notifications_two_factor_error'));

		} catch (err: any) {
			setError(err.message || 'Error');
		} finally {
			setLoading(false);
		}
	}

  return { toggleTFA, loading, error };
}
