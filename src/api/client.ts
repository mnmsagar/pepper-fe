import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env file
  withCredentials: true, // for cookies if needed
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response || error.message || error);
    return Promise.reject(error);
  }
);
