import axios from "axios";
import { store } from "@/redux/store"; // adjust path if needed

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach Bearer token if user is logged in
api.interceptors.request.use(
  (config) => {
    // Get token from Redux store (adjust if you use a different method)
    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle server errors and log them
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 502 || status === 500) {
        console.error("Server error:", status, error.response.data);
      }
    } else {
      // Network or other errors
      console.error("API call failed:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;