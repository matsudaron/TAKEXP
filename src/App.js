import { useState, useEffect } from "react";
import "./App.css";

const Top = () => {

  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [
    { id: 1, name: "通常XP", xp: 0 }
  ];
});

  // tasksが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // XP加算
  const DEV_MODE = false; // ←テスト時はtrueに変更
  const handleGainXp = (id) => {
  const today = new Date().toDateString();

  setTasks((prev) =>
    prev.map((task) => {
      if (task.id !== id) return task;
      // ▼開発者モード：制限無視
      if (DEV_MODE) {
        return {
          ...task,
          xp: Math.min(task.xp + 5, 100)
        };
      }
      // ▼通常モード：1日1回制限
      if (task.lastClaimed === today) return task;
      return {
        ...task,
        xp: Math.min(task.xp + 5, 100),
        lastClaimed: today
      };
    })
  );
};

  // 項目追加
  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        xp: 0,
        lastClaimed: null
      }
    ]);
  };

  // 名前変更
  const handleNameChange = (id, value) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, name: value } : task
      )
    );
  };

  // 削除
  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="top-container">

      <header className="header">
        <div>
          <h1 className="logo">TAKEXP</h1>
          <p className="subtitle">毎日の積み上げをゲーム化する</p>
        </div>
      </header>

      <main className="main">

        {tasks.map((task) => (
          <div key={task.id} className="top-card">

            {/* 名前編集 */}
            <input
              className="task-input"
              value={task.name}
              placeholder="項目名を入力（例：筋トレ）"
              onChange={(e) =>
                handleNameChange(task.id, e.target.value)
              }
            />

            <div className="exp-bar">
              <div
                className="exp-fill"
                style={{ width: `${task.xp}%` }}
              />
            </div>

            <p>{task.xp} / 100 XP</p>

            <div className="button-row">
              <button
                className="take-xp-button"
                onClick={() => handleGainXp(task.id)}
                disabled={task.lastClaimed === new Date().toDateString()}
              >
                ＋5 XP
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(task.id)}
              >
                削除
              </button>
            </div>

          </div>
        ))}

        <button
          className="add-button"
          onClick={handleAddTask}
        >
          ＋ 項目を追加
        </button>

      </main>

      <footer className="footer">
        <p>ここはフッターエリア</p>
      </footer>

    </div>
  );
};

export default Top;