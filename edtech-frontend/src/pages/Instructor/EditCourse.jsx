// src/pages/Instructor/EditCourse.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { courseService } from "../../services/courseService";
import Loader from "../../components/common/Loader";
import ImageUploader from "../../components/common/ImageUploader";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/outline";

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Health & Fitness",
];

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Fetch course details
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseDetails(courseId),
    refetchOnWindowFocus: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Set form values when course data is loaded
  useEffect(() => {
    if (data && !isLoading) {
      const course = data.data;

      // Set form values
      reset({
        title: course.title,
        subtitle: course.subtitle || "",
        description: course.description || "",
        category: course.category,
        level: course.level,
        price: course.price,
        isPublished: course.isPublished,
      });

      // Set thumbnail preview
      if (course.thumbnail) {
        setThumbnailPreview(course.thumbnail);
      }
    }
  }, [data, isLoading, reset]);

  // Handle thumbnail upload
  const handleThumbnailUpload = (file) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Revert to original thumbnail
  const revertToOriginalThumbnail = () => {
    if (data?.data?.thumbnail) {
      setThumbnailFile(null);
      setThumbnailPreview(data.data.thumbnail);
    } else {
      removeThumbnail();
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  // Update course on form submit
  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Create form data for API request
      const apiFormData = new FormData();
      
      // Handle isPublished checkbox explicitly
      const isPublished = formData.isPublished || false;
      delete formData.isPublished;
      
      // Add all other form fields
      Object.keys(formData).forEach((key) => {
        apiFormData.append(key, formData[key]);
      });
      
      // Add isPublished as a boolean string
      apiFormData.append("isPublished", isPublished.toString());

      // Append thumbnail file if changed
      if (thumbnailFile) {
        apiFormData.append("thumbnail", thumbnailFile);
      }

      // Update course
      const response = await courseService.updateCourseDetails(courseId, apiFormData);
      
      toast.success("Course updated successfully");
      
      // Show specific message about publish status
      if (response.data.isPublished) {
        toast.success("Your course is now published and visible to students!");
      } else {
        toast.info("Your course is saved as a draft and is not visible to students.");
      }

      // Navigate back to courses list
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.data) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Failed to load course details. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const course = data.data;

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">
              Edit Course
            </h2>
            <p className="mt-1 text-sm text-secondary-500">
              Update your course details
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-6"
          >
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-secondary-700"
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`mt-1 input ${errors.title ? "border-red-300" : ""}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-secondary-700"
              >
                Course Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                {...register("subtitle")}
                className="mt-1 input"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-secondary-700"
              >
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                className={`mt-1 input ${
                  errors.description ? "border-red-300" : ""
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-secondary-700"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className={`mt-1 input ${
                  errors.category ? "border-red-300" : ""
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-secondary-700"
              >
                Level <span className="text-red-500">*</span>
              </label>
              <select
                id="level"
                {...register("level", { required: "Level is required" })}
                className={`mt-1 input ${errors.level ? "border-red-300" : ""}`}
              >
                {LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-secondary-700"
              >
                Price (INR) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={`mt-1 input ${errors.price ? "border-red-300" : ""}`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Published Status */}
            <div className="flex items-center">
              <input
                id="isPublished"
                type="checkbox"
                {...register("isPublished")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label
                htmlFor="isPublished"
                className="ml-2 block text-sm text-secondary-900"
              >
                Publish this course (make it visible to students)
              </label>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-secondary-700">
                Course Thumbnail
              </label>

              {thumbnailPreview ? (
                <div className="mt-1 relative rounded-md overflow-hidden w-full max-w-xs">
                  <img
                    src={thumbnailPreview}
                    alt="Course thumbnail preview"
                    className="object-cover h-40 w-full"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {thumbnailFile && (
                      <button
                        type="button"
                        onClick={revertToOriginalThumbnail}
                        className="p-1 bg-secondary-800 rounded-full text-white"
                        title="Revert to original"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="p-1 bg-secondary-800 rounded-full text-white"
                      title="Change thumbnail"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ImageUploader onFileSelect={handleThumbnailUpload} />
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3 border-t border-secondary-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
