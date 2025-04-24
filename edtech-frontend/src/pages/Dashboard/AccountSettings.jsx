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
          <h1 className="text-2xl font-bold text-secondary-900">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Manage your profile information and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              Password
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-medium text-secondary-900">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-secondary-500">
                Update your personal information and profile picture
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div
                  className="h-24 w-24 rounded-full overflow-hidden cursor-pointer relative group"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-secondary-300" />
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PencilSquareIcon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <p className="mt-2 text-sm text-secondary-500">
                  Click to change profile picture
                </p>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="input pl-10"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSymbolIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="input pl-10"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-secondary-700"
                >
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="input"
                    placeholder="Tell us a little about yourself"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                  />
                </div>
                <p className="mt-1 text-xs text-secondary-500">
                  Brief description for your profile. Maximum 200 characters.
                </p>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-lg font-medium text-secondary-900">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-secondary-500">
                Update your password to keep your account secure
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-secondary-700"
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
                  className="block text-sm font-medium text-secondary-700"
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
                  className="block text-sm font-medium text-secondary-700"
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
