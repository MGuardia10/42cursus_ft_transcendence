"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

interface PlayerStats {
  id: number;
  active: boolean;
  configuration: {
    default_value: boolean;
    points_to_win: number;
    serve_delay: number;
    ball_color: string;
    stick_color: string;
    field_color: string;
  };
  win_count: number;
  lose_count: number;
  win_points: number;
  lose_points: number;
}

export function usePlayer() {
  const { user } = useAuth();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  const fetchPlayerStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player/${user.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Intentar crear el jugador
          const createResponse = await fetch(
            `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: user.id }),
            }
          );

          if (createResponse.ok) {
            // Volver a intentar obtener los stats
            return fetchPlayerStats();
          } else {
            throw new Error(
              `Failed to create player: ${createResponse.status}`
            );
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      setPlayerStats(data);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshPlayerStats = useCallback(async () => {
    await fetchPlayerStats();
  }, [fetchPlayerStats]);

  // Initial fetch
  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  // Auto-refresh cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlayerStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchPlayerStats]);

  // Refresh cuando la ventana vuelve a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPlayerStats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchPlayerStats]);

  return {
    playerId: user?.id,
    winCount: playerStats?.win_count || 0,
    loseCount: playerStats?.lose_count || 0,
    winPoints: playerStats?.win_points || 0,
    losePoints: playerStats?.lose_points || 0,
    configuration: playerStats?.configuration,
    loading,
    error,
    refreshPlayerStats,
    lastFetch,
    playerStats,
  };
}
