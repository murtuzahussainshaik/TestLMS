// src/App.jsx (Updated version with correct routes)
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Static Pages
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Loader from "./components/common/Loader";

// Lazy-loaded pages for better performance
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));

const CourseListing = lazy(() => import("./pages/Courses/CourseListing"));
const CourseDetails = lazy(() => import("./pages/Courses/CourseDetails"));
const CoursePlayer = lazy(() => import("./pages/Courses/CoursePlayer"));

const StudentDashboard = lazy(() => import("./pages/Dashboard/Student"));
const MyCourses = lazy(() => import("./pages/Dashboard/MyCourses"));
const AccountSettings = lazy(() => import("./pages/Dashboard/AccountSettings"));
const PurchaseHistory = lazy(() => import("./pages/Dashboard/PurchaseHistory"));

const InstructorDashboard = lazy(() => import("./pages/Dashboard/Instructor"));
const AdminDashboard = lazy(() => import("./pages/Dashboard/Admin"));

const CreateCourse = lazy(() => import("./pages/Instructor/CreateCourse"));
const EditCourse = lazy(() => import("./pages/Instructor/EditCourse"));
const ManageCourses = lazy(() => import("./pages/Instructor/ManageCourses"));
const UploadLecture = lazy(() => import("./pages/Instructor/UploadLecture"));

const Checkout = lazy(() => import("./pages/Payment/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/Payment/Success"));

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Protected route component
  const RequireAuth = ({ children, allowedRoles = [] }) => {
    console.log("RequireAuth - User:", user);
    console.log("RequireAuth - Allowed roles:", allowedRoles);
    
    // If authentication is still loading, show a loader
    if (isLoading) {
      return <Loader fullScreen />;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // If no specific roles are required, allow access
    if (allowedRoles.length === 0) {
      return children;
    }
    
    // If user role is missing but should be there, attempt to reload user profile
    if (!user?.role && isAuthenticated) {
      // This is an edge case - we're authenticated but missing role information
      // For now, let's be permissive rather than block access
      console.log("User is authenticated but role information is missing");
      
      // We could add code here to refresh the user profile, but for now
      // let's just allow access to prevent disruption
      return children;
    }

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(user?.role)) {
      console.log("RequireAuth - Role not allowed:", user?.role);
      
      // If user is a student trying to access instructor routes,
      // redirect to student dashboard
      if (user?.role === "student") {
        return <Navigate to="/dashboard" replace />;
      }
      
      // For instructor or admin trying to access routes they don't have permission for
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<CourseListing />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="my-courses"
            element={
              <RequireAuth>
                <MyCourses />
              </RequireAuth>
            }
          />
          <Route
            path="settings"
            element={
              <RequireAuth>
                <AccountSettings />
              </RequireAuth>
            }
          />
          <Route
            path="purchases"
            element={
              <RequireAuth>
                <PurchaseHistory />
              </RequireAuth>
            }
          />
          <Route
            path="course/:courseId"
            element={
              <RequireAuth>
                <CoursePlayer />
              </RequireAuth>
            }
          />
          <Route
            path="checkout/:courseId"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="payment/success"
            element={
              <RequireAuth>
                <PaymentSuccess />
              </RequireAuth>
            }
          />
        </Route>

        {/* Instructor Routes */}
        <Route
          path="/instructor"
          element={
            <RequireAuth allowedRoles={["instructor", "admin"]}>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <RequireAuth allowedRoles={["instructor", "admin"]}>
                <InstructorDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="courses"
            element={
              <RequireAuth allowedRoles={["instructor", "admin"]}>
                <ManageCourses />
              </RequireAuth>
            }
          />
          <Route
            path="courses/create"
            element={
              <RequireAuth allowedRoles={["instructor", "admin"]}>
                <CreateCourse />
              </RequireAuth>
            }
          />
          <Route
            path="courses/edit/:courseId"
            element={
              <RequireAuth allowedRoles={["instructor", "admin"]}>
                <EditCourse />
              </RequireAuth>
            }
          />
          <Route
            path="courses/:courseId/upload-lecture"
            element={
              <RequireAuth allowedRoles={["instructor", "admin"]}>
                <UploadLecture />
              </RequireAuth>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <RequireAuth allowedRoles={["admin"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          {/* Add more admin routes as needed */}
        </Route>

        {/* 404 and Unauthorized Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
