import React, { useState } from "react";
import { registerUser } from "../api/api";

export default function Login({ onLogin }) {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rollNumber.trim() || !name.trim()) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    const result = await registerUser(rollNumber.trim(), name.trim());
    setLoading(false);
    if (result.success) {
      onLogin({ rollNumber: rollNumber.trim(), name: name.trim() });
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "60px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center" }}>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Roll Number
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              autoFocus
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{ width: "100%", padding: 10 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
