import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "../common/ImageUploader";
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

const CourseForm = ({ 
  initialData = null, 
  onSubmit, 
  isSubmitting = false,
  submitButtonText = "Create Course"
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      level: initialData?.level || "beginner",
      price: initialData?.price || "",
    },
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || null);

  const handleThumbnailUpload = (file) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleFormSubmit = async (data) => {
    if (!thumbnailFile && !initialData?.thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Course Thumbnail <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          {thumbnailPreview ? (
            <div className="relative w-48 h-32">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <ImageUploader onFileSelect={handleThumbnailUpload} />
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className={`mt-1 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700 ${
            errors.title ? "border-red-300 dark:border-red-700" : ""
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Course Subtitle
        </label>
        <input
          id="subtitle"
          type="text"
          {...register("subtitle")}
          className="mt-1 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Course Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description", { required: "Description is required" })}
          className={`mt-1 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700 ${
            errors.description ? "border-red-300 dark:border-red-700" : ""
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
        <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register("category", { required: "Category is required" })}
          className={`mt-1 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700 ${
            errors.category ? "border-red-300 dark:border-red-700" : ""
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
        <label htmlFor="level" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Level <span className="text-red-500">*</span>
        </label>
        <select
          id="level"
          {...register("level", { required: "Level is required" })}
          className="mt-1 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700"
        >
          {LEVELS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-500 dark:text-secondary-400 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className={`pl-7 input dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700 ${
              errors.price ? "border-red-300 dark:border-red-700" : ""
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default CourseForm; 