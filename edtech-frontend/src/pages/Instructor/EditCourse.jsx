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
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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
        <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white !important">
              Edit Course
            </h2>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
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
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${errors.title ? "border-red-300 dark:border-red-500" : ""}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Course Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                {...register("subtitle")}
                className="mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${
                  errors.description ? "border-red-300 dark:border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${
                  errors.category ? "border-red-300 dark:border-red-500" : ""
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
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Level <span className="text-red-500">*</span>
              </label>
              <select
                id="level"
                {...register("level", { required: "Level is required" })}
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${
                  errors.level ? "border-red-300 dark:border-red-500" : ""
                }`}
              >
                {LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${
                  errors.price ? "border-red-300 dark:border-red-500" : ""
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Publish status */}
            <div className="flex items-center space-x-2">
              <input
                id="isPublished"
                type="checkbox"
                {...register("isPublished")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-700"
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Publish this course (make it visible to students)
              </label>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
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
                    <button
                      type="button"
                      onClick={revertToOriginalThumbnail}
                      className="p-1 bg-secondary-800 rounded-full text-white"
                      disabled={data?.data?.thumbnail === thumbnailPreview && !thumbnailFile}
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="p-1 bg-secondary-800 rounded-full text-white"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ImageUploader onFileSelect={handleThumbnailUpload} />
              )}
              <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                Leave unchanged to keep the current thumbnail
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3 border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
