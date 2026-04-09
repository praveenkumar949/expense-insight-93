import { useState, useEffect } from "react";
import { api } from "@/integrations/api/client";
import { useAuth } from "./useAuth";

interface Profile {
  id: string;
  full_name: string;
  phone_number: string | null;
  email: string;
  avatar_url: string | null;
  monthly_report_enabled: boolean;
  report_frequency: string | null;
  last_report_sent_at: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
};
