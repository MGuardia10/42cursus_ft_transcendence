/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlayerStats } from "@/types/playerTypes";
import { useState, useEffect, useCallback } from "react";

export function useUserStats(userId: string | number) {
  // State variables
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Función que hace la petición
  const fetchUserRanking = useCallback(async () => {
    // Set error and loading state
    setError(null);
    setLoading(true);

    // Get data from the API
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      // Check if the response is ok
      if (!res.ok) {
        throw new Error(`Error fetching user ${userId}: ${res.status}`);
      }

      // Parse the response data
      const data = await res.json();

      // playerStats object
      const playerStats: PlayerStats = {
        winCount: data.win_count || 0,
        loseCount: data.lose_count || 0,
        winPointsCount: data.win_points || 0,
        losePointsCount: data.lose_points || 0,
      };

      setStats(playerStats);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cada vez que cambie el userId, refetch
  useEffect(() => {
    if (userId != null) {
      fetchUserRanking();
    } else {
      setStats(null);
      setError(new Error("No userId provided"));
    }
  }, [userId, fetchUserRanking]);

  return {
    stats,
    loading,
    error,
    refetch: fetchUserRanking,
  };
}
