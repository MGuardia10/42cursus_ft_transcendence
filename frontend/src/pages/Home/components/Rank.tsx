import { useLanguage } from '@/hooks/useLanguage';

const Rank: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	return (
		<div className='flex flex-col items-center justify-center gap-4 md:gap-6 h-full p-6 md:p-10'>

			{/* % Wins */}
			{/* <p className='text-xl inline-block'><span className='text-6xl text-text-tertiary'>75</span>% Wins</p> */}
			<p className='text-xl inline-block items-center'>
				<span className='text-6xl text-red-500'>49</span>
				% { t("dashboard_wins") }
			</p>
			
			{/* Rank */}
			<p>Rank <span className='font-bold text-text-tertiary'>3</span></p>
		</div>
	);
};

export default Rank;