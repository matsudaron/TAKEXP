import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../App.css";
import { User } from "@supabase/supabase-js";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      setUser(u);

      if (!u) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", u.id)
        .single();

      setNickname(profile?.nickname || "");
    };

    init();
  }, []);

  const update = async () => {
    if (!user) return;

    const updates: { nickname?: string } = {};

    if (nickname.trim() !== "") {
      updates.nickname = nickname;
    }

    if (Object.keys(updates).length === 0) {
      alert("変更がありません");
      return;
    }

    await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    alert("更新しました");
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h2>プロフィール</h2>

        <p className="profile-email">{user?.email}</p>

        <input
          className="profile-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="nickname"
        />

        <button className="profile-button" onClick={update}>
          更新
        </button>

      </div>

    </div>
  );
}