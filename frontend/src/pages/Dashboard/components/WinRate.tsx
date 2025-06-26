"use client"

import { usePlayer } from "@/hooks/usePlayer"
import { useEffect, useState } from "react"

export default function WinRate() {
  const { winCount, loseCount, loading, error, refreshPlayerStats, lastFetch, playerId } = usePlayer()
  const [refreshCount, setRefreshCount] = useState(0)

  // Auto-refresh más agresivo
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 WinRate: Auto-refresh triggered")
      refreshPlayerStats()
      setRefreshCount((prev) => prev + 1)
    }, 5000) // Cada 5 segundos

    return () => clearInterval(interval)
  }, [refreshPlayerStats])

  const totalGames = winCount + loseCount
  const winRate = totalGames > 0 ? (winCount / totalGames) * 100 : 0

  const handleManualRefresh = () => {
    console.log("🔄 WinRate: Manual refresh triggered")
    refreshPlayerStats()
    setRefreshCount((prev) => prev + 1)
  }

  console.log("📊 WinRate: Current stats:", { winCount, loseCount, totalGames, winRate })

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Win Rate</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-text-tertiary rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-text-tertiary rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Win Rate</h3>
        <div className="text-red-400 text-sm">
          <p>Error: {error}</p>
          <button
            onClick={handleManualRefresh}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Win Rate</h3>
        <button
          onClick={handleManualRefresh}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-text-tertiary">
            {totalGames > 0 ? `${winRate.toFixed(1)}%` : "0%"}
          </div>
          <div className="text-text-secondary text-sm">Win Rate</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xl font-semibold text-green-400">{winCount}</div>
            <div className="text-text-secondary text-xs">Wins</div>
          </div>
          <div>
            <div className="text-xl font-semibold text-red-400">{loseCount}</div>
            <div className="text-text-secondary text-xs">Losses</div>
          </div>
        </div>

        {totalGames > 0 && (
          <div className="w-full bg-background-primary rounded-full h-2">
            <div
              className="bg-text-tertiary h-2 rounded-full transition-all duration-300"
              style={{ width: `${winRate}%` }}
            ></div>
          </div>
        )}

        {/* Debug info */}
        <div className="text-xs text-text-tertiary space-y-1 border-t border-text-tertiary/20 pt-2">
          <div>Player ID: {playerId}</div>
          <div>Total Games: {totalGames}</div>
          <div>Last Update: {lastFetch?.toLocaleTimeString()}</div>
          <div>Refresh Count: {refreshCount}</div>
        </div>
      </div>
    </div>
  )
}
