import { Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC WEBSITE
// =====================================================

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Courses from "../pages/public/Courses";
import CourseDetailsPage from "../pages/public/CourseDetailsPage";
import PublicProject from "../pages/public/PublicProject";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =====================================================
// ERROR
// =====================================================

import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";
import ServerError from "../pages/errors/ServerError";

// =====================================================
// LAYOUTS
// =====================================================

import StudentLayout from "../components/layout/StudentLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectLayout from "../components/layout/ProjectLayout";

// =====================================================
// STUDENT
// =====================================================

import StudentDashboard from "../pages/student/StudentDashboard";
import MyCourses from "../pages/student/MyCourses";
import MyAssignments from "../pages/student/MyAssignments";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import SubmitAssignment from "../pages/student/SubmitAssignment";
import StudentProfile from "../pages/student/StudentProfile";

// =====================================================
// STUDENT AI
// =====================================================

import AIChatbot from "../pages/student/AIChatbot";
import AIRecommendations from "../pages/student/AIRecommendations";
import AISearch from "../pages/student/AISearch";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";
import ManageCourses from "../pages/admin/ManageCourses";
import AdminProfile from "../pages/admin/AdminProfile";

import AddAssignment from "../pages/admin/AddAssignment";
import EditAssignment from "../pages/admin/EditAssignment";
import ManageAssignments from "../pages/admin/ManageAssignments";

import ManageUsers from "../pages/admin/ManageUsers";

// =====================================================
// ADMIN AI
// =====================================================

import AIContentGenerator from "../pages/admin/AIContentGenerator";
import AIAssignmentGenerator from "../pages/admin/AIAssignmentGenerator";
import AIFeedbackReview from "../pages/admin/AIFeedbackReview";

// =====================================================
// PROJECTS
// =====================================================

import Projects from "../pages/projects/Projects";
import CreateProject from "../pages/projects/CreateProject";
import ProjectDetails from "../pages/projects/ProjectDetails";
import EditProject from "../pages/projects/EditProject";
import ProjectMembersPage from "../pages/projects/ProjectMembersPage";

// =====================================================
// NOTES
// =====================================================

import ProjectNotes from "../pages/notes/ProjectNotes";
import CreateNote from "../pages/notes/CreateNote";
import EditNote from "../pages/notes/EditNote";

// =====================================================
// FILES
// =====================================================

import ProjectFiles from "../pages/files/ProjectFiles";

// =====================================================
// ANALYTICS
// =====================================================

import ProjectAnalytics from "../pages/analytics/ProjectAnalytics";

// =====================================================
// NOTIFICATIONS
// =====================================================

import Notifications from "../pages/notifications/Notifications";

// =====================================================
// ROUTE GUARDS
// =====================================================

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC AUTH ROUTES
      ===================================================== */}

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

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}

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

      {/* =====================================================
          PUBLIC PROJECT
      ===================================================== */}

      <Route
        path="/public/project/:slug"
        element={<PublicProject />}
      />

      {/* =====================================================
          AUTHENTICATED ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        {/* ===================================================
            NOTIFICATIONS
            STUDENT + ADMIN
        =================================================== */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* ===================================================
            STUDENT ONLY ROUTES
        =================================================== */}

        <Route element={<StudentLayout />}>
          {/* DASHBOARD */}

          <Route
            path="/student"
            element={<StudentDashboard />}
          />

          {/* COURSES */}

          <Route
            path="/student/courses"
            element={<MyCourses />}
          />

          {/* ASSIGNMENTS */}

          <Route
            path="/student/assignments"
            element={<MyAssignments />}
          />

          <Route
            path="/student/assignments/submit"
            element={<SubmitAssignment />}
          />

          <Route
            path="/student/assignments/:id"
            element={<AssignmentDetails />}
          />

          {/* PROFILE */}

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />

          {/* AI */}

          <Route
            path="/student/ai-chatbot"
            element={<AIChatbot />}
          />

          <Route
            path="/student/ai-recommendations"
            element={<AIRecommendations />}
          />

          <Route
            path="/student/ai-search"
            element={<AISearch />}
          />
        </Route>

        {/* ===================================================
            PROJECTS
            STUDENT + ADMIN BOTH CAN ACCESS
        =================================================== */}

        <Route element={<ProjectLayout />}>
          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/create"
            element={<CreateProject />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/projects/:id/edit"
            element={<EditProject />}
          />

          <Route
            path="/projects/:id/members"
            element={<ProjectMembersPage />}
          />

          <Route
            path="/projects/:projectId/notes"
            element={<ProjectNotes />}
          />

          <Route
            path="/projects/:projectId/notes/create"
            element={<CreateNote />}
          />

          <Route
            path="/notes/:id/edit"
            element={<EditNote />}
          />

          <Route
            path="/projects/:projectId/files"
            element={<ProjectFiles />}
          />

          <Route
            path="/projects/:projectId/analytics"
            element={<ProjectAnalytics />}
          />
        </Route>

        {/* ===================================================
            ADMIN ONLY
        =================================================== */}

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout role="admin" />}>
            {/* DASHBOARD */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* PROFILE */}

            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />

            {/* COURSES */}

            <Route
              path="/admin/courses"
              element={<ManageCourses />}
            />

            <Route
              path="/admin/courses/add"
              element={<AddCourse />}
            />

            <Route
              path="/admin/courses/edit/:id"
              element={<EditCourse />}
            />

            {/* ASSIGNMENTS */}

            <Route
              path="/admin/assignments"
              element={<ManageAssignments />}
            />

            <Route
              path="/admin/assignments/add"
              element={<AddAssignment />}
            />

            <Route
              path="/admin/assignments/edit/:id"
              element={<EditAssignment />}
            />

            {/* USERS */}

            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />

            {/* AI */}

            <Route
              path="/admin/ai-content-generator"
              element={<AIContentGenerator />}
            />

            <Route
              path="/admin/ai-assignment-generator"
              element={<AIAssignmentGenerator />}
            />

            <Route
              path="/admin/ai-feedback"
              element={<AIFeedbackReview />}
            />
          </Route>
        </Route>
      </Route>

      {/* =====================================================
          ERROR
      ===================================================== */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="/server-error"
        element={<ServerError />}
      />

      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;