import UserRank from "@/pages/Dashboard/components/UserRank";
import WinRate from "@/pages/Dashboard/components/WinRate";
import GameStats from "@/pages/Dashboard/components/GameStats";
import MatchHistory from "@/pages/Dashboard/components/MatchHistory";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-6 grid-rows-4 lg:grid-rows-6 gap-4 w-full lg:max-h-screen p-6 md:p-10 bg-background-secondary rounded-md">
		<div className="col-span-full row-span-1 lg:col-span-3 lg:row-span-3  xl:col-span-2 xl:row-span-3 bg-background-primary flex items-center justify-center rounded-md">
			<UserRank />
		</div>
		<div className="col-span-full row-span-1 lg:col-span-3 lg:row-span-3 xl:col-span-2 xl:row-span-3 xl:col-start-3 bg-background-primary flex items-center justify-center rounded-md">
			<WinRate />
		</div>
		<div className="col-span-full row-span-1 lg:row-span-2 xl:col-span-4 xl:row-span-3 xl:col-start-1 xl:row-start-4 bg-background-primary flex items-center justify-center rounded-md">
			<GameStats />
		</div>
		<div className="col-span-full row-span-1 lg:row-span-2 xl:col-span-2 xl:row-span-6 xl:col-start-5 xl:row-start-1 bg-background-primary justify-center rounded-md">
			<MatchHistory />
		</div>
    </div>
  );
};

export default Dashboard;
