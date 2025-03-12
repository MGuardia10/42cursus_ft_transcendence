import { useState } from 'react';
import { Outlet } from 'react-router';
import TopBar from '@/layout/AppLayout/components/TopBar';
import SideBar from '@/layout/AppLayout/components/SideBar';

const AppLayout: React.FC = () => {

	// useState to toggle the sidebar
	const [showSidebar, setShowSidebar] = useState(false);

	return (
		<>
		  <div className='flex transition-all duration-300'>
			
			{/* Sidebar with navigation */}
		  	<SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

			<div className={`flex-1 transition-all duration-300 ${showSidebar ? "md:ml-64" : "ml-0"}`}>
				
				{/* Topbar with search, notifications and user settings */}
				<TopBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

				{/* Main content */}
				<section className='p-4 md:py-4 md:px-6 overflow-y-auto'>
					<Outlet />
				</section>
				
			</div>
		  </div>
		</>
	);
};

export default AppLayout;