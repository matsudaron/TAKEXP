import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    navigate("/");
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
        <h2>ログイン</h2>

        <input
          className="auth-input"
          placeholder="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <button className="auth-button" onClick={login}>
          ログイン
        </button>

        <p className="auth-link" onClick={() => navigate("/signup")}>
          アカウント作成はこちら
        </p>
      </div>

    </div>
  );
}