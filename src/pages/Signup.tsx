import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("signup result:", data, error);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data?.user;

    if (user?.id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: username || "no_name",
        });

      if (profileError) {
        console.warn(profileError.message);
      }
    }

    alert("登録完了！メール確認が必要な場合があります");
    navigate("/");
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>アカウント作成</h2>

        <input
          className="auth-input"
          placeholder="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        />

        <button className="auth-button" onClick={handleSignup}>
          登録する
        </button>

        <p className="auth-link" onClick={() => navigate("/login")}>
          すでにアカウントがある
        </p>

      </div>

    </div>
  );
}