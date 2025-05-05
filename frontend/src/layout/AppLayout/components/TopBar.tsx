import React from 'react';
import { LuMenu } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

import UsersSearch from '@/layout/AppLayout/components/UsersSearch';
import Language from '@/layout/AppLayout/components/Language';
import Profile from '@/layout/AppLayout/components/Profile';

type TopBarProps = {
	showSidebar: boolean;
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  };

const TopBar: React.FC<TopBarProps> = ({ showSidebar, setShowSidebar }) => {
	return (
		<header className='flex justify-between items-center p-4 md:py-4 md:px-6'>
			<div className='flex items-center gap-3 md:gap-4'>
				<div
					className={`text-2xl hover:cursor-pointer transform transition-transform duration-600 ${showSidebar ? "rotate-90" : "rotate-0"}`}
					onClick={ () => setShowSidebar(!showSidebar) }
				>
					{ showSidebar ? <RxCross2 /> : <LuMenu />}
				</div>
				<UsersSearch />
			</div>
			<div className='flex items-center gap-3 md:gap-6'>
				<Language />
				<Profile />
			</div>
		</header>
	);
};

export default TopBar;