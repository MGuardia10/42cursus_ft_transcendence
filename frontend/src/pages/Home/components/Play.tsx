import { Link } from "react-router";
import { PiPingPong, PiRanking } from "react-icons/pi";

import { useLanguage } from '@/hooks/useLanguage';


const Play: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	return (
		<div className='flex flex-col items-center justify-center gap-4 md:gap-6 h-full p-6 md:p-10'>

			{/* Single Match */}
			<Link 
				className='flex items-center justify-center gap-3 p-2 md:p-3 w-48 xl:w-64 bg-text-secondary hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300'
				to={'/single-match'}
				>
				<PiPingPong className="text-xl" />
				{ t("home_play_match") }
			</Link>

			{/* Tournament */}
			<Link 
				className='flex items-center justify-center gap-2 p-2 md:p-3 w-48 xl:w-64 bg-text-secondary hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300'
				to={'/tournament'}
			>
				<PiRanking className="text-xl" />	
				{ t("home_play_tournament") }
			</Link>
		</div>
	);
};

export default Play;