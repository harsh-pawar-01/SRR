import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Lock, User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Route based on selected role
    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'teacher') {
      // Automatically detect subject teacher based on username keywords
      const lowerUser = username.toLowerCase();
      if (lowerUser.includes('chem')) {
        navigate('/teacher/chemistry');
      } else if (lowerUser.includes('math')) {
        navigate('/teacher/mathematics');
      } else if (lowerUser.includes('bio')) {
        navigate('/teacher/biology');
      } else if (lowerUser.includes('phy') || lowerUser.includes('rc')) {
        navigate('/teacher/physics');
      } else {
        navigate('/teacher/physics'); // Default fallback
      }
    } else if (selectedRole === 'receptionist') {
      navigate('/receptionist');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    }
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
              SRR
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600">JEE • NEET • CET</span>
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

      {/* Login Form Container */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Portal Login</h1>
            <p className="text-xs text-slate-500">Select your role and enter credentials to access your portal</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2 rounded-xl transition cursor-pointer ${selectedRole === 'student' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`py-2 rounded-xl transition cursor-pointer ${selectedRole === 'teacher' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('receptionist')}
              className={`py-2 rounded-xl transition cursor-pointer ${selectedRole === 'receptionist' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Receptionist
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 rounded-xl transition cursor-pointer ${selectedRole === 'admin' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Username / ID
              </label>
              <input
                type="text"
                required
                placeholder={selectedRole === 'teacher' ? "e.g. physics_rc, chem_sandeep, math_vijay, bio_anjali" : "e.g. student_srr"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Password
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
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-600/20 text-sm cursor-pointer mt-2"
            >
              Login to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal &rarr;
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        &copy; Shri Rajlaxmi Royal Academy Vita. Secure Portal Access.
      </footer>
    </div>
  );
}