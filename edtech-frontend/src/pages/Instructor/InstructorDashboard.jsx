import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const InstructorDashboard = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch instructor's courses
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: courseService.getMyCreatedCourses,
  });

  // Toggle course publish status
  const togglePublishMutation = useMutation({
    mutationFn: courseService.toggleCoursePublish,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["instructor-courses"]);
      queryClient.invalidateQueries(["published-courses"]);
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update course status");
    },
  });

  // Handle publish toggle
  const handleTogglePublish = (courseId) => {
    togglePublishMutation.mutate(courseId);
  };

  // Placeholder for delete function
  const handleDeleteCourse = (courseId) => {
    // TODO: Implement course deletion
    console.log("Delete course:", courseId);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Failed to load courses. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const courses = data?.data || [];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">My Courses</h1>
          <Link
            to="/instructor/courses/create"
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No courses yet
            </h3>
            <p className="text-secondary-500 mb-4">
              Create your first course to get started.
            </p>
            <Link to="/instructor/courses/create" className="btn btn-primary">
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className={`p-2 rounded-full ${
                        course.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                      title={course.isPublished ? "Unpublish" : "Publish"}
                    >
                      {course.isPublished ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-secondary-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-secondary-500 mb-4">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="text-sm text-secondary-500">
                      {course.enrolledStudents?.length || 0} students
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!course.isPublished && (
                        <button
                          onClick={() => handleTogglePublish(course._id)}
                          className="text-xs px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 rounded-md"
                        >
                          Publish
                        </button>
                      )}
                      {course.isPublished && (
                        <button
                          onClick={() => handleTogglePublish(course._id)}
                          className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md"
                        >
                          Unpublish
                        </button>
                      )}
                      <Link
                        to={`/instructor/courses/${course._id}/edit`}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/instructor/courses/${course._id}/lectures/add`}
                        className="text-xs px-3 py-1 bg-primary-100 text-primary-800 hover:bg-primary-200 rounded-md"
                      >
                        Add Lecture
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard; 