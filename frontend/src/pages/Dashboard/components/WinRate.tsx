"use client"

import type React from "react"

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart"
import { useLanguage } from "@/hooks/useLanguage"
import { useMediaQuery } from "@mui/material"
import { usePlayer } from "@/hooks/usePlayer"
import Spinner from "@/layout/Spinner/Spinner"

const WinRate: React.FC = () => {
  // useLanguage hook
  const { t } = useLanguage()

  // usePlayer hook to get real player data
  const { winCount, loseCount, loading, error } = usePlayer()

  // useMediaQuery hook
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isMonitor = useMediaQuery("(max-width: 1536px)")

  const width = isMonitor ? (isMobile ? 250 : 300) : 350
  const height = isMonitor ? (isMobile ? 125 : 150) : 175

  // Calculate total games and percentages
  const totalGames = winCount + loseCount
  const winPercentage = totalGames > 0 ? Math.round((winCount / totalGames) * 100) : 0
  const losePercentage = totalGames > 0 ? Math.round((loseCount / totalGames) * 100) : 0

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-400 text-center">Error loading player data</p>
      </div>
    )
  }

  // Show message if no games played
  if (totalGames === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-text-secondary text-center">No games played yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
      <PieChart
        colors={["#4ACEAB", "#6a6fc3"]}
        series={[
          {
            data: [
              { value: winPercentage, label: `${t("dashboard_wins")}` },
              { value: losePercentage, label: `${t("dashboard_losses")}` },
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
  )
}

export default WinRate
