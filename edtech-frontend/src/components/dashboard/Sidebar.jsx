// src/components/dashboard/Sidebar.jsx
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // Define navigation based on user role
  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "My Courses", href: "/dashboard/my-courses", icon: BookOpenIcon },
      {
        name: "Account Settings",
        href: "/dashboard/settings",
        icon: Cog6ToothIcon,
      },
      {
        name: "Purchase History",
        href: "/dashboard/purchases",
        icon: BanknotesIcon,
      },
    ];

    // Add instructor/admin specific navigation
    if (user?.role === "instructor" || user?.role === "admin") {
      baseNavigation.push(
        {
          name: "Instructor Dashboard",
          href: "/instructor",
          icon: AcademicCapIcon,
        },
        {
          name: "Manage Courses",
          href: "/instructor/courses",
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "Create Course",
          href: "/instructor/courses/create",
          icon: BookOpenIcon,
        }
      );
    }

    // Add admin specific navigation
    if (user?.role === "admin") {
      baseNavigation.push(
        { name: "Admin Dashboard", href: "/admin", icon: HomeIcon },
        { name: "Manage Users", href: "/admin/users", icon: UsersIcon }
      );
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary-600 bg-opacity-75 dark:bg-secondary-900 dark:bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative max-w-xs w-full bg-white dark:bg-secondary-800 pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex-shrink-0 px-4 flex items-center">
                  <AcademicCapIcon className="h-8 w-auto text-primary-600" />
                  <span className="ml-2 text-xl font-bold text-primary-900 dark:text-primary-100">
                    EduTech
                  </span>
                </div>

                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`
                          ${
                            pathname === item.href
                              ? "bg-primary-100 text-primary-900 dark:bg-primary-900/10 dark:text-primary-100"
                              : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-100"
                          }
                          group flex items-center px-2 py-2 text-sm font-medium rounded-md
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon
                          className={`
                            ${
                              pathname === item.href
                                ? "text-primary-500 dark:text-primary-400"
                                : "text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300"
                            }
                            mr-3 flex-shrink-0 h-6 w-6
                          `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      className="w-full text-left text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    >
                      <ArrowLeftOnRectangleIcon
                        className="text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300 mr-3 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 flex flex-col">
          <div className="border-r border-secondary-200 dark:border-secondary-700 pt-5 pb-4 flex flex-col h-full bg-white dark:bg-secondary-800 overflow-y-auto">
            <div className="flex-shrink-0 px-4 flex items-center">
              <AcademicCapIcon className="h-8 w-auto text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-900 dark:text-primary-100">
                EduTech
              </span>
            </div>

            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      ${
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/")
                          ? "bg-primary-100 text-primary-900 dark:bg-primary-900/10 dark:text-primary-100"
                          : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-100"
                      }
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    `}
                  >
                    <item.icon
                      className={`
                        ${
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300"
                        }
                        mr-3 flex-shrink-0 h-6 w-6
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="px-4 mt-auto pb-4">
                <button
                  onClick={logout}
                  className="w-full text-left text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-secondary-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <ArrowLeftOnRectangleIcon
                    className="text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300 mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
