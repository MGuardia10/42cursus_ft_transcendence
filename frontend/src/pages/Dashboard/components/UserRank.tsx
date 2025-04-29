import { useAuth } from '@/hooks/useAuth';

const UserRank: React.FC = () => {

	/* useAuth hook */
	const { user } = useAuth();

	return (
		<div className="flex flex-col items-center justify-center gap-4 md:gap-6 h-full p-6 md:p-10">

			{/* Image and Name of User */}
			<div className='flex flex-col items-center'>
				<img
					src={user?.avatar}
					onError={(e) => {
						e.currentTarget.src = '/placeholder.webp';
					}}
					crossOrigin="use-credentials"
					alt='avatar'
					className='md:block w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-text-tertiary object-cover'
				/>
				<h2 className="text-center md:text-xl font-bold mt-2 md:mt-3">{ user?.alias || '' }</h2>
			</div>

			{/* Ranking of user */}
			<p className="md:text-xl">Rank <span className='font-bold text-text-tertiary'>3</span></p>
		</div>
	);
};

export default UserRank;