import React from 'react';
import ProfileView from '@/pages/Home/components/ProfileView';
import Play from '@/pages/Home/components/Play';
import Rank from '@/pages/Home/components/Rank';
import FriendsView from '@/pages/Home/components/FriendsView';

const Home: React.FC = () => {
	return (
		<div className="grid grid-col-1 grid-row-4 xl:grid-col-4 xl:grid-row-2 gap-4 w-full xl:max-h-screen p-6 md:p-10 bg-background-secondary rounded-md">
      
		{/* ProfileView */}
		<div className="max-h-[500px] xl:max-h-max col-span-full row-span-1 xl:col-span-3 xl:row-span-1 bg-background-primary rounded-md overflow-y-auto min-h-0">
		  <ProfileView />
		</div>
		
		{/* Play */}
		<div className="max-h-[500px] xl:max-h-max col-span-full row-span-1 row-start-2 xl:col-span-1 xl:row-span-1 xl:col-start-4 bg-background-primary rounded-md">
		  <Play />
		</div>
		
		{/* Rank */}
		<div className="max-h-[500px] lg:max-h-[500px] xl:max-h-max col-span-full row-span-1 row-start-3 xl:col-span-1 xl:row-span-1 xl:col-start-1 xl:row-start-2 bg-background-primary rounded-md overflow-y-auto min-h-0">
		  <Rank />
		</div>
		
		{/* FriendsView */}
		<div className="max-h-[500px] lg:max-h-[500px] xl:max-h-max col-span-full row-span-1 row-start-4 xl:col-span-3 xl:row-span-1 xl:col-start-2 xl:row-start-2 bg-background-primary rounded-md overflow-y-auto min-h-0">
		  <FriendsView />
		</div>
		
	  </div>
	);
};

export default Home;
