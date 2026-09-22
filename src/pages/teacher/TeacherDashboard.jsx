import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

function TeacherOverview() {
  const batches = [
    { name: 'Advanced Engineering - Batch A', students: 45, progress: '72%', nextClass: 'Tomorrow, 10:00 AM' },
    { name: 'Smart & Sustainable Systems', students: 38, progress: '54%', nextClass: 'Thursday, 02:00 PM' },
    { name: 'Coding Bootcamp Track', students: 50, progress: '85%', nextClass: 'Friday, 11:30 AM' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Teacher Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage assigned batches, monitor syllabus completion, and track student engagement.</p>
      </div>

      {/* Batches Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {batches.map((batch, idx) => (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-cobalt/20 text-cobalt-light rounded-lg inline-block mb-3">
                Active Batch
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{batch.name}</h3>
              <p className="text-xs text-slate-400 mb-4">Enrolled Students: <span className="text-white font-medium">{batch.students}</span></p>
              
              <div className="space-y-1 mb-6">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Syllabus Progress</span>
                  <span className="text-white font-medium">{batch.progress}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div className="bg-cobalt h-full rounded-full" style={{ width: batch.progress }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>Next: {batch.nextClass}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Notice */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 lg:p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-3">Syllabus Tracker & Notes</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Keep your curriculum milestones up to date. Updating track progress here automatically reflects in the student portal view.
        </p>
        <Link to="/teacher/syllabus" className="inline-block px-4 py-2.5 bg-cobalt hover:bg-cobalt-dark text-white text-sm font-medium rounded-xl transition shadow-lg shadow-cobalt/20">
          Manage Syllabus Tracker
        </Link>
      </div>
    </div>
  );
}

function TeacherSyllabus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Syllabus & Curriculum Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Mark completed modules, upload lecture resources, and schedule assignments.</p>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 text-slate-300">
        <p className="font-medium">Detailed interactive syllabus checklist module will be rendered here.</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/90 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold tracking-wider text-cobalt-light">
              TEACHER<span className="text-white">PORTAL</span>
            </h2>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <Link to="/teacher" className="block px-4 py-3 rounded-xl bg-cobalt/20 text-cobalt-light transition">
              My Batches
            </Link>
            <Link to="/teacher/syllabus" className="block px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              Syllabus Tracker
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-xl text-sm font-medium transition text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<TeacherOverview />} />
          <Route path="/syllabus" element={<TeacherSyllabus />} />
        </Routes>
      </main>
    </div>
  );
}