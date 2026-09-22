import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

function StudentOverview() {
  const announcements = [
    { title: 'Mid-Term Examination Schedule Released', date: 'October 12, 2026', tag: 'Academic' },
    { title: 'Guest Lecture on Sustainable IoT Systems', date: 'October 15, 2026', tag: 'Event' },
    { title: 'Fee Payment Reminder for Q3 Installment', date: 'October 20, 2026', tag: 'Finance' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Student & Parent Portal</h1>
        <p className="text-slate-400 text-sm mt-1">Track your academic progress, upcoming schedules, and fee payment status.</p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Attendance Rate</p>
          <h3 className="text-3xl font-bold text-white mb-2">94%</h3>
          <p className="text-xs text-cobalt-light font-medium">Excellent standing</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Current CGPA</p>
          <h3 className="text-3xl font-bold text-white mb-2">9.2</h3>
          <p className="text-xs text-cobalt-light font-medium">Top 5% of batch</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Fee Status</p>
          <h3 className="text-3xl font-bold text-white mb-2">Paid</h3>
          <p className="text-xs text-cobalt-light font-medium">No dues pending</p>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 lg:p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Academy Announcements</h2>
        <div className="space-y-4">
          {announcements.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-cobalt/20 text-cobalt-light rounded-md inline-block mb-1">
                  {item.tag}
                </span>
                <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentFees() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Fee Status & Receipts</h1>
        <p className="text-slate-400 text-sm mt-1">View payment history, download official fee receipts, and check installment due dates.</p>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 text-slate-300">
        <p className="font-medium">Fee payment breakdown and receipt downloader will be rendered here.</p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
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
              STUDENT<span className="text-white">PORTAL</span>
            </h2>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <Link to="/student" className="block px-4 py-3 rounded-xl bg-cobalt/20 text-cobalt-light transition">
              Overview
            </Link>
            <Link to="/student/fees" className="block px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              Fee Status
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
          <Route path="/" element={<StudentOverview />} />
          <Route path="/fees" element={<StudentFees />} />
        </Routes>
      </main>
    </div>
  );
}