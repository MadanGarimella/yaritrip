// src/api/api.js

// API Base URL
// export const API_BASE_URL = "http://192.168.1.3:8082";
export const API_BASE_URL = "http://localhost:8082";

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/oauth2/authorization/google`,
};

// Generic API Call Function
export const apiCall = async (endpoint, method = "GET", body = null) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Attach token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Attach body
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
