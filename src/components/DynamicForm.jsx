import React, { useEffect, useState } from "react";
import { fetchForm } from "../api/api";
import Section from "./Section";
import styles from "./Section.module.css";

export default function DynamicForm({ rollNumber, initialForm }) {
  const [form, setForm] = useState(initialForm);
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [sectionErrors, setSectionErrors] = useState({});
  const [loading, setLoading] = useState(!initialForm);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function loadForm() {
      if (initialForm) {
        setForm(initialForm);
        return;
      }

      setLoading(true);
      setFetchError("");
      try {
        const data = await fetchForm(rollNumber);
        setForm(data.form);
        const initialValues = {};
        data.form.sections.forEach((section) => {
          section.fields.forEach((field) => {
            if (field.type === "checkbox") {
              initialValues[field.fieldId] = [];
            } else {
              initialValues[field.fieldId] = "";
            }
          });
        });
        setFormValues(initialValues);
      } catch (err) {
        setFetchError("Failed to fetch form.");
      }
      setLoading(false);
    }
    loadForm();
  }, [rollNumber, initialForm]);

  if (loading) {
    return (
      <div className={styles.sectionContainer} style={{ textAlign: "center" }}>
        <div className={styles.sectionHeader}>Loading form...</div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "90%" }} />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={styles.sectionContainer} style={{ textAlign: "center" }}>
        <div className={styles.sectionHeader}>Error</div>
        <div style={{ color: "var(--error)", marginTop: "1rem" }}>
          {fetchError}
        </div>
        <button
          className={styles.button}
          onClick={() => window.location.reload()}
          style={{ marginTop: "1.5rem" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!form) return null;

  const section = form.sections[currentSection];

  const handleSectionChange = (values, errors) => {
    setFormValues((prev) => ({ ...prev, ...values }));
    setSectionErrors(errors);
  };

  const goToPrev = () => {
    setSectionErrors({});
    setCurrentSection((s) => Math.max(s - 1, 0));
  };

  const goToNext = (values, errors) => {
    if (Object.keys(errors).length === 0) {
      // Check if all required fields are filled
      const hasEmptyRequired = section.fields.some(
        (field) =>
          field.required &&
          (!values[field.fieldId] ||
            (Array.isArray(values[field.fieldId]) &&
              values[field.fieldId].length === 0))
      );

      if (hasEmptyRequired) {
        setSectionErrors((prev) => ({
          ...prev,
          _section: "Please fill in all required fields before proceeding",
        }));
        return;
      }

      setFormValues((prev) => ({ ...prev, ...values }));
      setSectionErrors({});
      setCurrentSection((s) => Math.min(s + 1, form.sections.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSectionErrors(errors);
    }
  };

  const handleSubmit = (values, errors) => {
    if (Object.keys(errors).length === 0) {
      const finalFormValues = { ...formValues, ...values };
      console.log("Form Data:", finalFormValues);
      alert("Form submitted! Check console for data.");
    } else {
      setSectionErrors(errors);
    }
  };

  return (
    <div className="form-content">
      <div className="form-header">
        <div>
          <h1 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>
            {form.formTitle}
          </h1>
        </div>
      </div>

      {/* Progress indicators */}
      <div className={styles.sectionProgress}>
        {form.sections.map((s, index) => (
          <div
            key={s.sectionId}
            className={`${styles.progressStep} ${
              index === currentSection ? styles.active : ""
            } ${index < currentSection ? styles.completed : ""}`}
          >
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepLabel}>{s.title}</div>
          </div>
        ))}
      </div>

      <Section
        section={section}
        values={formValues}
        errors={sectionErrors}
        onSectionChange={handleSectionChange}
        onPrev={goToPrev}
        onNext={goToNext}
        onSubmit={handleSubmit}
        isFirst={currentSection === 0}
        isLast={currentSection === form.sections.length - 1}
        sectionIndex={currentSection}
        totalSections={form.sections.length}
      />

      {sectionErrors._section && (
        <div className={styles.sectionError}>{sectionErrors._section}</div>
      )}
    </div>
  );
}
