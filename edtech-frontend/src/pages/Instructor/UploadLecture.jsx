// src/pages/Instructor/UploadLecture.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { courseService } from "../../services/courseService";
import Loader from "../../components/common/Loader";
import {
  CloudArrowUpIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const UploadLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // Fetch course details with lectures
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["course-with-lectures", courseId],
    queryFn: () => courseService.getCourseLectures(courseId),
    refetchOnWindowFocus: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      isPreview: false,
    },
  });

  // Handle video file selection
  const handleVideoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        toast.error("Video file size must be less than 500MB");
        return;
      }

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only MP4, WebM, and Ogg video formats are allowed");
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Remove selected video
  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  // Upload lecture
  const onSubmit = async (data) => {
    // Validate video file
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data for API request
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("isPreview", data.isPreview);
      formData.append("video", videoFile);

      // Upload lecture
      await courseService.addLectureToCourse(courseId, formData);

      toast.success("Lecture added successfully");

      // Reset form
      reset();
      setVideoFile(null);
      setVideoPreview(null);

      // Refetch lectures
      refetch();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to add lecture. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.data) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Failed to load course details. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const { lectures = [], isInstructor } = data.data;

  if (!isInstructor) {
    navigate("/instructor/courses");
    return null;
  }

  return (
    <div className="py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Add Lectures to Your Course
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Upload video lectures for your course
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload form */}
          <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-lg font-medium text-secondary-900 dark:text-white !important">
                Upload New Lecture
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Lecture title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Lecture Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${
                    errors.title ? "border-red-300 dark:border-red-500" : ""
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Lecture description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Lecture Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className="mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white"
                />
              </div>

              {/* Preview toggle */}
              <div className="flex items-center">
                <input
                  id="isPreview"
                  type="checkbox"
                  {...register("isPreview")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-700"
                />
                <label
                  htmlFor="isPreview"
                  className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300"
                >
                  Make this lecture available as a free preview
                </label>
              </div>

              {/* Video upload */}
              <div>
                <label
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Video <span className="text-red-500">*</span>
                </label>
                {videoPreview ? (
                  <div className="mt-2 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-auto rounded border border-secondary-300 dark:border-secondary-600"
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-md cursor-pointer dark:bg-secondary-700"
                    onClick={() => document.getElementById("video").click()}
                  >
                    <div className="space-y-1 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-500" />
                      <div className="flex text-sm text-secondary-600 dark:text-secondary-400">
                        <label
                          htmlFor="video"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a video file</span>
                          <input
                            id="video"
                            name="video"
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            onChange={handleVideoSelect}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        MP4, WebM, Ogg up to 500MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                  onClick={() => {
                    reset();
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Upload Lecture"}
                </button>
              </div>
            </form>
          </div>

          {/* Course lectures list */}
          <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-lg font-medium text-secondary-900 dark:text-white !important">
                Course Lectures
              </h2>
              {lectures.length > 0 && (
                <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"} uploaded
                </p>
              )}
            </div>

            <div className="px-6 py-4">
              {lectures.length > 0 ? (
                <ul className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {lectures.map((lecture, index) => (
                    <li key={lecture._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                            {lecture.title}
                          </p>
                          {lecture.description && (
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                              {lecture.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center space-x-4">
                            <div className="flex items-center text-xs text-secondary-500 dark:text-secondary-400">
                              <PlayIcon className="h-4 w-4 mr-1" />
                              {lecture.duration ? formatDuration(lecture.duration) : "N/A"}
                            </div>
                            {lecture.isPreview && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                Free Preview
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <PlayIcon className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-500" />
                  <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">
                    No lectures yet
                  </h3>
                  <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                    Add your first lecture using the form on the left
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-white">
                    Done adding lectures?
                  </h3>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/instructor/courses`)}
                    className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back to My Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLecture;
