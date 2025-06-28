/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage leaderboard data: fetch top 3 and paginated list.
 * @param {number} itemsPerPage Number of items per page for the paginated list
 */
export function useLeaderboard(itemsPerPage: number = 5) {
  /* useState variables */
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errorTop, setErrorTop] = useState<Error | null>(null);
  const [errorPage, setErrorPage] = useState<Error | null>(null);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch top 3 players
  const fetchTopPlayers = useCallback(async () => {
    // Set loading state and reset error
    setLoadingTop(true);
    setErrorTop(null);

    try {
      // Fetch top 3 players from the API
      const res = await fetch(
        `${
          import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
        }/ranking?limit=3&page=1&includeTop3=true`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      // Check if the response is ok
      if (!res.ok) throw new Error(`Error fetching top players: ${res.status}`);
      const { results } = await res.json();

      // With results, get user data from the API
      if (!Array.isArray(results) || results.length === 0) {
        setTopPlayers([]);
      } else {
        // Map results to include user data
        const data = await Promise.all(
          results.map(async (player: any) => {
            // Fetch user data for each player
            const userRes = await fetch(
              `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${player.id}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            if (userRes.status == 404) {
              // If user not found, return player with empty alias
              return {
                ...player,
                alias: "Unknown",
              };
            }

            // Check if user data response is ok
            if (!userRes.ok)
              throw new Error(
                `Error fetching user ${player.id}: ${userRes.status}`
              );

            // Extract user data neccesary
            const { alias } = await userRes.json();

            // Return player data with alias
            return {
              ...player,
              alias,
            };
          })
        );
        setTopPlayers(data);
      }
    } catch (err: any) {
      setErrorTop(err);
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // Fetch paginated players (excluding top 3 on backend)
  const fetchPagePlayers = useCallback(
    async (page: number) => {
      // Set loading state and reset error
      setLoadingPage(true);
      setErrorPage(null);

      // Fetch players for the current page
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
          }/ranking?limit=${itemsPerPage}&page=${page}&includeTop3=false`
        );

        // Check if the response is ok
        if (!res.ok)
          throw new Error(`Error fetching page ${page}: ${res.status}`);

        // Extract results and stats from the response
        const { results, stats } = await res.json();

        // Check if results is an array and has items
        if (!Array.isArray(results) || results.length === 0) {
          setCurrentPlayers([]);
          setTotalPages(1);
        } else {
          // Map results to include user data
          const data = await Promise.all(
            results.map(async (player: any) => {
              // Fetch user data for each player
              const userRes = await fetch(
                `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                  player.id
                }`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );
              if (userRes.status == 404) {
                // If user not found, return player with empty alias
                return {
                  ...player,
                  alias: "Unknown",
                };
              }

              // Check if user data response is ok
              if (!userRes.ok)
                throw new Error(
                  `Error fetching user ${player.id}: ${userRes.status}`
                );

              // Extract user data neccesary
              const { alias } = await userRes.json();

              // Return player data with alias
              return {
                ...player,
                alias,
              };
            })
          );

          // Set current players
          setCurrentPlayers(data);
        }

        // Set total pages from stats
        setTotalPages(stats.lastPage);
      } catch (err: any) {
        setErrorPage(err);
      } finally {
        setLoadingPage(false);
      }
    },
    [itemsPerPage]
  );

  // Effects
  useEffect(() => {
    fetchTopPlayers();
  }, [fetchTopPlayers]);

  useEffect(() => {
    fetchPagePlayers(currentPage);
  }, [currentPage, fetchPagePlayers]);

  return {
    // Top 3
    topPlayers,
    loadingTop,
    errorTop,
    refetchTop: fetchTopPlayers,
    // Pagination
    currentPlayers,
    currentPage,
    setCurrentPage,
    totalPages,
    loadingPage,
    errorPage,
    refetchPage: () => fetchPagePlayers(currentPage),
  };
}

// Usage in Leaderboard.tsx:
// const {
//   topPlayers, loadingTop, errorTop, refetchTop,
//   currentPlayers, currentPage, setCurrentPage, totalPages, loadingPage, errorPage
// } = useLeaderboard(5);
