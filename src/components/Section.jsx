import React, { useState } from "react";
import Field from "./Field";
import { validateField } from "../utils/validation";
import styles from "./Section.module.css";

export default function Section({
  section,
  values,
  errors,
  onSectionChange,
  onPrev,
  onNext,
  onSubmit,
  isFirst,
  isLast,
  sectionIndex,
  totalSections,
}) {
  const [localValues, setLocalValues] = useState(values);
  const [localErrors, setLocalErrors] = useState(errors);

  const handleFieldChange = (fieldId, value) => {
    const newValues = { ...localValues, [fieldId]: value };
    setLocalValues(newValues);

    const field = section.fields.find((f) => f.fieldId === fieldId);
    const fieldError = validateField(value, field);

    const newErrors = {
      ...localErrors,
      [fieldId]: fieldError,
    };
    setLocalErrors(newErrors);
    onSectionChange(newValues, newErrors);
  };

  const handleContinue = () => {
    const newErrors = {};
    let hasErrors = false;

    section.fields.forEach((field) => {
      const error = validateField(localValues[field.fieldId], field);
      if (error) {
        newErrors[field.fieldId] = error;
        hasErrors = true;
      }
    });

    setLocalErrors(newErrors);

    if (!hasErrors) {
      if (isLast) {
        onSubmit(localValues, newErrors);
      } else {
        onNext(localValues, newErrors);
      }
    }
  };

  const progress = ((sectionIndex + 1) / totalSections) * 100;

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>

      <h2 className={styles.sectionHeader}>{section.title}</h2>
      {section.description && (
        <p className={styles.sectionDescription}>{section.description}</p>
      )}

      <div className={styles.fieldsGrid}>
        {section.fields.map((field) => (
          <Field
            key={field.fieldId}
            field={field}
            value={localValues[field.fieldId]}
            error={localErrors[field.fieldId]}
            onChange={(value) => handleFieldChange(field.fieldId, value)}
          />
        ))}
      </div>

      <div className={styles.buttonRow}>
        {!isFirst && (
          <button
            type="button"
            onClick={() => onPrev()}
            className={styles.button}
            style={{
              background: "#fff",
              color: "#4b5563",
              border: "1.5px solid #e5e7eb",
            }}
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={handleContinue}
          className={styles.button}
          style={{ marginLeft: "auto" }}
        >
          {isLast ? "Submit" : "Continue"}
        </button>
      </div>
    </div>
  );
}
