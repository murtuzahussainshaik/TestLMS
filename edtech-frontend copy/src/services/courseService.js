// src/services/courseService.js
import api from "./api";

export const courseService = {
  // Student facing endpoints
  getPublishedCourses: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/course/published?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  searchCourses: async (filters) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/course/search?${queryString}`);
    return response.data;
  },

  getCourseDetails: async (courseId) => {
    const response = await api.get(`/course/c/${courseId}`);
    return response.data;
  },

  getCourseLectures: async (courseId) => {
    const response = await api.get(`/course/c/${courseId}/lectures`);
    return response.data;
  },

  getMyEnrolledCourses: async () => {
    const response = await api.get("/course/enrolled");
    return response.data;
  },

  // Instructor facing endpoints
  createCourse: async (formData) => {
    const response = await api.post("/course", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getMyCreatedCourses: async () => {
    const response = await api.get("/course");
    return response.data;
  },

  updateCourseDetails: async (courseId, formData) => {
    const response = await api.patch(`/course/c/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  addLectureToCourse: async (courseId, formData) => {
    const response = await api.post(
      `/course/c/${courseId}/lectures`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  toggleCoursePublish: async (courseId) => {
    const response = await api.patch(`/course/c/${courseId}/publish`);
    return response.data;
  },
};
