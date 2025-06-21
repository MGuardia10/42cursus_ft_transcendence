import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/authContext";
import { PlayerSettings } from "@/types/playerTypes";

export function useGameSettings() {
  /* Get userID */
  const { user } = useAuth();
  const { id } = user as User;

  /* State variables with default values */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [defaultValue, setDefaultValue] = useState(true);
  const [score, setScore] = useState(import.meta.env.VITE_POINTS_TO_WIN);
  const [serveDelay, setServeDelay] = useState(
    import.meta.env.VITE_SERVE_DELAY
  );
  const [bgColor, setBgColor] = useState(
    `#${import.meta.env.VITE_FIELD_COLOR}`
  );
  const [barColor, setBarColor] = useState(
    `#${import.meta.env.VITE_STICK_COLOR}`
  );
  const [ballColor, setBallColor] = useState(
    `#${import.meta.env.VITE_BALL_COLOR}`
  );

  /* Fetch current user data from API */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    /* Get userID */

    fetch(`${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error fetching settings: ${res.status}`);
        }
        const data = await res.json();
        // const { configuration } = data;

        const currentConfiguration: PlayerSettings = {
          default: data.configuration.default_value,
          pointToWin: data.configuration.points_to_win,
          serveDelay: data.configuration.serve_delay,
          bgColor: data.configuration.field_color,
          barColor: data.configuration.stick_color,
          ballColor: data.configuration.ball_color,
        };

        // Check if component is still mounted before updating state
        if (!isMounted) return;

        // Set state variables with fetched data
        setDefaultValue(currentConfiguration.default === 1 ? true : false);
        setScore(String(currentConfiguration.pointToWin));
        setServeDelay(String(currentConfiguration.serveDelay));
        setBgColor(`#${currentConfiguration.bgColor}`);
        setBarColor(`#${currentConfiguration.barColor}`);
        setBallColor(`#${currentConfiguration.ballColor}`);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* Submit updated settings */
  const updateSettings = useCallback(
    async (overrideDefault: boolean) => {
      let default_value = defaultValue ? 1 : 0;

      // If overrideDefault is true, set default_value to opposite
      if (overrideDefault) default_value = defaultValue ? 0 : 1;

      // Payload
      const payload = {
        default_value,
        points_to_win: Number(score),
        serve_delay: Number(serveDelay),
        ball_color: ballColor.replace("#", ""),
        stick_color: barColor.replace("#", ""),
        field_color: bgColor.replace("#", ""),
      };

      try {
        // Make API request to save settings
        const res = await fetch(
          `${import.meta.env.VITE_PONG_API_BASEURL_EXTERNAL}/player/${id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ configuration: payload }),
          }
        );

        // Check if response is ok
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error saving settings: ${res.status} ${errorText}`);
        }

        // Parse response
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [defaultValue, score, serveDelay, bgColor, barColor, ballColor, id]
  );

  return {
    loading,
    error,
    defaultValue,
    setDefaultValue,
    score,
    setScore,
    serveDelay,
    setServeDelay,
    bgColor,
    setBgColor,
    barColor,
    setBarColor,
    ballColor,
    setBallColor,
    updateSettings,
  };
}
