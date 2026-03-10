import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./components/layout/AdminLayout";
import TeacherLayout from "./components/layout/TeacherLayout";
import StudentLayout from "./components/layout/StudentLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/users";
import AdminClasses from "./pages/admin/classes";
import AdminClassDetail from "./pages/admin/classes/detail";
import AdminRooms from "./pages/admin/rooms";
import AdminSubjects from "./pages/admin/subjects";
import AdminSchedule from "./pages/admin/schedule";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

const Placeholder = ({ name }) => (
  <div style={{ padding: 28, color: "var(--color-text2)", fontSize: 13 }}>
    📄 {name} — en cours...
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="classes/:id" element={<AdminClassDetail />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="schedule" element={<AdminSchedule />} />
      </Route>

      {/* ── Teacher ── */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={<Placeholder name="Vue Enseignant" />}
        />
      </Route>

      {/* ── Student ── */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Placeholder name="Vue Étudiant" />} />
      </Route>

      {/* Dans les routes teacher : */}
      <Route path="dashboard" element={<TeacherDashboard />} />

      {/* Dans les routes student : */}
      <Route path="dashboard" element={<StudentDashboard />} />

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
