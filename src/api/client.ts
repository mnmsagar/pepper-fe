import axios from "axios";

// ✅ Create Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env file
  withCredentials: true, // ✅ include cookies automatically with each request
});

// ❌ Remove localStorage token logic (since token is in cookies)

// ✅ Optional: Global response error handler
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message || error
    );

    // Optional: handle auth errors globally
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Token may be invalid or expired.");
      // Optional: redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
