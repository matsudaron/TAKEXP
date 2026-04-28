import { useState, useEffect } from "react";
import "../App.css";
import { supabase } from "../supabase";

const Top = () => {
  const today = new Date().toDateString();
  const [celebration, setCelebration] = useState(false);
  const [tasks, setTasks] = useState([]);

  // =========================
  // 初期ロード
  // =========================
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setTasks(data ?? []);
    };

    fetchTasks();
  }, []);

  const DEV_MODE = false;

  // =========================
  // +1 day
  // =========================
  const handleGainDay = async (task) => {
    const isDone = task.days >= task.goal;

    if (!DEV_MODE && (task.last_claimed === today || isDone)) return;

    const nextDays = task.days + 1;
    const willComplete = nextDays >= task.goal;

    if (willComplete && !isDone) {
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        days: Math.min(nextDays, task.goal),
        last_claimed: today
      })
      .eq("id", task.id)
      .select();

    if (error) {
      console.error(error);
      return;
    }

    const updated = data?.[0];
    if (!updated) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updated : t))
    );
  };

  // =========================
  // 追加
  // =========================
  const handleAddTask = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          name: "",
          days: 0,
          last_claimed: null,
          goal: 30
        }
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    const created = data?.[0];
    if (!created) return;

    setTasks((prev) => [...prev, created]);
  };

  // =========================
  // ローカル変更（即反映）
  // =========================
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

  // =========================
  // DB保存（onBlur）
  // =========================
  const saveTask = async (task) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        name: task.name,
        goal: task.goal
      })
      .eq("id", task.id);

    if (error) console.error(error);
  };

  // =========================
  // 削除
  // =========================
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

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
            <div key={task.id} className={`top-card ${isDone ? "done" : ""}`}>

              <input
                className="task-input"
                value={task.name}
                placeholder="項目名（例：筋トレ）"
                onChange={(e) =>
                  handleNameChange(task.id, e.target.value)
                }
                onBlur={() => saveTask(task)}
              />

              <div className="settings-row">
                <input
                  type="number"
                  value={task.goal}
                  onChange={(e) =>
                    handleGoalChange(task.id, e.target.value)
                  }
                  onBlur={() => saveTask(task)}
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
                  onClick={() => handleGainDay(task)}
                  disabled={
                    task.last_claimed === today || isDone
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

        <button className="add-button" onClick={handleAddTask}>
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