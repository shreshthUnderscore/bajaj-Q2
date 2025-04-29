export function validateField(value, field) {
  if (
    field.required &&
    (!value || (Array.isArray(value) && value.length === 0))
  ) {
    return field.validation?.message || "This field is required";
  }

  // Length validations
  if (field.minLength && value && value.length < field.minLength) {
    return field.validation?.message || `Minimum length is ${field.minLength}`;
  }
  if (field.maxLength && value && value.length > field.maxLength) {
    return field.validation?.message || `Maximum length is ${field.maxLength}`;
  }

  // Name validations (firstName, lastName)
  if (
    (field.fieldId === "firstName" || field.fieldId === "lastName") &&
    value
  ) {
    if (value.length < 2 || value.length > 30) {
      return (
        field.validation?.message ||
        `${field.label} must be between 2-30 characters`
      );
    }
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      return "Only letters, spaces, hyphens, and apostrophes are allowed";
    }
  }

  // Registration number validation
  if (field.fieldId === "registrationNumber" && value) {
    if (value.length < 2 || value.length > 50) {
      return (
        field.validation?.message ||
        "Registration number must be between 2-50 characters"
      );
    }
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return field.validation?.message || "Invalid email address";
    }
  }

  // Phone number validation
  if (field.type === "tel" && value) {
    const telRegex = /^\+?\d{10,15}$/;
    if (!telRegex.test(value.replace(/\D/g, ""))) {
      return field.validation?.message || "Invalid phone number";
    }
  }

  // Date of Birth validation (must be at least 16 years old)
  if (field.fieldId === "dateOfBirth" && value) {
    const dob = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();

    if (isNaN(dob.getTime())) {
      return "Please enter a valid date";
    }

    if (
      age < 16 ||
      (age === 16 &&
        (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())))
    ) {
      return field.validation?.message || "You must be at least 16 years old";
    }

    if (dob > now) {
      return "Date of birth cannot be in the future";
    }
  }

  // Student ID validation
  if (field.fieldId === "studentId" && value) {
    if (!/^\d{9}$/.test(value)) {
      return field.validation?.message || "Student ID must be 9 digits";
    }
  }

  // Emergency contact validations
  if (field.fieldId === "emergencyContactPhone" && value) {
    const cleanPhone = value.replace(/\D/g, "");
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      return field.validation?.message || "Please enter a valid phone number";
    }
  }

  if (field.fieldId === "emergencyContactEmail" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return field.validation?.message || "Please enter a valid email address";
    }
  }

  if (field.fieldId === "emergencyContactAddress" && value) {
    if (value.length < 5 || value.length > 200) {
      return (
        field.validation?.message || "Address must be between 5-200 characters"
      );
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
