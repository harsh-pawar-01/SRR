import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Admissions from './pages/public/Admissions';
import HallOfFame from './pages/public/HallOfFame';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/halloffame" element={<HallOfFame />} />

        {/* Portal Dashboards */}
        <Route path="/student" element={<StudentDashboard />} />
        
        {/* Subject-Specific Teacher Portals */}
        <Route path="/teacher/physics" element={<TeacherDashboard fixedSubject="Physics" facultyName="Prof. R. C. Patil (RC Sir)" />} />
        <Route path="/teacher/chemistry" element={<TeacherDashboard fixedSubject="Chemistry" facultyName="Dr. Sandeep Kulkarni" />} />
        <Route path="/teacher/mathematics" element={<TeacherDashboard fixedSubject="Mathematics" facultyName="Prof. Vijay Chavan" />} />
        <Route path="/teacher/biology" element={<TeacherDashboard fixedSubject="Biology" facultyName="Dr. Anjali Deshmukh" />} />
        
        {/* Fallback route */}
        <Route path="/teacher" element={<TeacherDashboard fixedSubject="Physics" facultyName="Prof. R. C. Patil (RC Sir)" />} />
      </Routes>
    </Router>
  );
}