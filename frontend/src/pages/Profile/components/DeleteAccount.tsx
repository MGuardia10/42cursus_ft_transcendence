import { useState } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';

import { MdOutlineCancel } from 'react-icons/md';
import { RiLogoutBoxLine } from 'react-icons/ri';

const DeleteAccount: React.FC = () => {

	/* useAuth hook */
	const { deleteUser, deleteError } = useAuth();

	/* useNotification hook */
	const { addNotification } = useNotification();
	
	/* useLanguage hook */
	const { t } = useLanguage();

	/* useState hook */
	const [showLastCall, setShowLastCall] = useState(false);
	
	const handleDeleteAccount = async () => {

		// delete account
		await deleteUser();

		if (deleteError) {
			// Notify error
			addNotification(t('notifications_delete_account_error'), 'error');
			return;
		}

		// Notify success
		addNotification(t('notifications_delete_account_success'), 'success');

		// Close confirmation modal
		setShowLastCall(false);

		// localstorage remove
		localStorage.removeItem('lang');
	};

	return (
		<div className='flex md:items-right md:justify-end'>
			{/* Delete Account button */}
			<button
				className="flex items-center gap-2 text-sm md:text-base text-red-700 border border-red-700 p-1.5 md:px-3 md:py-2 rounded-xs bg-background-primary hover:bg-red-400 hover:cursor-pointer transition-all duration-300 mt-12 md:mt-6"
				onClick={ () => setShowLastCall(true) }
			>
				<FaRegTrashAlt className='inline-block text-sm text-red-700'/>
				{ t('profile_delete_account') }
			</button>

			{/* Component to confirm delete account */}
			<div
				className={`absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-20 transition-all duration-200 ${ showLastCall ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible" }`}
				onClick={ () => setShowLastCall(false) }	
			>
				<div
					className='flex flex-col items-center align-items bg-background-secondary p-4 md:p-10 rounded-xs z-30'
					onClick={ (e) => e.stopPropagation() }
				>
					<p className='text-xs md:text-sm'>{t("delete_string_1")} <b>{t("delete_string_2")}</b> {t("delete_string_3")}</p>
					<div className='flex items-center justify-center gap-4 pt-6'>
						<button
							className='bg-background-primary w-32 md:w-40 flex items-center justify-center px-4 py-2 md:py-3 rounded-xs transition-all duration-300 hover:cursor-pointer hover:bg-background-hover'
							onClick={ () => setShowLastCall(false) }
						>
							<div className='flex items-center text-sm'>
								<MdOutlineCancel className='mr-2 md:text-base' />
								<p>{t("delete_cancel")}</p>
							</div>
						</button>
						<button
							className='bg-[#9a0101] w-32 md:w-40 flex items-center justify-center px-4 py-2 md:py-3 rounded-xs transition-all duration-300 hover:cursor-pointer hover:bg-red-600'
							onClick={ () => handleDeleteAccount() }
						>
							<div className='flex items-center text-sm'>
								<RiLogoutBoxLine className='mr-2 md:text-base' />
								<b>{t("delete_string_2")}</b>
							</div>
						</button>
					</div>
				</div>
			</div>
	 	</div>
	);
};

export default DeleteAccount;