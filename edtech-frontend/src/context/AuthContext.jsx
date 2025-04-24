// src/context/AuthContext.jsx (Updated import)
import { createContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";
import Cookies from "js-cookie";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Action types
const AUTH_START = "AUTH_START";
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_FAILURE = "AUTH_FAILURE";
const AUTH_LOGOUT = "AUTH_LOGOUT";
const AUTH_RESET = "AUTH_RESET";

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case AUTH_RESET:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: AUTH_START });
        
        // Try to get token from cookies or localStorage
        const tokenFromCookie = Cookies.get("token");
        const tokenFromStorage = localStorage.getItem("auth_token");
        const token = tokenFromCookie || tokenFromStorage;
        
        // If a token was found in localStorage but not in cookies, set it in cookies too
        if (!tokenFromCookie && tokenFromStorage) {
          setAuthToken(tokenFromStorage);
        }

        if (!token) {
          dispatch({ type: AUTH_LOGOUT });
          return;
        }

        const { data } = await authService.getCurrentUser();

        if (data) {
          dispatch({
            type: AUTH_SUCCESS,
            payload: data,
          });
        } else {
          dispatch({ type: AUTH_LOGOUT });
        }
      } catch (error) {
        console.error("Auth status check error:", error);
        dispatch({
          type: AUTH_FAILURE,
          payload: error.response?.data?.message || "Authentication failed",
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Helper function to set tokens with proper cookie options
  const setAuthToken = (token) => {
    if (token) {
      // Set token with proper options to ensure it persists
      Cookies.set("token", token, {
        expires: 7, // Expires in 7 days
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
      });
      
      // Also store in localStorage as a fallback
      localStorage.setItem("auth_token", token);
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.register(userData);
      
      // Store the token properly
      if (response.token) {
        setAuthToken(response.token);
      }
      
      // Fetch complete user profile after registration
      try {
        const userProfile = await authService.getCurrentUser();
        if (userProfile && userProfile.data) {
          console.log("User profile after registration:", userProfile.data);
          dispatch({
            type: AUTH_SUCCESS,
            payload: userProfile.data,
          });
          return { ...response, user: userProfile.data };
        }
      } catch (profileError) {
        console.error("Error fetching user profile after registration:", profileError);
      }

      // Fallback to using the response user data
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.user,
      });

      return response;
    } catch (error) {
      console.error("Register error:", error);
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || "Registration failed",
      });
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.login(credentials);
      
      // Store the token properly
      if (response.token) {
        setAuthToken(response.token);
      }
      
      // Fetch complete user profile after login if not already provided
      if (typeof response.user === 'string' || !response.user?.role) {
        try {
          const userProfile = await authService.getCurrentUser();
          if (userProfile && userProfile.data) {
            console.log("User profile after login:", userProfile.data);
            dispatch({
              type: AUTH_SUCCESS,
              payload: userProfile.data,
            });
            return { ...response, user: userProfile.data };
          }
        } catch (profileError) {
          console.error("Error fetching user profile after login:", profileError);
        }
      }

      // Use the response user data if available
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.user,
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
      // Remove both cookie and localStorage
      Cookies.remove("token", { path: "/" });
      localStorage.removeItem("auth_token");
      dispatch({ type: AUTH_LOGOUT });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.updateProfile(formData);
      
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Ensure we have the complete user data
      const userData = {
        ...response.data,
        avatar: response.data.avatar || state.user?.avatar,
      };

      dispatch({
        type: AUTH_SUCCESS,
        payload: userData,
      });

      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || "Profile update failed",
      });
      throw error;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.changePassword(passwordData);

      // Reset error state but keep user data
      dispatch({ type: AUTH_RESET });

      return response;
    } catch (error) {
      console.error("Change password error:", error);
      dispatch({
        type: AUTH_FAILURE,
        payload: error.response?.data?.message || "Password change failed",
      });
      throw error;
    }
  };

  // Check if user has instructor role
  const isInstructor = () => {
    return state.user?.role === "instructor";
  };

  // Check if user has admin role
  const isAdmin = () => {
    return state.user?.role === "admin";
  };

  // Utility function to refresh user profile when needed
  const refreshUserProfile = async () => {
    try {
      dispatch({ type: AUTH_START });
      const { data } = await authService.getCurrentUser();
      
      if (data) {
        dispatch({
          type: AUTH_SUCCESS,
          payload: data,
        });
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        isInstructor,
        isAdmin,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
