import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Profile = {
  id: string;
  nickname: string;
  username: string;
};

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [userId]);

  return profile;
};