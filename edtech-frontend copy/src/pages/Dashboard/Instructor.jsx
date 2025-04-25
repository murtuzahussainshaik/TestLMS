// src/pages/Dashboard/Instructor.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import {
  AcademicCapIcon,
  PlusIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    publishedCourses: 0,
  });

  // Fetch instructor courses
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => courseService.getMyCreatedCourses(),
    refetchOnWindowFocus: false
  });

  // Set courses and calculate stats when data is loaded
  useEffect(() => {
    if (data && !isLoading) {
      const courses = data.data || [];
      setMyCourses(courses);

      // Calculate stats
      setStats({
        totalCourses: courses.length,
        totalStudents: courses.reduce(
          (total, course) => total + (course.enrolledStudents?.length || 0),
          0
        ),
        totalRevenue: courses.reduce((total, course) => {
          return total + course.price * (course.enrolledStudents?.length || 0);
        }, 0),
        publishedCourses: courses.filter((course) => course.isPublished).length,
      });
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
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Instructor Dashboard
            </h1>
            <p className="mt-1 text-sm text-secondary-500">
              Manage your courses and track your performance
            </p>
          </div>
          <div className="mt-4 md:mt-0">
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

      {/* Stats overview */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total courses */}
          <div className="bg-white dark:bg-secondary-800 !important overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon
                    className="h-6 w-6 text-primary-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Total Courses
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {stats.totalCourses}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total students */}
          <div className="bg-white dark:bg-secondary-800 !important overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon
                    className="h-6 w-6 text-green-600 dark:text-green-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Total Students
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {stats.totalStudents}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total revenue */}
          <div className="bg-white dark:bg-secondary-800 !important overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyRupeeIcon
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Total Revenue
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {formatCurrency(stats.totalRevenue)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Published courses */}
          <div className="bg-white dark:bg-secondary-800 !important overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon
                    className="h-6 w-6 text-purple-600 dark:text-purple-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                      Published Courses
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-secondary-900 dark:text-white">
                        {stats.publishedCourses} / {stats.totalCourses}
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-lg font-medium text-secondary-900 dark:text-white">
            My Courses
          </h2>

          <Link
            to="/instructor/courses"
            className="inline-flex items-center mt-3 md:mt-0 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            View All
            <span className="ml-1">→</span>
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : myCourses.length > 0 ? (
          <div className="overflow-hidden bg-white dark:bg-secondary-800 !important shadow sm:rounded-md">
            <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {myCourses.slice(0, 5).map((course) => (
                <li key={course._id}>
                  <div className="flex items-center p-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={course.thumbnail}
                          alt={course.title}
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="truncate text-sm font-medium text-primary-600">
                            {course.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-secondary-500">
                            {course.enrolledStudents?.length || 0} students
                            enrolled
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
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
                    <div className="ml-5 flex flex-shrink-0">
                      <Link
                        to={`/instructor/courses/edit/${course._id}`}
                        className="ml-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/instructor/courses/${course._id}/upload-lecture`}
                        className="ml-4 inline-flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-700"
                      >
                        Add Lecture
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-secondary-400" />
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
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
