// src/pages/Courses/CourseDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import LectureList from "../../components/courses/LectureList";
import { toast } from "react-hot-toast";
import {
  StarIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import {
  ShoppingCartIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isPurchased, setIsPurchased] = useState(false);

  // Fetch course details
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseDetails(courseId),
    refetchOnWindowFocus: false
  });

  // Fetch purchase status if user is authenticated
  const { data: purchaseData, isLoading: isPurchaseLoading } = useQuery({
    queryKey: ["purchase-status", courseId],
    queryFn: () => paymentService.getCoursePurchaseStatus(courseId),
    enabled: isAuthenticated && !!courseId,
    refetchOnWindowFocus: false
  });

  // Update purchased status when data is loaded
  useEffect(() => {
    if (purchaseData && !isPurchaseLoading) {
      setIsPurchased(purchaseData.data.isPurchased);
    }
  }, [purchaseData, isPurchaseLoading]);

  // Handle enrollment/purchase
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }

    try {
      // Navigate to checkout
      navigate(`/dashboard/checkout/${courseId}`);
    } catch (error) {
      toast.error("Failed to process enrollment");
    }
  };

  // Handle start/continue learning
  const handleStartLearning = () => {
    navigate(`/dashboard/course/${courseId}`);
  };

  // Show error if course couldn't be loaded
  useEffect(() => {
    if (error) {
      toast.error("Failed to load course details");
    }
  }, [error]);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Course not found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const course = data.data;

  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      {/* Hero section */}
      <div className="bg-secondary-900 dark:bg-secondary-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course info */}
            <div className="md:w-2/3">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {course.category}
                </span>
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-lg text-secondary-300 mb-6">
                  {course.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center text-sm text-secondary-300 gap-x-6 gap-y-2 mb-6">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{course.averageRating || 0} rating</span>
                </div>

                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>

                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {course.totalDuration
                      ? `${Math.round(course.totalDuration / 60)} hours`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  <span>{course.lectures?.length || 0} lectures</span>
                </div>
              </div>

              <div className="flex items-center">
                {course.instructor?.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-800 font-medium text-sm">
                      {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {course.instructor?.name || "Instructor"}
                  </p>
                  <p className="text-xs text-secondary-400">
                    {course.instructor?.role || "Instructor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Course card */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Course thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <PlayIcon className="h-16 w-16 text-white opacity-75" />
                  </div>
                </div>

                {/* Price and actions */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-3xl font-bold text-secondary-900">
                      {formatPrice(course.price)}
                    </div>
                  </div>

                  {isPurchased ? (
                    <button
                      onClick={handleStartLearning}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-3"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mb-3"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Enroll Now
                    </button>
                  )}

                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-semibold text-secondary-900">
                      This course includes:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex text-sm text-secondary-500">
                        <ClockIcon className="h-5 w-5 text-secondary-400 mr-2" />
                        {course.totalDuration
                          ? `${Math.round(
                              course.totalDuration / 60
                            )} hours of video content`
                          : "Video lectures"}
                      </li>
                      <li className="flex text-sm text-secondary-500">
                        <AcademicCapIcon className="h-5 w-5 text-secondary-400 mr-2" />
                        {course.lectures?.length || 0} lectures
                      </li>
                      <li className="flex text-sm text-secondary-500">
                        <CheckCircleIcon className="h-5 w-5 text-secondary-400 mr-2" />
                        Full lifetime access
                      </li>
                      <li className="flex text-sm text-secondary-500">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-secondary-400 mr-2" />
                        Access on mobile and desktop
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Course details */}
          <div className="md:w-2/3">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                About This Course
              </h2>
              <div className="prose prose-sm max-w-none text-secondary-500 dark:text-secondary-300">
                {course.description ? (
                  <p>{course.description}</p>
                ) : (
                  <p>No description available for this course.</p>
                )}
              </div>
            </div>

            {/* Course curriculum */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Course Curriculum
              </h2>
              <LectureList
                courseId={courseId}
                isPurchased={isPurchased}
                isInstructor={course.instructor?._id === user?._id}
              />
            </div>
          </div>

          {/* Instructor profile */}
          <div className="md:w-1/3">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Instructor
              </h2>
              <div className="flex items-center mb-4">
                {course.instructor?.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-800 font-medium text-lg">
                      {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                    {course.instructor?.name || "Instructor"}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {course.instructor?.role || "Instructor"}
                  </p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-secondary-500 dark:text-secondary-300">
                {course.instructor?.bio ? (
                  <p>{course.instructor.bio}</p>
                ) : (
                  <p>No instructor bio available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
