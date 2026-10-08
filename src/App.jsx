import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Admissions from './pages/public/Admissions';
import HallOfFame from './pages/public/HallOfFame';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ReceptionDashboard from './pages/receptionist/ReceptionDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/halloffame" element={<HallOfFame />} />

          {/* Portal Dashboards with Role-Based Route Guards */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={['reception', 'admin']}>
                <ReceptionDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Subject-Specific Teacher Portals */}
          <Route
            path="/teacher/physics"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard fixedSubject="Physics" facultyName="Prof. R. C. Patil (RC Sir)" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/chemistry"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard fixedSubject="Chemistry" facultyName="Dr. Sandeep Kulkarni" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/mathematics"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard fixedSubject="Mathematics" facultyName="Prof. Vijay Chavan" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/biology"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard fixedSubject="Biology" facultyName="Dr. Anjali Deshmukh" />
              </ProtectedRoute>
            }
          />

          {/* Fallback teacher route */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard fixedSubject="Physics" facultyName="Prof. R. C. Patil (RC Sir)" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}