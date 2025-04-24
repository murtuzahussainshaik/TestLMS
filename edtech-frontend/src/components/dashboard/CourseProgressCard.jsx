// src/components/dashboard/CourseProgressCard.jsx
import { Link } from "react-router-dom";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/solid";

const CourseProgressCard = ({ course }) => {
  // Progress percentage defaults to 0
  const progressPercentage = course.progress?.completionPercentage || 0;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {/* Course image */}
      <div className="relative h-36">
        <img
          className="w-full h-full object-cover"
          src={course.thumbnail}
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/20 to-transparent opacity-50"></div>

        {progressPercentage === 100 ? (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              <CheckIcon className="h-3 w-3 mr-1" />
              Completed
            </span>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
            <div className="flex items-center">
              <div className="w-full bg-secondary-200 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-medium text-white">
                {progressPercentage}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Course info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-secondary-900 line-clamp-2">
          {course.title}
        </h3>

        <p className="mt-1 text-xs text-secondary-500 line-clamp-1">
          by {course.instructor?.name || "Instructor"}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-secondary-500">
            {course.lectures?.length || 0} lectures
          </div>

          <Link
            to={`/dashboard/course/${course._id}`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {progressPercentage === 0
              ? "Start"
              : progressPercentage === 100
              ? "Review"
              : "Continue"}
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressCard;
