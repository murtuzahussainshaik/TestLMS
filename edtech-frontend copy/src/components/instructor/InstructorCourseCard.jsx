import { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon, ClockIcon, UserIcon } from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-hot-toast";

const InstructorCourseCard = ({ course, onDelete, onStatusChange }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Calculate average rating
  const averageRating = course.averageRating || 0;

  // Get level badge color
  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200";
    }
  };

  // Toggle publish status
  const togglePublishStatus = async () => {
    try {
      setIsPublishing(true);
      const response = await axios.patch(
        `/api/courses/${course._id}/publish-status`,
        { isPublished: !course.isPublished }
      );
      
      if (response.data.success) {
        toast.success(
          course.isPublished
            ? "Course unpublished successfully"
            : "Course published successfully"
        );
        if (onStatusChange) {
          onStatusChange(course._id, !course.isPublished);
        }
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update course status");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle delete course
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await axios.delete(`/api/courses/${course._id}`);
        if (response.data.success) {
          toast.success("Course deleted successfully");
          if (onDelete) {
            onDelete(course._id);
          }
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  return (
    <div className="course-card bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden border border-secondary-200 dark:border-secondary-700">
      {/* Course thumbnail with status badge */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-primary-600 text-white px-2 py-1 text-xs font-medium">
          {course.category}
        </div>
        <div className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs font-medium rounded-full ${
          course.isPublished
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        }`}>
          {course.isPublished ? "Published" : "Draft"}
        </div>
      </div>

      {/* Course content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
              course.level
            )}`}
          >
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          <div className="flex items-center text-yellow-500">
            <StarIcon className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        <Link to={`/courses/${course._id}`}>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1 line-clamp-2 hover:text-primary-600 transition">
            {course.title}
          </h3>
        </Link>

        {course.subtitle && (
          <p className="text-sm text-secondary-500 dark:text-secondary-300 mb-3 line-clamp-2">
            {course.subtitle}
          </p>
        )}

        <div className="flex items-center text-xs text-secondary-500 dark:text-secondary-300 mb-3">
          <div className="flex items-center mr-3">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>
              {course.totalDuration
                ? `${Math.round(course.totalDuration / 60)} hrs`
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <UserIcon className="h-3 w-3 mr-1" />
            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-primary-700 dark:text-primary-400 font-bold">
            {formatPrice(course.price)}
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">
            Last updated: {new Date(course.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <Link
          to={`/instructor/courses/${course._id}/edit`}
          className="flex items-center justify-center py-2 px-4 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit
        </Link>
        
        <Link
          to={`/instructor/courses/${course._id}/manage`}
          className="flex items-center justify-center py-2 px-4 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          Manage
        </Link>
      </div>
      
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button
          onClick={togglePublishStatus}
          disabled={isPublishing}
          className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
            course.isPublished
              ? "text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
              : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          }`}
        >
          {isPublishing ? "Updating..." : course.isPublished ? "Unpublish" : "Publish"}
        </button>
        
        <button
          onClick={handleDelete}
          className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
        >
          <TrashIcon className="h-4 w-4 inline mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default InstructorCourseCard; 