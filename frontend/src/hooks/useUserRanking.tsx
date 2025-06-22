/* eslint-disable @typescript-eslint/no-explicit-any */
import { RankingPlayer } from "@/types/rankingPlayerTypes";
import { useState, useEffect, useCallback } from "react";

export function useUserRanking(userId: string | number) {
  // State variables
  const [data, setData] = useState<RankingPlayer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Función que hace la petición
  const fetchUserRanking = useCallback(async () => {
    // Reseteamos error anterior
    setError(null);

    // Get data from the API
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/ranking/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      // Check if the response is ok
      if (!res.ok) {
        throw new Error(`Error fetching user ${userId}: ${res.status}`);
      }

      const json: RankingPlayer = await res.json();

      console.log("User ranking data:", json);
      setData(json);
    } catch (err: any) {
      setError(err);
    }
  }, [userId]);

  // Cada vez que cambie el userId, refetch
  useEffect(() => {
    if (userId != null) {
      fetchUserRanking();
    } else {
      setData(null);
      setError(new Error("No userId provided"));
    }
  }, [userId, fetchUserRanking]);

  return {
    data,
    error,
    refetch: fetchUserRanking,
  };
}
