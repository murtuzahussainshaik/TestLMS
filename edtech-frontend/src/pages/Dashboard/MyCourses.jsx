// src/pages/Dashboard/MyCourses.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import {
  BookOpenIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatters";

const MyCourses = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch purchased courses
  const {
    data: purchasedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["purchased-courses"],
    queryFn: () => paymentService.getPurchasedCourses(),
    refetchOnWindowFocus: false
  });

  // Set enrolled courses when data is loaded
  useEffect(() => {
    if (purchasedData && !isLoading) {
      setEnrolledCourses(purchasedData.data || []);
    }
  }, [purchasedData, isLoading]);

  // Show error if courses couldn't be loaded
  useEffect(() => {
    if (error) {
      toast.error("Failed to load enrolled courses");
      console.error("Error loading courses:", error);
    }
  }, [error]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">My Courses</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Access your enrolled courses and continue learning
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-secondary-200"
              >
                {/* Course thumbnail */}
                <div className="relative h-40">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Progress indicator */}
                  {course.progress && (
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full"
                            style={{
                              width: `${
                                course.progress.completionPercentage || 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-white">
                          {course.progress?.completionPercentage || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Course info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-secondary-900 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-sm text-secondary-500 line-clamp-1">
                    by {course.instructor?.name || "Instructor"}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-secondary-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>
                        {course.totalDuration
                          ? `${Math.round(course.totalDuration / 60)} hrs`
                          : `${course.lectures?.length || 0} lectures`}
                      </span>
                    </div>

                    <div className="text-xs text-secondary-500">
                      Enrolled on{" "}
                      {formatDate(course.enrolledAt || course.createdAt)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      to={`/dashboard/course/${course._id}`}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      {course.progress?.isCompleted ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Review Course
                        </>
                      ) : course.progress?.completionPercentage > 0 ? (
                        <>
                          <ArrowRightIcon className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-lg font-medium text-secondary-900">
              No courses yet
            </h3>
            <p className="mt-1 text-sm text-secondary-500">
              You haven't enrolled in any courses yet.
            </p>
            <div className="mt-6">
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
