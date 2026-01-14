export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchData(endpoint, options = {}) {
  try {
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      if (!window.location.pathname.includes("login.html")) {
        window.location.href = "/src/features/auth/login.html";
      }
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Terjadi kesalahan");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}