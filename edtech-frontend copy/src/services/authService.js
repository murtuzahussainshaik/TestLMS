// src/services/authService.js
import api from "./api";

export const authService = {
  register: async (userData) => {
    const response = await api.post("/user/signup", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/user/signin", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/user/signout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.patch("/user/change-password", passwordData);
    return response.data;
  },
};
