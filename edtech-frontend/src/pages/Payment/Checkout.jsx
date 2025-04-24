// src/pages/Payment/Checkout.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { courseService } from "../../services/courseService";
import { paymentService } from "../../services/paymentService";
import Loader from "../../components/common/Loader";
import RazorpayCheckout from "../../components/payment/RazorpayCheckout";
import { useAuth } from "../../hooks/useAuth";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

const Checkout = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Fetch course details
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseDetails(courseId),
    refetchOnWindowFocus: false
  });

  // Initiate payment when checkout button is clicked
  const initiatePayment = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.createRazorpayOrder(courseId);
      setPaymentData(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    toast.success("Payment successful!");
    navigate(`/dashboard/course/${courseId}`);
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    toast.error(
      `Payment failed: ${error.error?.description || "Unknown error"}`
    );
  };

  // Go back to course details
  const handleCancel = () => {
    navigate(`/courses/${courseId}`);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (isCourseLoading) {
    return <Loader />;
  }

  if (courseError || !courseData?.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load course details. Please try again.
        </div>
      </div>
    );
  }

  const course = courseData.data;

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Checkout</h1>
          <p className="mt-2 text-secondary-600">
            Complete your purchase to access the course
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">
              Order Summary
            </h2>

            {/* Course preview */}
            <div className="flex items-center mb-6">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-16 w-16 object-cover rounded-md"
              />
              <div className="ml-4">
                <h3 className="font-medium text-secondary-900">
                  {course.title}
                </h3>
                <p className="text-sm text-secondary-500">
                  by {course.instructor?.name || "Instructor"}
                </p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-b border-secondary-200 py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-secondary-600">Course Price</span>
                <span className="text-secondary-900">
                  {formatPrice(course.price)}
                </span>
              </div>

              {/* You can add discount logic here if needed */}

              <div className="flex justify-between font-medium">
                <span className="text-secondary-900">Total</span>
                <span className="text-secondary-900">
                  {formatPrice(course.price)}
                </span>
              </div>
            </div>

            {/* User details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Your Details
              </h3>
              <div className="flex items-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-800 font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="space-y-4">
              {!paymentData ? (
                <>
                  <button
                    onClick={initiatePayment}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : `Pay ${formatPrice(course.price)}`}
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full flex justify-center items-center py-3 px-4 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <RazorpayCheckout
                  order={paymentData.order}
                  course={paymentData.course}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              )}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-secondary-50 px-6 py-4 flex items-center text-xs text-secondary-500">
            <ShieldCheckIcon className="h-4 w-4 text-secondary-400 mr-2" />
            <span>
              Your payment information is processed securely. We do not store
              credit card details.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
