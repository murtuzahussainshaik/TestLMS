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
        const token = Cookies.get("token");

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

  // Register a new user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authService.register(userData);

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
      Cookies.remove("token");
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

      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
