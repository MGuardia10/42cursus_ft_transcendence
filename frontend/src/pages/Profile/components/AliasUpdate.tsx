import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateAlias } from '@/hooks/useUpdateAlias';

const AliasUpdate: React.FC = () => {
	
	/* useAuth hook */
	const { user, refreshUser } = useAuth();

	/* useUpdateAlias hook */
	const { updateAlias, loading, error } = useUpdateAlias();

	/* useLanguage hook */
	const { t } = useLanguage();
	
	/* useNotification hook */
	const { addNotification } = useNotification();
	
	/* useState hook */
	const [alias, setAlias] = useState<string>( '' );
	const [placeholder, setPlaceholder] = useState<string>( user?.alias || '' );

	/* useEffect hook */
	useEffect(() => {
		if (user?.alias) {
			setPlaceholder(user.alias);
		}
	}, [user?.alias]);

	/* handle submit button */
	const handleAliasSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

		// Prevent default form submission
		e.preventDefault();

		// Check if alias contain spaces
		if (alias.includes(' ')) {
			addNotification(`${t("notifications_alias_invalid_char")}`, 'error');
			setAlias('');
			return ;
		}

		// Check if alias is between 3 and 10 characters
		if (alias.length < 3 || alias.length > 10) {
			addNotification(`${t("notifications_alias_invalid_length")}`, 'error');
			setAlias('');
			return ;
		}

		// if alias equuals current alias
		if ( alias === user?.alias ) {
			addNotification(`${t("notifications_alias_same")}`, 'error');
			setAlias('');
			return ;
		}

		// Update the alias on endpoint
		await updateAlias(alias);

		// Show success or error notification
		if (error) {
			addNotification(`${error}`, 'error');
			return ;
		}

		// Show success notification
		addNotification(`${t("notifications_alias_success")}`, 'success');

		// Refresh user data
		await refreshUser();

		// Reset alias state
		setAlias('');

	};

	return (
		<form onSubmit={handleAliasSubmit} className="flex flex-col gap-2 md:gap-2.5 mb-6">
		<label htmlFor="alias" className="inline-block text-sm font-medium">
			{ t('user_settings_alias') }
		</label>
		<div className='flex flex-row gap-2 md:gap-3'>
			<input
				id="alias"
				type="text"
				disabled={loading}
				value={alias}
				onChange={(e) => setAlias(e.target.value)}
				placeholder={ placeholder || 'loading...' }
				className="flex-1 p-1.5 md:p-2 text-sm md:text-base border rounded-xs focus:outline-none focus:ring focus:border-blue-300"
				required
			/>
			<button
				disabled={loading}
				type="submit"
				className={`bg-text-secondary text-white p-1.5 md:p-2 text-sm md:text-base rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
			>
				{ t('user_settings_submit') }
			</button>
		</div>
      </form>
	);
};

export default AliasUpdate;