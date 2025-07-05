import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardProps } from "@/types/dashboardProps";
import { useUserStats } from "@/hooks/useUserStats";
import Spinner from "@/layout/Spinner/Spinner";
import { useUserMatches } from "@/hooks/useUserMatches";

const GameStats: React.FC<DashboardProps> = ({ id }) => {
  // useLanguage hook
  const { t } = useLanguage();

  // useUserStats hook
  const { stats, error, loading } = useUserStats(id);
  const { matches } = useUserMatches(id);
  const tieLength = matches?.filter((m) => m.status === "Tie").length || 0;

  const wins = stats?.winCount || 0;
  const losses = stats?.loseCount || 0;
  const total = wins + losses + tieLength;
  const pointsWon = stats?.winPointsCount || 0;
  const pointsLost = stats?.losePointsCount || 0;
  const totalPoints = pointsWon + pointsLost;

  // Cálculo de ancho en porcentaje para cada barra
  const gameWonWidth = (wins / total) * 100;
  const gameTieWidth = (tieLength / total) * 100;
  const gameLossWidth = (losses / total) * 100;
  const pointsWonWidth = (pointsWon / totalPoints) * 100;
  const pointsLossWidth = (pointsLost / totalPoints) * 100;

  if (loading) {
    return (
      <div className="h-44 md:h-90 w-full mx-auto p-6 md:p-10 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-44 md:h-90 text-text-secondary flex w-full justify-center items-center">
        {t("dashboard_no_data")}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-2 w-full px-8 py-10 md:px-10">
      {/* Game stats */}
      <div className="flex justify-between font-bold">
        <h3>{t("dashboard_games")}</h3>
        <p>{total}</p>
      </div>

      <hr className="-mt-1" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm md:text-base">
          <p>{t("dashboard_games_wins")}</p>
          <p className="text-sm">{wins}</p>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
          <div
            className="h-1.5 md:h-2 rounded-full bg-text-tertiary"
            style={{ width: `${isNaN(gameWonWidth) ? 0 : gameWonWidth}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm md:text-base">
          <p>{t("dashboard_games_tie")}</p>
          <p className="text-sm">{tieLength}</p>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
          <div
            className="h-1.5 md:h-2 rounded-full bg-gray-400"
            style={{ width: `${isNaN(gameTieWidth) ? 0 : gameTieWidth}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm md:text-base">
          <p>{t("dashboard_games_lost")}</p>
          <p className="text-sm">{losses}</p>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
          <div
            className="h-1.5 md:h-2 rounded-full bg-text-secondary"
            style={{ width: `${isNaN(gameLossWidth) ? 0 : gameLossWidth}%` }}
          />
        </div>
      </div>

      {/* Points stats */}
      <div className="flex justify-between font-bold mt-4">
        <h3>{t("dashboard_points")}</h3>
        <p>{totalPoints}</p>
      </div>

      <hr className="-mt-1" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <p>{t("dashboard_points_won")}</p>
          <p>{pointsWon}</p>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
          <div
            className="h-1.5 md:h-2 rounded-full bg-text-tertiary"
            style={{ width: `${isNaN(pointsWonWidth) ? 0 : pointsWonWidth}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <p>{t("dashboard_points_lost")}</p>
          <p>{pointsLost}</p>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
          <div
            className="h-1.5 md:h-2 rounded-full bg-text-secondary"
            style={{
              width: `${isNaN(pointsLossWidth) ? 0 : pointsLossWidth}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameStats;
