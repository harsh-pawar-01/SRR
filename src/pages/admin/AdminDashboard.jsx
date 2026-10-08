import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, Users, UserPlus, 
  CreditCard, CalendarCheck, CheckCircle2, XCircle, 
  Search, ShieldCheck, DollarSign, Edit3, Key, 
  Phone, MapPin, Award, Check, Clock, Trash2, Filter, Percent,
  Loader2, RefreshCw, AlertCircle, Save
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Loading & Action State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. TEACHERS STATE
  const [teachers, setTeachers] = useState([
    {
      id: 't1',
      name: 'Prof. R. C. Patil (RC Sir)',
      subject: 'Physics',
      mobileNo: '+91 98220 54321',
      qualification: 'M.Sc. Physics (Gold Medalist), B.Ed.',
      address: 'Shivaji Road, Near Royal Complex, Vita',
      username: 'physics_rc',
      password: '••••••••',
      monthlySalary: 75000,
      is_active: true
    },
    {
      id: 't2',
      name: 'Dr. Sandeep Kulkarni',
      subject: 'Chemistry',
      mobileNo: '+91 94220 98765',
      qualification: 'Ph.D. Organic Chemistry, NET/SET',
      address: 'Mayani Road, Vita, Dist. Sangli',
      username: 'chem_sandeep',
      password: '••••••••',
      monthlySalary: 70000,
      is_active: true
    },
    {
      id: 't3',
      name: 'Prof. Vijay Chavan',
      subject: 'Mathematics',
      mobileNo: '+91 98900 11223',
      qualification: 'M.Sc. Applied Mathematics (12+ Yrs Exp)',
      address: 'Tasgaon Naka, Vita',
      username: 'math_vijay',
      password: '••••••••',
      monthlySalary: 72000,
      is_active: true
    },
    {
      id: 't4',
      name: 'Dr. Anjali Deshmukh',
      subject: 'Biology',
      mobileNo: '+91 94230 44556',
      qualification: 'M.B.B.S, M.Sc. Life Sciences',
      address: 'Station Road, Vita',
      username: 'bio_anjali',
      password: '••••••••',
      monthlySalary: 75000,
      is_active: true
    }
  ]);

  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '', subject: 'Physics', mobileNo: '', 
    qualification: '', address: '', username: '', password: '', monthlySalary: 65000
  });

  // 2. RECEPTIONIST STATE
  const [receptionists, setReceptionists] = useState([
    {
      id: 'r1',
      name: 'Suresh Patil (Desk 1)',
      mobileNo: '+91 98221 11000',
      username: 'reception_srr',
      password: '••••••••',
      shift: 'Morning & Afternoon (8 AM - 4 PM)',
      monthlySalary: 25000,
      is_active: true
    },
    {
      id: 'r2',
      name: 'Mahesh Shinde (Desk 2)',
      mobileNo: '+91 94230 99887',
      username: 'admin_desk',
      password: '••••••••',
      shift: 'Evening Session (1 PM - 9 PM)',
      monthlySalary: 22000,
      is_active: true
    }
  ]);

  const [receptionForm, setReceptionForm] = useState({
    name: '', mobileNo: '', username: '', password: '', shift: 'Full Day', monthlySalary: 22000
  });

  // 3. STUDENT FEE STATE
  const [feeStandardFilter, setFeeStandardFilter] = useState('All');
  const [studentFees, setStudentFees] = useState([
    {
      id: 's1',
      name: 'Atharva Ravindra Patil',
      rollNo: 'SRR-JEE-202',
      classGrade: '12th',
      parentName: 'Ravindra Patil',
      totalFee: 85000,
      concession: 5000,
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
      concession: 10000,
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

  // 5. MONTH-WISE SALARY LEDGER STATE
  const academicMonths = [
    'June 2026', 'July 2026', 'August 2026', 'September 2026', 
    'October 2026', 'November 2026', 'December 2026', 'January 2027', 
    'February 2027', 'March 2027', 'April 2027', 'May 2027'
  ];

  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('October 2026');
  const [salaryRoleFilter, setSalaryRoleFilter] = useState('All');

  const [monthlyPayroll, setMonthlyPayroll] = useState(() => {
    const initialPayroll = {};
    academicMonths.forEach((month, idx) => {
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

  // Students count for KPI
  const [totalEnrolledCount, setTotalEnrolledCount] = useState(0);

  // Load Dashboard Data from Live API
  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, feesRes, studentsRes] = await Promise.allSettled([
        api.get('/api/users'),
        api.get('/api/fees'),
        api.get('/api/students')
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
        const allUsers = usersRes.value.data || [];
        
        // Populate live teachers
        const liveTeachers = allUsers.filter(u => u.role === 'teacher').map(t => ({
          id: t.id,
          name: t.name,
          subject: t.subject || 'Physics',
          mobileNo: t.phone || '+91 98220 00000',
          qualification: `Faculty Department of ${t.subject || 'Science'}`,
          address: 'Campus Faculty Office, Vita',
          username: t.username,
          password: '••••••••',
          monthlySalary: t.subject === 'Physics' || t.subject === 'Biology' ? 75000 : 70000,
          is_active: t.is_active
        }));
        if (liveTeachers.length > 0) {
          setTeachers(liveTeachers);
        }

        // Populate live receptionists
        const liveRecs = allUsers.filter(u => u.role === 'reception').map(r => ({
          id: r.id,
          name: r.name,
          mobileNo: r.phone || '+91 98221 00000',
          username: r.username,
          password: '••••••••',
          shift: 'General Duty (8 AM - 5 PM)',
          monthlySalary: 22000,
          is_active: r.is_active
        }));
        if (liveRecs.length > 0) {
          setReceptionists(liveRecs);
        }
      }

      if (feesRes.status === 'fulfilled' && feesRes.value?.success) {
        const liveFees = feesRes.value.data || [];
        if (liveFees.length > 0) {
          const mapped = liveFees.map(f => {
            const sName = f.students?.users?.name || 'Academy Student';
            const roll = f.students?.users?.username || 'SRR-' + (f.students?.class_grade || '11TH');
            const classGrade = f.students?.class_grade || '11th';
            const totalFee = Number(f.total_amount) || 80000;
            const paidAmount = Number(f.paid_amount) || 0;
            return {
              id: f.id,
              studentId: f.student_id,
              name: sName,
              rollNo: roll,
              classGrade,
              parentName: 'Guardian on Record',
              totalFee,
              concession: 0,
              paidAmount,
              dueDate: f.due_date || 'Nov 15, 2026',
              status: f.status
            };
          });
          setStudentFees(mapped);
        }
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value?.success) {
        setTotalEnrolledCount((studentsRes.value.data || []).length);
      }
    } catch (err) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login?role=admin');
  };

  // --- Handlers: Teacher Management ---
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (editingTeacherId) {
        const payload = {
          name: teacherForm.name.trim(),
          subject: teacherForm.subject,
          phone: teacherForm.mobileNo.trim(),
        };
        if (teacherForm.password && teacherForm.password !== '••••••••') {
          payload.password = teacherForm.password;
        }
        const res = await api.patch(`/api/users/${editingTeacherId}`, payload);
        if (res.success) {
          setTeachers(prev => prev.map(t => t.id === editingTeacherId ? {
            ...t,
            name: res.data.name,
            subject: res.data.subject,
            mobileNo: res.data.phone,
            monthlySalary: teacherForm.monthlySalary
          } : t));
          setSuccessMsg(`Faculty member "${teacherForm.name}" updated successfully!`);
          setEditingTeacherId(null);
        }
      } else {
        const payload = {
          name: teacherForm.name.trim(),
          username: teacherForm.username.trim(),
          password: teacherForm.password || 'password123',
          phone: teacherForm.mobileNo.trim(),
          role: 'teacher',
          subject: teacherForm.subject
        };
        const res = await api.post('/api/users', payload);
        if (res.success) {
          const newT = {
            id: res.data.id,
            name: res.data.name,
            subject: res.data.subject,
            mobileNo: res.data.phone,
            qualification: `Faculty Department of ${res.data.subject}`,
            address: 'Campus Faculty Office, Vita',
            username: res.data.username,
            password: '••••••••',
            monthlySalary: Number(teacherForm.monthlySalary) || 70000,
            is_active: true
          };
          setTeachers(prev => [newT, ...prev]);
          setSuccessMsg(`Teacher "${teacherForm.name}" onboarded with username "${res.data.username}"!`);
        }
      }

      setTeacherForm({
        name: '', subject: 'Physics', mobileNo: '', 
        qualification: '', address: '', username: '', password: '', monthlySalary: 65000
      });
    } catch (err) {
      setError(err.message || 'Failed to save faculty record');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTeacherClick = (t) => {
    setEditingTeacherId(t.id);
    setTeacherForm({
      name: t.name,
      subject: t.subject,
      mobileNo: t.mobileNo,
      qualification: t.qualification || `Faculty Department of ${t.subject}`,
      address: t.address || 'Campus Faculty Office, Vita',
      username: t.username,
      password: '',
      monthlySalary: t.monthlySalary || 70000
    });
    setActiveTab('teachers');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove faculty access for "${name}"?`)) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/api/users/${id}`);
      if (res.success) {
        setTeachers(prev => prev.filter(t => t.id !== id));
        setSuccessMsg(`Teacher "${name}" removed from active faculty.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to remove faculty member');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Handlers: Receptionist Management ---
  const handleAddReceptionist = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        name: receptionForm.name.trim(),
        username: receptionForm.username.trim(),
        password: receptionForm.password || 'reception123',
        phone: receptionForm.mobileNo.trim(),
        role: 'reception'
      };
      const res = await api.post('/api/users', payload);
      if (res.success) {
        const newR = {
          id: res.data.id,
          name: res.data.name,
          mobileNo: res.data.phone,
          username: res.data.username,
          password: '••••••••',
          shift: receptionForm.shift || 'General Duty',
          monthlySalary: Number(receptionForm.monthlySalary) || 22000,
          is_active: true
        };
        setReceptionists(prev => [newR, ...prev]);
        setSuccessMsg(`Receptionist "${res.data.name}" created with username "${res.data.username}"!`);
        setReceptionForm({ name: '', mobileNo: '', username: '', password: '', shift: 'Full Day', monthlySalary: 22000 });
      }
    } catch (err) {
      setError(err.message || 'Failed to create receptionist account');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReceptionist = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate receptionist account for "${name}"?`)) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/api/users/${id}`);
      if (res.success) {
        setReceptionists(prev => prev.filter(r => r.id !== id));
        setSuccessMsg(`Reception account for "${name}" deactivated.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to deactivate receptionist');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Handlers: Fee Update Modal ---
  const handleSaveFeeUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const prevPaid = feeUpdateModal.paidAmount || 0;
      const newPaid = Number(feeInputs.paidAmount);
      
      // If payment was added, record via atomic payments endpoint
      if (newPaid > prevPaid) {
        const amountDifference = newPaid - prevPaid;
        await api.post(`/api/fees/${feeUpdateModal.id}/pay`, {
          amount: amountDifference,
          method: 'CASH'
        });
      }

      setStudentFees(prev => prev.map(s => {
        if (s.id === feeUpdateModal.id) {
          return {
            ...s,
            totalFee: Number(feeInputs.totalFee),
            concession: Number(feeInputs.concession || 0),
            paidAmount: newPaid,
            dueDate: feeInputs.dueDate
          };
        }
        return s;
      }));

      setSuccessMsg(`Fee records and scholarship concessions updated for ${feeUpdateModal.name}!`);
      setFeeUpdateModal(null);
    } catch (err) {
      setError(err.message || 'Failed to record fee adjustments');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Handlers: Leave Actions ---
  const handleLeaveDecision = (id, newStatus) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setSuccessMsg(`Leave request marked as ${newStatus}.`);
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

  // Calculations
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

  const currentMonthStaff = (monthlyPayroll[selectedSalaryMonth] || []).filter(item => {
    const matchesRole = salaryRoleFilter === 'All' || item.role === salaryRoleFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading Directorate Control Panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-sm dark:shadow-slate-950/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
              SRR <span className="text-emerald-600 dark:text-emerald-400">ADMIN CONTROL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400">
              Master Institutional & Academic Administration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            title="Refresh portal records"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {user?.name || 'Prof. K. P. Patil (Director)'}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
        
        {/* Feedback Banners */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-between text-rose-800 dark:text-rose-200 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg cursor-pointer">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg cursor-pointer">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200 dark:border-slate-800 pb-3">
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
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm">
              <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                Academy Directorate
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">Welcome, {user?.name || 'Director KP Sir'}!</h1>
              <p className="text-emerald-100 text-sm mt-2 max-w-2xl">
                Master management panel for Shri Rajlaxmi Royal Academy of Science Vita. Configure faculty profiles, provision front-desk staff, monitor 11th & 12th fee collections with concessions, and track 12-month payroll disbursements.
              </p>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Gross Expected</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-2 block">₹{totalGrossExpected.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">Full Tuition Value</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 block uppercase tracking-wider">Fee Concessions</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 block">₹{totalConcessions.toLocaleString()}</span>
                <span className="text-[11px] text-blue-500 font-medium mt-1 block">Scholarship Disbursed</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">Collected Fees</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">₹{totalCollected.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 block">
                  {totalNetExpected > 0 ? Math.round((totalCollected/totalNetExpected)*100) : 0}% of Net Payable
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">Outstanding Dues</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 block">₹{totalPending.toLocaleString()}</span>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1 block">Net Balance Pending</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Faculty & Staff Roster
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {teachers.length} faculty head(s) and {receptionists.length} receptionist(s) currently registered across {totalEnrolledCount} academy students.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('teachers')}
                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Manage Teachers &rarr;
                  </button>
                  <button
                    onClick={() => setActiveTab('reception')}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Manage Reception &rarr;
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 12-Month Academic Payroll
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
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

        {/* TAB 2: FACULTY MANAGEMENT */}
        {activeTab === 'teachers' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Faculty Administration
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {editingTeacherId ? 'Update Faculty Details' : 'Onboard New Faculty Member'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Add, edit, or remove teachers when they exit the academy.
                </p>
              </div>
              {editingTeacherId && (
                <button 
                  onClick={() => {
                    setEditingTeacherId(null);
                    setTeacherForm({ name: '', subject: 'Physics', mobileNo: '', qualification: '', address: '', username: '', password: '', monthlySalary: 65000 });
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. R. C. Patil"
                    value={teacherForm.name}
                    onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Assigned Subject *</label>
                  <select
                    value={teacherForm.subject}
                    onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98220 54321"
                    value={teacherForm.mobileNo}
                    onChange={e => setTeacherForm({ ...teacherForm, mobileNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Qualification Level *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc. Physics (Gold Medalist), B.Ed."
                    value={teacherForm.qualification}
                    onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Monthly Remuneration (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={teacherForm.monthlySalary}
                    onChange={e => setTeacherForm({ ...teacherForm, monthlySalary: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-emerald-800 dark:text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Residential Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivaji Road, Near Royal Complex, Vita"
                  value={teacherForm.address}
                  onChange={e => setTeacherForm({ ...teacherForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Portal Username *</label>
                  <input
                    type="text"
                    required={!editingTeacherId}
                    disabled={!!editingTeacherId}
                    placeholder="e.g. physics_rc"
                    value={teacherForm.username}
                    onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    {editingTeacherId ? 'Change Password (Optional)' : 'Portal Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingTeacherId}
                    placeholder={editingTeacherId ? 'Leave blank to keep unchanged' : '••••••••'}
                    value={teacherForm.password}
                    onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                  <span>{editingTeacherId ? 'Save & Update Faculty Information' : 'Onboard Teacher'}</span>
                </button>
              </div>
            </form>

            {/* List of Teachers with Edit & Delete Options */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Current Academy Faculty ({teachers.length})</h3>
              <div className="space-y-3">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{teacher.name}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                          {teacher.subject} HOD
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          ₹{teacher.monthlySalary?.toLocaleString() || '70,000'} / mo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.qualification}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 pt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {teacher.mobileNo}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {teacher.address}</span>
                      </p>
                      <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                        Username: <strong>{teacher.username}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTeacherClick(teacher)}
                        className="px-3.5 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 text-slate-700 dark:text-slate-200 hover:text-emerald-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                        className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
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

        {/* TAB 3: RECEPTIONIST ACCOUNTS */}
        {activeTab === 'reception' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Front-Desk Credential Control
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Provision & Manage Receptionist Accounts</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Issue login credentials or remove receptionists who have exited the academy.</p>
            </div>

            <form onSubmit={handleAddReceptionist} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Patil"
                  value={receptionForm.name}
                  onChange={e => setReceptionForm({ ...receptionForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98221 00000"
                  value={receptionForm.mobileNo}
                  onChange={e => setReceptionForm({ ...receptionForm, mobileNo: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Salary (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="22000"
                  value={receptionForm.monthlySalary}
                  onChange={e => setReceptionForm({ ...receptionForm, monthlySalary: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Assign Username</label>
                <input
                  type="text"
                  required
                  placeholder="reception_desk"
                  value={receptionForm.username}
                  onChange={e => setReceptionForm({ ...receptionForm, username: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Assign Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={receptionForm.password}
                  onChange={e => setReceptionForm({ ...receptionForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-5 flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />} Create Receptionist Account
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Authorized Reception Accounts ({receptionists.length})</h3>
              <div className="space-y-3">
                {receptionists.map(r => (
                  <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">₹{r.monthlySalary?.toLocaleString() || '22,000'} / mo</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{r.shift} • Contact: {r.mobileNo}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 block">
                          User: {r.username}
                        </span>
                      </div>

                      <button
                        onClick={async () => {
                          const newPass = prompt(`Enter new password for ${r.name}:`);
                          if (newPass && newPass.length >= 6) {
                            try {
                              await api.patch(`/api/users/${r.id}`, { password: newPass });
                              setSuccessMsg(`Password updated for ${r.name}!`);
                            } catch (err) {
                              setError(err.message || 'Failed to update password');
                            }
                          } else if (newPass) {
                            alert('Password must be at least 6 characters.');
                          }
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer"
                      >
                        Reset Password
                      </button>

                      <button
                        onClick={() => handleDeleteReceptionist(r.id, r.name)}
                        className="p-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-xl transition cursor-pointer"
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

        {/* TAB 4: STUDENT FEE LEDGER */}
        {activeTab === 'fees' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Financial Records & Scholarships
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Student Fee Master Ledger</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Select standard (11th / 12th) to inspect tuition dues, track scholarship concessions, and view payments.</p>
              </div>

              {/* Class Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Class:
                </span>
                {['All', '11th', '12th'].map(grade => (
                  <button
                    key={grade}
                    onClick={() => setFeeStandardFilter(grade)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      feeStandardFilter === grade 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
                    }`}
                  >
                    {grade === 'All' ? 'All Classes' : `${grade} Standard`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats for Selected Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Gross {feeStandardFilter} Fees</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">₹{totalGrossExpected.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl">
                <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold block uppercase">Scholarship Concessions</span>
                <span className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1 block">₹{totalConcessions.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block uppercase">Collected Amount</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">₹{totalCollected.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl">
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block uppercase">Outstanding Dues</span>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1 block">₹{totalPending.toLocaleString()}</span>
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Student Fee List */}
            <div className="space-y-3">
              {filteredStudentFees.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                  No student fee records found for {feeStandardFilter} standard.
                </div>
              ) : (
                filteredStudentFees.map(student => {
                  const concession = student.concession || 0;
                  const netPayable = student.totalFee - concession;
                  const pending = netPayable - student.paidAmount;
                  const status = pending <= 0 ? 'Paid' : student.paidAmount > 0 ? 'Partial' : 'Pending';

                  return (
                    <div key={student.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            student.classGrade === '12th' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                          }`}>
                            {student.classGrade} Standard
                          </span>
                          {concession > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                              <Percent className="w-3 h-3" /> ₹{concession.toLocaleString()} Concession
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Roll: #{student.rollNo} • Parent: {student.parentName}</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Scheduled Deadline: {student.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right text-xs space-y-0.5">
                          <span className="text-slate-400 block">Gross Fee: ₹{student.totalFee.toLocaleString()}</span>
                          {concession > 0 && (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold block">Net Payable: ₹{netPayable.toLocaleString()}</span>
                          )}
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold block">Paid: ₹{student.paidAmount.toLocaleString()}</span>
                          <span className="text-sm font-black text-rose-600 dark:text-rose-400 block">Pending: ₹{pending.toLocaleString()}</span>
                        </div>

                        <div className="text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold block mb-2 ${
                            status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : status === 'Partial' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
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

            {/* Fee Edit Modal */}
            {feeUpdateModal && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-emerald-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update {feeUpdateModal.classGrade} Fee: {feeUpdateModal.name}</h3>
                    <button onClick={() => setFeeUpdateModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveFeeUpdate} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Total Agreed Course Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={feeInputs.totalFee}
                        onChange={e => setFeeInputs({ ...feeInputs, totalFee: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-slate-700 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Fee Concession / Scholarship Discount (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={feeInputs.concession}
                        onChange={e => setFeeInputs({ ...feeInputs, concession: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-xl text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
                      />
                      <span className="text-[10px] text-slate-400 block">
                        Net payable fee will be: ₹{(Number(feeInputs.totalFee || 0) - Number(feeInputs.concession || 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Total Amount Paid So Far (₹)</label>
                      <input
                        type="number"
                        required
                        value={feeInputs.paidAmount}
                        onChange={e => setFeeInputs({ ...feeInputs, paidAmount: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Next Installment Due Date</label>
                      <input
                        type="text"
                        required
                        value={feeInputs.dueDate}
                        onChange={e => setFeeInputs({ ...feeInputs, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setFeeUpdateModal(null)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Fee Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TEACHERS LEAVE APPROVAL */}
        {activeTab === 'leaves' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Staff Governance
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Faculty Leave Approval Request Desk</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Review, authorize or decline leave applications submitted by faculty members.</p>
            </div>

            <div className="space-y-4">
              {leaveRequests.map(leave => (
                <div key={leave.id} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{leave.teacherName}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                        {leave.subject}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Duration: {leave.dates}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 italic">"{leave.reason}"</p>
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
                          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                        leave.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
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

        {/* TAB 6: 12-MONTH SALARY LEDGER */}
        {activeTab === 'salaries' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Payroll Management (Academic Year 2026–27)
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Month-wise Staff Salary & Remuneration</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Select any month from the 12-month academic calendar to update teacher and receptionist payment status.</p>
              </div>

              {/* All 12 Academic Months Selector Dropdown */}
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-2xl">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase">Payroll Month:</span>
                <select
                  value={selectedSalaryMonth}
                  onChange={e => setSelectedSalaryMonth(e.target.value)}
                  className="bg-transparent font-bold text-emerald-800 dark:text-emerald-300 text-xs focus:outline-none cursor-pointer"
                >
                  {academicMonths.map(month => (
                    <option key={month} value={month} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Role + Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter Staff:</span>
                <div className="flex bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 p-1">
                  {['All', 'Teacher', 'Receptionist'].map(role => (
                    <button
                      key={role}
                      onClick={() => setSalaryRoleFilter(role)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        salaryRoleFilter === role 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
                      }`}
                    >
                      {role === 'All' ? 'All Staff' : `${role}s Only`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Month Total: <strong className="text-emerald-700 dark:text-emerald-400 text-sm">
                  ₹{currentMonthStaff.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Staff Month-wise Payroll Table */}
            <div className="space-y-3">
              {currentMonthStaff.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">No payroll records for this month filter.</div>
              ) : (
                currentMonthStaff.map(staff => (
                  <div key={staff.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{staff.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          staff.role === 'Teacher' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                        }`}>
                          {staff.role} • {staff.designation}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Payment Cycle: {selectedSalaryMonth} • Status Info: {staff.paidDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Monthly Amount</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">₹{staff.amount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-black rounded-full ${
                          staff.status === 'Credited' 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {staff.status}
                        </span>

                        <button
                          onClick={() => toggleMonthlySalaryStatus(selectedSalaryMonth, staff.id)}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            staff.status === 'Credited'
                              ? 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-100'
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