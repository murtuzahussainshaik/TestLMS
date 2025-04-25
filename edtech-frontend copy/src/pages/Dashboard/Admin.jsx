// src/pages/Dashboard/Admin.jsx
import { Link } from "react-router-dom";
import {
  UsersIcon,
  AcademicCapIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  return (
    <div className="py-6">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Manage your platform and monitor overall performance
        </p>
      </div>

      {/* Quick actions */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-lg font-medium text-secondary-900 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Manage Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon
                    className="h-6 w-6 text-primary-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-secondary-900 truncate">
                    Manage Users
                  </h3>
                  <p className="mt-1 text-xs text-secondary-500">
                    View and manage user accounts
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Users
                </Link>
              </div>
            </div>
          </div>

          {/* Manage Courses */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-secondary-900 truncate">
                    Manage Courses
                  </h3>
                  <p className="mt-1 text-xs text-secondary-500">
                    Review and moderate courses
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/courses"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Courses
                </Link>
              </div>
            </div>
          </div>

          {/* Payment Reports */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCardIcon
                    className="h-6 w-6 text-yellow-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-secondary-900 truncate">
                    Payment Reports
                  </h3>
                  <p className="mt-1 text-xs text-secondary-500">
                    View transaction history
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/payments"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Reports
                </Link>
              </div>
            </div>
          </div>

          {/* Platform Settings */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon
                    className="h-6 w-6 text-purple-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-secondary-900 truncate">
                    Platform Settings
                  </h3>
                  <p className="mt-1 text-xs text-secondary-500">
                    Configure platform parameters
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/admin/settings"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-secondary-900 mb-4">
          Platform Overview
        </h2>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <p className="text-sm text-secondary-500">
              This is a placeholder for the admin dashboard. In a real
              implementation, you would see platform statistics, charts, and
              data visualization here.
            </p>
            <p className="text-sm text-secondary-500 mt-2">
              The admin dashboard functionality will need to be implemented
              based on specific requirements and backend API endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
