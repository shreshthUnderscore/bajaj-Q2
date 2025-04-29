export function validateField(value, field) {
  if (
    field.required &&
    (!value || value === "" || (Array.isArray(value) && value.length === 0))
  ) {
    return field.validation?.message || "This field is required";
  }
  if (field.minLength && value && value.length < field.minLength) {
    return `Minimum length is ${field.minLength}`;
  }
  if (field.maxLength && value && value.length > field.maxLength) {
    return `Maximum length is ${field.maxLength}`;
  }
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Invalid email address";
    }
  }
  if (field.type === "tel" && value) {
    const telRegex = /^[0-9+\-\s()]{6,}$/;
    if (!telRegex.test(value)) {
      return "Invalid phone number";
    }
  }
  return null;
}

export function validateSection(section, values) {
  const errors = {};
  for (const field of section.fields) {
    const error = validateField(values[field.fieldId], field);
    if (error) {
      errors[field.fieldId] = error;
    }
  }
  return errors;
}
