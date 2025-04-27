import { useState } from 'react';
import { Outlet } from 'react-router';
import TopBar from '@/layout/AppLayout/components/TopBar';
import SideBar from '@/layout/AppLayout/components/SideBar';
import NotificationsLayout from '../NotificationsLayout/NotificationsLayout';

const AppLayout: React.FC = () => {
  // useState to toggle the sidebar
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className='flex transition-all duration-300'>
      {/* Sidebar with navigation */}
      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
          showSidebar ? 'md:ml-72' : 'ml-0'
        }`}
      >
        {/* TopBar */}
        <TopBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <NotificationsLayout />

        {/* Main content que ocupa el resto de la altura */}
        <section className='flex p-4 md:py-4 md:px-6'>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AppLayout;
