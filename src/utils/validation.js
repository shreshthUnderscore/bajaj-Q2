export function validateField(value, field) {
  if (
    field.required &&
    (!value || (Array.isArray(value) && value.length === 0))
  ) {
    return field.validation?.message || "This field is required";
  }
  if (field.minLength && value && value.length < field.minLength) {
    return field.validation?.message || `Minimum length is ${field.minLength}`;
  }
  if (field.maxLength && value && value.length > field.maxLength) {
    return field.validation?.message || `Maximum length is ${field.maxLength}`;
  }
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return field.validation?.message || "Invalid email address";
    }
  }
  if (field.type === "tel" && value) {
    const telRegex = /^\+?\d{10,15}$/;
    if (!telRegex.test(value.replace(/\D/g, ""))) {
      return field.validation?.message || "Invalid phone number";
    }
  }
  // Custom: Date of Birth (must be at least 16 years old)
  if (field.fieldId === "dateOfBirth" && value) {
    const dob = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    if (
      age < 16 ||
      (age === 16 && now < new Date(dob.setFullYear(dob.getFullYear() + 16)))
    ) {
      return field.validation?.message || "You must be at least 16 years old";
    }
  }
  // Custom: Pin code
  if (field.fieldId === "pinCode" && value && !/^\d{6}$/.test(value)) {
    return field.validation?.message || "Please enter a valid 6-digit pin code";
  }
  // Custom: Student ID (if present, must be 9 digits)
  if (field.fieldId === "studentId" && value && !/^\d{9}$/.test(value)) {
    return (
      field.validation?.message ||
      "Student ID must be in the format of 9 digits"
    );
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
