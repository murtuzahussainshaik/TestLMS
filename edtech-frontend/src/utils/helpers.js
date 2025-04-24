// src/utils/helpers.js
/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename?.split(".")?.pop()?.toLowerCase() || "";
};

/**
 * Check if file is an image
 * @param {string} filename - File name
 * @returns {boolean} Is file an image
 */
export const isImageFile = (filename) => {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext);
};

/**
 * Check if file is a video
 * @param {string} filename - File name
 * @returns {boolean} Is file a video
 */
export const isVideoFile = (filename) => {
  const ext = getFileExtension(filename);
  return ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext);
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

/**
 * Generate random avatar based on initials
 * @param {string} name - User name
 * @returns {string} Placeholder avatar URL
 */
export const getInitialsAvatar = (name) => {
  if (!name) return "";

  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Placeholder API for generating avatar
  return `https://ui-avatars.com/api/?name=${initials}&background=6366F1&color=fff&size=128`;
};
