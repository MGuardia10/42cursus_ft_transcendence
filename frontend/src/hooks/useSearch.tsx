/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { SearchUser } from '@/types/friendsContext';

export function useSearch() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchUser[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query) {
      // limpieza al borrar el input
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(false);    // marcamos que aún no ha terminado ninguna búsqueda

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/?limit=5&alias=${encodeURIComponent(query)}`,
          {
            credentials: 'include',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = (await res.json()) as SearchUser[];
        setResults(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('useSearch error:', err);
          setError(err.message || 'Error buscando usuarios');
        }
      } finally {
        setLoading(false);
        setHasSearched(true); // aquí ya sabemos que la búsqueda terminó
      }
    };

    const timeout = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { query, setQuery, results, loading, error, hasSearched };
}
