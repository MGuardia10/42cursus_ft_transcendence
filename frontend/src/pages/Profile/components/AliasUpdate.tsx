import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';

const AliasUpdate: React.FC = () => {
	
	// useLanguage hook
	const { t } = useLanguage();
	
	// useNotification hook
	const { addNotification } = useNotification();
	
	// useState hook
	const [alias, setAlias] = useState<string>('');
	
	// handle alias submit function
	const handleAliasSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Logic to update the alias in your endpoint
		console.log('Updating alias:', alias);
		
		addNotification("Alias updated!", 'success');
		// addNotification("Error updating alias", 'error');
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
				value={alias}
				onChange={(e) => setAlias(e.target.value)}
				placeholder="mguardia"
				className="flex-1 p-1.5 md:p-2 text-sm md:text-base border rounded-xs focus:outline-none focus:ring focus:border-blue-300"
				required
			/>
			<button
				type="submit"
				className="bg-text-secondary text-white p-1.5 md:p-2 text-sm md:text-base rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
			>
				{ t('user_settings_submit') }
			</button>
		</div>
      </form>
	);
};

export default AliasUpdate;