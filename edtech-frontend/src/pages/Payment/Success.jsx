// src/pages/Payment/Success.jsx
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get course ID from URL query params
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");

  // Redirect to dashboard if no course ID
  useEffect(() => {
    if (!courseId) {
      navigate("/dashboard", { replace: true });
    }
  }, [courseId, navigate]);

  return (
    <div className="bg-secondary-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />

          <h1 className="mt-4 text-3xl font-bold text-secondary-900">
            Payment Successful!
          </h1>

          <p className="mt-2 text-lg text-secondary-600">
            Congratulations! You have successfully enrolled in the course.
          </p>

          <div className="mt-8 space-y-4">
            <Link
              to={`/dashboard/course/${courseId}`}
              className="block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start Learning
            </Link>

            <Link
              to="/dashboard"
              className="block w-full py-3 px-4 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
