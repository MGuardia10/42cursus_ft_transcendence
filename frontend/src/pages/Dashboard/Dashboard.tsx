import UserRank from "@/pages/Dashboard/components/UserRank";
import WinRate from "@/pages/Dashboard/components/WinRate";
import GameStats from "@/pages/Dashboard/components/GameStats";
import MatchHistory from "@/pages/Dashboard/components/MatchHistory";

const Dashboard: React.FC = () => {
  return (
    <div className="relative grid lg:grid-cols-2 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-6 gap-4 w-full xl:max-h-screen p-6 md:p-10 bg-background-secondary rounded-md">
      
      {/* UserRank */}
      <div className="max-h-[500px] xl:max-h-max col-span-full row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-2 xl:row-span-3 bg-background-primary rounded-md overflow-y-auto min-h-0">
        <UserRank />
      </div>
      
      {/* WinRate */}
      <div className="max-h-[500px] xl:max-h-max col-span-full row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-2 xl:row-span-3 xl:col-start-3 bg-background-primary flex rounded-md">
        <WinRate />
      </div>
      
      {/* GameStats */}
      <div className="max-h-[500px] xl:max-h-max col-span-full row-span-2 lg:col-span-2 lg:row-span-1 xl:col-span-4 xl:row-span-3 xl:col-start-1 xl:row-start-4 bg-background-primary flex rounded-md overflow-y-auto min-h-0">
        <GameStats />
      </div>
      
      {/* MatchHistory */}
      <div className="max-h-[500px] xl:max-h-full xl:h-full col-span-full row-span-2 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-6 xl:col-start-5 xl:row-start-1 bg-background-primary rounded-md overflow-y-auto min-h-0">
        <MatchHistory />
      </div>
      
    </div>
  );
};

export default Dashboard;
