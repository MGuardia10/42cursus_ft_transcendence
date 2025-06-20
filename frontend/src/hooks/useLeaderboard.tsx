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
    setLoadingTop(true);
    setErrorTop(null);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
        }/ranking?limit=3&page=1&includeTop3=true`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`Error fetching top players: ${res.status}`);
      const data = await res.json();
      setTopPlayers(data);
    } catch (err: any) {
      setErrorTop(err);
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // Fetch paginated players (excluding top 3 on backend)
  const fetchPagePlayers = useCallback(
    async (page: number) => {
      setLoadingPage(true);
      setErrorPage(null);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
          }/ranking?limit=${itemsPerPage}&page=${page}&includeTop3=false`
        );
        if (!res.ok)
          throw new Error(`Error fetching page ${page}: ${res.status}`);
        const { results, stats } = await res.json();
        setCurrentPlayers(results);
        setTotalPages(Math.ceil(stats.lastPage));
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
