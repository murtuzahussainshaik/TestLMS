// src/components/courses/CourseCard.jsx
import { Link } from "react-router-dom";
import { StarIcon, ClockIcon, UserIcon } from "@heroicons/react/24/solid";

const CourseCard = ({ course }) => {
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Calculate average rating (placeholder until review system is implemented)
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

  return (
    <div className="course-card bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden border border-secondary-200 dark:border-secondary-700">
      {/* Course thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-primary-600 text-white px-2 py-1 text-xs font-medium">
          {course.category}
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
          <div className="flex items-center">
            {course.instructor?.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="h-6 w-6 rounded-full mr-2 object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2">
                <span className="text-primary-800 dark:text-primary-200 font-medium text-xs">
                  {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                </span>
              </div>
            )}
            <span className="text-xs text-secondary-700 dark:text-secondary-300 truncate">
              {course.instructor?.name || "Instructor"}
            </span>
          </div>
          <div className="text-primary-700 dark:text-primary-400 font-bold">
            {formatPrice(course.price)}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-4 pb-4">
        <Link
          to={`/courses/${course._id}`}
          className="w-full block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
