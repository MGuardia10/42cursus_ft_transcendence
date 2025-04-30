import { useLocation, useNavigate, useParams } from "react-router";

import UserRank from "@/pages/Dashboard/components/UserRank";
import WinRate from "@/pages/Dashboard/components/WinRate";
import GameStats from "@/pages/Dashboard/components/GameStats";
import MatchHistory from "@/pages/Dashboard/components/MatchHistory";
import { useAuth } from "@/hooks/useAuth";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const Dashboard: React.FC = () => {

  /* useNavigate */
  const Navigate = useNavigate();

  /* useLocation hook */
  const { pathname } = useLocation();

  /* useAuth */
  const { user } = useAuth();
  const { id: paramID } = useParams<{ id: string }>()

  /* Obtain id */
  let id;
  if ( pathname === '/dashboard' ) {
    id = user?.id;
  } else {
    id = paramID;
  }

  /* If no id, return to login */
  if (!id) {
    Navigate('/login', { replace: true });
    return ;
  }

  /* If userId is not a number, return NotFoundPage */
  const userIdNumber = Number(id)
  if (isNaN(userIdNumber) || !Number.isInteger(userIdNumber) || userIdNumber < 1) return <NotFoundPage />;

  /* If pahtname equals same user, redirect to Dashboard */
  if (pathname === `/users/${user?.id}`) {
    Navigate('/dashboard');
    return ;
  }

  /**
   * Faltaria enviar el id como props a cada componente
   * y hacer hooks para cada endopoint diferente
   * 
   * Añadir a types la siguiente interfaz de props
   * export interface DashboardProps {
   *   id: string;
   * }
   */

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
