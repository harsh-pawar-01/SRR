import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

function ReceptionOverview() {
  const recentInquiries = [
    { name: 'Aarav Deshmukh', track: 'Advanced Engineering', date: 'Today, 02:30 PM', status: 'Pending Review' },
    { name: 'Priya Kulkarni', track: 'Coding Bootcamp', date: 'Today, 11:15 AM', status: 'Document Verified' },
    { name: 'Rohan Joshi', track: 'Smart & Sustainable Systems', date: 'Yesterday', status: 'Enrolled' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Receptionist Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage walk-in visitors, student admission applications, and initial fee processing.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Today's Inquiries</p>
          <h3 className="text-3xl font-bold text-white mb-2">12</h3>
          <p className="text-xs text-cobalt-light font-medium">4 walk-ins pending</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Applications Processed</p>
          <h3 className="text-3xl font-bold text-white mb-2">8</h3>
          <p className="text-xs text-cobalt-light font-medium">Ready for admin signoff</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Fee Vouchers Issued</p>
          <h3 className="text-3xl font-bold text-white mb-2">₹1.4L</h3>
          <p className="text-xs text-cobalt-light font-medium">Collected today</p>
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recent Admission Inquiries</h2>
          <Link to="/receptionist/admissions" className="text-xs text-cobalt-light font-medium hover:underline">View All &rarr;</Link>
        </div>
        <div className="space-y-4">
          {recentInquiries.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/60 rounded-xl">
              <div>
                <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.track} • {item.date}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-cobalt/20 text-cobalt-light rounded-lg font-medium">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReceptionWorkflow() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admission Workflow</h1>
        <p className="text-slate-400 text-sm mt-1">Process new student registrations, verify documents, and assign batches.</p>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 text-slate-300">
        <p className="font-medium">Step-by-step admission processing interface will be rendered here.</p>
      </div>
    </div>
  );
}

export default function ReceptionDashboard() {
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
              RECEPTION<span className="text-white">PORTAL</span>
            </h2>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <Link to="/receptionist" className="block px-4 py-3 rounded-xl bg-cobalt/20 text-cobalt-light transition">
              Overview & Inquiries
            </Link>
            <Link to="/receptionist/admissions" className="block px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              Admission Workflow
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
          <Route path="/" element={<ReceptionOverview />} />
          <Route path="/admissions" element={<ReceptionWorkflow />} />
        </Routes>
      </main>
    </div>
  );
}