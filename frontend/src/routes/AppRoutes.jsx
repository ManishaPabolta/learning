import { Routes, Route } from "react-router-dom";

// ================= PUBLIC =================
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Courses from "../pages/public/Courses";
import CourseDetailsPage from "../pages/public/CourseDetailsPage";

// ================= AUTH =================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// ================= ERRORS =================
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import ServerError from "../pages/errors/ServerError";

// ================= STUDENT =================
import StudentLayout from "../components/layout/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import MyCourses from "../pages/student/MyCourses";
import MyAssignments from "../pages/student/MyAssignments";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import SubmitAssignment from "../pages/student/SubmitAssignment";
import StudentProfile from "../pages/student/StudentProfile";

// ================= ADMIN =================
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";
import ManageCourses from "../pages/admin/ManageCourses";
import AdminProfile from "../pages/admin/AdminProfile";
import AddAssignment from "../pages/admin/AddAssignment";
import EditAssignment from "../pages/admin/EditAssignment";
import ManageAssignments from "../pages/admin/ManageAssignments";
import ManageUsers from "../pages/admin/ManageUsers";

// ================= GUARDS =================
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================================================
          PUBLIC AUTH ROUTES
      ================================================== */}

      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
      </Route>

      {/* ==================================================
          PUBLIC WEBSITE ROUTES
      ================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/courses"
        element={<Courses />}
      />

      <Route
        path="/courses/:id"
        element={<CourseDetailsPage />}
      />

      {/* ==================================================
          STUDENT ROUTES
      ================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>

          {/* ================= STUDENT DASHBOARD ================= */}

          <Route
            path="/student"
            element={<StudentDashboard />}
          />

          {/* ================= MY COURSES ================= */}

          <Route
            path="/student/courses"
            element={<MyCourses />}
          />

          {/* ================= ASSIGNMENTS ================= */}

          {/* Student's submitted assignments */}
          <Route
            path="/student/assignments"
            element={<MyAssignments />}
          />

          {/* Student submits an admin-created assignment */}
          <Route
            path="/student/assignments/submit"
            element={<SubmitAssignment />}
          />

          {/* Assignment / submission details */}
          <Route
            path="/student/assignments/:id"
            element={<AssignmentDetails />}
          />

          {/* ================= STUDENT PROFILE ================= */}

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />

        </Route>
      </Route>

      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>

          {/* ================= ADMIN DASHBOARD ================= */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* ================= ADMIN PROFILE ================= */}

          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />

          {/* ================= COURSES ================= */}

          {/* All courses */}
          <Route
            path="/admin/courses"
            element={<ManageCourses />}
          />

          {/* Create course */}
          <Route
            path="/admin/courses/add"
            element={<AddCourse />}
          />

          {/* Edit course */}
          <Route
            path="/admin/courses/edit/:id"
            element={<EditCourse />}
          />

          {/* ================= ASSIGNMENTS ================= */}

          {/* Manage all assignments and student submissions */}
          <Route
            path="/admin/assignments"
            element={<ManageAssignments />}
          />

          {/* Create new assignment */}
          <Route
            path="/admin/assignments/add"
            element={<AddAssignment />}
          />

          {/* Edit assignment */}
          <Route
            path="/admin/assignments/edit/:id"
            element={<EditAssignment />}
          />

          {/* ================= USERS ================= */}

          <Route
            path="/admin/users"
            element={<ManageUsers />}
          />

        </Route>
      </Route>

      {/* ==================================================
          ERROR ROUTES
      ================================================== */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="/server-error"
        element={<ServerError />}
      />

      {/* ==================================================
          404 NOT FOUND
      ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;