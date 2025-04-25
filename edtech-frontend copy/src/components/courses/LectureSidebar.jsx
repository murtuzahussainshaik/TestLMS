// src/components/courses/LectureSidebar.jsx
import { useState } from "react";
import {
  CheckCircleIcon,
  LockClosedIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const LectureSidebar = ({
  lectures,
  activeLectureId,
  onSelectLecture,
  isLectureCompleted,
  courseTitle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate total duration
  const totalDuration = lectures.reduce(
    (total, lecture) => total + (lecture.duration || 0),
    0
  );

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format total duration to hours and minutes
  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }

    return `${minutes} min`;
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-secondary-800 text-white flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 text-secondary-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto">
          {lectures.map((lecture, index) => (
            <button
              key={lecture._id}
              onClick={() => onSelectLecture(lecture._id)}
              className={`w-full p-4 text-left border-l-4 ${
                lecture._id === activeLectureId
                  ? "border-primary-500 bg-secondary-700"
                  : isLectureCompleted(lecture._id)
                  ? "border-green-500 bg-secondary-900"
                  : "border-transparent hover:bg-secondary-700"
              }`}
            >
              <span className="inline-block text-center w-6 h-6">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-secondary-800 text-white flex flex-col border-r border-secondary-700">
      <div className="flex justify-between items-center p-4 border-b border-secondary-700">
        <h2 className="font-semibold text-lg truncate">{courseTitle}</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-secondary-400 hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 border-b border-secondary-700">
        <div className="text-sm text-secondary-400">
          {lectures.length} lectures • {formatTotalDuration(totalDuration)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {lectures.map((lecture, index) => (
          <button
            key={lecture._id}
            onClick={() => onSelectLecture(lecture._id)}
            className={`w-full p-4 text-left border-l-4 ${
              lecture._id === activeLectureId
                ? "border-primary-500 bg-secondary-700"
                : isLectureCompleted(lecture._id)
                ? "border-green-500 bg-secondary-900"
                : "border-transparent hover:bg-secondary-700"
            }`}
          >
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                {isLectureCompleted(lecture._id) ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : lecture._id === activeLectureId ? (
                  <PlayIcon className="h-5 w-5 text-primary-500" />
                ) : (
                  <span className="inline-block text-center w-5 h-5 text-secondary-400">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {lecture.title}
                </span>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-secondary-400">
                    {formatDuration(lecture.duration || 0)}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LectureSidebar;
