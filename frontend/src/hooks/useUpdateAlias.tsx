/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/authContext';
import { useLanguage } from '@/hooks/useLanguage';

export function useUpdateAlias() {

	/* Get userID */
	const { user } = useAuth();
	const { id } = user as User;

	/* Get traductions */
	const { t } = useLanguage();

	/* Loading state */
	const [loading, setLoading] = useState(false);

	/* Error state */
	const [error, setError] = useState<string | null>(null);

	/* Function to update the alias */
	async function updateAlias(newAlias: string) {
		try {
			setLoading(true);
			setError(null);

			const res = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ alias: newAlias }),
			});

			if (!res.ok) {
				if (res.status === 409)
					throw new Error(`${t('notifications_alias_repeated')}`);
				else
					throw new Error(`${t('notifications_alias_error')}`);
			}
		
		} catch (e: any) {
			setError(e.message || 'Error');
		} finally {
			setLoading(false);
		}
	}

  return { updateAlias, loading, error };
}
