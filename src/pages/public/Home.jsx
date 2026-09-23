import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, GraduationCap, CheckCircle2, 
  Phone, MapPin, Clock, Calendar, 
  UserCheck, Briefcase, Lock
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const logoMenuRef = useRef(null);

  // Close popup menu when clicking outside the logo
  useEffect(() => {
    function handleClickOutside(event) {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target)) {
        setIsStaffMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tracks = [
    {
      title: '11th & 12th Integrated: JEE (Main + Adv)',
      desc: 'Deep analytical problem solving in Physics, Chemistry & Advanced Mathematics.',
      stats: 'Complete NCERT • Advanced Reference Sheets • Weekly Computer Based Tests (CBT)',
      target: 'Target: IITs, NITs, BITS, IIITs',
      tag: 'Engineering Target',
    },
    {
      title: '11th & 12th Medical: NEET-UG Target',
      desc: 'Line-by-line NCERT encoding in Biology, rigorous numerical workshops in Physics.',
      stats: '360/360 Target Biology NCERT Maps • Speed & Accuracy OMR Testing Drills',
      target: 'Target: AIIMS, GMC, KEM, Grant Medical',
      tag: 'Medical Target',
    },
    {
      title: 'Maharashtra Board - MHT-CET (PCM & PCB)',
      desc: 'Synchronized Maharashtra State Board syllabus coverage combined with entrance tricks.',
      stats: 'Complete HSC Textbooks & Exemplars • Chapter-wise Past 15-Year CET Solutions',
      target: 'Target: COEP, VJTI, SPIT, Govt Pharmacy',
      tag: 'State Board & CET',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-600 text-white text-xs py-2 px-6 lg:px-16 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-100" />
          <span>Admissions Open for 11th & 12th Integrated Batches (2026–27)</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Counseling Desk: +91 98220 12345</span>
          <span className="hidden sm:inline">Vita & Sangli District</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Left Side: Clickable Green Logo Icon that opens the 3 Staff Logins */}
        <div className="flex items-center gap-3 relative" ref={logoMenuRef}>
          {/* LOGO ICON TRIGGER */}
          <button
            onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl text-white shadow-md shadow-emerald-500/20 cursor-pointer transition flex items-center justify-center group"
            title="Click logo for Staff Portals (Teacher, Receptionist, Admin)"
          >
            <GraduationCap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
          </button>

          {/* Logo Title (Navigates to Home) */}
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
              SRR
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600">
              JEE • NEET • CET
            </span>
          </Link>

          {/* POPUP MENU: Opens when the Green Logo is clicked */}
          {isStaffMenuOpen && (
            <div className="absolute top-14 left-0 w-60 bg-white border border-emerald-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Staff Portals
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Authorized
                </span>
              </div>
              
              {/* Option 1: Teachers Login */}
              <button
                onClick={() => { setIsStaffMenuOpen(false); navigate('/login?type=staff&role=teacher'); }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition cursor-pointer"
              >
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Teachers Login</p>
                  <p className="text-[10px] text-slate-400 font-normal">Syllabus & Student Reviews</p>
                </div>
              </button>

              {/* Option 2: Receptionist Login */}
              <button
                onClick={() => { setIsStaffMenuOpen(false); navigate('/login?type=staff&role=receptionist'); }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition cursor-pointer"
              >
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Receptionist Login</p>
                  <p className="text-[10px] text-slate-400 font-normal">Admissions & Attendance</p>
                </div>
              </button>

              {/* Option 3: Admin Login */}
              <button
                onClick={() => { setIsStaffMenuOpen(false); navigate('/login?type=staff&role=admin'); }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition cursor-pointer border-t border-slate-50"
              >
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Admin Login</p>
                  <p className="text-[10px] text-slate-400 font-normal">Director & Full Management</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <a href="#about" className="hover:text-emerald-600 transition">About Academy</a>
          <a href="#courses" className="hover:text-emerald-600 transition">Courses (11th/12th)</a>
          <Link to="/halloffame" className="hover:text-emerald-600 transition flex items-center gap-1.5">
            <span className="text-emerald-600">🏆</span> Hall of Fame
          </Link>
          <Link to="/admissions" className="hover:text-emerald-600 transition">Contact & Admissions</Link>
        </div>

        {/* Right Side: Student Login (Opens ONLY the student portal) */}
        <div>
          <Link
            to="/login?type=student"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Student Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="relative bg-gradient-to-b from-emerald-50/60 to-white px-6 lg:px-16 py-20 text-center">
        <span className="px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-block mb-6">
          Academic Excellence Redefined
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Shri Rajlaxmi Royal Academy <span className="text-emerald-600 block sm:inline">Of Science Vita</span>
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/admissions"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5" /> Book Consultation <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/halloffame"
            className="px-8 py-4 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>🏆</span> View Hall of Fame
          </Link>
        </div>
      </header>

      {/* Featured Programs Section */}
      <section id="courses" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Curriculum & Batches
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">Specialized Academic Programs</h2>
          <p className="text-slate-600 text-sm mt-2">Meticulously planned curriculum designed by senior academicians.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track, idx) => (
            <div key={idx} className="bg-white border border-emerald-100 hover:border-emerald-300 p-8 rounded-3xl shadow-sm transition hover:shadow-md flex flex-col justify-between relative">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md inline-block mb-4">
                  {track.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{track.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{track.desc}</p>
                <div className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                  {track.stats.split('•').map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">{track.target}</span>
                <Link to="/admissions" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  Apply Now &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-emerald-800 bg-emerald-950 text-white px-6 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-emerald-200/80">
          <p>&copy; {new Date().getFullYear()} Shri Rajlaxmi Royal Academy of Science Vita. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admissions" className="hover:text-white transition">Admissions</Link>
            <Link to="/halloffame" className="hover:text-white transition">Results</Link>
            <Link to="/login?type=student" className="hover:text-white transition font-bold text-emerald-400">Student Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}