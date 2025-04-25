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
  XCircleIcon,
  CheckCircleIcon,
  PlayIcon,
  BookOpenIcon,
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Manage Courses
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Create, edit and manage your courses
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Link
              to="/instructor/courses/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create New Course
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400 dark:text-red-500"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Error loading courses
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>Failed to load your courses. Please try again.</p>
                </div>
              </div>
            </div>
          </div>
        ) : myCourses.length > 0 ? (
          <div className="bg-white dark:bg-secondary-800 !important shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {myCourses.map((course) => (
                <li key={course._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden mr-4">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {course.title}
                          </p>
                          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400 line-clamp-1">
                            {course.subtitle || course.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300">
                              {course.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300">
                              {course.level.charAt(0).toUpperCase() +
                                course.level.slice(1)}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300">
                              {course.lectures?.length || 0} lectures
                            </span>
                            {course.isPublished ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          to={`/instructor/courses/${course._id}/edit`}
                          className="inline-flex items-center px-3 py-1.5 border border-secondary-300 dark:border-secondary-600 text-xs font-medium rounded text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                        >
                          <PencilIcon
                            className="-ml-0.5 mr-1 h-4 w-4"
                            aria-hidden="true"
                          />
                          Edit
                        </Link>
                        <Link
                          to={`/instructor/courses/${course._id}/upload-lecture`}
                          className="inline-flex items-center px-3 py-1.5 border border-secondary-300 dark:border-secondary-600 text-xs font-medium rounded text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                        >
                          <PlayIcon
                            className="-ml-0.5 mr-1 h-4 w-4"
                            aria-hidden="true"
                          />
                          Lectures
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(course)}
                          className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded ${
                            course.isPublished
                              ? "border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 bg-white dark:bg-secondary-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 bg-white dark:bg-secondary-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                        >
                          {course.isPublished ? (
                            <>
                              <XCircleIcon
                                className="-ml-0.5 mr-1 h-4 w-4"
                                aria-hidden="true"
                              />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon
                                className="-ml-0.5 mr-1 h-4 w-4"
                                aria-hidden="true"
                              />
                              Publish
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg">
            <div className="px-4 py-12 text-center sm:px-6">
              <BookOpenIcon className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-500" />
              <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                Get started by creating a new course.
              </p>
              <div className="mt-6">
                <Link
                  to="/instructor/courses/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
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
