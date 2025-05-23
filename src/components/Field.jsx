import React, { useRef } from "react";
import styles from "./Field.module.css";

export default function Field({ field, value, error, onChange }) {
  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    if (field.type === "checkbox") {
      if (field.options && field.options.length > 0) {
        // Handle checkbox group
        const checkboxValue = e.target.value;
        const newValue = e.target.checked
          ? [...(value || []), checkboxValue]
          : (value || []).filter((v) => v !== checkboxValue);
        onChange(newValue);
      } else {
        // Handle single checkbox
        onChange(e.target.checked);
      }
    } else {
      onChange(e.target.value);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "date":
        return (
          <div className={styles.dateInputWrapper}>
            <input
              ref={dateInputRef}
              type="date"
              id={field.fieldId}
              value={value || ""}
              onChange={handleChange}
              className={styles.input}
              max={new Date().toISOString().split("T")[0]}
              data-testid={field.dataTestId}
            />
            <button
              type="button"
              className={styles.calendarButton}
              onClick={() => dateInputRef.current?.showPicker()}
              aria-label="Open calendar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        );

      case "text":
      case "email":
      case "number":
      case "tel":
        return (
          <input
            type={field.type}
            id={field.fieldId}
            value={value || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.fieldId}
            value={value || ""}
            onChange={handleChange}
            className={styles.textarea}
            rows={4}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
          />
        );

      case "select":
      case "dropdown":
        const options = field.options || [];
        const placeholderText =
          field.placeholder || `Select ${field.label.toLowerCase()}`;

        return (
          <select
            id={field.fieldId}
            value={value || ""}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="" disabled>
              {placeholderText}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className={styles.radioGroup}>
            {field.options?.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={field.fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options && field.options.length > 0) {
          // Render checkbox group
          return (
            <div className={styles.checkboxGroup}>
              {field.options.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(value || []).includes(option.value)}
                    onChange={handleChange}
                    data-testid={option.dataTestId}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          );
        } else {
          // Render single checkbox
          return (
            <label className={styles.singleCheckbox}>
              <input
                type="checkbox"
                checked={value || false}
                onChange={handleChange}
                data-testid={field.dataTestId}
              />
              <span>{field.label}</span>
            </label>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.fieldGroup} ${
        field.type === "checkbox" && !field.options?.length
          ? styles.singleCheckboxField
          : ""
      }`}
    >
      {field.type !== "checkbox" || field.options?.length > 0 ? (
        <label className={styles.label} htmlFor={field.fieldId}>
          {field.label}
          {field.required && <span style={{ color: "#dc2626" }}>*</span>}
        </label>
      ) : null}
      {renderField()}
      {field.helper && <div className={styles.helper}>{field.helper}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
