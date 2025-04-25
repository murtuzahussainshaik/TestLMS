// src/pages/Dashboard/AccountSettings.jsx
import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { toast } from "react-hot-toast";
import {
  UserCircleIcon,
  LockClosedIcon,
  AtSymbolIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const AccountSettings = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: null,
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar upload click
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Handle avatar file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileForm((prev) => ({
        ...prev,
        avatar: file,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Create FormData for multipart form submission (for avatar)
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      formData.append("bio", profileForm.bio);

      if (profileForm.avatar) {
        formData.append("avatar", profileForm.avatar);
      }

      const response = await authService.updateProfile(formData);

      if (response.success) {
        toast.success("Profile updated successfully");
        updateProfile(response.data);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Manage your profile information and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200 dark:border-secondary-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-600"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-600"
              }`}
            >
              Password
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-lg font-medium text-secondary-900 dark:text-white">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                Update your personal information and profile picture
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div
                  className="relative cursor-pointer group"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.name || 'User avatar'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-secondary-200 dark:border-secondary-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                      <UserCircleIcon className="w-16 h-16 text-secondary-400 dark:text-secondary-500" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PencilSquareIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <p
                  className="mt-2 text-sm text-primary-600 dark:text-primary-400 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  Change photo
                </p>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="mt-1 input dark:bg-secondary-700 dark:border-secondary-600 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Email Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 sm:text-sm">
                    <AtSymbolIcon className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border dark:border-secondary-600 dark:bg-secondary-700 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white rounded-md"
                    placeholder="Brief description of yourself"
                  />
                </div>
                <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                  Brief description for your profile. Maximum 200 characters.
                </p>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white dark:bg-secondary-800 !important shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-lg font-medium text-secondary-900 dark:text-white">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                Update your password to keep your account secure
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Current Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="input pl-10"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="input pl-10"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-xs text-secondary-500">
                  Password must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="input pl-10"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
