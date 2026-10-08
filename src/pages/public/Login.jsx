import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Lock, User, Briefcase, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // Reads exact role from URL: ?role=teacher, ?role=receptionist, ?role=admin, or defaults to 'student'
  const roleFromUrl = searchParams.get('role') || (searchParams.get('type') === 'student' ? 'student' : 'student');

  const [selectedRole, setSelectedRole] = useState(roleFromUrl);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl);
    }
  }, [roleFromUrl]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(username, password);

      // Route by real user role returned from API
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'teacher') {
        const subject = user.subject ? user.subject.toLowerCase() : 'physics';
        navigate(`/teacher/${subject}`);
      } else if (user.role === 'reception') {
        navigate('/receptionist');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setSubmitting(false);
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
          placeholder: 'e.g. admin',
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 px-6 lg:px-16 py-4 flex items-center justify-between shadow-sm dark:shadow-slate-950/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
              SRR
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600 dark:text-emerald-400">
              {meta.badge}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Card */}
      <main className="max-w-md w-full mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 inline-block mb-1">
              {meta.badge}
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {meta.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta.subtitle}
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Direct Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {meta.label}
              </label>
              <input
                type="text"
                required
                disabled={submitting}
                placeholder={meta.placeholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Password
              </label>
              <input
                type="password"
                required
                disabled={submitting}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-600/20 text-sm cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                meta.buttonText
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
        &copy; Shri Rajlaxmi Royal Academy of Science Vita. All rights reserved.
      </footer>
    </div>
  );
}