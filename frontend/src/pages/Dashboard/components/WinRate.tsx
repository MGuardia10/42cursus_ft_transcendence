import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@mui/material";
import { DashboardProps } from "@/types/dashboardProps";
import Spinner from "@/layout/Spinner/Spinner";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserMatches } from "@/hooks/useUserMatches";

const WinRate: React.FC<DashboardProps> = ({ id }) => {
  // useLanguage hook
  const { t } = useLanguage();

  // useUserStats hook
  const { stats, loading, error } = useUserStats(id);
  const { matches } = useUserMatches(id);
  const tieLength = matches?.filter((m) => m.status === "Tie").length || 0;

  const wins = stats?.winCount || 0;
  const losses = stats?.loseCount || 0;
  const total = wins + losses + tieLength;

  // Cálculo de ancho en porcentaje para cada barra
  const gameWonPercentage = Number(((wins / total) * 100).toFixed(1));
  const gameTiePercentage = Number(((tieLength / total) * 100).toFixed(1));
  const gameLossPercentage = Number(((losses / total) * 100).toFixed(1));

  // useMediaQuery hook
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isMonitor = useMediaQuery("(max-width: 1536px)");

  const width = isMonitor ? (isMobile ? 250 : 300) : 350;
  const height = isMonitor ? (isMobile ? 125 : 150) : 175;

  if (loading) {
    return (
      <div className="min-h-44 md:min-h-90 flex items-center justify-center w-full p-6 md:p-10">
        <Spinner />
      </div>
    );
  }

  // If there is an error or win_percentage empty
  if (error || !stats || total === 0) {
    return (
      <div className="min-h-44 md:min-h-90 flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
        <p className="text-text-secondary text-center">
          {t("dashboard_no_stats")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
      <PieChart
        colors={["#4ACEAB", "#99A1AE", "#6a6fc3"]}
        series={[
          {
            data: [
              {
                value: gameWonPercentage || 0,
                label: `${t("dashboard_wins")}`,
              },
              {
                value: Number(gameTiePercentage),
                label: `${t("dashboard_games_tie")}`,
              },
              {
                value: gameLossPercentage,
                label: `${t("dashboard_losses")}`,
              },
            ],
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: isMonitor ? (isMobile ? 20 : 30) : 40,
            paddingAngle: 5,
            startAngle: -180,
            arcLabel: (item) => `${item.value}%`,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            stroke: "none",
            fontSize: 14,
            fontWeight: "bold",
          },
          [`& .${pieArcLabelClasses.highlighted}`]: {
            fill: "white",
          },
          [`& .${pieArcLabelClasses.faded}`]: {
            fill: "none",
          },
        }}
        slotProps={{
          legend: {
            hidden: false,
            labelStyle: {
              fontSize: isMobile ? 14 : 16,
              fill: "white",
            },
          },
        }}
        width={width}
        height={height}
      />
    </div>
  );
};

export default WinRate;
