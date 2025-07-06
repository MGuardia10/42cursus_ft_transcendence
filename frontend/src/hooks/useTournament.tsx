/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "http";
import { useState, useCallback } from "react";

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

export function useTournament() {
  // useState variables
  const [tournament, setTournament] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Util: transformGames
  const transformGames = async (
    gamesObj: Record<string, any[]>
  ): Promise<any[][]> => {
    const gamesArray = Object.keys(gamesObj)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => gamesObj[key]);

    for (const roundGames of gamesArray) {
      for (const game of roundGames) {
        // Fetch name of player A
        if (game.player_a_id !== -1) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                game.player_a_id
              }`,
              { credentials: "include" }
            );
            const data = await res.json();
            game.player_a_alias = data.alias;
          } catch {
            game.player_a_alias = "Unknown Player";
          }
        }

        // Fetch name of player B
        if (game.player_b_id !== -1) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                game.player_b_id
              }`,
              { credentials: "include" }
            );
            const data = await res.json();
            game.player_b_alias = data.alias;
          } catch {
            game.player_b_alias = "Unknown Player";
          }
        }

        Object.assign(game, {
          status: game.status === 1 ? "Waiting" : "Finished",
        });
      }
    }

    return gamesArray;
  };

  // Update tournament
  const updateTournament = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(
        `${
          import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL
        }/tournament/${id}/update`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      return;
    } catch (err: any) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get tournament by id
  const getTournament = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        // Update tournament before getting it
        await updateTournament(id);

        // Fetch torunament data
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

        const transformed = {
          ...data,
          games: await transformGames(data.games),
        };
        setTournament(transformed);
        return transformed;
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [updateTournament]
  );

  // Create tournament
  const createTournament = useCallback(async (data: any) => {
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

      return tournament_id;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Join tournament
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

  // Get game from tournament
  const getGameDataFromTournament = useCallback(
    async (tournamentId: string, gameId: number) => {
      if (!tournamentId || !gameId) return null;

      // Get refreshed tournament
      const refreshedTournament = await getTournament(tournamentId);

      if (
        !refreshedTournament ||
        !refreshedTournament.games ||
        !refreshedTournament.configuracion
      )
        return null;

      let refreshedGame;
      for (const round of refreshedTournament.games) {
        for (const game of round) {
          if (game.id === gameId) {
            // Fetch name of player A
            if (game.player_a_id !== -1) {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                    game.player_a_id
                  }`,
                  { credentials: "include" }
                );
                const data = await res.json();
                game.player_a_alias = data.alias;
              } catch {
                game.player_a_alias = "Unknown Player";
              }
            }

            // Fetch name of player B
            if (game.player_b_id !== -1) {
              try {
                const res = await fetch(
                  `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
                    game.player_b_id
                  }`,
                  { credentials: "include" }
                );
                const data = await res.json();
                game.player_b_alias = data.alias;
              } catch {
                game.player_b_alias = "Unknown Player";
              }
            }

            // Assign game based on status too
            if (game.status === "Waiting") {
              refreshedGame = game;
            }
          }
        }
      }

      if (
        !refreshedGame ||
        !refreshedGame.player_a_id ||
        !refreshedGame.player_b_id
      )
        return null;

      const tournamentGameData = {
        gameId: gameId,
        tournamentId: tournamentId,
        player1: {
          id: refreshedGame.player_a_id,
          alias: refreshedGame.player_a_alias,
          avatar: `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
            refreshedGame.player_a_id
          }/avatar`,
        },
        player2: {
          id: refreshedGame.player_b_id,
          alias: refreshedGame.player_b_alias,
          avatar: `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${
            refreshedGame.player_b_id
          }/avatar`,
        },
        configuration: refreshedTournament.configuracion,
      };

      return tournamentGameData;
    },
    [getTournament]
  );

  // Delete tournament
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

  return {
    tournament,
    loading,
    error,
    getTournament,
    getGameDataFromTournament,
    createTournament,
    updateTournament,
    joinTournament,
    deleteTournament,
  };
}
