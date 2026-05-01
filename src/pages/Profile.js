import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setNickname(data.user?.user_metadata?.nickname || "");
    });
  }, []);

  const update = async () => {
    await supabase.auth.updateUser({
      data: { nickname },
    });
  };

  const deleteUserData = async () => {
    if (!user) return;

    await supabase.from("tasks").delete().eq("user_id", user.id);
    alert("データ削除完了（ユーザー削除はEdge Function）");
  };

  return (
    <div>
      <h2>プロフィール</h2>

      <p>{user?.email}</p>

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <button onClick={update}>更新</button>
      <button onClick={deleteUserData}>データ削除</button>
    </div>
  );
}