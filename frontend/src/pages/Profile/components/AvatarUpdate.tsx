import { useState, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

import { VscFolderActive } from "react-icons/vsc";
import { VscFolder } from "react-icons/vsc";
import { useNotification } from '@/hooks/useNotification';


const AvatarUpdate: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useNotification hook
	const { addNotification } = useNotification();

	// useState hook
	const [avatar, setAvatar] = useState<File | null>(null);
	
	// hadle avatar submit function
	const handleAvatarSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Lógica para actualizar el avatar en su endpoint
		if (!avatar) return;
	
		console.log('Actualizando avatar:', avatar);
		
		// Show notification
		addNotification(`${t("notifications_avatar_success")}`, 'success');
		// addNotification(`${t("notifications_avatar_error")}`, 'error');
	
	  };
	  
	  // handle avatar change function
	  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
		  setAvatar(e.target.files[0]);
		}
	  };

	return (
		<form onSubmit={handleAvatarSubmit} className="flex flex-col mb-6">
		<div className='flex flex-col gap-2.5'>
			<div className="inline-block whitespace-nowrap text-sm font-medium">
			{ t('user_settings_avatar') }
			</div>
			<div className='flex flex-row gap-2 md:gap-3'>
				<label
					htmlFor="avatar"
					className="text-sm md:text-base cursor-pointer flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xs border"
				>
					{ avatar ? <VscFolderActive className='text-text-tertiary'/> : <VscFolder /> }
					<p className='inline-block whitespace-nowrap'>{ t("user_settings_upload") }</p>
				</label>
				<input
					id="avatar"
					type="file"
					accept="image/*"
					onChange={handleAvatarChange}
					className="hidden"
				/>
				<button
					type="submit"
					className="text-sm md:text-base text-white p-1.5 md:p-2 rounded-xs bg-text-secondary hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
				>
					{ t('user_settings_submit') }
				</button>
			</div>
		</div>
		{ avatar && (
		<div>
			<img
			src={ URL.createObjectURL(avatar) }
			alt="Vista previa del avatar"
			className="mt-6 h-20 w-20 object-cover rounded-full border"
			/>
		</div>
		)}
      </form>
	);
};

export default AvatarUpdate;