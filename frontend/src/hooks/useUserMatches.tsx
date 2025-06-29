/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import {
  RawMatch,
  PlayerInfo,
  UserInfo,
  EnrichedMatch,
} from "@/types/matchTypes";

/**
 * Hook que devuelve las partidas de un usuario, enriquecidas con alias/avatar y estado,
 * asignando placeholders cuando un jugador no está activo.
 */
export function useUserMatches(userId: number | string) {
  // useState variables
  const [matches, setMatches] = useState<EnrichedMatch[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // API base URLs
  const pongBase = import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL;
  const userBase = import.meta.env.VITE_USER_API_BASEURL_EXTERNAL;

  const fetchUserMatches = useCallback(async () => {
    setError(null);

    try {
      // 1) Traer la lista cruda de matches
      const res = await fetch(`${pongBase}/games?player=${userId}`, {
        method: "GET",
        credentials: "include",
      });

      // Check for errors in the response
      if (!res.ok) throw new Error(`Error fetching matches: ${res.status}`);
      const raw: RawMatch[] = await res.json();

      const enriched: EnrichedMatch[] = await Promise.all(
        raw.map(async (m) => {
          // 2) Consultar estado active de ambos
          const [pARes, pBRes] = await Promise.all([
            fetch(`${pongBase}/player/${m.player_a_id}`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`${pongBase}/player/${m.player_b_id}`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

          // Check errors
          if (!pARes.ok || !pBRes.ok) {
            throw new Error(`Error fetching player status`);
          }

          // Set players info
          const pAResJson = await pARes.json();
          const pBResJson = await pBRes.json();

          const pAJson: PlayerInfo = {
            id: m.player_a_id,
            active: pAResJson.active,
          };

          const pBJson: PlayerInfo = {
            id: m.player_b_id,
            active: pBResJson.active,
          };

          // 3) Para cada jugador, si está activo hago la petición de usuario,
          //    si no, uso el placeholder
          const getUserOrPlaceholder = async (
            id: number,
            isActive: boolean
          ): Promise<UserInfo> => {
            // If not active, return placeholder
            if (!isActive) {
              return { id, alias: "No data", avatarUrl: "/placeholder.webp" };
            }

            // If active, fetch user data
            const uRes = await fetch(`${userBase}/${id}`, {
              method: "GET",
              credentials: "include",
            });

            // Check for errors in user response
            if (!uRes.ok) {
              throw new Error(`Error fetching user ${id}: ${uRes.status}`);
            }

            const uJson = await uRes.json();

            /* Refresh avatar */
            const avatarRes = await fetch(
              `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${id}/avatar`,
              {
                credentials: "include",
                headers: {
                  "Access-Control-Allow-Origin": `${
                    import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL
                  }`,
                },
              }
            );

            if (!avatarRes.ok) {
              return {
                id,
                alias: uJson.alias,
                avatarUrl: "/placeholder.webp",
              };
            }

            // Convert avatar response to blob and create object URL
            const avatarBlob = await avatarRes.blob();
            const avatarUrlObject = URL.createObjectURL(avatarBlob);

            if (uJson.avatarUrl) {
              URL.revokeObjectURL(uJson.avatarUrl);
            }

            return {
              id,
              alias: uJson.alias,
              avatarUrl: avatarUrlObject || "/placeholder.webp",
            };
          };

          const [userA, userB] = await Promise.all([
            getUserOrPlaceholder(m.player_a_id, pAJson.active),
            getUserOrPlaceholder(m.player_b_id, pBJson.active),
          ]);

          const playerA = { ...userA, score: m.player_a_score };
          const playerB = { ...userB, score: m.player_b_score };

          // 4) Determinar si es playerA o playerB y estado final
          const isPlayerA = String(m.player_a_id) === String(userId);
          let finalStatus: EnrichedMatch["status"];
          if (m.player_a_score === m.player_b_score) {
            finalStatus = "Tie";
          } else if (
            (isPlayerA && m.player_a_score > m.player_b_score) ||
            (!isPlayerA && m.player_b_score > m.player_a_score)
          ) {
            finalStatus = "Won";
          } else {
            finalStatus = "Lost";
          }

          return {
            id: m.id,
            date: m.date,
            status: finalStatus,
            playerA,
            playerB,
            isPlayerA,
          };
        })
      );

      setMatches(enriched);
    } catch (err: any) {
      setError(err);
    }
  }, [pongBase, userBase, userId]);

  useEffect(() => {
    if (userId != null) {
      fetchUserMatches();
    } else {
      setError(new Error("No userId provided"));
    }
  }, [userId, fetchUserMatches]);

  return { matches, error, refetch: fetchUserMatches };
}
