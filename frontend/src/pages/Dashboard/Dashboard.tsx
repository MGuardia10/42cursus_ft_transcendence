import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo } from "react";

import UserRank from "@/pages/Dashboard/components/UserRank";
import WinRate from "@/pages/Dashboard/components/WinRate";
import GameStats from "@/pages/Dashboard/components/GameStats";
import MatchHistory from "@/pages/Dashboard/components/MatchHistory";
import { useAuth } from "@/hooks/useAuth";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import Spinner from "@/layout/Spinner/Spinner";
import { useGetUserName } from "@/hooks/useGetUserName";

const Dashboard: React.FC = () => {

  /* useNavigate */
  const Navigate = useNavigate();

  /* useLocation hook */
  const { pathname } = useLocation();
  
  /* useAuth */
  const { user, loading } = useAuth();
  const { id: paramID } = useParams<{ id: string }>()
  
  /* Decide user id to show */
  const id = useMemo<string | undefined>(() => {
    
    // return id from params if it is not the dashboard
    return (pathname === "/dashboard") ? user?.id : paramID;
    
  }, [pathname, user?.id, paramID]);
  
  /* Check id is valid */
  const userIdNumber = id ? Number(id) : NaN;
  const invalidId =
  !id ||
  isNaN(userIdNumber) ||
  !Number.isInteger(userIdNumber) ||
  userIdNumber < 1;
  
  /* useGetUserName hook */
  const { userName, error } = useGetUserName(Number(id));

  /* useEffect to handle user is authenticated */
  useEffect(() => {

    // if loading is true, return
    if (loading) return;

    // if user is not authenticated, redirect to /login
    if (!user) {
      Navigate("/login", { replace: true });
    }
  }, [loading, invalidId, user, Navigate]);
  
  /* useEffect to redirect to /dashboard when user is visiting his own profile */
  useEffect(() => {

    // if loading is true, return
    if (loading) return;

    // if user is authenticated and visiting his own profile, redirect to /dashboard
    if (paramID && user && paramID == user.id) {
      Navigate("/dashboard", { replace: true });
    }
  }, [loading, paramID, user, Navigate]);

  /* If loading false and not valid id */
  if ((!loading && invalidId) || error) {
    return <NotFoundPage />;
  }

  // 6) Mientras authLoading o id indefinido, puedes mostrar un loader
  if (loading || !id) {
    return <Spinner />;
  }

  return (
    <div className="relative grid lg:grid-cols-2 lg:grid-rows-3 xl:grid-cols-6 xl:grid-rows-6 gap-4 w-full xl:max-h-screen p-6 md:p-10 bg-background-secondary rounded-md">
      
      {/* UserRank */}
      <div className="max-h-[500px] xl:max-h-max col-span-full row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-2 xl:row-span-3 bg-background-primary rounded-md overflow-y-auto min-h-0">
        <UserRank  id={Number(id)} alias={userName} />
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
