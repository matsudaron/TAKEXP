import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);

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