// src/components/dashboard/DashboardHeader.jsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const DashboardHeader = ({ toggleSidebar, isSidebarOpen, title = "Dashboard" }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white dark:bg-secondary-800 !important border-b border-secondary-200 dark:border-secondary-700 shadow-sm dark:shadow-md">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-secondary-500 dark:text-secondary-400" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-secondary-500 dark:text-secondary-400" />
          )}
        </button>
        <h1 className="text-xl font-semibold text-secondary-900 dark:text-white !important">{title}</h1>
      </div>

      <div className="flex items-center">
        <ThemeToggle />
        
        <div className="relative ml-3">
          <div>
            <button
              onClick={toggleProfile}
              className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800"
            >
              {user?.avatar && user.avatar !== "undefined" ? (
                <img
                  className="h-8 w-8 rounded-full object-cover border border-secondary-200 dark:border-secondary-600"
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const initials = user?.name?.charAt(0).toUpperCase() || 'U';
                    e.target.outerHTML = `<div class="h-8 w-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center"><span class="text-secondary-600 dark:text-secondary-300 font-medium text-sm">${initials}</span></div>`;
                  }}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
                  <span className="text-secondary-600 dark:text-secondary-300 font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </button>
          </div>

          {isProfileOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-800 !important ring-1 ring-black ring-opacity-5 dark:ring-secondary-700 py-1 z-10">
              <div className="px-4 py-2 border-b dark:border-secondary-700">
                <p className="text-sm font-medium text-secondary-900 dark:text-white !important truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
