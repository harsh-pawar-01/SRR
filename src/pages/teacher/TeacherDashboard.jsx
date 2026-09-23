import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, BookOpen, MessageSquare, 
  User, BarChart2, CheckCircle, Clock, PlusCircle, 
  Send, Trash2, Edit3, Search, Check, X,
  Phone, MapPin, Award, Camera, CalendarCheck, 
  DollarSign, FileText, CheckCircle2, AlertCircle, XCircle
} from 'lucide-react';

export default function TeacherDashboard({ 
  fixedSubject = 'Physics', 
  facultyName = 'Prof. R. C. Patil (RC Sir)' 
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Teacher Profile Information State
  const [teacherProfile, setTeacherProfile] = useState({
    name: facultyName,
    mobileNo: '+91 98220 54321',
    qualification: `M.Sc. ${fixedSubject} (Gold Medalist), B.Ed. (15+ Yrs Exp)`,
    address: 'Shivaji Road, Near Royal Complex, Vita, Dist. Sangli - 415311',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  });

  // Chapter Input States
  const [newChapter11, setNewChapter11] = useState('');
  const [newChapter12, setNewChapter12] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing Chapter States
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // 11th Standard Syllabus Data
  const [syllabus11th, setSyllabus11th] = useState([
    { id: 1, chapter: `Units, Dimensions & Measurements`, status: 'Completed' },
    { id: 2, chapter: `Mathematical Methods & Vectors`, status: 'Completed' },
    { id: 3, chapter: `Laws of Motion & Friction`, status: 'Pending' },
    { id: 4, chapter: `Work, Energy & Power`, status: 'Pending' },
    { id: 5, chapter: `Gravitation & Satellite Motion`, status: 'Pending' }
  ]);

  // 12th Standard Syllabus Data
  const [syllabus12th, setSyllabus12th] = useState([
    { id: 1, chapter: `Rotational Dynamics & Moment of Inertia`, status: 'Completed' },
    { id: 2, chapter: `Mechanical Properties of Fluids`, status: 'Completed' },
    { id: 3, chapter: `Kinetic Theory of Gases & Radiation`, status: 'Completed' },
    { id: 4, chapter: `Thermodynamics`, status: 'Pending' },
    { id: 5, chapter: `Oscillations & Simple Harmonic Motion`, status: 'Pending' },
    { id: 6, chapter: `Superposition of Waves`, status: 'Pending' }
  ]);

  // Student Reviews State
  const [studentReviews, setStudentReviews] = useState([
    { 
      id: 1, 
      studentName: 'Atharva Patil (Roll #JEE-202)', 
      subject: fixedSubject, 
      review: `Demonstrating solid conceptual grasp in rotational dynamics and numerical problem-solving.`, 
      date: 'Oct 24, 2026' 
    },
    { 
      id: 2, 
      studentName: 'Snehal More (Roll #NEET-105)', 
      subject: fixedSubject, 
      review: `Good understanding of ray optics; requires more formula practice in thermodynamics.`, 
      date: 'Oct 26, 2026' 
    }
  ]);

  const [reviewStudent, setReviewStudent] = useState('Atharva Patil (Roll #JEE-202)');
  const [reviewText, setReviewText] = useState('');

  // ==========================================
  // LEAVE APPLICATIONS STATE
  // ==========================================
  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 'l1',
      leaveType: 'Academic / Conference Leave',
      startDate: '2026-11-02',
      endDate: '2026-11-04',
      days: 3,
      reason: 'Attending National Physics Teachers Conference in Pune.',
      status: 'Approved',
      appliedOn: 'Oct 20, 2026',
      adminRemark: 'Approved by Director KP Sir.'
    },
    {
      id: 'l2',
      leaveType: 'Casual Leave',
      startDate: '2026-11-12',
      endDate: '2026-11-12',
      days: 1,
      reason: 'Personal family engagement.',
      status: 'Pending',
      appliedOn: 'Oct 25, 2026',
      adminRemark: 'Under review by directorate.'
    }
  ]);

  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // ==========================================
  // SALARY & PAYROLL RECORDS STATE
  // ==========================================
  const [salaryRecords, setSalaryRecords] = useState([
    {
      month: 'October 2026',
      basicSalary: 65000,
      allowance: 10000,
      deductions: 0,
      netSalary: 75000,
      status: 'Credited',
      creditDate: 'Oct 01, 2026',
      referenceId: 'UPI/627492019283/HDFC',
      slipAvailable: true
    },
    {
      month: 'September 2026',
      basicSalary: 65000,
      allowance: 10000,
      deductions: 0,
      netSalary: 75000,
      status: 'Credited',
      creditDate: 'Sep 01, 2026',
      referenceId: 'UPI/592817204912/HDFC',
      slipAvailable: true
    },
    {
      month: 'August 2026',
      basicSalary: 65000,
      allowance: 10000,
      deductions: 0,
      netSalary: 75000,
      status: 'Credited',
      creditDate: 'Aug 01, 2026',
      referenceId: 'UPI/482710394812/HDFC',
      slipAvailable: true
    },
    {
      month: 'November 2026 (Upcoming)',
      basicSalary: 65000,
      allowance: 10000,
      deductions: 0,
      netSalary: 75000,
      status: 'Pending',
      creditDate: 'Scheduled: Nov 01, 2026',
      referenceId: 'Processing with Central Bank',
      slipAvailable: false
    }
  ]);

  const handleLogout = () => {
    navigate('/login?role=teacher');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTeacherProfile(prev => ({ ...prev, photoUrl: imageUrl }));
    }
  };

  const toggleStatus11th = (id) => {
    setSyllabus11th(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
    ));
  };

  const toggleStatus12th = (id) => {
    setSyllabus12th(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
    ));
  };

  const handleDeleteChapter11 = (id) => {
    if (window.confirm('Are you sure you want to remove this chapter?')) {
      setSyllabus11th(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteChapter12 = (id) => {
    if (window.confirm('Are you sure you want to remove this chapter?')) {
      setSyllabus12th(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddChapter11 = (e) => {
    e.preventDefault();
    if (!newChapter11.trim()) return;
    const newEntry = {
      id: Date.now(),
      chapter: newChapter11.trim(),
      status: 'Pending'
    };
    setSyllabus11th(prev => [...prev, newEntry]);
    setNewChapter11('');
  };

  const handleAddChapter12 = (e) => {
    e.preventDefault();
    if (!newChapter12.trim()) return;
    const newEntry = {
      id: Date.now(),
      chapter: newChapter12.trim(),
      status: 'Pending'
    };
    setSyllabus12th(prev => [...prev, newEntry]);
    setNewChapter12('');
  };

  const handleSaveEdit = (listType, id) => {
    if (!editedTitle.trim()) return;
    if (listType === '11th') {
      setSyllabus11th(prev => prev.map(item => item.id === id ? { ...item, chapter: editedTitle } : item));
    } else {
      setSyllabus12th(prev => prev.map(item => item.id === id ? { ...item, chapter: editedTitle } : item));
    }
    setEditingId(null);
    setEditedTitle('');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const newRev = {
      id: Date.now(),
      studentName: reviewStudent,
      subject: fixedSubject,
      review: reviewText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setStudentReviews(prev => [newRev, ...prev]);
    setReviewText('');
  };

  // Leave Form Submit
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) {
      alert('Please fill all leave fields.');
      return;
    }

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: 'l_' + Date.now(),
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: diffDays > 0 ? diffDays : 1,
      reason: leaveForm.reason.trim(),
      status: 'Pending',
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      adminRemark: 'Forwarded to Director desk for authorization.'
    };

    setLeaveHistory([newLeave, ...leaveHistory]);
    alert('Leave application submitted to Director successfully!');
    setLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
  };

  // Calculations
  const completed11th = syllabus11th.filter(s => s.status === 'Completed').length;
  const progress11th = syllabus11th.length ? Math.round((completed11th / syllabus11th.length) * 100) : 0;

  const completed12th = syllabus12th.filter(s => s.status === 'Completed').length;
  const progress12th = syllabus12th.length ? Math.round((completed12th / syllabus12th.length) * 100) : 0;

  const filtered11th = syllabus11th.filter(item => 
    item.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filtered12th = syllabus12th.filter(item => 
    item.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
              SRR <span className="text-emerald-600">{fixedSubject.toUpperCase()} PORTAL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
              Department of {fixedSubject}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold text-emerald-800">
            <img 
              src={teacherProfile.photoUrl} 
              alt={teacherProfile.name}
              className="w-6 h-6 rounded-full object-cover border border-emerald-400"
            />
            <span>{teacherProfile.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Content */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-1.5">
            <button
              onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Faculty Overview
            </button>
            <button
              onClick={() => { setActiveTab('syllabus11'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus11' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> 11th Syllabus
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'syllabus11' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {progress11th}%
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('syllabus12'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus12' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> 12th Syllabus
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'syllabus12' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {progress12th}%
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('reviews'); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Student Reviews
            </button>
            <button
              onClick={() => { setActiveTab('leaves'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'leaves' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" /> Leave Applications
              </span>
              {leaveHistory.some(l => l.status === 'Pending') && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('salary'); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'salary' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Salary & Payroll
            </button>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-xs space-y-2 text-emerald-900">
            <span className="font-bold uppercase tracking-wider block text-emerald-700">Quick Summary</span>
            <div className="flex justify-between">
              <span>Total 11th Chapters:</span>
              <span className="font-bold">{syllabus11th.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total 12th Chapters:</span>
              <span className="font-bold">{syllabus12th.length}</span>
            </div>
            <div className="flex justify-between">
              <span>October Salary:</span>
              <span className="font-bold text-emerald-700">Credited (₹75,000)</span>
            </div>
            <div className="flex justify-between">
              <span>Leave Balance:</span>
              <span className="font-bold">12 Days / Year</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Green Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  Department of {fixedSubject} Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome, {teacherProfile.name}!</h1>
                <p className="text-emerald-100 text-sm mt-2 max-w-xl">
                  Manage your academic milestones, update completed chapters, submit leave requests, and review credited salary receipts.
                </p>
              </div>

              {/* TEACHER PROFILE & WHATSAPP DP CARD */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-600" /> Faculty Profile Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Official teacher contact and credential details</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    {fixedSubject} HOD
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* WhatsApp-Style DP with Upload */}
                  <div className="relative group shrink-0">
                    <img 
                      src={teacherProfile.photoUrl} 
                      alt={teacherProfile.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-500 ring-4 ring-emerald-100 shadow-md"
                    />
                    <label 
                      htmlFor="teacher-photo-upload" 
                      className="absolute bottom-1 right-1 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg cursor-pointer transition border-2 border-white"
                      title="Update WhatsApp DP"
                    >
                      <Camera className="w-4 h-4" />
                      <input 
                        id="teacher-photo-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600" /> Full Name
                      </span>
                      <p className="text-sm font-bold text-slate-900">{teacherProfile.name}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile Number
                      </span>
                      <p className="text-sm font-bold text-emerald-700">{teacherProfile.mobileNo}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600" /> Qualification Level
                      </span>
                      <p className="text-sm font-semibold text-slate-800">{teacherProfile.qualification}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Residential Address
                      </span>
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{teacherProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">11th Standard Tracker</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {progress11th}% Done
                    </span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 block">
                    {completed11th} / {syllabus11th.length} <span className="text-sm font-medium text-slate-400">Chapters</span>
                  </span>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress11th}%` }}></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('syllabus11')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition cursor-pointer inline-flex items-center gap-1 pt-1"
                  >
                    Open 11th Tracker &rarr;
                  </button>
                </div>

                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">12th Standard Tracker</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {progress12th}% Done
                    </span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 block">
                    {completed12th} / {syllabus12th.length} <span className="text-sm font-medium text-slate-400">Chapters</span>
                  </span>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress12th}%` }}></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('syllabus12')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition cursor-pointer inline-flex items-center gap-1 pt-1"
                  >
                    Open 12th Tracker &rarr;
                  </button>
                </div>
              </div>

              {/* Quick Status Bar for Salary & Recent Leave */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">Latest Salary Status</span>
                    <p className="text-sm font-black text-slate-900">October 2026: ₹75,000</p>
                    <p className="text-xs text-emerald-700 font-semibold">Credited on Oct 01, 2026</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('salary')}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    View Slip
                  </button>
                </div>

                <div className="p-5 bg-slate-100/70 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Pending Leave Application</span>
                    <p className="text-sm font-bold text-slate-900">1 Day Casual Leave</p>
                    <p className="text-xs text-amber-700 font-semibold">Scheduled for Nov 12 • Under Review</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 11TH SYLLABUS TRACKER */}
          {activeTab === 'syllabus11' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    11th Standard
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{fixedSubject} Syllabus Checklist</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage topics taught, toggle completion, or remove incorrectly entered items.</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{progress11th}%</span>
                  <span className="text-xs text-slate-400 block">Overall Completion</span>
                </div>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter11} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Add new 11th ${fixedSubject} chapter name...`}
                  value={newChapter11}
                  onChange={(e) => setNewChapter11(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add
                </button>
              </form>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter chapters by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Chapters List */}
              <div className="space-y-2.5 pt-2">
                {filtered11th.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">No chapters found.</div>
                ) : (
                  filtered11th.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition ${
                        item.status === 'Completed' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
                      } gap-3`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input 
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-sm w-full"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveEdit('11th', item.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-semibold ${item.status === 'Completed' ? 'text-slate-800' : 'text-slate-700'}`}>
                            {item.chapter}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => toggleStatus11th(item.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition cursor-pointer ${
                            item.status === 'Completed' 
                              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {item.status === 'Completed' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => { setEditingId(item.id); setEditedTitle(item.chapter); }}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Chapter Name"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteChapter11(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 12TH SYLLABUS TRACKER */}
          {activeTab === 'syllabus12' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    12th Standard
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{fixedSubject} Syllabus Checklist</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">Track final board and entrance examination syllabus progress.</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{progress12th}%</span>
                  <span className="text-xs text-slate-400 block">Overall Completion</span>
                </div>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter12} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Add new 12th ${fixedSubject} chapter name...`}
                  value={newChapter12}
                  onChange={(e) => setNewChapter12(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add
                </button>
              </form>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter chapters by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Chapters List */}
              <div className="space-y-2.5 pt-2">
                {filtered12th.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">No chapters found.</div>
                ) : (
                  filtered12th.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition ${
                        item.status === 'Completed' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
                      } gap-3`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input 
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-sm w-full"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveEdit('12th', item.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-semibold ${item.status === 'Completed' ? 'text-slate-800' : 'text-slate-700'}`}>
                            {item.chapter}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => toggleStatus12th(item.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 border transition cursor-pointer ${
                            item.status === 'Completed' 
                              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {item.status === 'Completed' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => { setEditingId(item.id); setEditedTitle(item.chapter); }}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Edit Chapter Name"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteChapter12(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Student Feedback
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{fixedSubject} Performance Remarks</h2>
                  <p className="text-slate-500 text-sm">Post individual academic feedback and improvement notes visible to students.</p>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700">Select Student</label>
                    <select
                      value={reviewStudent}
                      onChange={(e) => setReviewStudent(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Atharva Patil (Roll #JEE-202)">Atharva Patil (Roll #JEE-202)</option>
                      <option value="Snehal More (Roll #NEET-105)">Snehal More (Roll #NEET-105)</option>
                      <option value="Rohan Deshmukh (Roll #CET-310)">Rohan Deshmukh (Roll #CET-310)</option>
                      <option value="Pooja Kadam (Roll #JEE-205)">Pooja Kadam (Roll #JEE-205)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700">{fixedSubject} Performance Review / Remarks</label>
                    <textarea
                      rows="3"
                      required
                      placeholder={`Write detailed feedback for ${reviewStudent} in ${fixedSubject}...`}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Publish Review
                  </button>
                </form>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Evaluations ({studentReviews.length})</h3>
                  <div className="space-y-3">
                    {studentReviews.map((rev) => (
                      <div key={rev.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            {rev.subject} — {rev.studentName}
                          </span>
                          <span className="text-slate-400 font-medium">{rev.date}</span>
                        </div>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed">{rev.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: LEAVE APPLICATION & TRACKER                       */}
          {/* ========================================================= */}
          {activeTab === 'leaves' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Staff Leave Portal
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Faculty Leave Application</h2>
                <p className="text-slate-500 text-sm">Submit planned absence requests directly to Director KP Sir for authorization.</p>
              </div>

              {/* Leave Application Form */}
              <form onSubmit={handleLeaveSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-800">New Leave Request</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Leave Category</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Casual Leave">Casual Leave (CL)</option>
                      <option value="Medical Leave">Medical Leave (ML)</option>
                      <option value="Academic / Conference Leave">Academic / Conference Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Start Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.startDate}
                      onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">End Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.endDate}
                      onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Reason for Leave *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Provide details about the absence (e.g. personal, medical, or academic training)..."
                    value={leaveForm.reason}
                    onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Application to Director
                  </button>
                </div>
              </form>

              {/* Leave Applications History */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-slate-800">Your Leave History & Approvals</h3>
                <div className="space-y-3">
                  {leaveHistory.map((leave) => (
                    <div key={leave.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{leave.leaveType}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {leave.days} Day(s)
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          Period: {leave.startDate} to {leave.endDate}
                        </p>
                        <p className="text-xs text-slate-500 italic">"{leave.reason}"</p>
                        <p className="text-[11px] text-slate-400 pt-0.5">Applied: {leave.appliedOn} • Note: {leave.adminRemark}</p>
                      </div>

                      <div>
                        {leave.status === 'Approved' ? (
                          <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
                          </span>
                        ) : leave.status === 'Pending' ? (
                          <span className="px-3.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Approval
                          </span>
                        ) : (
                          <span className="px-3.5 py-1.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SALARY & PAYROLL LEDGER                            */}
          {/* ========================================================= */}
          {activeTab === 'salary' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Compensation & Payroll
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">Faculty Monthly Salary Record</h2>
                  <p className="text-slate-500 text-sm">Monthly institutional compensation disbursed via Bank Transfer / NEFT.</p>
                </div>

                <div className="text-right bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Gross Package</span>
                  <span className="text-2xl font-black text-emerald-800">₹75,000 / mo</span>
                </div>
              </div>

              {/* Monthly Slips Ledger */}
              <div className="space-y-3">
                {salaryRecords.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.month}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Basic: ₹{item.basicSalary.toLocaleString()} • Allowance: ₹{item.allowance.toLocaleString()} • Deductions: ₹{item.deductions}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Status Date: {item.creditDate} • Ref: {item.referenceId}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Net Credited</span>
                        <span className="text-lg font-black text-emerald-700">₹{item.netSalary.toLocaleString()}</span>
                      </div>

                      {item.slipAvailable ? (
                        <button
                          onClick={() => alert(`Downloading official Salary Slip for ${item.month} for ${teacherProfile.name}...`)}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 text-emerald-700 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Salary Slip
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-medium">Pending Pay Date</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}