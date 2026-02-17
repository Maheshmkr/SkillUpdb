import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import MyLearning from "./pages/MyLearning";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import LearningInterface from "./pages/LearningInterface";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import NotFound from "./pages/NotFound";

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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/learning/:courseId" element={<LearningInterface />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/enrollment-success" element={<EnrollmentSuccess />} />

          {/* Instructor Portal Routes */}
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorMyCourses />} />
          <Route path="/instructor/courses/new" element={<InstructorCourseWizard />} />
          <Route path="/instructor/courses/:courseId/edit" element={<InstructorCourseWizard />} />
          <Route path="/instructor/courses/preview" element={<LearnerCoursePreview />} />
          {/* Legacy Create Route - keeping for reference if needed */}
          {/* <Route path="/instructor/courses/create" element={<CreateCourse />} /> */}
          <Route path="/instructor/enrollments" element={<InstructorEnrollments />} />
          <Route path="/instructor/analytics" element={<CourseAnalytics />} />
          <Route path="/instructor/reviews" element={<InstructorReviews />} />
          <Route path="/instructor/profile" element={<InstructorProfile />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/course-approvals" element={<CourseApprovals />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/instructors" element={<ManageInstructors />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
