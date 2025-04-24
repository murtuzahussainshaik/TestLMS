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

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
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
      Cookies.remove("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
