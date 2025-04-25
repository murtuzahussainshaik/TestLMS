// src/components/common/ImageUploader.jsx
import { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

const ImageUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 py-10 ${
        isDragging 
          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" 
          : "border-secondary-300 dark:border-secondary-700"
      } dark:bg-secondary-900`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <PhotoIcon className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-500" />
        <div className="mt-4 flex text-sm text-secondary-600 dark:text-secondary-400">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white dark:bg-secondary-800 font-medium text-primary-600 dark:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-secondary-900 hover:text-primary-500"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-secondary-500 dark:text-secondary-400">PNG, JPG, GIF up to 5MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
