import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  HomeIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ReceiptRefundIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <NavLink to="/" className="flex items-center">
          <AcademicCapIcon className="h-8 w-auto text-primary-600" />
          <span className="ml-2 text-xl font-bold text-primary-900">
            EduTech
          </span>
        </NavLink>
      </div>

      <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto">
        {/* Common Links */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
              : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
          }
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/my-courses"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
              : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
          }
        >
          <BookOpenIcon className="h-5 w-5 mr-3" />
          My Courses
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
              : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
          }
        >
          <Cog6ToothIcon className="h-5 w-5 mr-3" />
          Account Settings
        </NavLink>
        <NavLink
          to="/dashboard/purchase-history"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
              : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
          }
        >
          <ReceiptRefundIcon className="h-5 w-5 mr-3" />
          Purchase History
        </NavLink>

        {/* Separator */}
        <hr className="my-4 border-secondary-200" />

        {/* Instructor Links */}
        {(user?.role === "instructor" || user?.role === "admin") && (
          <>
            <NavLink
              to="/instructor/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
                  : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
              }
            >
              <AcademicCapIcon className="h-5 w-5 mr-3" />
              Instructor Dashboard
            </NavLink>
            <NavLink
              to="/instructor/courses"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
                  : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
              }
            >
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              Manage Courses
            </NavLink>
            <NavLink
              to="/instructor/courses/create"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2.5 rounded-lg bg-primary-100 text-primary-700"
                  : "flex items-center px-4 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
              }
            >
              <PencilSquareIcon className="h-5 w-5 mr-3" />
              Create Course
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 mt-auto border-t">
        <button
          onClick={logout}
          className="flex items-center px-4 py-2.5 rounded-lg w-full text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 