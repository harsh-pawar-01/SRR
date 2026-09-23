import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, Calendar, Award, 
  FileText, User, BarChart2, CheckCircle, XCircle, CreditCard 
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    navigate('/login');
  };

  const attendanceRecords = [
    { date: 'Oct 25, 2026', day: 'Sunday', status: 'Present', remarks: 'Full Day Session & CBT' },
    { date: 'Oct 24, 2026', day: 'Saturday', status: 'Present', remarks: 'Regular Lectures & Doubt Cell' },
    { date: 'Oct 23, 2026', day: 'Friday', status: 'Present', remarks: 'Regular Lectures' },
    { date: 'Oct 22, 2026', day: 'Absent', status: 'Absent', remarks: 'Medical Leave Approved' },
    { date: 'Oct 21, 2026', day: 'Wednesday', status: 'Present', remarks: 'Regular Lectures' },
    { date: 'Oct 20, 2026', day: 'Tuesday', status: 'Present', remarks: 'Regular Lectures' },
    { date: 'Oct 19, 2026', day: 'Monday', status: 'Present', remarks: 'Weekly Test & Lectures' }
  ];

  const allTestMarks = [
    { type: 'Board Term Exam', name: 'HSC Physics & Mathematics Semester Term-1', date: 'Oct 18, 2026', max: '100 Marks', scored: '88 Marks', percentage: '88.0%' },
    { type: 'Mock Test', name: 'JEE Advanced Full Syllabus Mock #04', date: 'Oct 12, 2026', max: '360 Marks', scored: '272 Marks', percentage: '75.5% (99.2%tile)' },
    { type: 'Weekly Test', name: 'Weekly JEE Main CBT Test #12 (Physics & Chem)', date: 'Oct 05, 2026', max: '300 Marks', scored: '240 Marks', percentage: '80.0%' },
    { type: 'Weekly Test', name: 'Weekly NEET Biology Line-by-Line NCERT Drill #11', date: 'Sep 28, 2026', max: '360 Marks', scored: '335 Marks', percentage: '93.0%' }
  ];

  const feeDetails = {
    standard: '11th & 12th Integrated Batch (2026–27)',
    totalFee: 85000,
    paidFee: 60000,
    pendingFee: 25000,
    dueDate: 'November 15, 2026',
    installments: [
      { sr: 1, title: 'Admission & Registration Fee', amount: 30000, paidDate: 'Jun 10, 2026', status: 'Paid' },
      { sr: 2, title: 'First Term Tuition Fee', amount: 30000, paidDate: 'Aug 15, 2026', status: 'Paid' },
      { sr: 3, title: 'Second Term & CBT Library Fee', amount: 25000, paidDate: 'Pending', status: 'Pending' }
    ]
  };

  const materials = [
    { title: 'Physics Rotational Dynamics Formula Sheet & Short Tricks', type: 'PDF • 4.2 MB', subject: 'Physics' },
    { title: 'Organic Chemistry Name Reactions Visual Decoder Map', type: 'PDF • 8.1 MB', subject: 'Chemistry' },
    { title: 'Coordinate Geometry Master Reference Sheets (IIT-JEE)', type: 'PDF • 6.5 MB', subject: 'Mathematics' }
  ];

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
              SRR <span className="text-emerald-600">STUDENT PORTAL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">JEE • NEET • CET BATCH (2026–27)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <User className="w-3.5 h-3.5 text-emerald-600" /> Atharva Patil (Roll #JEE-202)
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
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Overview & Stats
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Calendar className="w-4 h-4" /> Daily Attendance
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'marks' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Award className="w-4 h-4" /> Test Marks & Results
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'fees' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Fee Status & Dues
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'materials' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <FileText className="w-4 h-4" /> Study Materials & PDFs
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  JEE (Main + Advanced) Integrated Batch
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome back, Atharva!</h1>
                <p className="text-emerald-100 text-sm mt-2 max-w-xl">
                  Here is your academic summary at Shri Rajlaxmi Royal Academy Vita campus. Check your attendance, test marks, and fee payment status below.
                </p>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Overall Attendance</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">96.4%</span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Consistent present records</span>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Latest Test Average</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">86.2%</span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Weekly tests & Mock exams</span>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Fee Pending Dues</span>
                  <span className="text-3xl font-black text-amber-600 mt-2 block">₹25,000</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">Due by Nov 15, 2026</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Attendance Tracker
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Daily Attendance Record</h2>
                <p className="text-slate-600 text-sm">Review day-to-day presence at Vita campus classes and CBT labs.</p>
              </div>

              <div className="space-y-3">
                {attendanceRecords.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs">
                        {record.date}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{record.day}</span>
                        <span className="text-xs text-slate-500">{record.remarks}</span>
                      </div>
                    </div>
                    <div>
                      {record.status === 'Present' ? (
                        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Present
                        </span>
                      ) : (
                        <span className="px-3.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Absent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEST MARKS & RESULTS */}
          {activeTab === 'marks' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Examination Performance
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Weekly Tests, Mock Exams & Board Scores</h2>
                <p className="text-slate-600 text-sm">Comprehensive scorecards covering weekly entrance tests, closing mock exams, and Maharashtra Board term assessments.</p>
              </div>

              <div className="space-y-4">
                {allTestMarks.map((test, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                        {test.type}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{test.name}</h4>
                      <span className="text-xs text-slate-500 block">Exam Date: {test.date} | Max: {test.max}</span>
                    </div>
                    <div className="text-right bg-white border border-emerald-200 px-5 py-3 rounded-xl shadow-sm">
                      <span className="text-xs text-slate-500 block">Marks Scored</span>
                      <span className="text-base font-black text-emerald-600">{test.scored}</span>
                      <span className="text-xs font-bold text-slate-700 block mt-0.5">{test.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FEE STATUS & DUES */}
          {activeTab === 'fees' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Financial Ledger
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Fee Status & Academic Dues</h2>
                <p className="text-slate-600 text-sm">{feeDetails.standard}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-500 block">Total Course Fee</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">₹{feeDetails.totalFee.toLocaleString()}</span>
                </div>
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-xs font-semibold text-emerald-800 block">Total Paid Amount</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block">₹{feeDetails.paidFee.toLocaleString()}</span>
                </div>
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-xs font-semibold text-amber-800 block">Pending Balance Due</span>
                  <span className="text-2xl font-black text-amber-700 mt-1 block">₹{feeDetails.pendingFee.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-800 font-bold mt-1 block">Due by {feeDetails.dueDate}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-slate-900">Installment Breakdown & Receipt History</h3>
                <div className="space-y-3">
                  {feeDetails.installments.map((inst) => (
                    <div key={inst.sr} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          0{inst.sr}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{inst.title}</span>
                          <span className="text-xs text-slate-500">Recorded Payment Date: {inst.paidDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">₹{inst.amount.toLocaleString()}</span>
                        {inst.status === 'Paid' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">Paid</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mt-1">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDY MATERIALS */}
          {activeTab === 'materials' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Resource Library
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Study Materials & Formula Sheets</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {materials.map((m, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {m.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{m.title}</h4>
                      <span className="text-xs text-slate-500 block">{m.type}</span>
                    </div>
                    <button
                      onClick={() => alert('Downloading official SRR study module...')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> Download PDF Module
                    </button>
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