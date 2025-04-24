// src/components/common/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <AcademicCapIcon className="h-8 w-auto text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-900">
                EduTech
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "border-primary-500 text-primary-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  isActive
                    ? "border-primary-500 text-primary-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                Courses
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "border-primary-500 text-primary-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                About
              </NavLink>
            </div>
          </div>

          {/* Authentication buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleProfile}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-secondary-400" />
                    )}
                  </button>
                </div>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-secondary-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>

                    {(user?.role === "instructor" ||
                      user?.role === "admin") && (
                      <Link
                        to="/instructor"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Instructor Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-secondary-500 hover:text-secondary-700 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
              onClick={closeMenu}
            >
              Courses
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  : "border-transparent text-secondary-500 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
          </div>

          {/* Mobile authentication */}
          <div className="pt-4 pb-3 border-t border-secondary-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  {user?.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-secondary-400" />
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-secondary-800">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium text-secondary-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>

                  {(user?.role === "instructor" || user?.role === "admin") && (
                    <Link
                      to="/instructor"
                      className="block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100"
                      onClick={closeMenu}
                    >
                      Instructor Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  to="/login"
                  className="block text-center py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100 rounded-md"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full py-2 text-base font-medium text-center text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
