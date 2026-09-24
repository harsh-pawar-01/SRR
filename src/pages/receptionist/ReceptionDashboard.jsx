import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, UserPlus, CalendarCheck, 
  Award, MessageSquare, ArrowRightLeft, Send, 
  Search, Phone, MapPin, Building, CheckCircle2, 
  ShieldCheck, Clock, Check, Save, UserX, Archive, Trash2, Filter
} from 'lucide-react';

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admission');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitFilterGrade, setExitFilterGrade] = useState('All'); // 'All', '11th', '12th'

  // Initial Student State
  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Rohan Sunil Joshi',
      mobileNo: '9822112233',
      parentName: 'Sunil Joshi',
      parentMobNo: '919822112233',
      address: 'Shivaji Chowk, Near Old Bus Stand, Vita',
      collegeName: 'Adarsh Mahavidyalaya, Vita',
      classGrade: '12th',
      username: 'rohan.joshi',
      attendance: 'Present',
      lastAttendanceSaved: 'Oct 24, 2026',
      marks: [
        { testName: 'Weekly Test #1', subject: 'Physics', scored: 78, total: 100 }
      ]
    },
    {
      id: '2',
      name: 'Snehal Anil More',
      mobileNo: '9423445566',
      parentName: 'Anil More',
      parentMobNo: '919423445566',
      address: 'Mayani Road, Vita, Sangli',
      collegeName: 'Modern Junior College, Vita',
      classGrade: '11th',
      username: 'snehal.more',
      attendance: 'Absent',
      lastAttendanceSaved: 'Oct 24, 2026',
      marks: [
        { testName: 'Weekly Test #1', subject: 'Physics', scored: 84, total: 100 }
      ]
    },
    {
      id: '3',
      name: 'Atharva Ravindra Patil',
      mobileNo: '9822012345',
      parentName: 'Ravindra Patil',
      parentMobNo: '919423056789',
      address: 'Rajlaxmi Complex, Vita',
      collegeName: 'Balwant College, Vita',
      classGrade: '12th',
      username: 'atharva.patil',
      attendance: 'Present',
      lastAttendanceSaved: 'Oct 24, 2026',
      marks: [
        { testName: 'JEE Mock Exam #4', subject: 'Physics', scored: 88, total: 100 }
      ]
    },
    {
      id: '4',
      name: 'Pratik Ramesh Shinde',
      mobileNo: '9822556677',
      parentName: 'Ramesh Shinde',
      parentMobNo: '919822556677',
      address: 'Tasgaon Naka, Vita',
      collegeName: 'Balwant College, Vita',
      classGrade: '11th',
      username: 'pratik.shinde',
      attendance: 'Absent',
      lastAttendanceSaved: 'Oct 24, 2026',
      marks: []
    }
  ]);

  // Consultation Leads State
  const [consultations, setConsultations] = useState([
    {
      id: 'c1',
      studentName: 'Pranav Deshmukh',
      parentName: 'Sanjay Deshmukh',
      admissionYear: '11th Standard',
      stream: 'JEE (Engineering)',
      contactNumber: '9823123456',
      email: 'pranav.deshmukh@gmail.com',
      address: 'Station Road, Vita',
      message: 'Inquiring about hostel availability and morning batch timings.',
      date: 'Today, 10:30 AM',
      status: 'Pending'
    },
    {
      id: 'c2',
      studentName: 'Aditi Kulkarni',
      parentName: 'Dhananjay Kulkarni',
      admissionYear: '12th Standard',
      stream: 'NEET (Medical)',
      contactNumber: '9423987654',
      email: 'aditi.k@yahoo.com',
      address: 'Tasgaon Naka, Vita',
      message: 'Direct admission inquiry for repeater/crash course.',
      date: 'Yesterday, 04:15 PM',
      status: 'Followed Up'
    }
  ]);

  // Admission Form State
  const [admissionForm, setAdmissionForm] = useState({
    name: '',
    mobileNo: '',
    parentName: '',
    parentMobNo: '',
    address: '',
    collegeName: '',
    classGrade: '11th',
    username: '',
    password: ''
  });

  // Global Test Config for Batch-wise Mark Entry
  const [examConfig, setExamConfig] = useState({
    testName: 'Weekly Unit Test #01',
    subject: 'Physics',
    totalMarks: '100'
  });

  // Score Inputs for All Students (Keyed by Student ID)
  const [batchScores, setBatchScores] = useState({});

  const handleLogout = () => {
    navigate('/login?role=receptionist');
  };

  // 1. Handle New Admission
  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    if (!admissionForm.name || !admissionForm.username || !admissionForm.password) {
      alert('Please fill out all required fields.');
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      ...admissionForm,
      attendance: 'Present',
      lastAttendanceSaved: attendanceDate,
      marks: []
    };

    setStudents([...students, newStudent]);
    alert(`Student ${admissionForm.name} enrolled successfully with username: ${admissionForm.username}`);

    setAdmissionForm({
      name: '',
      mobileNo: '',
      parentName: '',
      parentMobNo: '',
      address: '',
      collegeName: '',
      classGrade: '11th',
      username: '',
      password: ''
    });
  };

  // ==========================================
  // BULK SEND: WHATSAPP ABSENT ALERTS FOR ALL
  // ==========================================
  const handleSendAllAbsentWhatsAppAlerts = () => {
    const absentStudents = students.filter(s => s.attendance === 'Absent');
    
    if (absentStudents.length === 0) {
      alert('Great news! No students are marked absent for today.');
      return;
    }

    const confirmSend = window.confirm(
      `Found ${absentStudents.length} absent student(s):\n` +
      absentStudents.map(s => `• ${s.name} (${s.classGrade}) - Parent: ${s.parentMobNo}`).join('\n') +
      `\n\nDo you want to dispatch WhatsApp alerts to their parents now?`
    );

    if (!confirmSend) return;

    // Send WhatsApp messages sequentially
    absentStudents.forEach((student, index) => {
      setTimeout(() => {
        const message = encodeURIComponent(
          `*Shri Rajlaxmi Royal Academy of Science, Vita (SRR)*\n\n` +
          `Namaskar ${student.parentName},\n` +
          `This is to inform you that your ward *${student.name}* (${student.classGrade} Standard) was marked *ABSENT* for lectures today (${attendanceDate}).\n\n` +
          `Please contact reception for academic assistance or leave records.\n` +
          `Office: +91 98220 12345 / +91 94230 56789`
        );
        const phone = student.parentMobNo.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      }, index * 600);
    });
  };

  // BULK SAVE: ALL ATTENDANCE
  const handleSaveAllAttendance = () => {
    setStudents(prev => prev.map(s => ({
      ...s,
      lastAttendanceSaved: attendanceDate
    })));
    alert(`All attendance records saved successfully for date: ${attendanceDate}!`);
  };

  // BULK SAVE: ALL ENTERED MARKS
  const handleSaveAllMarks = () => {
    const enteredIds = Object.keys(batchScores).filter(id => batchScores[id] !== '');
    if (enteredIds.length === 0) {
      alert('Please enter marks for at least one student before saving.');
      return;
    }

    setStudents(prev => prev.map(s => {
      const score = batchScores[s.id];
      if (score !== undefined && score !== '') {
        return {
          ...s,
          marks: [
            {
              testName: examConfig.testName,
              subject: examConfig.subject,
              scored: Number(score),
              total: Number(examConfig.totalMarks)
            },
            ...s.marks
          ]
        };
      }
      return s;
    }));

    alert(`Marks for ${enteredIds.length} student(s) saved successfully for ${examConfig.testName}!`);
    setBatchScores({});
  };

  // 4. Handle 11th to 12th Standard Promotion/Swap
  const handleBulkSwap11to12 = () => {
    const count11th = students.filter(s => s.classGrade === '11th').length;
    if (count11th === 0) {
      alert('No 11th standard students found to promote.');
      return;
    }

    if (window.confirm(`Are you sure you want to promote and copy all (${count11th}) 11th standard students directly to 12th standard? All previous data & records will be retained.`)) {
      setStudents(prev => prev.map(s => s.classGrade === '11th' ? { ...s, classGrade: '12th' } : s));
      alert(`Batch swap completed! ${count11th} students promoted to 12th standard.`);
    }
  };

  const handleSingleSwap = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, classGrade: s.classGrade === '11th' ? '12th' : '11th' } : s));
  };

  // 5. STUDENT EXIT & REMOVAL HANDLERS (11th or 12th middle exit + Passed 12th Batch)
  const handleRemoveIndividualStudent = (id, name, classGrade) => {
    if (window.confirm(`Are you sure you want to exit and remove ${classGrade} student "${name}" from the active academy database? This action cannot be undone.`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      alert(`Student ${name} (${classGrade}) has been removed from active records.`);
    }
  };

  const handleRemoveBulkPassed12thBatch = () => {
    const count12th = students.filter(s => s.classGrade === '12th').length;
    if (count12th === 0) {
      alert('No 12th standard students found to remove.');
      return;
    }

    if (window.confirm(`WARNING: Are you sure you want to archive and remove ALL (${count12th}) completed 12th standard students from the active database? This will clear the passed batch.`)) {
      setStudents(prev => prev.filter(s => s.classGrade !== '12th'));
      alert(`Successfully archived and removed all ${count12th} completed 12th standard students!`);
    }
  };

  // Filtered Student List for general tabs
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.classGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Student List for Exit tab (handles grade filter + search)
  const exitFilteredStudents = students.filter(s => {
    const matchesGrade = exitFilterGrade === 'All' || s.classGrade === exitFilterGrade;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const totalAbsentCount = students.filter(s => s.attendance === 'Absent').length;

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
              SRR <span className="text-emerald-600">RECEPTION DESK</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
              Admission, Attendance & Academic Control
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Front Office Authorized
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200 pb-3">
          {[
            { id: 'admission', label: 'New Admission Form', icon: UserPlus },
            { id: 'attendance', label: 'Daily Attendance & WhatsApp', icon: CalendarCheck },
            { id: 'marks', label: 'Update Test Marks', icon: Award },
            { id: 'consultation', label: 'Booked Consultations', icon: MessageSquare },
            { id: 'swap', label: '11th to 12th Swap', icon: ArrowRightLeft },
            { id: 'exit', label: 'Student Exit & Batch Archive', icon: UserX },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: NEW STUDENT ADMISSION FORM                         */}
        {/* ========================================================= */}
        {activeTab === 'admission' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Onboarding & Enrollment
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">New Student Admission</h2>
              <p className="text-slate-600 text-sm">Fill in personal, contact, academic and portal credentials to complete registration.</p>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashashri Kadam"
                    value={admissionForm.name}
                    onChange={e => setAdmissionForm({ ...admissionForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Student Mobile No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822123456"
                    value={admissionForm.mobileNo}
                    onChange={e => setAdmissionForm({ ...admissionForm, mobileNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Class Grade *</label>
                  <select
                    value={admissionForm.classGrade}
                    onChange={e => setAdmissionForm({ ...admissionForm, classGrade: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="11th">11th Standard</option>
                    <option value="12th">12th Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hanmantrao Kadam"
                    value={admissionForm.parentName}
                    onChange={e => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Parent Mobile No (WhatsApp Alerts) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 919822123456"
                    value={admissionForm.parentMobNo}
                    onChange={e => setAdmissionForm({ ...admissionForm, parentMobNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">College / School Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adarsh College, Vita"
                    value={admissionForm.collegeName}
                    onChange={e => setAdmissionForm({ ...admissionForm, collegeName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Residential Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shivaji Road, Vita, Dist-Sangli"
                    value={admissionForm.address}
                    onChange={e => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200/80 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Student Portal Login Credentials</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Generated Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yashashri.srr"
                      value={admissionForm.username}
                      onChange={e => setAdmissionForm({ ...admissionForm, username: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Initial Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={admissionForm.password}
                      onChange={e => setAdmissionForm({ ...admissionForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Complete Student Admission
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ATTENDANCE LOG & BULK ACTIONS ONLY                 */}
        {/* ========================================================= */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Daily Attendance Tracker
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Daily Attendance & WhatsApp Absent Dispatch</h2>
                <p className="text-slate-600 text-sm">Toggle attendance status below, save the entire batch, and send alerts to absent students with one click.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-500">Date:</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="border-none text-xs font-bold bg-transparent focus:outline-none"
                  />
                </div>

                {/* BULK ACTION 1: SAVE ALL ATTENDANCE */}
                <button
                  onClick={handleSaveAllAttendance}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4" /> Save All Attendance
                </button>

                {/* BULK ACTION 2: SEND WHATSAPP ALERTS TO ALL ABSENT STUDENTS ONLY */}
                <button
                  onClick={handleSendAllAbsentWhatsAppAlerts}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-2 shrink-0 ${
                    totalAbsentCount > 0 
                      ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={totalAbsentCount === 0}
                  title="Send WhatsApp notice to all absent students' parents"
                >
                  <Send className="w-4 h-4" /> Send Absent Alerts ({totalAbsentCount})
                </button>
              </div>
            </div>

            {/* Quick Search & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student or college..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Total Enrolled: <span className="text-emerald-700 font-bold">{students.length}</span> | 
                Present: <span className="text-emerald-600 font-bold">{students.filter(s => s.attendance === 'Present').length}</span> |
                Absent: <span className="text-rose-600 font-bold">{totalAbsentCount}</span>
              </div>
            </div>

            {/* Student Attendance List (No Individual WhatsApp button) */}
            <div className="space-y-3">
              {filteredStudents.map((student, idx) => (
                <div 
                  key={student.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    student.attendance === 'Absent' ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {student.classGrade}
                      </span>
                      {student.lastAttendanceSaved && (
                        <span className="text-[10px] text-slate-400">
                          (Last Saved: {student.lastAttendanceSaved})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Parent: {student.parentName}</span>
                      <span>•</span>
                      <span>Mob: {student.parentMobNo}</span>
                      <span>•</span>
                      <span>{student.collegeName}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Status Selector Toggle */}
                    <div className="flex rounded-xl border border-slate-200 p-1 bg-white">
                      <button
                        type="button"
                        onClick={() => {
                          setStudents(students.map(s => s.id === student.id ? { ...s, attendance: 'Present' } : s));
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          student.attendance === 'Present' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-600'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudents(students.map(s => s.id === student.id ? { ...s, attendance: 'Absent' } : s));
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          student.attendance === 'Absent' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-rose-600'
                        }`}
                      >
                        Absent
                      </button>
                    </div>

                    {/* Status indicator tag */}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      student.attendance === 'Present' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {student.attendance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: UPDATE STUDENT TEST MARKS (SINGLE SAVE ALL AT TOP)  */}
        {/* ========================================================= */}
        {activeTab === 'marks' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Academic Score Entry
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Post-Test Score Updates</h2>
                <p className="text-slate-600 text-sm">Enter scores for all students below and commit them with "Save All Marks".</p>
              </div>

              {/* SINGLE SAVE ALL MARKS BUTTON (TOP ONLY) */}
              <button
                onClick={handleSaveAllMarks}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Save className="w-4 h-4" /> Save All Marks
              </button>
            </div>

            {/* Test Configuration Header */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Test / Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Test #03"
                  value={examConfig.testName}
                  onChange={e => setExamConfig({ ...examConfig, testName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Subject</label>
                <select
                  value={examConfig.subject}
                  onChange={e => setExamConfig({ ...examConfig, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Total Maximum Marks</label>
                <input
                  type="number"
                  placeholder="100"
                  value={examConfig.totalMarks}
                  onChange={e => setExamConfig({ ...examConfig, totalMarks: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-center font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Search Filter for Student Marks */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search students to enter marks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* List of All Students */}
            <div className="space-y-3">
              {filteredStudents.map((student, idx) => (
                <div 
                  key={student.id} 
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {student.classGrade}
                      </span>
                    </div>
                    
                    {/* Display previously saved marks */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {student.marks.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">No previous scores recorded</span>
                      ) : (
                        student.marks.map((m, mi) => (
                          <span key={mi} className="bg-white border border-emerald-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {m.testName} ({m.subject}): <strong className="text-emerald-700">{m.scored}/{m.total}</strong>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Input field for this student */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                      <span className="text-xs text-slate-500 font-medium">Score:</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={batchScores[student.id] ?? ''}
                        onChange={e => setBatchScores({ ...batchScores, [student.id]: e.target.value })}
                        className="w-16 text-center font-bold text-emerald-700 text-sm focus:outline-none"
                      />
                      <span className="text-xs text-slate-400">/ {examConfig.totalMarks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CONSULTATION REQUESTS                             */}
        {/* ========================================================= */}
        {activeTab === 'consultation' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Lead Pipeline
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Booked Consultations & Admission Inquiries</h2>
              <p className="text-slate-600 text-sm">Inquiries filled by parents/students directly via the public portal's "Book Consultation" form.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultations.map((lead) => (
                <div key={lead.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{lead.studentName}</h4>
                        <span className="text-xs text-slate-500">Parent: {lead.parentName}</span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {lead.stream}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-200">
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {lead.contactNumber} ({lead.email})</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {lead.address}</p>
                      <p className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5" /> Booked: {lead.date}</p>
                    </div>

                    {lead.message && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 italic">
                        "{lead.message}"
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <a
                      href={`tel:${lead.contactNumber}`}
                      className="flex-1 py-2 text-center bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition"
                    >
                      Call Parent
                    </a>
                    <button
                      onClick={() => {
                        setAdmissionForm({
                          ...admissionForm,
                          name: lead.studentName,
                          parentName: lead.parentName,
                          mobileNo: lead.contactNumber,
                          parentMobNo: lead.contactNumber,
                          address: lead.address,
                          classGrade: lead.admissionYear.includes('12') ? '12th' : '11th'
                        });
                        setActiveTab('admission');
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer text-center"
                    >
                      Convert to Admission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: 11TH TO 12TH ACADEMIC YEAR SWAP                   */}
        {/* ========================================================= */}
        {activeTab === 'swap' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Annual Promotion Workflow
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">11th to 12th Standard Promotion & Data Swap</h2>
              <p className="text-slate-600 text-sm">
                Promote students directly from 11th to 12th standard. All existing student marks, attendance profiles, credentials, and parent details are preserved automatically.
              </p>
            </div>

            {/* Bulk Action Notice Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Annual Batch Transition</h3>
                <p className="text-xs text-emerald-100">
                  Ready to upgrade current 11th standard students? You have {students.filter(s => s.classGrade === '11th').length} student(s) in 11th grade.
                </p>
              </div>
              <button
                onClick={handleBulkSwap11to12}
                className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black transition shadow-md cursor-pointer shrink-0 flex items-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" /> Promote All 11th &rarr; 12th
              </button>
            </div>

            {/* Individual Student List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800">Student Directory Status</h3>
              <div className="space-y-2.5">
                {students.map((student) => (
                  <div key={student.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <p className="text-xs text-slate-500">College: {student.collegeName} • Roll: {student.username}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        student.classGrade === '12th' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.classGrade} Standard
                      </span>

                      <button
                        onClick={() => handleSingleSwap(student.id)}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" /> Toggle Grade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STUDENT EXIT & BATCH ARCHIVE (11TH & 12TH MID/END) */}
        {/* ========================================================= */}
        {activeTab === 'exit' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Course Completion & Student Exit
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Student Exit & Batch Archive Management</h2>
                <p className="text-slate-600 text-sm">
                  Remove individual students who leave in the middle of 11th or 12th, or bulk-archive an entire completed 12th standard batch.
                </p>
              </div>

              {/* Bulk Remove Entire Passed 12th Batch Button */}
              <button
                onClick={handleRemoveBulkPassed12thBatch}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Trash2 className="w-4 h-4" /> Remove Entire Passed 12th Batch ({students.filter(s => s.classGrade === '12th').length})
              </button>
            </div>

            {/* Informational Guidance Box */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <Archive className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 space-y-0.5">
                <p className="font-bold">Total Active Roster: {students.length} students (11th: {students.filter(s => s.classGrade === '11th').length} | 12th: {students.filter(s => s.classGrade === '12th').length})</p>
                <p>Removing a student completely deregisters their portal login and clears them from daily attendance and test lists.</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student to remove..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Grade Filter Pills */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                  {['All', '11th', '12th'].map(grade => (
                    <button
                      key={grade}
                      onClick={() => setExitFilterGrade(grade)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        exitFilterGrade === grade
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      {grade === 'All' ? 'All Classes' : `${grade} Standard`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Students (11th & 12th) with Exit Option */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800">
                Active Enrolled Students ({exitFilteredStudents.length})
              </h3>
              
              {exitFilteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-sm">
                  No matching students found in this category.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {exitFilteredStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            student.classGrade === '12th'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {student.classGrade} Standard
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (User: {student.username})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          College: {student.collegeName} • Parent: {student.parentName} ({student.parentMobNo})
                        </p>
                      </div>

                      {/* Remove Student Button */}
                      <button
                        onClick={() => handleRemoveIndividualStudent(student.id, student.name, student.classGrade)}
                        className="px-3.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 self-end sm:self-auto shadow-2xs"
                        title="Remove student from academy records"
                      >
                        <UserX className="w-3.5 h-3.5" /> Exit / Remove Student
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}