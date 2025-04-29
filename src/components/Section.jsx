import React, { useEffect, useState } from "react";
import { validateSection } from "../utils/validation";
import Field from "./Field";

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
}) {
  const [localValues, setLocalValues] = useState({});
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    const sectionFieldValues = {};
    section.fields.forEach((field) => {
      sectionFieldValues[field.fieldId] =
        values[field.fieldId] || (field.type === "checkbox" ? [] : "");
    });
    setLocalValues(sectionFieldValues);
    setLocalErrors({});
  }, [section, values]);

  const handleChange = (fieldId, value) => {
    const updatedValues = { ...localValues, [fieldId]: value };
    setLocalValues(updatedValues);
    const validationErrors = validateSection(section, updatedValues);
    setLocalErrors(validationErrors);
    onSectionChange(updatedValues, validationErrors);
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateSection(section, localValues);
    setLocalErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onNext(localValues, {});
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    onPrev();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateSection(section, localValues);
    setLocalErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(localValues, {});
    }
  };

  return (
    <form>
      <h3 style={{ marginBottom: 4 }}>{section.title}</h3>
      <div style={{ color: "#666", marginBottom: 16 }}>
        {section.description}
      </div>
      {section.fields.map((field) => (
        <div key={field.fieldId} style={{ marginBottom: 18 }}>
          <Field
            field={field}
            value={localValues[field.fieldId]}
            error={localErrors[field.fieldId]}
            onChange={(value) => handleChange(field.fieldId, value)}
          />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        {!isFirst && (
          <button
            type="button"
            onClick={handlePrev}
            style={{ padding: "8px 18px" }}
          >
            Prev
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={handleNext}
            style={{ padding: "8px 18px", marginLeft: "auto" }}
          >
            Next
          </button>
        )}
        {isLast && (
          <button
            type="button"
            onClick={handleSubmit}
            style={{ padding: "8px 18px", marginLeft: "auto" }}
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
