import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import DynamicForm from "./components/DynamicForm";
import styles from "./components/Section.module.css";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-tabs">
          <button
            className={styles.button}
            onClick={() => setMode("login")}
            style={{
              background: mode === "login" ? "#6366f1" : "#fff",
              color: mode === "login" ? "#fff" : "#4b5563",
              border: "1.5px solid #e5e7eb",
              maxWidth: "150px",
              flex: 1,
            }}
          >
            Login
          </button>
          <button
            className={styles.button}
            onClick={() => setMode("register")}
            style={{
              background: mode === "register" ? "#6366f1" : "#fff",
              color: mode === "register" ? "#fff" : "#4b5563",
              border: "1.5px solid #e5e7eb",
              maxWidth: "150px",
              flex: 1,
            }}
          >
            Register
          </button>
        </div>
        {mode === "register" ? (
          <RegisterForm onRegistered={setUser} />
        ) : (
          <LoginForm
            onLoggedIn={({ rollNumber, form }) => {
              setUser({ rollNumber });
              setForm(form);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "0.95rem", color: "#4b5563" }}>
          Welcome,{" "}
          <span style={{ fontWeight: 600, color: "#111827" }}>
            {user.rollNumber}
          </span>
        </div>
        <button
          className={styles.button}
          onClick={() => {
            setUser(null);
            setForm(null);
            setMode("login");
          }}
          style={{
            background: "#fff",
            color: "#4b5563",
            border: "1.5px solid #e5e7eb",
            padding: "0.5rem 1rem",
          }}
        >
          Logout
        </button>
      </div>
      <DynamicForm rollNumber={user.rollNumber} initialForm={form} />
    </div>
  );
}
