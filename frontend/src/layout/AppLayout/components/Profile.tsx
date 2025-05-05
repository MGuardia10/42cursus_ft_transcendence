import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';

const Profile: React.FC = () => {

	// language, notification and auth hooks
	const { t } = useLanguage();
	const { addNotification } = useNotification();
	const { logout, logoutError } = useAuth();

	// useRef to handle the menu
	const profileMenuRef = useRef<HTMLDivElement | null>(null);

	// useState to toggle the profile options
	const [showProfileOptions, setShowProfileOptions] = useState(false);

	// useState to toggle the last call when deleting the account
	const [showLastCall, setShowLastCall] = useState(false);

	  // Function to handle clicks outside the dropdown
	  const handleClickOutside = ( event: MouseEvent ) => {
		// Close dropdown if clicked outside
		if (profileMenuRef.current && !profileMenuRef.current.contains( event.target as Node )) {
			setShowProfileOptions(false);
		}
	  };
	
	  useEffect(() => {
		// Listen clicks outside menu
		document.addEventListener('click', handleClickOutside);
	
		// Clean event listener when component unmounts
		return () => {
		  document.removeEventListener('click', handleClickOutside);
		};
	  }, []);

	// Function to handle the delete account
	const handleLogOut = () => {

		
		// Call the logout function
		logout();
		
		// Check if there is an error
		if (logoutError) {
			// addNotification error
			addNotification(t('notifications_logout_error'), 'error');
			return;
		}

		// Close the last call modal
		setShowLastCall(false);
		
		// addNotification goodbye
		addNotification(t('notifications_logout_success'), 'success');

	};
	
	return (
		<>
		<div
			className='relative hover:cursor-pointer text-xs'
			ref={profileMenuRef}
			onClick={() => setShowProfileOptions(!showProfileOptions)}
		>
			<FiUser className='text-2xl' />
			<ul
				className={`absolute flex flex-col top-10 right-0 w-40 bg-background-secondary border border-border-primary shadow-lg overflow-hidden rounded-xs z-10 transition-all duration-200 ${ showProfileOptions ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible" }`}
			>
				<Link 
					to='/profile'
					className='flex items-center p-2.5 border-b border-border-primary last:border-none hover:bg-background-hover'
					onClick={ () => setShowProfileOptions(false) }
				>
					<IoSettingsOutline className='mr-2 text-sm' />
					<p>{t("profile_settings")}</p>
				</Link>
				<li
					className='flex items-center p-2.5 text-red-500 hover:bg-background-hover'
					onClick={ () => {setShowProfileOptions(false); setShowLastCall(true)} }
				>
					<RiLogoutBoxLine className='mr-2 text-sm' />
					<p>{t("logout")}</p>
				</li>
			</ul>
		</div>

		{/* Component to confirm logout */}
		<div
			className={`absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-20 transition-all duration-200 ${ showLastCall ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible" }`}
			onClick={ () => setShowLastCall(false) }	
		>
			<div
				className='flex flex-col items-center align-items bg-background-secondary p-4 md:p-10 rounded-xs z-30'
				onClick={ (e) => e.stopPropagation() }
			>
				<p className='text-sm'>{t("logout_string_1")} <b>{t("logout_string_2")}</b> {t("logout_string_3")}</p>
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
						onClick={ () => handleLogOut() }
					>
						<div className='flex items-center text-sm'>
							<RiLogoutBoxLine className='mr-2 md:text-base' />
							<b>{t("logout_string_2")}</b>
						</div>
					</button>
				</div>
			</div>
		</div>
		</>
	);
};

export default Profile;