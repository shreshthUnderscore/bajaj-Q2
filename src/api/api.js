const BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export async function registerUser(rollNumber, name) {
  const response = await fetch(`${BASE_URL}/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollNumber, name }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return {
      success: false,
      status: response.status,
      message: data.message || "Registration failed",
    };
  }
  const data = await response.json();
  return { success: true, ...data };
}

export async function fetchForm(rollNumber) {
  const response = await fetch(
    `${BASE_URL}/get-form?rollNumber=${encodeURIComponent(rollNumber)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch form");
  }
  return await response.json();
}
