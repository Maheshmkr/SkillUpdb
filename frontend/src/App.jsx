import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import MyLearning from "./pages/MyLearning";
import Profile from "./pages/Profile";
import CourseDetailBeforeEnroll from "./pages/CourseDetailBeforeEnroll";
import LearningPlayer from "./pages/LearningPlayer";
import AchievementsPage from "./pages/AchievementsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";


import Logout from "./pages/Logout";
import Cart from "./pages/Cart";
import Settings from "./pages/Settings";
import CourseDetail from "./pages/CourseDetail"; // Added for consistency check

import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorMyCourses from "./pages/instructor/MyCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import InstructorCourseWizard from "./pages/instructor/InstructorCourseWizard";
import LearnerCoursePreview from "./pages/course/LearnerCoursePreview";
import InstructorEnrollments from "./pages/instructor/Enrollments";
import CourseAnalytics from "./pages/instructor/CourseAnalytics";
import InstructorReviews from "./pages/instructor/Reviews";
import InstructorProfile from "./pages/instructor/InstructorProfile";

import AdminDashboard from "./pages/admin/Dashboard";
import CourseApprovals from "./pages/admin/CourseApprovals";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageInstructors from "./pages/admin/ManageInstructors";
import Reports from "./pages/admin/Reports";
import AuditLogs from "./pages/admin/AuditLogs";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { Navigate } from "react-router-dom";

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute><LearningPlayer /></ProtectedRoute>} />
          <Route path="/learn/:courseId/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/enrollment-success" element={<ProtectedRoute><EnrollmentSuccess /></ProtectedRoute>} />
          <Route path="/logout" element={<Logout />} />

          {/* Instructor Portal Routes */}
          <Route path="/instructor/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute><InstructorMyCourses /></ProtectedRoute>} />
          <Route path="/instructor/courses/new" element={<ProtectedRoute><InstructorCourseWizard /></ProtectedRoute>} />
          <Route path="/instructor/courses/:courseId/edit" element={<ProtectedRoute><InstructorCourseWizard /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/preview/before" element={<ProtectedRoute><CourseDetailBeforeEnroll /></ProtectedRoute>} />
          <Route path="/instructor/courses/:courseId/preview/after" element={<ProtectedRoute><LearningPlayer /></ProtectedRoute>} />
          <Route path="/instructor/enrollments" element={<ProtectedRoute><InstructorEnrollments /></ProtectedRoute>} />
          <Route path="/instructor/analytics" element={<ProtectedRoute><CourseAnalytics /></ProtectedRoute>} />
          <Route path="/instructor/reviews" element={<ProtectedRoute><InstructorReviews /></ProtectedRoute>} />
          <Route path="/instructor/profile" element={<ProtectedRoute><InstructorProfile /></ProtectedRoute>} />


          {/* Admin Portal Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/course-approvals" element={<ProtectedRoute><CourseApprovals /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/instructors" element={<ProtectedRoute><ManageInstructors /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
