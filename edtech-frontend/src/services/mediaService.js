// src/services/mediaService.js
import api from "./api";

export const mediaService = {
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/media/upload-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
