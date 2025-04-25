import express from "express";
import {
  getCoursePurchaseStatus,
  getPurchasedCourses,
  handleStripeWebhook,
  initiateStripeCheckout,
  getPaymentHistory,
  directEnroll,
} from "../controllers/coursePurchase.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, initiateStripeCheckout);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), handleStripeWebhook);
router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCoursePurchaseStatus);

router.route("/").get(isAuthenticated, getPurchasedCourses);
router.route("/history").get(isAuthenticated, getPaymentHistory);

// Testing route for direct enrollment
router.route("/direct-enroll").post(isAuthenticated, directEnroll);

export default router;
