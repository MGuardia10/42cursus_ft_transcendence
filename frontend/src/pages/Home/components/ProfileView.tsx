import React from 'react';
import { Link } from 'react-router';
import { AiFillEdit } from "react-icons/ai";

const ProfileView: React.FC = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-3 md:gap-6 h-full p-5 sm:p-6 md:p-10'>

			{/* Welcome + Edit */}
			<div className='flex items-end justify-between px-1 w-full'>

				{/* Welcome message */}
				<h1 className='text-base md:text-xl inline-block'>Welcome, <span className='font-bold text-text-secondary'>Miguel</span></h1>

				{/* Edit button */}
				<Link to='/profile' className='flex items-center gap-2 text-sm md:text-base text-text-secondary hover:text-text-tertiary hover:cursor-pointer transition-all duration-300'>
					<AiFillEdit className='text-sm md:text-base inline-block' />
					Edit
				</Link>
			</div>

			<hr className='md:-mt-2 text-gray-700 w-full'/>

			<div className='flex flex-col sm:flex-row sm:items-center justify-baseline pl-1 sm:pl-4 py-2 md:pt-0 gap-4 sm:gap-8 md:gap-14 w-full'>

				{/* Image + Avatar */}
				<div className='flex flex-col sm:items-center align-middle justify-center sm:gap-2'>
					<img src='https://i.redd.it/c83vyz4t9b651.jpg' alt='profile' className='h-20 w-20 sm:w-24 sm:h-24 md:w-30 md:h-30 border-2 text-text-tertiary rounded-sm sm:rounded-full'/>
					<p className='hidden sm:inline-block text-text-tertiary text-sm md:text-base'>mguardia</p>
				</div>

				{/* Username and Email */}
				<div className='flex flex-col items-start gap-3.5 h-full'>
					<div className='flex flex-col gap-1'>
						<p className='text-sm sm:text-base font-bold'>Username:</p>
						<p className='text-xs sm:text-sm'>Miguel Guardia</p>	
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-sm sm:text-base font-bold'>Email:</p>
						<p className='text-xs sm:text-sm'>miguel.guardia@trascendence.com</p>
					</div>
				</div>

			</div>
		</div>
	);
};

export default ProfileView;