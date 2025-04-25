// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { KeyIcon } from "@heroicons/react/24/solid";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Implement forgot password functionality
      // This would normally call an API endpoint

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-secondary-50 dark:bg-secondary-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyIcon className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900 dark:text-secondary-100">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600 dark:text-secondary-400">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-secondary-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset instructions"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="flex justify-center">
                <svg
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-secondary-100">
                Check your email
              </h3>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                We've sent password reset instructions to {email}
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
