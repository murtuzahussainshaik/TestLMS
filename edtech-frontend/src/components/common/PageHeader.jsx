import React from "react";

const PageHeader = ({ 
  title, 
  subtitle = "", 
  children = null 
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

export default PageHeader; 