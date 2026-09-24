import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, Users, UserPlus, 
  CreditCard, CalendarCheck, CheckCircle2, XCircle, 
  Search, ShieldCheck, DollarSign, Edit3, Key, 
  Phone, MapPin, Award, Check, Clock, Trash2, Filter, Percent
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. TEACHERS STATE (With Delete Option)
  const [teachers, setTeachers] = useState([
    {
      id: 't1',
      name: 'Prof. R. C. Patil (RC Sir)',
      subject: 'Physics',
      mobileNo: '+91 98220 54321',
      qualification: 'M.Sc. Physics (Gold Medalist), B.Ed.',
      address: 'Shivaji Road, Near Royal Complex, Vita',
      username: 'physics_rc',
      password: 'password123',
      monthlySalary: 75000
    },
    {
      id: 't2',
      name: 'Dr. Sandeep Kulkarni',
      subject: 'Chemistry',
      mobileNo: '+91 94220 98765',
      qualification: 'Ph.D. Organic Chemistry, NET/SET',
      address: 'Mayani Road, Vita, Dist. Sangli',
      username: 'chem_sandeep',
      password: 'password123',
      monthlySalary: 70000
    },
    {
      id: 't3',
      name: 'Prof. Vijay Chavan',
      subject: 'Mathematics',
      mobileNo: '+91 98900 11223',
      qualification: 'M.Sc. Applied Mathematics (12+ Yrs Exp)',
      address: 'Tasgaon Naka, Vita',
      username: 'math_vijay',
      password: 'password123',
      monthlySalary: 72000
    },
    {
      id: 't4',
      name: 'Dr. Anjali Deshmukh',
      subject: 'Biology',
      mobileNo: '+91 94230 44556',
      qualification: 'M.B.B.S, M.Sc. Life Sciences',
      address: 'Station Road, Vita',
      username: 'bio_anjali',
      password: 'password123',
      monthlySalary: 75000
    }
  ]);

  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '', subject: 'Physics', mobileNo: '', 
    qualification: '', address: '', username: '', password: '', monthlySalary: 65000
  });

  // 2. RECEPTIONIST STATE (With Delete Option)
  const [receptionists, setReceptionists] = useState([
    {
      id: 'r1',
      name: 'Suresh Patil (Desk 1)',
      mobileNo: '+91 98221 11000',
      username: 'reception_srr',
      password: 'reception@2026',
      shift: 'Morning & Afternoon (8 AM - 4 PM)',
      monthlySalary: 25000
    },
    {
      id: 'r2',
      name: 'Mahesh Shinde (Desk 2)',
      mobileNo: '+91 94230 99887',
      username: 'admin_desk',
      password: 'desk@pass123',
      shift: 'Evening Session (1 PM - 9 PM)',
      monthlySalary: 22000
    }
  ]);

  const [receptionForm, setReceptionForm] = useState({
    name: '', mobileNo: '', username: '', password: '', shift: 'Full Day', monthlySalary: 22000
  });

  // 3. STUDENT FEE STATE (Separate 11th & 12th + Fee Concession / Scholarship)
  const [feeStandardFilter, setFeeStandardFilter] = useState('All'); // 'All', '11th', '12th'
  const [studentFees, setStudentFees] = useState([
    {
      id: 's1',
      name: 'Atharva Ravindra Patil',
      rollNo: 'SRR-JEE-202',
      classGrade: '12th',
      parentName: 'Ravindra Patil',
      totalFee: 85000,
      concession: 5000, // Merit concession
      paidAmount: 60000,
      dueDate: 'Nov 15, 2026'
    },
    {
      id: 's2',
      name: 'Snehal Anil More',
      rollNo: 'SRR-NEET-105',
      classGrade: '11th',
      parentName: 'Anil More',
      totalFee: 80000,
      concession: 10000, // Scholarship concession
      paidAmount: 70000,
      dueDate: 'Paid in Full'
    },
    {
      id: 's3',
      name: 'Rohan Sunil Joshi',
      rollNo: 'SRR-CET-310',
      classGrade: '12th',
      parentName: 'Sunil Joshi',
      totalFee: 75000,
      concession: 0,
      paidAmount: 35000,
      dueDate: 'Oct 30, 2026'
    },
    {
      id: 's4',
      name: 'Pratik Ramesh Shinde',
      rollNo: 'SRR-11TH-042',
      classGrade: '11th',
      parentName: 'Ramesh Shinde',
      totalFee: 80000,
      concession: 5000,
      paidAmount: 40000,
      dueDate: 'Nov 10, 2026'
    }
  ]);

  const [feeUpdateModal, setFeeUpdateModal] = useState(null);
  const [feeInputs, setFeeInputs] = useState({ totalFee: '', concession: '', paidAmount: '', dueDate: '' });

  // 4. TEACHER LEAVE APPLICATIONS STATE
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'l1',
      teacherName: 'Dr. Sandeep Kulkarni',
      subject: 'Chemistry',
      dates: 'Nov 02, 2026 – Nov 04, 2026 (3 Days)',
      reason: 'Attending National Chemistry Teachers Conference in Pune.',
      status: 'Pending',
      appliedOn: 'Oct 25, 2026'
    },
    {
      id: 'l2',
      teacherName: 'Prof. Vijay Chavan',
      subject: 'Mathematics',
      dates: 'Oct 28, 2026 (1 Day)',
      reason: 'Family function & personal leave.',
      status: 'Pending',
      appliedOn: 'Oct 24, 2026'
    }
  ]);

  // 5. MONTH-WISE SALARY LEDGER STATE (All 12 Months of Academic Year)
  const academicMonths = [
    'June 2026', 'July 2026', 'August 2026', 'September 2026', 
    'October 2026', 'November 2026', 'December 2026', 'January 2027', 
    'February 2027', 'March 2027', 'April 2027', 'May 2027'
  ];

  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('October 2026');
  const [salaryRoleFilter, setSalaryRoleFilter] = useState('All'); // 'All', 'Teacher', 'Receptionist'

  // Master Payroll Record mapped dynamically per month
  const [monthlyPayroll, setMonthlyPayroll] = useState(() => {
    const initialPayroll = {};
    academicMonths.forEach((month, idx) => {
      // Past months (June - September) are marked Credited by default
      // Current & Future months (October onward) marked with realistic initial status
      const isPast = idx < 4;
      initialPayroll[month] = [
        { id: 't1', name: 'Prof. R. C. Patil', role: 'Teacher', designation: 'Physics HOD', amount: 75000, status: isPast || idx === 4 ? 'Credited' : 'Pending', paidDate: isPast || idx === 4 ? `1st ${month}` : 'Pending cycle' },
        { id: 't2', name: 'Dr. Sandeep Kulkarni', role: 'Teacher', designation: 'Chemistry HOD', amount: 70000, status: isPast ? 'Credited' : 'Pending', paidDate: isPast ? `1st ${month}` : 'Pending cycle' },
        { id: 't3', name: 'Prof. Vijay Chavan', role: 'Teacher', designation: 'Mathematics HOD', amount: 72000, status: isPast || idx === 4 ? 'Credited' : 'Pending', paidDate: isPast || idx === 4 ? `1st ${month}` : 'Pending cycle' },
        { id: 't4', name: 'Dr. Anjali Deshmukh', role: 'Teacher', designation: 'Biology HOD', amount: 75000, status: isPast || idx === 4 ? 'Credited' : 'Pending', paidDate: isPast || idx === 4 ? `1st ${month}` : 'Pending cycle' },
        { id: 'r1', name: 'Suresh Patil', role: 'Receptionist', designation: 'Front Desk (Shift 1)', amount: 25000, status: isPast || idx === 4 ? 'Credited' : 'Pending', paidDate: isPast || idx === 4 ? `2nd ${month}` : 'Pending cycle' },
        { id: 'r2', name: 'Mahesh Shinde', role: 'Receptionist', designation: 'Front Desk (Shift 2)', amount: 22000, status: isPast || idx === 4 ? 'Credited' : 'Pending', paidDate: isPast || idx === 4 ? `2nd ${month}` : 'Pending cycle' },
      ];
    });
    return initialPayroll;
  });

  const handleLogout = () => {
    navigate('/login?role=admin');
  };

  // --- Handlers: Teacher Management ---
  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (editingTeacherId) {
      setTeachers(prev => prev.map(t => t.id === editingTeacherId ? { ...t, ...teacherForm } : t));
      alert('Teacher details updated successfully!');
      setEditingTeacherId(null);
    } else {
      const newTeacher = {
        id: 't_' + Date.now(),
        ...teacherForm
      };
      setTeachers(prev => [...prev, newTeacher]);
      alert(`Teacher ${teacherForm.name} onboarded successfully!`);
    }
    setTeacherForm({
      name: '', subject: 'Physics', mobileNo: '', 
      qualification: '', address: '', username: '', password: '', monthlySalary: 65000
    });
  };

  const handleEditTeacherClick = (t) => {
    setEditingTeacherId(t.id);
    setTeacherForm({
      name: t.name,
      subject: t.subject,
      mobileNo: t.mobileNo,
      qualification: t.qualification,
      address: t.address,
      username: t.username,
      password: t.password,
      monthlySalary: t.monthlySalary
    });
    setActiveTab('teachers');
  };

  const handleDeleteTeacher = (id, name) => {
    if (window.confirm(`Are you sure you want to remove teacher "${name}"? This will revoke their access to the teacher portal and delete their profile.`)) {
      setTeachers(prev => prev.filter(t => t.id !== id));
      alert(`Teacher ${name} removed from academy records.`);
    }
  };

  // --- Handlers: Receptionist Management ---
  const handleAddReceptionist = (e) => {
    e.preventDefault();
    const newRec = {
      id: 'r_' + Date.now(),
      ...receptionForm
    };
    setReceptionists(prev => [...prev, newRec]);
    alert(`Receptionist account created! Username: ${receptionForm.username}`);
    setReceptionForm({ name: '', mobileNo: '', username: '', password: '', shift: 'Full Day', monthlySalary: 22000 });
  };

  const handleDeleteReceptionist = (id, name) => {
    if (window.confirm(`Are you sure you want to delete receptionist account for "${name}"? They will no longer be able to log in to the reception desk.`)) {
      setReceptionists(prev => prev.filter(r => r.id !== id));
      alert(`Receptionist account for ${name} removed.`);
    }
  };

  // --- Handlers: Fee Update Modal (With Concession) ---
  const handleSaveFeeUpdate = (e) => {
    e.preventDefault();
    setStudentFees(prev => prev.map(s => {
      if (s.id === feeUpdateModal.id) {
        return {
          ...s,
          totalFee: Number(feeInputs.totalFee),
          concession: Number(feeInputs.concession || 0),
          paidAmount: Number(feeInputs.paidAmount),
          dueDate: feeInputs.dueDate
        };
      }
      return s;
    }));
    alert(`Fee records and concession updated for ${feeUpdateModal.name}`);
    setFeeUpdateModal(null);
  };

  // --- Handlers: Leave Actions ---
  const handleLeaveDecision = (id, newStatus) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  // --- Handlers: Month-wise Salary Status Toggle ---
  const toggleMonthlySalaryStatus = (month, staffId) => {
    setMonthlyPayroll(prev => {
      const monthList = prev[month] || [];
      const updatedList = monthList.map(item => {
        if (item.id === staffId) {
          const nextStatus = item.status === 'Credited' ? 'Pending' : 'Credited';
          return {
            ...item,
            status: nextStatus,
            paidDate: nextStatus === 'Credited' 
              ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Pending authorization'
          };
        }
        return item;
      });
      return { ...prev, [month]: updatedList };
    });
  };

  // Filtered Fee Calculations (Supports 11th & 12th split + Concession)
  const filteredStudentFees = studentFees.filter(s => {
    const matchesGrade = feeStandardFilter === 'All' || s.classGrade === feeStandardFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const totalGrossExpected = filteredStudentFees.reduce((acc, curr) => acc + curr.totalFee, 0);
  const totalConcessions = filteredStudentFees.reduce((acc, curr) => acc + (curr.concession || 0), 0);
  const totalNetExpected = totalGrossExpected - totalConcessions;
  const totalCollected = filteredStudentFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = totalNetExpected - totalCollected;

  // Month-wise Payroll Filter
  const currentMonthStaff = (monthlyPayroll[selectedSalaryMonth] || []).filter(item => {
    const matchesRole = salaryRoleFilter === 'All' || item.role === salaryRoleFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
              SRR <span className="text-emerald-600">ADMIN CONTROL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
              Master Institutional & Academic Administration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Prof. K. P. Patil (Director)
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
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200 pb-3">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Users },
            { id: 'teachers', label: 'Faculty Management', icon: UserPlus },
            { id: 'reception', label: 'Reception Accounts', icon: Key },
            { id: 'fees', label: 'Student Fee Ledger (11th/12th)', icon: CreditCard },
            { id: 'leaves', label: 'Leave Approvals', icon: CalendarCheck, badge: leaveRequests.filter(l => l.status === 'Pending').length },
            { id: 'salaries', label: 'Monthly Staff Payroll', icon: DollarSign },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer relative ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" /> 
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW                                           */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm">
              <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                Academy Directorate
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">Welcome, Director KP Sir!</h1>
              <p className="text-emerald-100 text-sm mt-2 max-w-2xl">
                Master management panel for Shri Rajlaxmi Royal Academy of Science Vita. Configure faculty profiles, provision front-desk staff, monitor 11th & 12th fee collections with concessions, and track 12-month payroll disbursements.
              </p>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Gross Expected</span>
                <span className="text-2xl font-black text-slate-900 mt-2 block">₹{totalGrossExpected.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Full Tuition Value</span>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-blue-700 block uppercase tracking-wider">Fee Concessions</span>
                <span className="text-2xl font-black text-blue-600 mt-2 block">₹{totalConcessions.toLocaleString()}</span>
                <span className="text-[11px] text-blue-500 font-medium mt-1 block">Scholarship Disbursed</span>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-emerald-800 block uppercase tracking-wider">Collected Fees</span>
                <span className="text-2xl font-black text-emerald-600 mt-2 block">₹{totalCollected.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
                  {totalNetExpected > 0 ? Math.round((totalCollected/totalNetExpected)*100) : 0}% of Net Payable
                </span>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-amber-800 block uppercase tracking-wider">Outstanding Dues</span>
                <span className="text-2xl font-black text-amber-600 mt-2 block">₹{totalPending.toLocaleString()}</span>
                <span className="text-[11px] text-amber-700 font-medium mt-1 block">Net Balance Pending</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" /> Faculty & Staff Roster
                </h3>
                <p className="text-xs text-slate-500">
                  {teachers.length} faculty head(s) and {receptionists.length} receptionist(s) currently registered.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('teachers')}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Manage Teachers &rarr;
                  </button>
                  <button
                    onClick={() => setActiveTab('reception')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Manage Reception &rarr;
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> 12-Month Academic Payroll
                </h3>
                <p className="text-xs text-slate-500">
                  Track credited or pending salaries for both teachers and receptionists for all 12 months (June to May).
                </p>
                <button
                  onClick={() => setActiveTab('salaries')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Open Month-wise Payroll &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FACULTY MANAGEMENT (WITH DELETE OPTION)            */}
        {/* ========================================================= */}
        {activeTab === 'teachers' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Faculty Administration
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {editingTeacherId ? 'Update Faculty Details' : 'Onboard New Faculty Member'}
                </h2>
                <p className="text-slate-600 text-sm">
                  Add, edit, or remove teachers when they exit the academy.
                </p>
              </div>
              {editingTeacherId && (
                <button 
                  onClick={() => {
                    setEditingTeacherId(null);
                    setTeacherForm({ name: '', subject: 'Physics', mobileNo: '', qualification: '', address: '', username: '', password: '', monthlySalary: 65000 });
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. R. C. Patil"
                    value={teacherForm.name}
                    onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Assigned Subject *</label>
                  <select
                    value={teacherForm.subject}
                    onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98220 54321"
                    value={teacherForm.mobileNo}
                    onChange={e => setTeacherForm({ ...teacherForm, mobileNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Qualification Level *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc. Physics (Gold Medalist), B.Ed."
                    value={teacherForm.qualification}
                    onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Monthly Remuneration (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={teacherForm.monthlySalary}
                    onChange={e => setTeacherForm({ ...teacherForm, monthlySalary: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-emerald-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Residential Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivaji Road, Near Royal Complex, Vita"
                  value={teacherForm.address}
                  onChange={e => setTeacherForm({ ...teacherForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800 uppercase">Portal Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. physics_rc"
                    value={teacherForm.username}
                    onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800 uppercase">Portal Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={teacherForm.password}
                    onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> 
                  <span>{editingTeacherId ? 'Save & Update Faculty Information' : 'Onboard Teacher'}</span>
                </button>
              </div>
            </form>

            {/* List of Teachers with Edit & Delete Options */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-800">Current Academy Faculty ({teachers.length})</h3>
              <div className="space-y-3">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{teacher.name}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {teacher.subject} HOD
                        </span>
                        <span className="text-xs font-black text-emerald-700">
                          ₹{teacher.monthlySalary.toLocaleString()} / mo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{teacher.qualification}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-3 pt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> {teacher.mobileNo}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600" /> {teacher.address}</span>
                      </p>
                      <p className="text-[11px] font-mono text-emerald-700 font-semibold pt-1">
                        Username: <strong>{teacher.username}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTeacherClick(teacher)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      {/* TEACHER DELETE OPTION */}
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Remove teacher who exited the academy"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RECEPTIONIST ACCOUNTS (WITH DELETE OPTION)         */}
        {/* ========================================================= */}
        {activeTab === 'reception' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Front-Desk Credential Control
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Provision & Manage Receptionist Accounts</h2>
              <p className="text-slate-600 text-sm">Issue login credentials or remove receptionists who have exited the academy.</p>
            </div>

            <form onSubmit={handleAddReceptionist} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Patil"
                  value={receptionForm.name}
                  onChange={e => setReceptionForm({ ...receptionForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98221 00000"
                  value={receptionForm.mobileNo}
                  onChange={e => setReceptionForm({ ...receptionForm, mobileNo: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Salary (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="22000"
                  value={receptionForm.monthlySalary}
                  onChange={e => setReceptionForm({ ...receptionForm, monthlySalary: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Assign Username</label>
                <input
                  type="text"
                  required
                  placeholder="reception_desk"
                  value={receptionForm.username}
                  onChange={e => setReceptionForm({ ...receptionForm, username: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Assign Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={receptionForm.password}
                  onChange={e => setReceptionForm({ ...receptionForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-5 flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" /> Create Receptionist Account
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800">Authorized Reception Accounts ({receptionists.length})</h3>
              <div className="space-y-3">
                {receptionists.map(r => (
                  <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                        <span className="text-xs font-bold text-emerald-700">₹{r.monthlySalary?.toLocaleString() || '22,000'} / mo</span>
                      </div>
                      <p className="text-xs text-slate-500">{r.shift} • Contact: {r.mobileNo}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                          User: {r.username}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Pass: {r.password}</span>
                      </div>

                      <button
                        onClick={() => {
                          const newPass = prompt(`Enter new password for ${r.name}:`, r.password);
                          if (newPass) {
                            setReceptionists(prev => prev.map(item => item.id === r.id ? { ...item, password: newPass } : item));
                            alert('Password updated!');
                          }
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 text-xs font-semibold text-slate-700 rounded-xl cursor-pointer"
                      >
                        Reset Password
                      </button>

                      {/* RECEPTIONIST DELETE OPTION */}
                      <button
                        onClick={() => handleDeleteReceptionist(r.id, r.name)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition cursor-pointer"
                        title="Delete receptionist who left academy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STUDENT FEE LEDGER (11TH/12TH + FEE CONCESSION)     */}
        {/* ========================================================= */}
        {activeTab === 'fees' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Financial Records & Scholarships
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Student Fee Master Ledger</h2>
                <p className="text-slate-600 text-sm">Select standard (11th / 12th) to inspect or modify tuition dues, apply scholarship concessions, and track payments.</p>
              </div>

              {/* Class Filter Tabs: 11th & 12th Separate Option */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Class:
                </span>
                {['All', '11th', '12th'].map(grade => (
                  <button
                    key={grade}
                    onClick={() => setFeeStandardFilter(grade)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      feeStandardFilter === grade 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    {grade === 'All' ? 'All Classes' : `${grade} Standard`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats for Selected Grade (Including Concession Total) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block uppercase">Gross {feeStandardFilter} Fees</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">₹{totalGrossExpected.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-xs text-blue-800 font-semibold block uppercase">Scholarship Concessions</span>
                <span className="text-2xl font-black text-blue-700 mt-1 block">₹{totalConcessions.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs text-emerald-800 font-semibold block uppercase">Collected Amount</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">₹{totalCollected.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-xs text-amber-800 font-semibold block uppercase">Outstanding Dues</span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">₹{totalPending.toLocaleString()}</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Student Fee List */}
            <div className="space-y-3">
              {filteredStudentFees.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No student fee records found for {feeStandardFilter} standard.</div>
              ) : (
                filteredStudentFees.map(student => {
                  const concession = student.concession || 0;
                  const netPayable = student.totalFee - concession;
                  const pending = netPayable - student.paidAmount;
                  const status = pending <= 0 ? 'Paid' : student.paidAmount > 0 ? 'Partial' : 'Pending';

                  return (
                    <div key={student.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            student.classGrade === '12th' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {student.classGrade} Standard
                          </span>
                          {concession > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                              <Percent className="w-3 h-3" /> ₹{concession.toLocaleString()} Concession Applied
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">Roll: {student.rollNo} • Parent: {student.parentName}</p>
                        <p className="text-[11px] text-amber-700 font-semibold">Scheduled Deadline: {student.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right text-xs space-y-0.5">
                          <span className="text-slate-400 block">Gross Fee: ₹{student.totalFee.toLocaleString()}</span>
                          {concession > 0 && (
                            <span className="text-blue-600 font-semibold block">Net Payable: ₹{netPayable.toLocaleString()}</span>
                          )}
                          <span className="text-emerald-700 font-bold block">Paid: ₹{student.paidAmount.toLocaleString()}</span>
                          <span className="text-sm font-black text-rose-600 block">Pending: ₹{pending.toLocaleString()}</span>
                        </div>

                        <div className="text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold block mb-2 ${
                            status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : status === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {status}
                          </span>

                          <button
                            onClick={() => {
                              setFeeUpdateModal(student);
                              setFeeInputs({
                                totalFee: student.totalFee,
                                concession: student.concession || 0,
                                paidAmount: student.paidAmount,
                                dueDate: student.dueDate
                              });
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Update Fee
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Fee Edit Modal (Includes Fee Concession) */}
            {feeUpdateModal && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-emerald-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Update {feeUpdateModal.classGrade} Fee: {feeUpdateModal.name}</h3>
                    <button onClick={() => setFeeUpdateModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveFeeUpdate} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Total Agreed Course Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={feeInputs.totalFee}
                        onChange={e => setFeeInputs({ ...feeInputs, totalFee: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-bold bg-slate-50"
                      />
                    </div>

                    {/* FEE CONCESSION / SCHOLARSHIP FIELD */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-700 uppercase flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Fee Concession / Scholarship Discount (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={feeInputs.concession}
                        onChange={e => setFeeInputs({ ...feeInputs, concession: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm font-bold text-blue-700 bg-blue-50/50"
                      />
                      <span className="text-[10px] text-slate-400 block">
                        Net payable fee will be: ₹{(Number(feeInputs.totalFee || 0) - Number(feeInputs.concession || 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Total Amount Paid So Far (₹)</label>
                      <input
                        type="number"
                        required
                        value={feeInputs.paidAmount}
                        onChange={e => setFeeInputs({ ...feeInputs, paidAmount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-bold text-emerald-700 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Next Installment Due Date</label>
                      <input
                        type="text"
                        required
                        value={feeInputs.dueDate}
                        onChange={e => setFeeInputs({ ...feeInputs, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl text-sm bg-slate-50"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setFeeUpdateModal(null)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 cursor-pointer"
                      >
                        Save Fee Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TEACHERS LEAVE APPROVAL                            */}
        {/* ========================================================= */}
        {activeTab === 'leaves' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Staff Governance
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Faculty Leave Approval Request Desk</h2>
              <p className="text-slate-600 text-sm">Review, authorize or decline leave applications submitted by faculty members.</p>
            </div>

            <div className="space-y-4">
              {leaveRequests.map(leave => (
                <div key={leave.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{leave.teacherName}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {leave.subject}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">Duration: {leave.dates}</p>
                    <p className="text-xs text-slate-600 pt-1 italic">"{leave.reason}"</p>
                    <span className="text-[10px] text-slate-400 block pt-1">Applied: {leave.appliedOn}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {leave.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleLeaveDecision(leave.id, 'Approved')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve Leave
                        </button>
                        <button
                          onClick={() => handleLeaveDecision(leave.id, 'Rejected')}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                        leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {leave.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {leave.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: 12-MONTH SALARY LEDGER (TEACHERS & RECEPTIONISTS)   */}
        {/* ========================================================= */}
        {activeTab === 'salaries' && (
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payroll Management (Academic Year 2026–27)
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Month-wise Staff Salary & Remuneration</h2>
                <p className="text-slate-600 text-sm">Select any month from the 12-month academic calendar to update teacher and receptionist payment status.</p>
              </div>

              {/* All 12 Academic Months Selector Dropdown */}
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
                <span className="text-xs font-bold text-emerald-900 uppercase">Payroll Month:</span>
                <select
                  value={selectedSalaryMonth}
                  onChange={e => setSelectedSalaryMonth(e.target.value)}
                  className="bg-transparent font-bold text-emerald-800 text-xs focus:outline-none cursor-pointer"
                >
                  {academicMonths.map(month => (
                    <option key={month} value={month} className="bg-white text-slate-900">
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Role + Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Staff:</span>
                <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                  {['All', 'Teacher', 'Receptionist'].map(role => (
                    <button
                      key={role}
                      onClick={() => setSalaryRoleFilter(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        salaryRoleFilter === role 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      {role === 'All' ? 'All Staff' : `${role}s Only`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Month Total: <strong className="text-emerald-700 text-sm">
                  ₹{currentMonthStaff.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Staff Month-wise Payroll Table */}
            <div className="space-y-3">
              {currentMonthStaff.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No payroll records for this month filter.</div>
              ) : (
                currentMonthStaff.map(staff => (
                  <div key={staff.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{staff.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          staff.role === 'Teacher' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {staff.role} • {staff.designation}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Payment Cycle: {selectedSalaryMonth} • Status Info: {staff.paidDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Monthly Amount</span>
                        <span className="text-lg font-black text-slate-900">₹{staff.amount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-black rounded-full ${
                          staff.status === 'Credited' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {staff.status}
                        </span>

                        <button
                          onClick={() => toggleMonthlySalaryStatus(selectedSalaryMonth, staff.id)}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            staff.status === 'Credited'
                              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {staff.status === 'Credited' ? 'Mark Pending' : 'Mark Credited'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}