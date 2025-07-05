// src/components/ActivityTracker.tsx
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "react-router";

export function ActivityTracker() {
  // hooks
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Llamada al backend para actualizar last_active
    fetch(
      `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${user?.id}/active`,
      {
        method: "PUT",
        credentials: "include",
      }
    ).catch(() => {});
  }, [location.pathname, user?.id]);

  return null;
}
