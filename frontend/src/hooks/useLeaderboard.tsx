import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage leaderboard data: fetch top 3 and paginated list.
 * @param {number} itemsPerPage Number of items per page for the paginated list
 */
export function useLeaderboard(itemsPerPage: number = 5) {
  /* useState variables */
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errorTop, setErrorTop] = useState(null);
  const [errorPage, setErrorPage] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch top 3 players
  const fetchTopPlayers = useCallback(async () => {
    setLoadingTop(true);
    setErrorTop(null);
    try {
      const res = await fetch(`/api/leaderboard/top3`);
      if (!res.ok) throw new Error(`Error fetching top players: ${res.status}`);
      const data = await res.json();
      setTopPlayers(data);
    } catch (err) {
      setErrorTop(err);
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // Fetch paginated players (excluding top 3 on backend)
  const fetchPagePlayers = useCallback(
    async (page) => {
      setLoadingPage(true);
      setErrorPage(null);
      try {
        const res = await fetch(
          `/api/leaderboard?page=${page}&limit=${itemsPerPage}`
        );
        if (!res.ok)
          throw new Error(`Error fetching page ${page}: ${res.status}`);
        const { players, total } = await res.json();
        setCurrentPlayers(players);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } catch (err) {
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
