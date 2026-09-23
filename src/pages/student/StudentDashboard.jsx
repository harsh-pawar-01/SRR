import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, Calendar, Award, 
  FileText, User, BarChart2, CheckCircle, XCircle, 
  CreditCard, BookOpen, Clock, Phone, MapPin, Building
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [syllabusStandard, setSyllabusStandard] = useState('11th');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Redirects directly back to the Student login page
  const handleLogout = () => {
    navigate('/login?type=student');
  };

  const studentProfile = {
    name: 'Atharva Patil',
    rollNo: 'SRR-JEE-202',
    classGrade: '12th Standard',
    targetBatch: 'JEE • NEET Integrated Batch',
    mobileNo: '+91 98220 12345',
    parentName: 'Ravindra Patil',
    parentMobNo: '+91 94230 56789',
    collegeName: 'Modern College of Science, Vita',
    address: 'Shivaji Road, Near Old Bus Stand, Vita, Sangli'
  };

  const attendanceRecords = [
    { date: 'Oct 25, 2026', day: 'Sunday', status: 'Present', remarks: 'Full Day Session & CBT' },
    { date: 'Oct 24, 2026', day: 'Saturday', status: 'Present', remarks: 'Regular Lectures & Doubt Cell' },
    { date: 'Oct 23, 2026', day: 'Friday', status: 'Present', remarks: 'Regular Lectures' },
    { date: 'Oct 22, 2026', day: 'Thursday', status: 'Absent', remarks: 'Medical Leave Approved' },
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

  // Syllabus Completion Data (Includes Physics, Chemistry, Mathematics, and Biology)
  const syllabusData = [
    // 11th Standard
    { id: 1, standard: '11th', subject: 'Physics', chapter: 'Units, Dimensions & Measurements', status: 'Completed', completedDate: 'Jul 15, 2026' },
    { id: 2, standard: '11th', subject: 'Physics', chapter: 'Laws of Motion & Friction', status: 'Completed', completedDate: 'Aug 22, 2026' },
    { id: 3, standard: '11th', subject: 'Chemistry', chapter: 'Some Basic Concepts of Chemistry (Mole Concept)', status: 'Completed', completedDate: 'Jul 30, 2026' },
    { id: 4, standard: '11th', subject: 'Chemistry', chapter: 'Structure of Atom & Periodic Table', status: 'Completed', completedDate: 'Aug 18, 2026' },
    { id: 5, standard: '11th', subject: 'Mathematics', chapter: 'Trigonometry I & II', status: 'Completed', completedDate: 'Aug 10, 2026' },
    { id: 6, standard: '11th', subject: 'Mathematics', chapter: 'Straight Lines & Circle', status: 'Pending', completedDate: null },
    { id: 7, standard: '11th', subject: 'Biology', chapter: 'The Living World & Biological Classification', status: 'Completed', completedDate: 'Jul 24, 2026' },
    { id: 8, standard: '11th', subject: 'Biology', chapter: 'Cell: The Unit of Life & Cell Cycle', status: 'Completed', completedDate: 'Aug 14, 2026' },
    { id: 9, standard: '11th', subject: 'Biology', chapter: 'Plant Physiology & Photosynthesis', status: 'Pending', completedDate: null },

    // 12th Standard
    { id: 10, standard: '12th', subject: 'Physics', chapter: 'Rotational Dynamics & Moment of Inertia', status: 'Completed', completedDate: 'Oct 10, 2026' },
    { id: 11, standard: '12th', subject: 'Physics', chapter: 'Mechanical Properties of Fluids', status: 'Completed', completedDate: 'Oct 20, 2026' },
    { id: 12, standard: '12th', subject: 'Physics', chapter: 'Thermodynamics & Heat Engines', status: 'Pending', completedDate: null },
    { id: 13, standard: '12th', subject: 'Chemistry', chapter: 'Solid State & Crystal Lattices', status: 'Completed', completedDate: 'Sep 25, 2026' },
    { id: 14, standard: '12th', subject: 'Chemistry', chapter: 'Solutions & Colligative Properties', status: 'Completed', completedDate: 'Oct 15, 2026' },
    { id: 15, standard: '12th', subject: 'Chemistry', chapter: 'Chemical Kinetics', status: 'Pending', completedDate: null },
    { id: 16, standard: '12th', subject: 'Mathematics', chapter: 'Matrices & Determinants', status: 'Completed', completedDate: 'Oct 05, 2026' },
    { id: 17, standard: '12th', subject: 'Mathematics', chapter: 'Differentiation & Applications of Derivatives', status: 'Pending', completedDate: null },
    { id: 18, standard: '12th', subject: 'Biology', chapter: 'Reproduction in Lower & Higher Plants', status: 'Completed', completedDate: 'Sep 20, 2026' },
    { id: 19, standard: '12th', subject: 'Biology', chapter: 'Principles of Inheritance and Variation (Genetics)', status: 'Completed', completedDate: 'Oct 12, 2026' },
    { id: 20, standard: '12th', subject: 'Biology', chapter: 'Human Reproduction & Reproductive Health', status: 'Pending', completedDate: null }
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
    { title: 'Coordinate Geometry Master Reference Sheets (IIT-JEE)', type: 'PDF • 6.5 MB', subject: 'Mathematics' },
    { title: 'Genetics & Molecular Biology NCERT High-Yield Diagrams', type: 'PDF • 9.4 MB', subject: 'Biology' }
  ];

  // Filtered syllabus records based on standard and subject
  const filteredSyllabus = syllabusData.filter(item => {
    const matchesStandard = item.standard === syllabusStandard;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesStandard && matchesSubject;
  });

  const completedCount = filteredSyllabus.filter(i => i.status === 'Completed').length;
  const progressPercent = filteredSyllabus.length ? Math.round((completedCount / filteredSyllabus.length) * 100) : 0;

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
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
              Shri Rajlaxmi Royal Academy of Science Vita
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <User className="w-3.5 h-3.5 text-emerald-600" /> {studentProfile.name} ({studentProfile.rollNo})
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Overview & Profile
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Syllabus Completed
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Calendar className="w-4 h-4" /> Daily Attendance
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'marks' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Award className="w-4 h-4" /> Test Marks & Results
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'fees' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Fee Status & Dues
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'materials' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <FileText className="w-4 h-4" /> Study Materials
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-3 space-y-6">

          {/* TAB 1: OVERVIEW & PROFILE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  {studentProfile.targetBatch}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Namaskar, {studentProfile.name}!</h1>
                <p className="text-emerald-100 text-sm mt-2 max-w-xl">
                  Welcome to your SRR student dashboard. Track your academic standing, chapter completions by faculty, and attendance logs below.
                </p>
              </div>

              {/* Student Information Card */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" /> Student Profile & Enrollment Details
                  </h3>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded border border-emerald-200">
                    Active Student
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Student Mobile</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {studentProfile.mobileNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Parent / Guardian Name</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{studentProfile.parentName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Parent Mobile (WhatsApp Alert No)</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {studentProfile.parentMobNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">College / Junior College</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600" /> {studentProfile.collegeName}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 block">Residential Address</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {studentProfile.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Overall Attendance</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">96.4%</span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">6/7 lectures attended</span>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Latest Test Average</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">86.2%</span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">JEE Mock & Weekly tests</span>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">Pending Fee Dues</span>
                  <span className="text-3xl font-black text-amber-600 mt-2 block">₹25,000</span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">Due by Nov 15, 2026</span>
                </div>
              </div>

              {/* Faculty Remarks Card */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Latest Faculty Feedback</span>
                <p className="text-sm text-slate-800 font-medium italic">
                  "Atharva is showing consistent progress in Physics and Biology revisions. Recommended to solve more previous year JEE/NEET multi-correct questions."
                </p>
                <span className="text-xs text-slate-500 block font-semibold pt-1">— Prof. R. C. Patil (Academic Head)</span>
              </div>
            </div>
          )}

          {/* TAB 2: SYLLABUS COMPLETED (With Biology Added) */}
          {activeTab === 'syllabus' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Curriculum Progress
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">Syllabus Completion Status</h2>
                  <p className="text-slate-600 text-sm">Track real-time chapter status as marked completed by academy teachers.</p>
                </div>

                {/* Progress summary badge */}
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{progressPercent}%</span>
                  <span className="text-xs text-slate-400 block">Syllabus Finished</span>
                </div>
              </div>

              {/* Standard & Subject Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Standard:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSyllabusStandard('11th')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        syllabusStandard === '11th' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      11th Standard
                    </button>
                    <button
                      onClick={() => setSyllabusStandard('12th')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        syllabusStandard === '12th' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      12th Standard
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Subject:</span>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{syllabusStandard} Standard Progress ({completedCount} of {filteredSyllabus.length} Completed)</span>
                  <span className="text-emerald-700">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-3 pt-2">
                {filteredSyllabus.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">No chapters found for this selection.</div>
                ) : (
                  filteredSyllabus.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition ${
                        item.status === 'Completed' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                      } gap-3`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          item.subject === 'Biology'
                            ? 'text-teal-800 bg-teal-100'
                            : item.subject === 'Physics'
                            ? 'text-blue-800 bg-blue-100'
                            : item.subject === 'Chemistry'
                            ? 'text-amber-800 bg-amber-100'
                            : 'text-purple-800 bg-purple-100'
                        }`}>
                          {item.subject}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.chapter}</h4>
                          <span className="text-[11px] text-slate-500 block">
                            {item.status === 'Completed' ? `Completed on ${item.completedDate}` : 'In Progress / Upcoming'}
                          </span>
                        </div>
                      </div>

                      <div>
                        {item.status === 'Completed' ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY ATTENDANCE */}
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

          {/* TAB 4: TEST MARKS & RESULTS */}
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

          {/* TAB 5: FEE STATUS & DUES */}
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

          {/* TAB 6: STUDY MATERIALS */}
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        m.subject === 'Biology'
                          ? 'bg-teal-100 text-teal-800'
                          : m.subject === 'Physics'
                          ? 'bg-blue-100 text-blue-800'
                          : m.subject === 'Chemistry'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
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