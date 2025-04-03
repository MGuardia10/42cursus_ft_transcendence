import { useState, FormEvent } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';

const NameUpdate: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useNotification hook
	const { addNotification } = useNotification();

	// useState hook
	const [name, setName] = useState<string>('');
	
	// handle name submit function
	const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Lógica para actualizar el nombre en su endpoint
		console.log('Actualizando nombre:', name);
		addNotification("Name updated!", 'success');
	};

	return (
		<form onSubmit={handleNameSubmit} className="flex flex-col gap-2 md:gap-2.5 mb-6">
		<label htmlFor="name" className="inline-block text-sm font-medium">
			{ t('user_settings_name') }
		</label>
		<div className="flex flex-row gap-2 md:gap-3">
			<input
				id="name"
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Miguel Guardia"
				className="flex-1 p-1.5 md:p-2 text-sm md:text-base border rounded-xs focus:outline-none focus:ring focus:border-blue-300"
				required
				autoComplete='off'
			/>
			<button
				type="submit"
				className="bg-text-secondary text-sm md:text-base text-white p-1.5 md:p-2 rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
			>
			{ t('user_settings_submit') }
			</button>
		</div>
	  </form>
	);
};

export default NameUpdate;