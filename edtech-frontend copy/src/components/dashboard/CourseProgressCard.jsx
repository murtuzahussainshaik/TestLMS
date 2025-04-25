// src/components/dashboard/CourseProgressCard.jsx
import { Link } from "react-router-dom";
import { PlayIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import Card from "../common/Card";

const CourseProgressCard = ({ course, progress }) => {
  // Calculate progress percentage
  const progressPercentage = progress ? Math.round(progress.completedLectures / progress.totalLectures * 100) : 0;
  
  // Button configuration based on progress
  const getButtonConfig = () => {
    if (progressPercentage === 0) {
      return {
        to: `/learning/${course._id}/lecture/${course.lectures?.[0]?._id || ''}`,
        text: "Start Learning",
        icon: <PlayIcon className="h-4 w-4 mr-1" />
      };
    } else if (progressPercentage === 100) {
      return {
        to: `/learning/${course._id}/lecture/${progress?.lastAccessedLecture || course.lectures?.[0]?._id || ''}`,
        text: "Review Course",
        icon: <ArrowPathIcon className="h-4 w-4 mr-1" />
      };
    } else {
      return {
        to: `/learning/${course._id}/lecture/${progress?.lastAccessedLecture || course.lectures?.[0]?._id || ''}`,
        text: "Continue Learning",
        icon: <PlayIcon className="h-4 w-4 mr-1" />
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Course Image */}
        <div className="w-full sm:w-1/3 h-32 sm:h-auto">
          <img 
            src={course?.thumbnail || '/images/course-placeholder.jpg'} 
            alt={course?.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Course Details */}
        <div className="w-full sm:w-2/3 p-4">
          <div className="mb-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100 dark:bg-primary-900/50 dark:text-primary-300">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-300">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100 dark:bg-primary-900/50">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 dark:bg-primary-500"
                ></div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{course?.title}</h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-3">
            Instructor: {course?.instructor?.name || 'Unknown'}
          </p>
          
          <Link 
            to={buttonConfig.to}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800"
          >
            {buttonConfig.icon}
            {buttonConfig.text}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CourseProgressCard;
