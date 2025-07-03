import React from 'react';
import { Link } from 'react-router';
import { AiFillEdit } from "react-icons/ai";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';



const ProfileView: React.FC = () => {

	/* useLanguage hook */
	const { t } = useLanguage();

	/* useAuth hook */
	const { user } = useAuth();

	return (
		<div className='flex flex-col items-center gap-3 md:gap-6 h-full p-5 sm:p-6 md:p-8'>

			{/* Welcome + Edit */}
			<div className='flex items-end justify-between px-1 w-full'>

				{/* Welcome message */}
				<h1 className='text-xs sm:text-base md:text-xl inline-block'>{ t("home_welcome") } <span className='font-bold text-text-secondary'>{ user?.alias?.split(' ')[0] || '' }</span></h1>

				{/* Edit button */}
				<Link to='/profile' className='flex items-center gap-2 text-sm md:text-base text-text-secondary hover:text-text-tertiary hover:cursor-pointer transition-all duration-300'>
					<AiFillEdit className='text-xs sm:text-sm md:text-base inline-block' />
					{ t("home_edit") }
				</Link>
			</div>

			<hr className='md:-mt-2 text-gray-700 w-full'/>

			<div className='flex flex-col sm:flex-row sm:items-center justify-baseline pl-1 sm:pl-4 py-2 md:pt-0 gap-3 sm:gap-8 md:gap-8 w-full overflow-x-scroll scrollbar-thin'>

				{/* Image + Avatar */}
				<div className='flex flex-col sm:items-center align-middle justify-center sm:gap-2'>
					<img
						src={user?.avatar}
						onError={(e) => {
							e.currentTarget.src = '/placeholder.webp';
						}}
						crossOrigin="use-credentials"
						alt='avatar'
						className='h-20 w-20 md:min-w-20 md:h-20 lg:w-24 lg:min-w-24 lg:h-24 border-2 text-text-tertiary rounded-sm sm:rounded-full object-cover'
					/>
					<p className='hidden sm:inline-block text-text-tertiary text-sm md:text-base'>{ user?.alias?.split(' ')[0] || '' }</p>
				</div>

				{/* Username and Email */}
				<div className='flex flex-col items-start gap-3.5 h-full'>
					<div className='flex flex-col gap-1'>
						<p className='text-sm sm:text-base font-bold'>{ t("home_username") }</p>
						<p className='text-xs sm:text-sm'>{ user?.name || 'N/A' }</p>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-sm sm:text-base font-bold'>{ t("home_email") }</p>
						<p className='text-xs sm:text-sm'>{ user?.email || 'N/A' }</p>
					</div>
				</div>

			</div>
		</div>
	);
};

export default ProfileView;