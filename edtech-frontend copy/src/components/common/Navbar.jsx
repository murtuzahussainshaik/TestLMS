// src/components/common/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
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

  const baseNavClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const activeNavClass = "border-primary-500 text-primary-900 dark:text-primary-300";
  const inactiveNavClass = "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700 dark:text-secondary-400 dark:hover:border-secondary-600 dark:hover:text-secondary-200";
  
  const getNavLinkClass = ({ isActive }) => 
    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`;

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm dark:shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <AcademicCapIcon className="h-8 w-auto text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-bold text-primary-900 dark:text-primary-300">
                EduTech
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" className={getNavLinkClass}>
                Home
              </NavLink>

              <NavLink to="/courses" className={getNavLinkClass}>
                Courses
              </NavLink>

              <NavLink to="/about" className={getNavLinkClass}>
                About
              </NavLink>
            </div>
          </div>

          {/* Authentication buttons & Theme Toggle */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Authentication */}
            {isAuthenticated ? (
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
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-700 ring-1 ring-black ring-opacity-5 dark:ring-secondary-600 py-1 z-10">
                    <div className="px-4 py-2 border-b dark:border-secondary-600">
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-200 dark:hover:bg-secondary-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>

                    {(user?.role === "instructor" || user?.role === "admin") && (
                      <Link
                        to="/instructor/dashboard"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-200 dark:hover:bg-secondary-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Instructor Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-200 dark:hover:bg-secondary-600"
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
                  className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & Theme Toggle */}
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-secondary-500 dark:hover:bg-secondary-700 dark:focus:ring-secondary-600"
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
        <div className="sm:hidden absolute top-16 inset-x-0 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 shadow-lg z-20">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-white' 
                  : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'}`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-white' 
                  : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'}`
              }
              onClick={closeMenu}
            >
              Courses
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-white' 
                  : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'}`
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
          </div>

          {/* Mobile authentication */}
          <div className="pt-4 pb-3 border-t border-secondary-200 dark:border-secondary-700">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-5">
                  {user?.avatar && user.avatar !== "undefined" ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-secondary-200 dark:border-secondary-600"
                      src={user.avatar}
                      alt={user.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const initials = user?.name?.charAt(0).toUpperCase() || 'U';
                        e.target.outerHTML = `<div class="h-10 w-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center"><span class="text-secondary-600 dark:text-secondary-300 font-medium text-sm">${initials}</span></div>`;
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
                      <span className="text-secondary-600 dark:text-secondary-300 font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-secondary-800 dark:text-secondary-100">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  {(user?.role === "instructor" || user?.role === "admin") && (
                    <Link
                      to="/instructor/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white"
                      onClick={closeMenu}
                    >
                      Instructor Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); closeMenu(); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium btn btn-primary"
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
