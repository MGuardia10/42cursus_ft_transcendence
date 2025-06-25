/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./useAuth"
import { User } from "@/types/authContext"

export type PlayerStats = {
  id: number
  active: number
  winCount: number
  loseCount: number
  winPointsCount: number
  losePointsCount: number
}

export const usePlayer = () => {
  const { user } = useAuth()
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPlayerStats = useCallback(async () => {
    if (!user?.id) {
      setPlayerStats(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player/${user.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching player stats: ${response.status}`)
      }

      const data = await response.json()

      // Mapear los datos de la API al formato del hook
      const mappedStats: PlayerStats = {
        id: Number(user.id),
        active: data.active,
        winCount: data.win_count,
        loseCount: data.lose_count,
        winPointsCount: data.win_points,
        losePointsCount: data.lose_points,
      }

      setPlayerStats(mappedStats)
    } catch (err: any) {
      console.error("Error fetching player stats:", err)
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      setPlayerStats(null)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchPlayerStats()
  }, [fetchPlayerStats])

  // Función para refrescar los stats manualmente
  const refreshPlayerStats = useCallback(() => {
    fetchPlayerStats()
  }, [fetchPlayerStats])

  // Calcular estadísticas derivadas
  const totalGames = playerStats ? playerStats.winCount + playerStats.loseCount : 0
  const winRate = totalGames > 0 ? (playerStats?.winCount || 0) / totalGames : 0
  const totalPoints = playerStats ? playerStats.winPointsCount + playerStats.losePointsCount : 0

  return {
    // Datos básicos
    playerStats,
    loading,
    error,

    // Estadísticas individuales
    playerId: playerStats?.id || null,
    winCount: playerStats?.winCount || 0,
    loseCount: playerStats?.loseCount || 0,
    winPointsCount: playerStats?.winPointsCount || 0,
    losePointsCount: playerStats?.losePointsCount || 0,
    active: playerStats?.active || 0,

    // Estadísticas calculadas
    totalGames,
    winRate,
    totalPoints,

    // Funciones
    refreshPlayerStats,
    refetch: fetchPlayerStats, // Alias para consistencia con otros hooks
  }
}