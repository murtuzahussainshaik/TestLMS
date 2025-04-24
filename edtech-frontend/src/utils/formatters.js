// src/utils/formatters.js
/**
 * Format time from seconds to HH:MM:SS or MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (!seconds) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format duration from seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (!seconds) return "N/A";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};

/**
 * Format price with currency
 * @param {number} amount - Price amount
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";

  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-IN", options);
};

// src/utils/validators.js
/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is email valid
 */
export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const results = {
    isValid: false,
    errors: [],
  };

  if (password.length < 8) {
    results.errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    results.errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    results.errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    results.errors.push("Password must contain at least one number");
  }

  results.isValid = results.errors.length === 0;

  return results;
};

/**
 * Check if two passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} Do passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
