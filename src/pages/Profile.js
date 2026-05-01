import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../App.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      setUser(u);

      if (!u) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", u.id)
        .single();

      setNickname(profile?.username || "");
    };

    init();
  }, []);

  const update = async () => {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ username: nickname })
      .eq("id", user.id);

    alert("更新しました");
  };

  const deleteUserData = async () => {
    if (!user) return;

    await supabase.from("tasks").delete().eq("user_id", user.id);

    alert("タスク削除完了（ユーザー削除はEdge Function）");
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

        <button className="profile-danger" onClick={deleteUserData}>
          データ削除
        </button>

      </div>

    </div>
  );
}