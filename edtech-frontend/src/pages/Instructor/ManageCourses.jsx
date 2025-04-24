// src/pages/Instructor/ManageCourses.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import {
  PencilIcon,
  EyeIcon,
  PlusIcon,
  UserGroupIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";

const ManageCourses = () => {
  const [myCourses, setMyCourses] = useState([]);

  // Fetch instructor courses
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => courseService.getMyCreatedCourses(),
    refetchOnWindowFocus: false
  });

  // Set courses when data is loaded
  useEffect(() => {
    if (data && !isLoading) {
      setMyCourses(data.data || []);
    }
  }, [data, isLoading]);

  // Show error if courses couldn't be loaded
  useEffect(() => {
    if (error) {
      toast.error("Failed to load your courses");
    }
  }, [error]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-secondary-500">
              Manage and update your courses
            </p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New Course
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : myCourses.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-secondary-200">
              {myCourses.map((course) => (
                <li key={course._id}>
                  <div className="flex items-center p-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded object-cover"
                          src={course.thumbnail}
                          alt={course.title}
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <Link
                            to={`/courses/${course._id}`}
                            className="text-lg font-medium text-primary-600 hover:text-primary-700"
                          >
                            {course.title}
                          </Link>

                          <div className="mt-1 flex items-center text-sm text-secondary-500">
                            <span className="truncate">{course.category}</span>
                            <span className="mx-1">•</span>
                            <span>
                              {course.level.charAt(0).toUpperCase() +
                                course.level.slice(1)}
                            </span>
                            <span className="mx-1">•</span>
                            <span>{formatCurrency(course.price)}</span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center space-x-6">
                          <div className="flex items-center text-sm text-secondary-500">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            <span>
                              {course.enrolledStudents?.length || 0} students
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-secondary-500">
                            <FilmIcon className="h-4 w-4 mr-1" />
                            <span>{course.lectures?.length || 0} lectures</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            course.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/instructor/courses/edit/${course._id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-secondary-300 text-sm leading-5 font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>

                      <Link
                        to={`/courses/${course._id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-secondary-300 text-sm leading-5 font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>

                      <Link
                        to={`/instructor/courses/${course._id}/upload-lecture`}
                        className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm leading-5 font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Lecture
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-secondary-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                Get started by creating your first course.
              </p>
              <div className="mt-6">
                <Link
                  to="/instructor/courses/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create New Course
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
