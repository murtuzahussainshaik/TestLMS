// src/services/progressService.js
import api from "./api";

export const progressService = {
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/progress/${courseId}`);
    return response.data;
  },

  updateLectureProgress: async (courseId, lectureId) => {
    const response = await api.patch(
      `/progress/${courseId}/lectures/${lectureId}`
    );
    return response.data;
  },

  markCourseAsCompleted: async (courseId) => {
    const response = await api.patch(`/progress/${courseId}/complete`);
    return response.data;
  },

  resetCourseProgress: async (courseId) => {
    const response = await api.patch(`/progress/${courseId}/reset`);
    return response.data;
  },
};
