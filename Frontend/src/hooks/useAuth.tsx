import { useState, useEffect } from "react";
import { api, type AuthUser, getToken } from "@/integrations/api/client";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      try {
        if (!getToken()) {
          if (!cancelled) setUser(null);
          return;
        }
        const me = await api.me();
        if (!cancelled) setUser(me);
      } catch {
        // Token invalid/expired
        await api.signOut();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = async () => {
    await api.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
  };
};
