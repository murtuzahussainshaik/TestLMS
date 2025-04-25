// src/pages/Instructor/CreateCourse.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { courseService } from "../../services/courseService";
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

const CreateCourse = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      level: "beginner",
      price: "",
    },
  });

  // Handle thumbnail upload
  const handleThumbnailUpload = (file) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  // Create course on form submit
  const onSubmit = async (data) => {
    // Validate thumbnail
    if (!thumbnailFile) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create form data for API request
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append thumbnail file
      formData.append("thumbnail", thumbnailFile);

      // Create course
      const response = await courseService.createCourse(formData);

      toast.success("Course created successfully");

      // Navigate to edit page for adding lectures
      navigate(`/instructor/courses/${response.data._id}/upload-lecture`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg">
          <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white !important">
              Create New Course
            </h2>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              Fill in the details to create your new course
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
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${errors.level ? "border-red-300 dark:border-red-500" : ""}`}
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
                className={`mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white ${errors.price ? "border-red-300 dark:border-red-500" : ""}`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Course Thumbnail <span className="text-red-500">*</span>
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
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
