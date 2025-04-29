import React, { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <div style={{ textAlign: "right", padding: "12px 30px", color: "#666" }}>
        Logged in as <b>{user.name}</b> ({user.rollNumber})
      </div>
      <DynamicForm rollNumber={user.rollNumber} />
    </div>
  );
}
