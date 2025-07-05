/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";

// export interface Tournament {
//   id: number;
//   name: string;
//   dateStart: string;
//   dateEnd?: string;
//   [key: string]: any;
// }

// {
// 	"configuration": {
// 		"default_value": true,
// 		"points_to_win": "5",
// 		"serve_delay": "3",
// 		"ball_color": "FFFFFF",
// 		"stick_color": "FFFFFF",
// 		"field_color": "FFFFFF"
// 	},
// 	"players": [ 1, 2, 3, 4 ]
// }

export function useTournament(initialId?: string) {
  // useState variables
  const [tournament, setTournament] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get tournament by id
  const getTournament = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/tournament/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok)
        throw new Error(`Error fetching tournament: ${res.statusText}`);
      const data = await res.json();
      setTournament(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTournament = useCallback(
    async (data: any) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/tournaments`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) throw new Error(`Error creating: ${res.statusText}`);
        const { tournament_id } = await res.json();

        if (!tournament_id) {
          throw new Error("Tournament ID not returned from server");
        }

        const tournamentData = await getTournament(tournament_id);

        setTournament(tournamentData || null);
        return tournamentData;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getTournament]
  );

  const updateTournament = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
        }/tournament/${id}/update`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`Error updating: ${res.statusText}`);
      const updated = await res.json();
      setTournament(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinTournament = useCallback(
    async (tournamentId: string, userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/tournament/join`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              player_id: Number(userId),
              tournament_id: tournamentId,
            }),
          }
        );
        if (!res.ok) throw new Error(`Error joining tournament`);
        const join = await res.json();

        return join;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTournament = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/tournament/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`Error deleting: ${res.statusText}`);
      setTournament(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      getTournament(initialId);
    }
  }, [initialId, getTournament]);

  return {
    tournament,
    loading,
    error,
    getTournament,
    createTournament,
    updateTournament,
    joinTournament,
    deleteTournament,
  };
}
