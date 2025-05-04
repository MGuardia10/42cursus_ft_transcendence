/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/authContext';
import { useLanguage } from '@/hooks/useLanguage';

export function useUpdateAvatar() {

	/* Get userID */
	const { user } = useAuth();
	const { id } = user as User;
	
	/* Get traductions */
	const { t } = useLanguage();
	
	/* Loading state */
	const [loading, setLoading] = useState(false);
	
	/* Error state */
	const [error, setError] = useState<string | null>(null);
	
	/* Function to update the avatar */
	async function updateAvatar(file: File) {

		// Upload file
		try {
			setLoading(true);
			setError(null);

			const formData = new FormData();
			formData.append('avatar', file);

			const res = await fetch(`${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}/avatar`, {
				method: 'PUT',
				credentials: 'include',
				body: formData,
			});

			if (!res.ok)
				throw new Error(t('notifications_avatar_error'));

		} catch (err: any) {
			setError(err.message || 'Error');
		} finally {
			setLoading(false);
		}
	}

  return { updateAvatar, loading, error };
}
