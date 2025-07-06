"use client";

import { useState, useCallback } from "react";

interface Game {
  id: number;
  player_a_id: string;
  player_b_id: string;
  player_a_score?: number;
  player_b_score?: number;
  state: string;
  created_at: string;
  updated_at?: string;
}

interface CreateGameData {
  player_a_id: string;
  player_b_id: string;
  game_id?: number;
}

interface UpdateGameData {
  player_a_score: number;
  player_b_score: number;
  state: string;
}

export const useGame = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const findGame = useCallback(
    async (gameData: CreateGameData): Promise<{ game_id: number } | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/games/${
            gameData.game_id
          }`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error creating game: ${response.status}`);
        }

        const { id, status } = await response.json();

        if (status === 1) {
          return { game_id: id };
        }

        return { game_id: -1 };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateGame = useCallback(
    async (gameId: number, updateData: UpdateGameData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/game/${gameId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          throw new Error(`Error updating game: ${response.status}`);
        }

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchGame = useCallback(
    async (gameId: number): Promise<Game | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/game/${gameId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching game: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchGames = useCallback(async (): Promise<Game[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/games`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.status}`);
      }

      const data = await response.json();
      setGames(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    games,
    loading,
    error,
    findGame,
    updateGame,
    fetchGame,
    fetchGames,
  };
};
