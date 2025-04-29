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
        <div style={{ color: "#dc2626", marginTop: "1rem" }}>{fetchError}</div>
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
      setFormValues((prev) => ({ ...prev, ...values }));
      setSectionErrors({});
      setCurrentSection((s) => Math.min(s + 1, form.sections.length - 1));
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
    <div style={{ padding: "1rem" }}>
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
      <div
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.95rem",
          marginTop: "1rem",
        }}
      >
        Section {currentSection + 1} of {form.sections.length}
      </div>
    </div>
  );
}
