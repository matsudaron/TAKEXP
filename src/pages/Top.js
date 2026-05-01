import { useState, useEffect } from "react";
import "../App.css";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Top = () => {
  const today = new Date().toDateString();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [celebration, setCelebration] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const MAX_GUEST_TASKS = 1;
  const DEV_MODE = false;

  // =========================
  // Auth初期化
  // =========================
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setAuthReady(true);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // =========================
  // タスク取得
  // =========================
  useEffect(() => {
    if (!authReady) return;

    if (!user?.id) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      setTasks(data ?? []);
    };

    fetchTasks();
  }, [user?.id, authReady]);

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
        last_claimed: today,
      })
      .eq("id", task.id)
      .select();

    if (error) return console.error(error);

    const updated = data?.[0];

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updated : t))
    );
  };

  // =========================
  // 追加
  // =========================
  const handleAddTask = async () => {
    if (!user && tasks.length >= MAX_GUEST_TASKS) {
      alert("ゲストは1つまでしか作れません");
      return;
    }

    if (!user) {
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: "",
          days: 0,
          goal: 30,
          last_claimed: null,
          user_id: null,
        },
      ]);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          name: "",
          days: 0,
          goal: 30,
          last_claimed: null,
          user_id: user.id,
        },
      ])
      .select();

    if (error) return console.error(error);

    setTasks((prev) => [...prev, data[0]]);
  };

  // =========================
  // 更新
  // =========================
  const handleChange = (id, key, value) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [key]: value } : t
      )
    );
  };

  const saveTask = async (task) => {
    if (!user) return;

    await supabase
      .from("tasks")
      .update({
        name: task.name,
        goal: task.goal,
      })
      .eq("id", task.id);
  };

  // =========================
  // 削除
  // =========================
  const handleDelete = async (id) => {
    if (user) {
      await supabase.from("tasks").delete().eq("id", id);
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // =========================
  // UI
  // =========================
  if (!authReady) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="top-container">

      {celebration && (
        <div className="celebration">🎉 CONGRATULATIONS 🎉</div>
      )}

      <header className="header">
        <div>
          <h1 className="logo">TAKEXP</h1>
          <p className="subtitle">毎日の積み上げをゲーム化する</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {!user ? (
            <>
              <button onClick={() => navigate("/login")}>ログイン</button>
              <button onClick={() => navigate("/signup")}>新規登録</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/profile")}>プロフィール</button>
              <button onClick={() => supabase.auth.signOut()}>
                ログアウト
              </button>
            </>
          )}
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
                placeholder="項目（例：筋トレ）"
                onChange={(e) =>
                  handleChange(task.id, "name", e.target.value)
                }
                onBlur={() => saveTask(task)}
              />

              <div className="settings-row">
                <input
                  type="number"
                  value={task.goal}
                  onChange={(e) =>
                    handleChange(task.id, "goal", Number(e.target.value))
                  }
                  onBlur={() => saveTask(task)}
                />
              </div>

              <div className="exp-bar">
                <div
                  className="exp-fill"
                  style={{
                    width: `${task.goal ? Math.min((task.days / task.goal) * 100, 100) : 0}%`,
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

        <button
          className="add-button"
          onClick={handleAddTask}
        >
          ＋追加
        </button>

      </main>

      <footer className="footer">
        <p>ここはフッターエリア</p>
      </footer>

    </div>
  );
};

export default Top;