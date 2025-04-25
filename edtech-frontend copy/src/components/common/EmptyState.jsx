import React from "react";
import { Link } from "react-router-dom";
import { InboxIcon } from "@heroicons/react/24/outline";

const EmptyState = ({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon: Icon = InboxIcon,
  linkTo = "",
  linkText = "",
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-lg bg-white dark:bg-secondary-800 shadow">
      <Icon
        className="mx-auto h-12 w-12 text-secondary-400 dark:text-secondary-600"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
        {description}
      </p>
      {linkTo && linkText && (
        <div className="mt-6">
          <Link
            to={linkTo}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState; 