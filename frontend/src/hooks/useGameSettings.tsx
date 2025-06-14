import { useState, useEffect, useCallback } from "react";

export function useGameSettings() {
  /* State variables with default values */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [custom, setCustom] = useState(false);
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
    // let isMounted = true;
    setLoading(true);
    setError(null);

    console.log(bgColor, barColor, ballColor);

    // fetch("/api/game-settings")
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       throw new Error(`Error fetching settings: ${res.status}`);
    //     }
    //     const data = await res.json();

    //     // Check if component is still mounted before updating state
    //     if (!isMounted) return;

    //     // Set state variables with fetched data
    //     setCustom(data.custom);
    //     setScore(String(data.score));
    //     setServeDelay(String(data.serveDelay));
    //     setBgColor(data.bgColor);
    //     setBarColor(data.barColor);
    //     setBallColor(data.ballColor);
    //   })
    //   .catch((err: Error) => {
    //     if (isMounted) setError(err);
    //   })
    //   .finally(() => {
    //     if (isMounted) setLoading(false);
    //   });

    return () => {
      // isMounted = false;
    };
  }, []);

  /* Submit updated settings */
  const updateSettings = useCallback(async () => {
    // Payload
    const payload = {
      custom,
      score: Number(score),
      serveDelay: Number(serveDelay),
      bgColor,
      barColor,
      ballColor,
    };

    try {
      // Make API request to save settings
      const res = await fetch("/api/game-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if response is ok
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error saving settings: ${res.status} ${errorText}`);
      }

      // Parse response
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err };
    }
  }, [custom, score, serveDelay, bgColor, barColor, ballColor]);

  return {
    loading,
    error,
    custom,
    setCustom,
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
