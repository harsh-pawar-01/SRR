import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Lock, User, Briefcase, UserCheck, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Reads exact role from URL: ?role=teacher, ?role=receptionist, ?role=admin, or defaults to 'student'
  const roleFromUrl = searchParams.get('role') || (searchParams.get('type') === 'student' ? 'student' : 'student');

  const [selectedRole, setSelectedRole] = useState(roleFromUrl);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl);
    }
  }, [roleFromUrl]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'teacher') {
      const lowerUser = username.toLowerCase();
      if (lowerUser.includes('chem')) {
        navigate('/teacher/chemistry');
      } else if (lowerUser.includes('math')) {
        navigate('/teacher/mathematics');
      } else if (lowerUser.includes('bio')) {
        navigate('/teacher/biology');
      } else {
        navigate('/teacher/physics');
      }
    } else if (selectedRole === 'receptionist') {
      navigate('/receptionist');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    }
  };

  // Helper metadata based on current role
  const getRoleMeta = () => {
    switch (selectedRole) {
      case 'teacher':
        return {
          badge: 'Faculty Portal',
          title: 'Teacher Sign In',
          subtitle: 'Enter your subject faculty credentials to manage syllabus & reviews',
          placeholder: 'e.g. physics_rc, chem_sandeep, math_vijay',
          label: 'Teacher Username / ID',
          icon: Briefcase,
          buttonText: 'Sign In to Teacher Portal →'
        };
      case 'receptionist':
        return {
          badge: 'Front Office Portal',
          title: 'Receptionist Sign In',
          subtitle: 'Enter reception credentials to access admissions & attendance logs',
          placeholder: 'e.g. reception_srr or admin_desk',
          label: 'Receptionist ID',
          icon: UserCheck,
          buttonText: 'Sign In to Reception Desk →'
        };
      case 'admin':
        return {
          badge: 'Master Administration',
          title: 'Admin Sign In',
          subtitle: 'Director & administrative management access only',
          placeholder: 'e.g. admin_director or kp_sir',
          label: 'Admin Username',
          icon: Lock,
          buttonText: 'Sign In to Admin Portal →'
        };
      case 'student':
      default:
        return {
          badge: 'Student & Parent Portal',
          title: 'Student Sign In',
          subtitle: 'Enter your Roll Number or Username provided by Reception',
          placeholder: 'e.g. rohan.joshi or SRR-2026-042',
          label: 'Student Roll No / Username',
          icon: GraduationCap,
          buttonText: 'Sign In to Student Portal →'
        };
    }
  };

  const meta = getRoleMeta();
  const IconComponent = meta.icon;

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
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600">
              {meta.badge}
            </span>
          </div>
        </div>
        <div>
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Card */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
              {meta.badge}
            </span>
            <h1 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <IconComponent className="w-5 h-5 text-emerald-600" />
              {meta.title}
            </h1>
            <p className="text-xs text-slate-500">
              {meta.subtitle}
            </p>
          </div>

          {/* Direct Login Form without duplicate tab selectors */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {meta.label}
              </label>
              <input
                type="text"
                required
                placeholder={meta.placeholder}
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
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-600/20 text-sm cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {meta.buttonText}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        &copy; Shri Rajlaxmi Royal Academy of Science Vita. All rights reserved.
      </footer>
    </div>
  );
}