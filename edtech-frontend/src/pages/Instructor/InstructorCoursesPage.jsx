import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/solid";
import InstructorCourseCard from "../../components/instructor/InstructorCourseCard";
import DashboardLayout from "../../layouts/DashboardLayout";

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/courses/instructor/my-courses");
      
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        toast.error("Failed to fetch courses");
        setError("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to fetch courses. Please try again later.");
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course._id !== courseId));
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses(courses.map(course => 
      course._id === courseId ? { ...course, isPublished: newStatus } : course
    ));
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              Manage your created courses
            </p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create New Course
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchCourses}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white dark:bg-secondary-800 shadow-sm rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              No courses yet
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 mb-6">
              You haven't created any courses yet. Start by creating your first course.
            </p>
            <Link
              to="/instructor/courses/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <InstructorCourseCard
                key={course._id}
                course={course}
                onDelete={handleDeleteCourse}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorCoursesPage; 