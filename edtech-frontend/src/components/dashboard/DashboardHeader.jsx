// src/components/dashboard/DashboardHeader.jsx
import { Link } from "react-router-dom";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";

const DashboardHeader = ({ user, openSidebar }) => {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white shadow-sm flex">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden px-4 text-secondary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={openSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Logo for mobile */}
      <div className="md:hidden flex-1 flex justify-center px-4">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="text-lg font-bold text-primary-900">
            EduTech
          </Link>
        </div>
      </div>

      {/* Header content */}
      <div className="flex-1 px-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-secondary-900">
            Dashboard
          </h1>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification button */}
          <button
            type="button"
            className="p-1 rounded-full text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown can be added here */}
          <div className="ml-3 flex items-center">
            {user?.avatar ? (
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="ml-2 text-sm font-medium text-secondary-700 hidden md:block">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
