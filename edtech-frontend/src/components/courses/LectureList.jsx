// src/components/courses/LectureList.jsx
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { PlayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";

const LectureList = ({ courseId, isPurchased, isInstructor }) => {
  // Fetch course lectures
  const { data, isLoading, error } = useQuery({
    queryKey: ["course-lectures", courseId],
    queryFn: () => courseService.getCourseLectures(courseId),
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.data) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
        Failed to load course lectures. Please try again.
      </div>
    );
  }

  const { lectures, isEnrolled } = data.data;

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {lectures && lectures.length > 0 ? (
        lectures.map((lecture, index) => (
          <div
            key={lecture._id}
            className="border border-secondary-200 dark:border-secondary-700 rounded-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-secondary-50 dark:bg-secondary-800/50">
              <div className="flex items-center">
                <span className="text-secondary-500 dark:text-secondary-400 mr-3">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                  {lecture.title}
                </h3>
              </div>
              <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-sm">
                {formatDuration(lecture.duration)}
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2">
                {lecture.description || "No description available"}
              </p>

              {isPurchased || isInstructor || lecture.isPreview ? (
                <Link
                  to={`/dashboard/course/${courseId}?lecture=${lecture._id}`}
                  className="ml-4 flex-shrink-0 flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                >
                  <PlayIcon className="h-4 w-4 mr-1" />
                  {lecture.isPreview ? "Preview" : "Play"}
                </Link>
              ) : (
                <div className="ml-4 flex-shrink-0 flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-300">
                  <LockClosedIcon className="h-4 w-4 mr-1" />
                  Locked
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-secondary-500 dark:text-secondary-400">
          No lectures available for this course yet.
        </div>
      )}
    </div>
  );
};

export default LectureList;
