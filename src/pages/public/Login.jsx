import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Lock, Mail, UserCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Route to the respective dashboard based on selected role
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 px-6 lg:px-16 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
              SRR <span className="text-emerald-600">PORTAL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">VITA • LOGIN DESK</span>
          </div>
        </div>
        <div>
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Card Container */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Secure Portal Access
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Welcome Back</h1>
          <p className="text-slate-600 text-sm mt-1">Select your role and sign in to access your portal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Select Portal Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'student', label: 'Student' },
                { id: 'teacher', label: 'Teacher' },
                { id: 'receptionist', label: 'Reception' },
                { id: 'admin', label: 'Admin' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`py-2.5 px-4 text-xs font-bold rounded-xl transition cursor-pointer border ${
                    role === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label} Portal
                </button>
              ))}
            </div>
          </div>

          {/* Email / Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email ID / Username *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. user@srra.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard &rarr;
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-200">
        &copy; {new Date().getFullYear()} Shri Rajlaxmi Royal Academy of Vita. All rights reserved.
      </footer>
    </div>
  );
}