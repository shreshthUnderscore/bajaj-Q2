import React, { useState } from "react";
import { fetchForm } from "../api/api";
import styles from "./Section.module.css";
import fieldStyles from "./Field.module.css";

export default function LoginForm({ onLoggedIn }) {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!rollNumber.trim()) {
      setError("Roll Number is required.");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchForm(rollNumber.trim());
      setLoading(false);
      onLoggedIn({ rollNumber: rollNumber.trim(), form: data.form });
    } catch (err) {
      setLoading(false);
      setError("Invalid roll number or user not registered.");
    }
  };

  return (
    <form className={styles.sectionContainer} onSubmit={handleLogin}>
      <h2 className={styles.sectionHeader}>Welcome Back</h2>
      <p className={styles.sectionDescription}>
        Please enter your roll number to continue
      </p>

      <div className={fieldStyles.fieldGroup}>
        <label className={fieldStyles.label} htmlFor="rollNumber">
          Roll Number
        </label>
        <input
          id="rollNumber"
          className={fieldStyles.input}
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Enter your roll number"
          disabled={loading}
        />
        {error && <div className={fieldStyles.error}>{error}</div>}
      </div>

      <div className={styles.buttonRow} style={{ justifyContent: "center" }}>
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
