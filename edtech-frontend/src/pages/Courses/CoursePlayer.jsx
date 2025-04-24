// src/pages/Courses/CoursePlayer.jsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import { progressService } from "../../services/progressService";
import Loader from "../../components/common/Loader";
import VideoPlayer from "../../components/courses/VideoPlayer";
import LectureSidebar from "../../components/courses/LectureSidebar";
import { toast } from "react-hot-toast";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeLectureId, setActiveLectureId] = useState(
    searchParams.get("lecture") || null
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [progressData, setProgressData] = useState(null);

  // Fetch course details with lectures
  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseDetails(courseId),
    refetchOnWindowFocus: false
  });

  // Fetch course lectures
  const { data: lecturesData, isLoading: isLecturesLoading } = useQuery({
    queryKey: ["course-lectures", courseId],
    queryFn: () => courseService.getCourseLectures(courseId),
    refetchOnWindowFocus: false
  });

  // Fetch course progress
  const { data: progressResponse, isLoading: isProgressLoading } = useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: () => progressService.getCourseProgress(courseId),
    refetchOnWindowFocus: false
  });

  // Set initial active lecture if not specified
  useEffect(() => {
    if (
      !isLecturesLoading &&
      lecturesData?.data?.lectures &&
      !activeLectureId
    ) {
      const firstLecture = lecturesData.data.lectures[0];
      if (firstLecture) {
        setActiveLectureId(firstLecture._id);
        navigate(`/dashboard/course/${courseId}?lecture=${firstLecture._id}`, {
          replace: true,
        });
      }
    }
  }, [isLecturesLoading, lecturesData, activeLectureId, courseId, navigate]);

  // Update progress data when response is received
  useEffect(() => {
    if (!isProgressLoading && progressResponse?.data) {
      setProgressData(progressResponse.data);
    }
  }, [isProgressLoading, progressResponse]);

  // Get active lecture data
  const getActiveLecture = () => {
    if (!lecturesData?.data?.lectures || !activeLectureId) return null;
    return lecturesData.data.lectures.find(
      (lecture) => lecture._id === activeLectureId
    );
  };

  // Handle lecture selection
  const handleLectureSelect = (lectureId) => {
    setActiveLectureId(lectureId);
    navigate(`/dashboard/course/${courseId}?lecture=${lectureId}`, {
      replace: true,
    });
  };

  // Mark lecture as completed
  const markLectureAsCompleted = async () => {
    try {
      const response = await progressService.updateLectureProgress(
        courseId,
        activeLectureId
      );
      setProgressData((prevData) => ({
        ...prevData,
        progress: response.data.lectureProgress,
        isCompleted: response.data.isCompleted,
      }));
      toast.success("Progress updated");
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  // Navigate to next lecture
  const goToNextLecture = () => {
    if (!lecturesData?.data?.lectures || !activeLectureId) return;

    const lectures = lecturesData.data.lectures;
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === activeLectureId
    );

    if (currentIndex < lectures.length - 1) {
      const nextLecture = lectures[currentIndex + 1];
      handleLectureSelect(nextLecture._id);
    }
  };

  // Navigate to previous lecture
  const goToPreviousLecture = () => {
    if (!lecturesData?.data?.lectures || !activeLectureId) return;

    const lectures = lecturesData.data.lectures;
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === activeLectureId
    );

    if (currentIndex > 0) {
      const prevLecture = lectures[currentIndex - 1];
      handleLectureSelect(prevLecture._id);
    }
  };

  // Check if lecture is completed
  const isLectureCompleted = (lectureId) => {
    if (!progressData?.progress) return false;
    return progressData.progress.some(
      (item) => item.lecture === lectureId && item.isCompleted
    );
  };

  // Loading state
  if (isCourseLoading || isLecturesLoading) {
    return <Loader />;
  }

  // Error state
  if (!courseData?.data || !lecturesData?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load course content. Please try again.
        </div>
      </div>
    );
  }

  const course = courseData.data;
  const { lectures = [] } = lecturesData.data;
  const activeLecture = getActiveLecture();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-secondary-900">
      {/* Top bar */}
      <div className="bg-secondary-800 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-4 p-2 rounded-md hover:bg-secondary-700"
            >
              <BookOpenIcon className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold truncate">{course.title}</h1>
          </div>

          <div className="flex items-center">
            {progressData && (
              <div className="hidden sm:flex items-center mr-4">
                <div className="w-32 bg-secondary-700 rounded-full h-2.5">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${progressData.completionPercentage}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-secondary-300">
                  {progressData.completionPercentage}% complete
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <LectureSidebar
            lectures={lectures}
            activeLectureId={activeLectureId}
            onSelectLecture={handleLectureSelect}
            isLectureCompleted={isLectureCompleted}
            courseTitle={course.title}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-black">
          {activeLecture ? (
            <div className="flex flex-col h-full">
              {/* Video player */}
              <div className="flex-1 flex items-center justify-center">
                <VideoPlayer
                  videoUrl={activeLecture.videoUrl}
                  onComplete={markLectureAsCompleted}
                />
              </div>

              {/* Controls */}
              <div className="bg-secondary-800 text-white p-4">
                <div className="max-w-5xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{activeLecture.title}</h2>

                    <div className="flex items-center space-x-2">
                      {isLectureCompleted(activeLectureId) ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={markLectureAsCompleted}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-secondary-300">
                      {activeLecture.description ||
                        "No description available for this lecture."}
                    </p>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={goToPreviousLecture}
                      className="inline-flex items-center px-4 py-2 border border-secondary-600 rounded-md text-sm font-medium text-white bg-secondary-700 hover:bg-secondary-600"
                      disabled={
                        lectures.findIndex((l) => l._id === activeLectureId) ===
                        0
                      }
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Previous
                    </button>

                    <button
                      onClick={goToNextLecture}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      disabled={
                        lectures.findIndex((l) => l._id === activeLectureId) ===
                        lectures.length - 1
                      }
                    >
                      Next
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <h3 className="text-xl font-medium">No lecture selected</h3>
                <p className="mt-2">
                  Select a lecture from the sidebar to start learning
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
