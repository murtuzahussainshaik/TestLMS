import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
  const { user, isInstructor } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-red-600">
          <ShieldExclamationIcon className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          You don't have permission to access this page.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <p className="text-secondary-700 text-center">
                Your current role: <span className="font-semibold">{user?.role || "Unknown"}</span>
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              {user?.role === "student" && (
                <Link
                  to="/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Student Dashboard
                </Link>
              )}
              
              {isInstructor() && (
                <Link
                  to="/instructor"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Instructor Dashboard
                </Link>
              )}
              
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 