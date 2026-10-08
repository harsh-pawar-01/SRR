import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, UserPlus, CalendarCheck, 
  Award, MessageSquare, ArrowRightLeft, Send, 
  Search, Phone, MapPin, Building, CheckCircle2, 
  ShieldCheck, Clock, Check, Save, UserX, Archive, Trash2, Filter,
  CreditCard, Loader2, AlertCircle, RefreshCw, DollarSign
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('admission');

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitFilterGrade, setExitFilterGrade] = useState('All');

  // Core Data States
  const [students, setStudents] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [feesList, setFeesList] = useState([]);

  // Attendance local toggles: { [studentId]: 'Present' | 'Absent' }
  const [attendanceMap, setAttendanceMap] = useState({});

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
    password: '',
    initialTotalFee: '85000',
    feeDueDate: '2026-11-30',
  });

  // Global Test Config for Batch-wise Mark Entry
  const [examConfig, setExamConfig] = useState({
    testName: 'Weekly Unit Test #01',
    subject: 'Physics',
    totalMarks: '100'
  });

  // Score Inputs for All Students (Keyed by Student ID)
  const [batchScores, setBatchScores] = useState({});

  // Fee Payment Modal / Form State
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handleLogout = () => {
    logout();
    navigate('/login?role=receptionist');
  };

  // Fetch all initial data
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [studentsRes, consultRes, feesRes] = await Promise.allSettled([
        api.get('/api/students'),
        api.get('/api/consultations'),
        api.get('/api/fees'),
      ]);

      if (studentsRes.status === 'fulfilled' && studentsRes.value?.success) {
        const studentData = studentsRes.value.data || [];
        setStudents(studentData);

        // Pre-populate attendance map with default 'Present'
        const initialAtt = {};
        studentData.forEach((s) => {
          initialAtt[s.id] = 'Present';
        });
        setAttendanceMap(initialAtt);
      }

      if (consultRes.status === 'fulfilled' && consultRes.value?.success) {
        setConsultations(consultRes.value.data || []);
      }

      if (feesRes.status === 'fulfilled' && feesRes.value?.success) {
        setFeesList(feesRes.value.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch date-specific attendance
  const loadAttendanceForDate = async (dateStr) => {
    try {
      const res = await api.get(`/api/attendance?date=${dateStr}`);
      if (res.success && Array.isArray(res.data)) {
        setAttendanceMap((prev) => {
          const updated = { ...prev };
          res.data.forEach((att) => {
            updated[att.student_id] = att.status;
          });
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to fetch attendance for date:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (attendanceDate) {
      loadAttendanceForDate(attendanceDate);
    }
  }, [attendanceDate]);

  // 1. Handle New Admission (Creating Student Account + Initial Fee Record)
  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Step A: Admit Student
      const studentPayload = {
        name: admissionForm.name.trim(),
        mobileNo: admissionForm.mobileNo.trim(),
        parentName: admissionForm.parentName.trim(),
        parentMobNo: admissionForm.parentMobNo.trim(),
        address: admissionForm.address.trim(),
        collegeName: admissionForm.collegeName.trim(),
        classGrade: admissionForm.classGrade,
        username: admissionForm.username.trim(),
        password: admissionForm.password,
      };

      const admitRes = await api.post('/api/students/admit', studentPayload);
      if (!admitRes.success || !admitRes.data) {
        throw new Error(admitRes.message || 'Failed to enroll student');
      }

      const newStudent = admitRes.data;

      // Step B: Create Fee Record
      const feeAmount = Number(admissionForm.initialTotalFee) || 85000;
      await api.post('/api/fees', {
        studentId: newStudent.id,
        totalAmount: feeAmount,
        dueDate: admissionForm.feeDueDate || '2026-11-30',
      });

      setSuccessMsg(`Student '${admissionForm.name}' enrolled successfully with username '${admissionForm.username}' and assigned course fee of ₹${feeAmount.toLocaleString()}!`);

      // Reset form
      setAdmissionForm({
        name: '',
        mobileNo: '',
        parentName: '',
        parentMobNo: '',
        address: '',
        collegeName: '',
        classGrade: '11th',
        username: '',
        password: '',
        initialTotalFee: '85000',
        feeDueDate: '2026-11-30',
      });

      // Reload data
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Admission failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Attendance Handlers
  const handleSaveAllAttendance = async () => {
    if (students.length === 0) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const attendanceList = students.map((s) => ({
        studentId: s.id,
        status: attendanceMap[s.id] || 'Present',
      }));

      const res = await api.post('/api/attendance', {
        date: attendanceDate,
        attendanceList,
      });

      if (res.success) {
        setSuccessMsg(`Attendance saved successfully for ${students.length} students on ${attendanceDate}!`);
      } else {
        throw new Error(res.message || 'Failed to save attendance');
      }
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendAllAbsentWhatsAppAlerts = () => {
    const absentStudents = students.filter((s) => attendanceMap[s.id] === 'Absent');
    if (absentStudents.length === 0) {
      alert('Great news! No students are marked absent for today.');
      return;
    }

    const confirmSend = window.confirm(
      `Found ${absentStudents.length} absent student(s):\n` +
      absentStudents.map((s) => `• ${s.users?.name || s.name} (${s.class_grade}) - Parent: ${s.parent_mobile_no}`).join('\n') +
      `\n\nDo you want to dispatch WhatsApp alerts to their parents now?`
    );

    if (!confirmSend) return;

    absentStudents.forEach((student, index) => {
      setTimeout(() => {
        const studentName = student.users?.name || student.name;
        const message = encodeURIComponent(
          `*Shri Rajlaxmi Royal Academy of Science, Vita (SRR)*\n\n` +
          `Namaskar ${student.parent_name},\n` +
          `This is to inform you that your ward *${studentName}* (${student.class_grade} Standard) was marked *ABSENT* for lectures today (${attendanceDate}).\n\n` +
          `Please contact reception for academic assistance or leave records.\n` +
          `Office: +91 98220 12345 / +91 94230 56789`
        );
        const phone = (student.parent_mobile_no || '').replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      }, index * 600);
    });
  };

  // 3. Save Marks
  const handleSaveAllMarks = async () => {
    const enteredIds = Object.keys(batchScores).filter((id) => batchScores[id] !== '' && batchScores[id] !== undefined);
    if (enteredIds.length === 0) {
      alert('Please enter marks for at least one student before saving.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const entries = enteredIds.map((id) => ({
        studentId: id,
        marksObtained: Number(batchScores[id]),
      }));

      const res = await api.post('/api/marks', {
        testName: examConfig.testName.trim(),
        subject: examConfig.subject,
        totalMarks: Number(examConfig.totalMarks),
        date: attendanceDate,
        entries,
      });

      if (res.success) {
        setSuccessMsg(`Marks for ${entries.length} student(s) saved successfully for ${examConfig.testName}!`);
        setBatchScores({});
        loadDashboardData();
      } else {
        throw new Error(res.message || 'Failed to save marks');
      }
    } catch (err) {
      setError(err.message || 'Failed to record marks');
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Promotions 11th to 12th
  const handleBulkSwap11to12 = async () => {
    const count11th = students.filter((s) => s.class_grade === '11th').length;
    if (count11th === 0) {
      alert('No 11th standard students found to promote.');
      return;
    }

    if (!window.confirm(`Are you sure you want to promote all (${count11th}) 11th standard students directly to 12th standard? All previous data & records will be retained.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/api/students/swap-11-to-12');
      if (res.success) {
        setSuccessMsg(`Batch promotion completed! ${res.count} students promoted to 12th standard.`);
        loadDashboardData();
      } else {
        throw new Error(res.message || 'Promotion failed');
      }
    } catch (err) {
      setError(err.message || 'Promotion failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSingleSwap = async (id, currentGrade) => {
    const nextGrade = currentGrade === '11th' ? '12th' : '11th';
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/students/${id}`, { classGrade: nextGrade });
      if (res.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update grade');
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Exit & Archive
  const handleRemoveIndividualStudent = async (id, name, classGrade) => {
    if (!window.confirm(`Are you sure you want to exit and remove ${classGrade} student "${name}" from the active academy database? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.delete(`/api/students/${id}`);
      if (res.success) {
        setSuccessMsg(`Student '${name}' (${classGrade}) removed from academy records.`);
        loadDashboardData();
      } else {
        throw new Error(res.message || 'Failed to delete student');
      }
    } catch (err) {
      setError(err.message || 'Removal failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveBulkPassed12thBatch = async () => {
    const count12th = students.filter((s) => s.class_grade === '12th').length;
    if (count12th === 0) {
      alert('No 12th standard students found to remove.');
      return;
    }

    if (!window.confirm(`WARNING: Are you sure you want to archive and remove ALL (${count12th}) completed 12th standard students from the active database? This will clear the passed batch.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/api/students/bulk-archive-12th');
      if (res.success) {
        setSuccessMsg(`Successfully archived and removed ${res.count} completed 12th standard students!`);
        loadDashboardData();
      } else {
        throw new Error(res.message || 'Bulk archive failed');
      }
    } catch (err) {
      setError(err.message || 'Bulk archive failed');
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Record Cash/Manual Fee Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedFeeForPayment) return;

    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const remaining = Number(selectedFeeForPayment.total_amount) - Number(selectedFeeForPayment.paid_amount);
    if (amount > remaining) {
      alert(`Payment amount ₹${amount} exceeds remaining balance of ₹${remaining}`);
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      const res = await api.post(`/api/fees/${selectedFeeForPayment.id}/pay`, {
        amount,
        method: paymentMethod,
      });

      if (res.success) {
        setSuccessMsg(`Installment of ₹${amount.toLocaleString()} (${paymentMethod}) recorded successfully!`);
        setSelectedFeeForPayment(null);
        setPaymentAmount('');
        loadDashboardData();
      } else {
        throw new Error(res.message || 'Payment update failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Student List
  const filteredStudents = students.filter((s) => {
    const studentName = (s.users?.name || s.name || '').toLowerCase();
    const college = (s.college_name || '').toLowerCase();
    const username = (s.users?.username || s.username || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return studentName.includes(term) || college.includes(term) || username.includes(term);
  });

  // Filtered Student List for Exit tab
  const exitFilteredStudents = students.filter((s) => {
    const matchesGrade = exitFilterGrade === 'All' || s.class_grade === exitFilterGrade;
    const studentName = (s.users?.name || s.name || '').toLowerCase();
    const college = (s.college_name || '').toLowerCase();
    const username = (s.users?.username || s.username || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = studentName.includes(term) || college.includes(term) || username.includes(term);
    return matchesGrade && matchesSearch;
  });

  const totalAbsentCount = students.filter((s) => attendanceMap[s.id] === 'Absent').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-sm dark:shadow-slate-950/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
              SRR <span className="text-emerald-600 dark:text-emerald-400">RECEPTION DESK</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400">
              Admission, Attendance & Academic Control
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Front Office ({user?.name || 'Staff'})
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

        {/* Global Feedback Banners */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-rose-500 hover:text-rose-700 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-emerald-600 hover:text-emerald-800 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Spinner Header */}
        {loading && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading academy records...</span>
          </div>
        )}
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200 dark:border-slate-800 pb-3">
          {[
            { id: 'admission', label: 'New Admission Form', icon: UserPlus },
            { id: 'attendance', label: 'Daily Attendance & WhatsApp', icon: CalendarCheck },
            { id: 'marks', label: 'Update Test Marks', icon: Award },
            { id: 'fees', label: 'Student Fees & Payments', icon: CreditCard },
            { id: 'consultation', label: 'Booked Consultations', icon: MessageSquare },
            { id: 'swap', label: '11th to 12th Swap', icon: ArrowRightLeft },
            { id: 'exit', label: 'Student Exit & Batch Archive', icon: UserX },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
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
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Onboarding & Enrollment
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">New Student Admission & Fee Ledger Setup</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Fill in student details, portal credentials, and initialize fee structure.</p>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashashri Kadam"
                    value={admissionForm.name}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Student Mobile No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822123456"
                    value={admissionForm.mobileNo}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, mobileNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Class Grade *</label>
                  <select
                    value={admissionForm.classGrade}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, classGrade: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="11th">11th Standard</option>
                    <option value="12th">12th Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hanmantrao Kadam"
                    value={admissionForm.parentName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Parent Mobile No (WhatsApp Alerts) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 919822123456"
                    value={admissionForm.parentMobNo}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, parentMobNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">College / School Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adarsh College, Vita"
                    value={admissionForm.collegeName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, collegeName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Residential Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shivaji Road, Vita, Dist-Sangli"
                    value={admissionForm.address}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Portal Login Credentials */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Student Portal Login Credentials</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yashashri.srr"
                      value={admissionForm.username}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, username: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={admissionForm.password}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Course Fee Structure Setup */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Course Fee Structure</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Course Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="85000"
                      value={admissionForm.initialTotalFee}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, initialTotalFee: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fee Due Date *</label>
                    <input
                      type="date"
                      required
                      value={admissionForm.feeDueDate}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, feeDueDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Complete Student Admission
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ATTENDANCE LOG & BULK ACTIONS                      */}
        {/* ========================================================= */}
        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Daily Attendance Tracker
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Daily Attendance & WhatsApp Absent Dispatch</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Toggle attendance status below, save the entire batch, and send alerts to absent students with one click.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Date:</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border-none text-xs font-bold bg-transparent focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleSaveAllAttendance}
                  disabled={actionLoading}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 shrink-0"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All Attendance
                </button>

                <button
                  onClick={handleSendAllAbsentWhatsAppAlerts}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-2 shrink-0 ${
                    totalAbsentCount > 0 
                      ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={totalAbsentCount === 0}
                >
                  <Send className="w-4 h-4" /> Send Absent Alerts ({totalAbsentCount})
                </button>
              </div>
            </div>

            {/* Quick Search & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Total Enrolled: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{students.length}</span> | 
                Present: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{students.filter((s) => (attendanceMap[s.id] || 'Present') === 'Present').length}</span> |
                Absent: <span className="text-rose-600 dark:text-rose-400 font-bold">{totalAbsentCount}</span>
              </div>
            </div>

            {/* Student Attendance List */}
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">No students found matching your search.</div>
              ) : (
                filteredStudents.map((student, idx) => {
                  const currentStatus = attendanceMap[student.id] || 'Present';
                  const studentName = student.users?.name || student.name;
                  return (
                    <div 
                      key={student.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        currentStatus === 'Absent' ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</h4>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {student.class_grade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                          <span>Parent: {student.parent_name}</span>
                          <span>•</span>
                          <span>Mob: {student.parent_mobile_no}</span>
                          <span>•</span>
                          <span>{student.college_name}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => setAttendanceMap({ ...attendanceMap, [student.id]: 'Present' })}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              currentStatus === 'Present' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceMap({ ...attendanceMap, [student.id]: 'Absent' })}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              currentStatus === 'Absent' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                            }`}
                          >
                            Absent
                          </button>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          currentStatus === 'Present' 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: UPDATE STUDENT TEST MARKS                          */}
        {/* ========================================================= */}
        {activeTab === 'marks' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Academic Score Entry
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Post-Test Score Updates</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Enter scores for all students below and commit them with "Save All Marks".</p>
              </div>

              <button
                onClick={handleSaveAllMarks}
                disabled={actionLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All Marks
              </button>
            </div>

            {/* Test Configuration Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Test / Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Test #03"
                  value={examConfig.testName}
                  onChange={(e) => setExamConfig({ ...examConfig, testName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Subject</label>
                <select
                  value={examConfig.subject}
                  onChange={(e) => setExamConfig({ ...examConfig, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Total Maximum Marks</label>
                <input
                  type="number"
                  placeholder="100"
                  value={examConfig.totalMarks}
                  onChange={(e) => setExamConfig({ ...examConfig, totalMarks: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-center font-bold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* List of All Students */}
            <div className="space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">No students found.</div>
              ) : (
                filteredStudents.map((student, idx) => {
                  const studentName = student.users?.name || student.name;
                  const recentMarks = student.marks || [];
                  return (
                    <div 
                      key={student.id} 
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</h4>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {student.class_grade}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {recentMarks.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">No previous scores recorded</span>
                          ) : (
                            recentMarks.map((m, mi) => (
                              <span key={mi} className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                                {m.test_name} ({m.subject}): <strong className="text-emerald-700 dark:text-emerald-400">{m.marks_obtained}/{m.total_marks}</strong>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Score:</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={batchScores[student.id] ?? ''}
                            onChange={(e) => setBatchScores({ ...batchScores, [student.id]: e.target.value })}
                            className="w-16 text-center font-bold text-emerald-700 dark:text-emerald-400 text-sm focus:outline-none bg-transparent"
                          />
                          <span className="text-xs text-slate-400">/ {examConfig.totalMarks}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STUDENT FEES & CASH/MANUAL PAYMENTS               */}
        {/* ========================================================= */}
        {activeTab === 'fees' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Fee Accounts Ledger
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Student Fees & Installment Collection</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Review fee structures, pending balances, and record cash/UPI payments from parents.</p>
              </div>

              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Records
              </button>
            </div>

            {/* Record Payment Form Modal if Selected */}
            {selectedFeeForPayment && (
              <div className="p-6 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Record Installment Payment for {selectedFeeForPayment.students?.users?.name || 'Student'}
                    </h3>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Pending Balance: ₹{(Number(selectedFeeForPayment.total_amount) - Number(selectedFeeForPayment.paid_amount)).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFeeForPayment(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel ✕
                  </button>
                </div>

                <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount Received (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="CASH">Cash at Desk</option>
                      <option value="UPI">UPI / Google Pay</option>
                      <option value="CHEQUE">Bank Cheque</option>
                      <option value="MANUAL">Bank Transfer / NEFT</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Confirm Receipt
                  </button>
                </form>
              </div>
            )}

            {/* Fee Ledger Table */}
            <div className="space-y-3">
              {feesList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No fee records assigned yet. Admitting a student will automatically generate a fee record.
                </div>
              ) : (
                feesList.map((fee) => {
                  const studentName = fee.students?.users?.name || 'Student';
                  const studentGrade = fee.students?.class_grade || '11th';
                  const total = Number(fee.total_amount);
                  const paid = Number(fee.paid_amount);
                  const pending = Math.max(0, total - paid);

                  return (
                    <div
                      key={fee.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {studentGrade} Standard
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-amber-50 text-amber-700 border border-amber-300'
                          }`}>
                            {fee.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Total: <strong className="text-slate-800 dark:text-slate-200">₹{total.toLocaleString()}</strong> | 
                          Paid: <strong className="text-emerald-700 dark:text-emerald-400">₹{paid.toLocaleString()}</strong> | 
                          Pending: <strong className="text-amber-700 dark:text-amber-400">₹{pending.toLocaleString()}</strong> |
                          Due: {fee.due_date}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {pending > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedFeeForPayment(fee);
                              setPaymentAmount('');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Record Payment
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Dues Cleared
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CONSULTATION REQUESTS                             */}
        {/* ========================================================= */}
        {activeTab === 'consultation' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Lead Pipeline
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Booked Consultations & Admission Inquiries</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Inquiries submitted by parents/students directly via the public portal's "Book Consultation" form.</p>
            </div>

            {consultations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                No consultation leads recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultations.map((lead) => (
                  <div key={lead.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{lead.student_name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Parent: {lead.parent_name}</span>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                          {lead.stream}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {lead.contact_number} ({lead.email})</p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {lead.address}</p>
                        <p className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5" /> Booked: {new Date(lead.submitted_at).toLocaleDateString()}</p>
                      </div>

                      {lead.message && (
                        <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 italic">
                          "{lead.message}"
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <a
                        href={`tel:${lead.contact_number}`}
                        className="flex-1 py-2 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                      >
                        Call Parent
                      </a>
                      <button
                        onClick={() => {
                          setAdmissionForm({
                            ...admissionForm,
                            name: lead.student_name,
                            parentName: lead.parent_name,
                            mobileNo: lead.contact_number,
                            parentMobNo: lead.contact_number,
                            address: lead.address,
                            classGrade: lead.admission_year?.includes('12') ? '12th' : '11th',
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
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: 11TH TO 12TH ACADEMIC YEAR SWAP                   */}
        {/* ========================================================= */}
        {activeTab === 'swap' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Annual Promotion Workflow
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">11th to 12th Standard Promotion & Data Swap</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Promote students directly from 11th to 12th standard. All existing student marks, attendance profiles, credentials, and parent details are preserved automatically.
              </p>
            </div>

            {/* Bulk Action Notice Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Annual Batch Transition</h3>
                <p className="text-xs text-emerald-100">
                  Ready to upgrade current 11th standard students? You have {students.filter((s) => s.class_grade === '11th').length} student(s) in 11th grade.
                </p>
              </div>
              <button
                onClick={handleBulkSwap11to12}
                disabled={actionLoading}
                className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black transition shadow-md cursor-pointer shrink-0 flex items-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />} Promote All 11th &rarr; 12th
              </button>
            </div>

            {/* Individual Student List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Student Directory Status</h3>
              <div className="space-y-2.5">
                {students.map((student) => {
                  const studentName = student.users?.name || student.name;
                  return (
                    <div key={student.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">College: {student.college_name} • Roll: {student.users?.username || student.username}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                          student.class_grade === '12th' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {student.class_grade} Standard
                        </span>

                        <button
                          onClick={() => handleSingleSwap(student.id, student.class_grade)}
                          className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-700 dark:text-slate-300 hover:text-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Toggle Grade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: STUDENT EXIT & BATCH ARCHIVE                      */}
        {/* ========================================================= */}
        {activeTab === 'exit' && (
          <div className="bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/70 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                  Course Completion & Student Exit
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Student Exit & Batch Archive Management</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Remove individual students who leave in the middle of 11th or 12th, or bulk-archive an entire completed 12th standard batch.
                </p>
              </div>

              <button
                onClick={handleRemoveBulkPassed12thBatch}
                disabled={actionLoading}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-2 shrink-0"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Remove Entire Passed 12th Batch ({students.filter((s) => s.class_grade === '12th').length})
              </button>
            </div>

            {/* Informational Guidance Box */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
              <Archive className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <p className="font-bold">Total Active Roster: {students.length} students (11th: {students.filter((s) => s.class_grade === '11th').length} | 12th: {students.filter((s) => s.class_grade === '12th').length})</p>
                <p>Removing a student completely deregisters their portal login and clears them from daily attendance and test lists.</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student to remove..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Grade Filter Pills */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                  {['All', '11th', '12th'].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setExitFilterGrade(grade)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        exitFilterGrade === grade
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
                      }`}
                    >
                      {grade === 'All' ? 'All Classes' : `${grade} Standard`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Students */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Active Enrolled Students ({exitFilteredStudents.length})
              </h3>
              
              {exitFilteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 text-sm">
                  No matching students found in this category.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {exitFilteredStudents.map((student) => {
                    const studentName = student.users?.name || student.name;
                    return (
                      <div 
                        key={student.id} 
                        className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{studentName}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              student.class_grade === '12th'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                            }`}>
                              {student.class_grade} Standard
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              (User: {student.users?.username || student.username})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            College: {student.college_name} • Parent: {student.parent_name} ({student.parent_mobile_no})
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveIndividualStudent(student.id, studentName, student.class_grade)}
                          className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
                        >
                          <UserX className="w-3.5 h-3.5" /> Exit / Remove Student
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}