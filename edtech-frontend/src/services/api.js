// src/services/api.js
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Helper function to get token from multiple storage options
const getAuthToken = () => {
  // Try to get token from cookies first
  const tokenFromCookie = Cookies.get("token");
  if (tokenFromCookie) return tokenFromCookie;
  
  // Fallback to localStorage
  return localStorage.getItem("auth_token");
};

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle unauthorized error
    if (response && response.status === 401) {
      Cookies.remove("token", { path: "/" });
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
