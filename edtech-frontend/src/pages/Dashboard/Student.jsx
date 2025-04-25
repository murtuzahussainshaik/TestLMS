// src/pages/Dashboard/Student.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import CourseProgressCard from "../../components/dashboard/CourseProgressCard";
import { toast } from "react-hot-toast";
import { BookOpenIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch purchased courses
  const {
    data: purchasedData,
    isLoading: isPurchasedLoading,
    error: purchasedError,
  } = useQuery({
    queryKey: ["purchased-courses"],
    queryFn: () => paymentService.getPurchasedCourses(),
    refetchOnWindowFocus: false
  });

  // Fetch published courses for recommendations
  const { data: publishedData, isLoading: isPublishedLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: () => courseService.getPublishedCourses(1, 4),
    refetchOnWindowFocus: false
  });

  // Set enrolled courses when data is loaded
  useEffect(() => {
    if (purchasedData && !isPurchasedLoading) {
      setEnrolledCourses(purchasedData.data || []);
    }
  }, [purchasedData, isPurchasedLoading]);

  // Show error if courses couldn't be loaded
  useEffect(() => {
    if (purchasedError) {
      toast.error("Failed to load enrolled courses");
    }
  }, [purchasedError]);

  // Calculate overall completion percentage
  const getOverallProgress = () => {
    if (!enrolledCourses.length) return 0;

    const completedCourses = enrolledCourses.filter(
      (course) => course.progress?.isCompleted
    ).length;
    return Math.round((completedCourses / enrolledCourses.length) * 100);
  };

  return (
    <div className="py-6">
      {/* Welcome section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Welcome back, {user?.name || "Student"}!
        </h1>
        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
          Track your progress and continue learning from where you left off.
        </p>
      </div>

      {/* Stats overview */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Enrolled courses */}
          <div className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpenIcon
                    className="h-6 w-6 text-primary-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Enrolled Courses
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {enrolledCourses.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Completed courses */}
          <div className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-600 dark:text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Completed Courses
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {
                          enrolledCourses.filter(
                            (course) => course.progress?.isCompleted
                          ).length
                        }
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Overall Progress
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {getOverallProgress()}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My courses section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
          My Courses
        </h2>

        {isPurchasedLoading ? (
          <Loader />
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <CourseProgressCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-secondary-800 rounded-lg shadow">
            <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-500" />
            <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">
              No courses yet
            </h3>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              You haven't enrolled in any courses yet.
            </p>
            <div className="mt-6">
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recommended courses section */}
      {publishedData?.data && publishedData.data.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
            Recommended for You
          </h2>

          {isPublishedLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {publishedData.data.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg"
                >
                  <div className="relative h-36">
                    <img
                      className="w-full h-full object-cover"
                      src={course.thumbnail}
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/20 to-transparent opacity-50"></div>
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-secondary-900 dark:text-white line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2">
                      {course.subtitle || course.description}
                    </p>
                    <div className="mt-4">
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
