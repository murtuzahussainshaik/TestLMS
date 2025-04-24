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
          <h1 className="text-2xl font-bold text-secondary-900">
            Add Lectures to Your Course
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Upload video lectures for your course
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload form */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-medium text-secondary-900">
                Upload New Lecture
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Lecture title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Lecture Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={`mt-1 input ${
                    errors.title ? "border-red-300" : ""
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Lecture description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Lecture Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className="mt-1 input"
                />
              </div>

              {/* Free preview option */}
              <div className="flex items-center">
                <input
                  id="isPreview"
                  type="checkbox"
                  {...register("isPreview")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label
                  htmlFor="isPreview"
                  className="ml-2 block text-sm text-secondary-900"
                >
                  Make this lecture available as a free preview
                </label>
              </div>

              {/* Video upload */}
              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Video <span className="text-red-500">*</span>
                </label>

                {videoPreview ? (
                  <div className="mt-1 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 p-1 bg-secondary-800 rounded-full text-white"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 border-2 border-dashed border-secondary-300 rounded-md px-6 py-8 flex justify-center">
                    <div className="text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-secondary-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer"
                        >
                          <span className="mt-2 block text-sm font-medium text-primary-600">
                            Upload a video file
                          </span>
                          <input
                            id="video-upload"
                            name="video"
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            onChange={handleVideoSelect}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-1 text-xs text-secondary-500">
                          MP4, WebM, Ogg up to 500MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/instructor/courses`)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Upload Lecture"}
                </button>
              </div>
            </form>
          </div>

          {/* Lectures list */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-medium text-secondary-900">
                Course Lectures
              </h2>
              <p className="mt-1 text-sm text-secondary-500">
                {lectures.length}{" "}
                {lectures.length === 1 ? "lecture" : "lectures"} uploaded
              </p>
            </div>

            <div className="divide-y divide-secondary-200 max-h-[500px] overflow-y-auto">
              {lectures.length > 0 ? (
                lectures.map((lecture, index) => (
                  <div key={lecture._id} className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
                          {index + 1}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-secondary-900 truncate">
                            {lecture.title}
                          </h3>
                          <span className="ml-2 flex-shrink-0 text-xs text-secondary-500">
                            {formatDuration(lecture.duration || 0)}
                          </span>
                        </div>
                        {lecture.description && (
                          <p className="mt-1 text-xs text-secondary-500 line-clamp-1">
                            {lecture.description}
                          </p>
                        )}
                        <div className="mt-1 flex items-center">
                          {lecture.isPreview && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Free Preview
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-secondary-500">
                    No lectures added yet. Upload your first lecture to get
                    started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLecture;
