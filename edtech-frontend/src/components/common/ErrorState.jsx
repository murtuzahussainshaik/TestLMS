import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ErrorState = ({ 
  message = "Something went wrong. Please try again later.",
  onRetry = null,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-lg bg-white dark:bg-secondary-800 shadow">
      <ExclamationCircleIcon
        className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">
        Error
      </h3>
      <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorState; 