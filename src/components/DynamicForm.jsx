import React, { useEffect, useState } from "react";
import { fetchForm } from "../api/api";
import Section from "./Section";

export default function DynamicForm({ rollNumber }) {
  const [form, setForm] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [sectionErrors, setSectionErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function loadForm() {
      setLoading(true);
      setFetchError("");
      try {
        const data = await fetchForm(rollNumber);
        setForm(data.form);
        // Initialize form values for all fields
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
  }, [rollNumber]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>Loading form...</div>
    );
  }
  if (fetchError) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        {fetchError}
      </div>
    );
  }
  if (!form) {
    return null;
  }

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
      setSectionErrors({});
      setCurrentSection((s) => Math.min(s + 1, form.sections.length - 1));
    } else {
      setSectionErrors(errors);
    }
  };

  const handleSubmit = (values, errors) => {
    if (Object.keys(errors).length === 0) {
      console.log("Form Data:", { ...formValues, ...values });
      alert("Form submitted! Check console for data.");
    } else {
      setSectionErrors(errors);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 16 }}>{form.formTitle}</h2>
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
      />
      <div style={{ marginTop: 24, textAlign: "center", color: "#888" }}>
        Section {currentSection + 1} of {form.sections.length}
      </div>
    </div>
  );
}
