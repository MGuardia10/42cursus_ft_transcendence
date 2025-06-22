import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PlayerConfig {
  ball_color: string;
  stick_color: string;
  field_color: string;
  points_to_win: number;
  serve_delay: number;
  default_value: boolean;
}

export function usePlayerConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState<PlayerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerConfig = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASEURL}/pong/player/${user.id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch player config');
        }

        const data = await response.json();
        setConfig(data.configuration);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerConfig();
  }, [user]);

  return { config, loading, error };
}
