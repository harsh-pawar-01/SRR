import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Admissions from './pages/public/Admissions';
import HallOfFame from './pages/public/HallOfFame';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/halloffame" element={<HallOfFame />} />
      </Routes>
    </Router>
  );
}