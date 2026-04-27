import { useState, useEffect } from "react";
import "./App.css";

const Top = () => {
  const today = new Date().toDateString();
  const [celebration, setCelebration] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) {
      return JSON.parse(saved).map((task) => ({
        ...task,
        lastClaimed: task.lastClaimed ?? null,
        goal: task.goal ?? 100
      }));
    }

    return [
      {
        id: 1,
        name: "通常タスク",
        days: 0,
        lastClaimed: null,
        goal: 30
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const DEV_MODE = false;

  const handleGainDay = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const isDone = task.days >= task.goal;

        // 1日1回制限
        if (!DEV_MODE && (task.lastClaimed === today || isDone)) {
          return task;
        }

        const nextDays = task.days + 1;
        const willComplete = nextDays >= task.goal;

        if (willComplete && !isDone) {
          setCelebration(true);
          setTimeout(() => setCelebration(false), 2000);
        }

        return {
          ...task,
          days: Math.min(nextDays, task.goal),
          lastClaimed: today
        };
      })
    );
  };

  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        days: 0,
        lastClaimed: null,
        goal: 30
      }
    ]);
  };

  const handleNameChange = (id, value) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, name: value } : task
      )
    );
  };

  const handleGoalChange = (id, value) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, goal: Number(value) } : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="top-container">

      {celebration && (
        <div className="celebration">
          🎉 CONGRATULATIONS 🎉
        </div>
      )}

      <header className="header">
        <div>
          <h1 className="logo">TAKEXP</h1>
          <p className="subtitle">毎日の積み上げをゲーム化する</p>
        </div>
      </header>

      <main className="main">

        {tasks.map((task) => {
          const isDone = task.days >= task.goal;

          return (
            <div
              key={task.id}
              className={`top-card ${isDone ? "done" : ""}`}
            >

              <input
                className="task-input"
                value={task.name}
                placeholder="項目名（例：筋トレ）"
                onChange={(e) =>
                  handleNameChange(task.id, e.target.value)
                }
              />

              {/* 目標日数 */}
              <div className="settings-row">
                <input
                  type="number"
                  value={task.goal}
                  onChange={(e) =>
                    handleGoalChange(task.id, e.target.value)
                  }
                />
              </div>

              <div className="exp-bar">
                <div
                  className="exp-fill"
                  style={{
                    width: `${(task.days / task.goal) * 100}%`
                  }}
                />
              </div>

              <p>
                {task.days} / {task.goal} days
              </p>

              <div className="button-row">

                <button
                  className="take-day-button"
                  onClick={() => handleGainDay(task.id)}
                  disabled={
                    task.lastClaimed === today || isDone
                  }
                >
                  ＋1 day
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  削除
                </button>

              </div>

            </div>
          );
        })}

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