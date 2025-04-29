import React from "react";

export default function Field({ field, value, error, onChange }) {
  const commonProps = {
    id: field.fieldId,
    name: field.fieldId,
    value: value || "",
    placeholder: field.placeholder || "",
    onChange: (e) => onChange(e.target.value),
    "data-testid": field.dataTestId,
    style: { width: "100%", padding: 8, marginTop: 4 },
  };

  if (field.type === "textarea") {
    return (
      <div>
        <label htmlFor={field.fieldId}>
          {field.label}
          {field.required && " *"}
        </label>
        <textarea {...commonProps} />
        {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}
      </div>
    );
  }

  if (field.type === "dropdown") {
    return (
      <div>
        <label htmlFor={field.fieldId}>
          {field.label}
          {field.required && " *"}
        </label>
        <select
          {...commonProps}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {field.options &&
            field.options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                data-testid={opt.dataTestId}
              >
                {opt.label}
              </option>
            ))}
        </select>
        {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div>
        <label>
          {field.label}
          {field.required && " *"}
        </label>
        <div>
          {field.options &&
            field.options.map((opt) => (
              <label key={opt.value} style={{ marginRight: 16 }}>
                <input
                  type="radio"
                  name={field.fieldId}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  data-testid={opt.dataTestId}
                />
                {opt.label}
              </label>
            ))}
        </div>
        {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div>
        <label>
          {field.label}
          {field.required && " *"}
        </label>
        <div>
          {field.options &&
            field.options.map((opt) => (
              <label key={opt.value} style={{ marginRight: 16 }}>
                <input
                  type="checkbox"
                  name={field.fieldId}
                  value={opt.value}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...(value || []), opt.value]);
                    } else {
                      onChange((value || []).filter((v) => v !== opt.value));
                    }
                  }}
                  data-testid={opt.dataTestId}
                />
                {opt.label}
              </label>
            ))}
        </div>
        {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={field.fieldId}>
        {field.label}
        {field.required && " *"}
      </label>
      <input
        {...commonProps}
        type={field.type}
        maxLength={field.maxLength}
        minLength={field.minLength}
      />
      {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
