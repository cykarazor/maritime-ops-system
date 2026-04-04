import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// RESPONSE INTERCEPTOR
// =========================
apiClient.interceptors.response.use(
  (response) => {
    // 🔥 normalize ALL responses here
    return response.data;
  },
  (error) => {
    return Promise.reject(
      error.response?.data || {
        success: false,
        message: "Network error",
      }
    );
  }
);

export default apiClient;