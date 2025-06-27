import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@mui/material";
import { DashboardProps } from "@/types/dashboardProps";
import { useUserRanking } from "@/hooks/useUserRanking";

const WinRate: React.FC<DashboardProps> = ({ id }) => {
  // useLanguage hook
  const { t } = useLanguage();

  // useUserRanking hook
  const { data, error } = useUserRanking(id);

  // useMediaQuery hook
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isMonitor = useMediaQuery("(max-width: 1536px)");

  const width = isMonitor ? (isMobile ? 250 : 300) : 350;
  const height = isMonitor ? (isMobile ? 125 : 150) : 175;

  // If there is an error or win_percentage empty
  if (error || data?.win_percentage === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
        <p className="text-text-secondary text-center">
          {t("dashboard_no_stats")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
      <PieChart
        colors={["#4ACEAB", "#6a6fc3"]}
        series={[
          {
            data: [
              {
                value: data?.win_percentage || 0,
                label: `${t("dashboard_wins")}`,
              },
              {
                value: data?.win_percentage ? 100 - data.win_percentage : 100,
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
