import { useState } from "react";
import "./App.css";

const Top = () => {
  const [xp, setXp] = useState(0);

  const handleLogin = () => {
    setXp((prev) => {
      const next = prev + 5;
      return next > 100 ? 100 : next;
    });
  };

  return (
    <div className="top-container">

      {/* ヘッダー */}
      <header className="header">
        <div>
          <h1 className="logo">TAKEXP</h1>
          <p className="subtitle">毎日の積み上げをゲーム化する</p>
        </div>

        <button className="login-button">
          ログイン
        </button>
      </header>

      {/* メイン */}
      <main className="main">
        <div className="top-card">
          <h2>Lv.12</h2>

          <div className="exp-bar">
            <div
              className="exp-fill"
              style={{ width: `${xp}%` }}
            />
          </div>

          <p>{xp} / 100 XP</p>
        </div>

        <button className="take-xp-button" onClick={handleLogin}>
          今日の経験値を貯める
        </button>
      </main>

      {/* フッター */}
      <footer className="footer">
        <p>連続ログイン：3日目 🔥</p>
      </footer>

    </div>
  );
};

export default Top;