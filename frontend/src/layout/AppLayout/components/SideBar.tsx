import { NavLink } from 'react-router';
import { AiOutlineHome } from "react-icons/ai";
import { PiPingPongBold, PiRanking } from "react-icons/pi";
import { IoStatsChartSharp } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
import { GrGamepad } from "react-icons/gr";
import { TbTournament } from "react-icons/tb";

import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { MenuItem } from '@/types/sidebarTypes';
import { useNavigate } from 'react-router';

type SideBarProps = {
	showSidebar: boolean;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  };

const SideBar: React.FC<SideBarProps> = ({ showSidebar, setShowSidebar }) => {

	/* useAuth hook */
	const { user } = useAuth();

	/* useNavigate */
	const Navigate = useNavigate();

	// useLanguage hook
	const { t } = useLanguage();

	// Menu items
	const menuItems: MenuItem[] = [
		{ name: t("sidebar_home"), url: "/", icon: AiOutlineHome },
		{ name: t("sidebar_play") },
		{ name: t("sidebar_single_match"), url: "/single-match", icon: PiPingPongBold },
		{ name: t("sidebar_tournament"), url: "/tournament", icon: TbTournament },
		{ name: t("sidebar_stats") },
		{ name: t("sidebar_dashboard"), url: "/dashboard", icon: IoStatsChartSharp },
		{ name: t("sidebar_leaderboard"), url: "/leaderboard", icon: PiRanking },
		{ name: t("profile_settings") },
		{ name: t("sidebar_profile_settings"), url: "/profile", icon: RiUserSettingsLine },
		{ name: t("sidebar_game_pref"), url: "/game-settings", icon: GrGamepad },
	];

	// Function to close the sidebar when clicking on a link
	const manageCloseSidebar = () => {
		if ( showSidebar && window.innerWidth < 768 ) {
		  setShowSidebar(false);
	  }
	};

	return (
		<aside
      		className={`z-10 fixed top-[62px] md:top-0 left-0 h-full w-full md:w-72 bg-background-secondary p-4 transform ${showSidebar ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}
    	>
			<div>
				<div className='flex items-center justify-center md:items-center cursor-pointer'>
					<h1	
						className="text-xl md:text-sm font-login my-6 md:mt-2 md:mb-0"
						onClick={() => Navigate("/")}
					>
						FT_TRASCENDENCE
					</h1>
				</div>
				<div className="hidden md:flex md:flex-col md:items-center md:my-12">
					<img
						src={user?.avatar}
						onError={(e) => {
							e.currentTarget.src = '/placeholder.webp';
						  }}
						crossOrigin="use-credentials"
						alt='avatar'
						className='md:block md:w-24 md:h-24 rounded-full border-2 border-text-tertiary object-cover'
					/>
					<h2 className="text-3xl font-bold mt-3">{ user?.name?.split(' ')[0] || 'loading...' }</h2>
					<p className="mt-1 text-sm text-text-tertiary">{ user?.alias?.split(' ')[0] || 'loading...' }</p>
				</div>
				<nav className='mt-6 md:-mt-6'>
					<ul>
					{
						menuItems.map((item, index) => (
							<div key={index} className="flex flex-col md:flex-row md:items-center gap-3 px-14 py-2 md:px-6 md:py-2">
								{item.icon && item.url
								? <NavLink 
										to={item.url}
										onClick={() => manageCloseSidebar()}
										className={({ isActive }: { isActive: boolean }) => isActive 
											? "flex flex-row-reverse items-center justify-between md:flex-row gap-4 text-text-secondary pb-2 md:pb-0 border-b md:border-none" 
											: "flex flex-row-reverse items-center justify-between md:flex-row gap-4 pb-2 md:pb-0 border-b border-gray-600 md:border-none"
										}
								>
										<item.icon className="text-xl" />
										<p className='text-sm'>{item.name}</p>
								</NavLink> 
								
								: <p className="md:-ml-2 md:mt-1 text-sm text-gray-400">{item.name}</p>
								}
							</div>
						))
					}
					</ul>
				</nav>
			</div>
    	</aside>
	);
};

export default SideBar;