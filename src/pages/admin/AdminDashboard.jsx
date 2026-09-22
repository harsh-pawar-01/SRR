import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

function AdminOverview() {
  const stats = [
    { title: 'Total Students', value: '480', change: '+12% this month' },
    { title: 'Fee Collection Rate', value: '88%', change: '₹42,000 pending' },
    { title: 'Active Faculty', value: '24', change: 'All present' },
    { title: 'Pending Admissions', value: '15', change: 'Requires review' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of academy statistics, fee collections, and system health.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-xs text-cobalt-light font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 lg:p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">System Management Notice</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Automated fee ledger synchronization is active. You can manage student records, approve pending admissions from the receptionist workflow, or update batch syllabi from their respective portals.
        </p>
        <div className="flex gap-4">
          <Link to="/admin/ledgers" className="px-4 py-2.5 bg-cobalt hover:bg-cobalt-dark text-white text-sm font-medium rounded-xl transition shadow-lg shadow-cobalt/20">
            View Fee Ledgers
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminLedgers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Fee Ledgers & Payments</h1>
        <p className="text-slate-400 text-sm mt-1">Track student fee installments, pending dues, and automated receipts.</p>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 text-slate-300">
        <p className="font-medium">Fee ledger table and automated payment tracking module will be rendered here.</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
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
              ADMIN<span className="text-white">PORTAL</span>
            </h2>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <Link to="/admin" className="block px-4 py-3 rounded-xl bg-cobalt/20 text-cobalt-light transition">
              Overview
            </Link>
            <Link to="/admin/ledgers" className="block px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              Fee Ledgers
            </Link>
            <Link to="/admin" className="block px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              User Management
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
          <Route path="/" element={<AdminOverview />} />
          <Route path="/ledgers" element={<AdminLedgers />} />
        </Routes>
      </main>
    </div>
  );
}