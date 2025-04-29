import React, { useState } from "react";
import { registerUser } from "../api/api";
import styles from "./Section.module.css";
import fieldStyles from "./Field.module.css";

export default function RegisterForm({ onRegistered }) {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!rollNumber.trim() || !name.trim()) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    const result = await registerUser(rollNumber.trim(), name.trim());
    setLoading(false);
    if (result.success) {
      onRegistered({ rollNumber: rollNumber.trim(), name: name.trim() });
    } else {
      setError(result.message || "Registration failed.");
    }
  };

  return (
    <form className={styles.sectionContainer} onSubmit={handleRegister}>
      <h2 className={styles.sectionHeader}>Create Account</h2>
      <p className={styles.sectionDescription}>
        Please fill in your details to register
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
      </div>

      <div className={fieldStyles.fieldGroup}>
        <label className={fieldStyles.label} htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          className={fieldStyles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          disabled={loading}
        />
      </div>

      {error && <div className={fieldStyles.error}>{error}</div>}

      <div className={styles.buttonRow} style={{ justifyContent: "center" }}>
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
