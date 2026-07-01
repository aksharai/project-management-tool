import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Design Dashboard UI",
            assignedTo: "Alex",
            status: "Todo",
            comments: ["Initial wireframe done"]
          },
          {
            id: 2,
            name: "Create Login Page",
            assignedTo: "John",
            status: "In Progress",
            comments: ["API pending"]
          },
          {
            id: 3,
            name: "Connect Database",
            assignedTo: "Sarah",
            status: "Done",
            comments: ["MongoDB connected"]
          }
        ];
  });

  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("Alex");
  const [commentInput, setCommentInput] = useState({});

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = () => {
    if (taskName.trim() === "") return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      assignedTo,
      status: "Todo",
      comments: []
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
  };

  // Move Task (Kanban)
  const moveTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let nextStatus =
            task.status === "Todo"
              ? "In Progress"
              : task.status === "In Progress"
              ? "Done"
              : "Todo";

          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Add Comment
  const addComment = (id) => {
    if (!commentInput[id]) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            comments: [...task.comments, commentInput[id]]
          };
        }
        return task;
      })
    );

    setCommentInput({ ...commentInput, [id]: "" });
  };

  // Analytics
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "Todo").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  const renderColumn = (status) =>
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div className="task" key={task.id}>
          <div className="task-info">
            <h4>{task.name}</h4>
            <p>👤 {task.assignedTo}</p>

            <div className="comments">
              <strong>Comments:</strong>
              {task.comments.map((c, i) => (
                <p key={i}>💬 {c}</p>
              ))}
            </div>

            <div className="comment-box">
              <input
                placeholder="Add comment..."
                value={commentInput[task.id] || ""}
                onChange={(e) =>
                  setCommentInput({
                    ...commentInput,
                    [task.id]: e.target.value
                  })
                }
              />
              <button onClick={() => addComment(task.id)}>Send</button>
            </div>
          </div>

          <div className="task-actions">
            <button className="move-btn" onClick={() => moveTask(task.id)}>
              Move
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ));

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>PMT</h2>
        <ul>
          <li>Dashboard</li>
          <li>Tasks</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">
        <h1>Project Management Tool</h1>

        {/* Analytics */}
        <div className="cards">
          <div className="card">
            <h3>Total</h3>
            <p>{total}</p>
          </div>
          <div className="card">
            <h3>Todo</h3>
            <p>{todo}</p>
          </div>
          <div className="card">
            <h3>In Progress</h3>
            <p>{inProgress}</p>
          </div>
          <div className="card">
            <h3>Done</h3>
            <p>{done}</p>
          </div>
          <div className="card">
            <h3>Completion</h3>
            <p>{completionRate}%</p>
          </div>
        </div>

        {/* Add Task */}
        <div className="task-input">
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option>Alex</option>
            <option>John</option>
            <option>Sarah</option>
          </select>

          <button onClick={addTask}>Add Task</button>
        </div>

        {/* Kanban */}
        <div className="kanban">
          <div className="column">
            <h2>Todo</h2>
            {renderColumn("Todo")}
          </div>

          <div className="column">
            <h2>In Progress</h2>
            {renderColumn("In Progress")}
          </div>

          <div className="column">
            <h2>Done</h2>
            {renderColumn("Done")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
