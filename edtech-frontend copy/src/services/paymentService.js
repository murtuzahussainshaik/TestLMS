// src/services/paymentService.js
import api from "./api";

export const paymentService = {
  createRazorpayOrder: async (courseId) => {
    const response = await api.post("/razorpay/create-order", { courseId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post("/razorpay/verify-payment", paymentData);
    return response.data;
  },

  getPurchasedCourses: async () => {
    const response = await api.get("/purchase");
    return response.data;
  },

  getCoursePurchaseStatus: async (courseId) => {
    const response = await api.get(
      `/purchase/course/${courseId}/detail-with-status`
    );
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get("/purchase/history");
    return response.data;
  },
};
