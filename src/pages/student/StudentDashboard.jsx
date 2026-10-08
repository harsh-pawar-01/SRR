import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, Calendar, Award, 
  FileText, User, BarChart2, CheckCircle, XCircle, 
  CreditCard, BookOpen, Clock, Phone, MapPin, Building,
  AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [syllabusStandard, setSyllabusStandard] = useState('11th');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // API Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentRecord, setStudentRecord] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [marksRecords, setMarksRecords] = useState([]);
  const [syllabusRecords, setSyllabusRecords] = useState([]);
  const [feeRecord, setFeeRecord] = useState(null);

  // Online Payment State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Handle Logout
  const handleLogout = () => {
    logout();
  };

  // Fetch all student dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [studentRes, attRes, marksRes, feeRes] = await Promise.allSettled([
        api.get('/api/students/me'),
        api.get('/api/attendance'),
        api.get('/api/marks'),
        api.get('/api/fees'),
      ]);

      if (studentRes.status === 'fulfilled' && studentRes.value?.success) {
        setStudentRecord(studentRes.value.data);
        if (studentRes.value.data.class_grade) {
          setSyllabusStandard(studentRes.value.data.class_grade);
        }
      }

      if (attRes.status === 'fulfilled' && attRes.value?.success) {
        setAttendanceRecords(attRes.value.data || []);
      }

      if (marksRes.status === 'fulfilled' && marksRes.value?.success) {
        setMarksRecords(marksRes.value.data || []);
      }

      if (feeRes.status === 'fulfilled' && feeRes.value?.success) {
        const fees = feeRes.value.data || [];
        setFeeRecord(fees.length > 0 ? fees[0] : null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch syllabus when standard changes
  useEffect(() => {
    let isCurrent = true;

    async function fetchSyllabus() {
      try {
        const res = await api.get(`/api/syllabus/${syllabusStandard}`);
        if (isCurrent && res.success) {
          setSyllabusRecords(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load syllabus:', err);
      }
    }

    fetchSyllabus();
    return () => { isCurrent = false; };
  }, [syllabusStandard]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format student profile
  const studentProfile = {
    name: studentRecord?.users?.name || user?.name || 'Student',
    rollNo: studentRecord?.users?.username || user?.username || 'SRR-STUDENT',
    classGrade: studentRecord?.class_grade ? `${studentRecord.class_grade} Standard` : (user?.classGrade ? `${user.classGrade} Standard` : '11th Standard'),
    targetBatch: 'JEE • NEET Integrated Batch',
    mobileNo: studentRecord?.mobile_no || user?.phone || 'Not Registered',
    parentName: studentRecord?.parent_name || 'Guardian Record Pending',
    parentMobNo: studentRecord?.parent_mobile_no || 'Not Registered',
    collegeName: studentRecord?.college_name || 'Academy Student',
    address: studentRecord?.address || 'Vita, Dist. Sangli',
  };

  // Map attendance records
  const formattedAttendance = attendanceRecords.map((item) => {
    const d = new Date(item.date);
    const dayName = isNaN(d.getTime()) ? 'Day' : d.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = isNaN(d.getTime()) ? item.date : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      date: formattedDate,
      day: dayName,
      status: item.status,
      remarks: item.status === 'Present' ? 'Regular Lectures & Doubt Cell' : 'Absence recorded by Reception',
    };
  });

  // Calculate overall attendance stats
  const totalAttendanceDays = formattedAttendance.length;
  const presentDays = formattedAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = totalAttendanceDays > 0 ? ((presentDays / totalAttendanceDays) * 100).toFixed(1) : '100.0';

  // Map test marks records
  const formattedMarks = marksRecords.map((m) => {
    const scoredNum = Number(m.marks_obtained);
    const maxNum = Number(m.total_marks);
    const pct = maxNum > 0 ? ((scoredNum / maxNum) * 100).toFixed(1) : '0';
    return {
      type: `${m.subject} Test`,
      name: m.test_name,
      date: m.date,
      max: `${maxNum} Marks`,
      scored: `${scoredNum} Marks`,
      percentage: `${pct}%`,
      percentageNum: parseFloat(pct),
    };
  });

  const testAverage = formattedMarks.length > 0
    ? (formattedMarks.reduce((acc, curr) => acc + curr.percentageNum, 0) / formattedMarks.length).toFixed(1)
    : '0.0';

  // Format syllabus data
  const formattedSyllabus = syllabusRecords.map((s) => ({
    id: s.id,
    standard: s.class_grade,
    subject: s.subject,
    chapter: s.chapter_name,
    status: 'Completed',
    completedDate: s.completed_at ? new Date(s.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently Completed',
  }));

  const filteredSyllabus = formattedSyllabus.filter((item) => {
    const matchesStandard = item.standard === syllabusStandard;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesStandard && matchesSubject;
  });

  const completedCount = filteredSyllabus.length;
  const progressPercent = completedCount > 0 ? Math.min(100, Math.round((completedCount / (completedCount + 5)) * 100)) : 0;

  // Fee Details
  const totalFee = Number(feeRecord?.total_amount || 0);
  const paidFee = Number(feeRecord?.paid_amount || 0);
  const pendingFee = Math.max(0, totalFee - paidFee);
  const formattedDueDate = feeRecord?.due_date
    ? new Date(feeRecord.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not scheduled';

  const installments = (feeRecord?.fee_payments || []).map((pay, idx) => ({
    sr: idx + 1,
    title: `Installment Payment (${pay.method})`,
    amount: Number(pay.amount),
    paidDate: new Date(pay.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Paid',
  }));

  const feeDetails = {
    standard: `${studentProfile.classGrade} Integrated Batch (2026–27)`,
    totalFee,
    paidFee,
    pendingFee,
    dueDate: formattedDueDate,
    installments,
  };

  const materials = [
    { title: 'Physics Rotational Dynamics Formula Sheet & Short Tricks', type: 'PDF • 4.2 MB', subject: 'Physics' },
    { title: 'Organic Chemistry Name Reactions Visual Decoder Map', type: 'PDF • 8.1 MB', subject: 'Chemistry' },
    { title: 'Coordinate Geometry Master Reference Sheets (IIT-JEE)', type: 'PDF • 6.5 MB', subject: 'Mathematics' },
    { title: 'Genetics & Molecular Biology NCERT High-Yield Diagrams', type: 'PDF • 9.4 MB', subject: 'Biology' },
  ];

  // Dynamically load Razorpay SDK
  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Online Fee Payment via Razorpay
  const handlePayOnline = async () => {
    if (!feeRecord) return;
    const amountToPay = Number(paymentAmount) || pendingFee;
    if (amountToPay <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    if (amountToPay > pendingFee) {
      alert(`Payment cannot exceed pending dues of ₹${pendingFee.toLocaleString()}`);
      return;
    }

    setPaying(true);
    setPaymentSuccessMsg('');

    try {
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Step 1: Create Order
      const orderRes = await api.post(`/api/fees/${feeRecord.id}/create-order`, { amountToPay });
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to create payment order');
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'SRR Academy of Science',
        description: `Fee installment payment for ${studentProfile.name}`,
        order_id: orderId,
        prefill: {
          name: studentProfile.name,
          contact: studentProfile.mobileNo,
        },
        theme: {
          color: '#059669',
        },
        handler: async (response) => {
          try {
            // Step 3: Verify Payment
            const verifyRes = await api.post(`/api/fees/${feeRecord.id}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setPaymentSuccessMsg(`Payment of ₹${amountToPay.toLocaleString()} recorded successfully!`);
              setPaymentAmount('');
              // Refresh fees
              const freshFees = await api.get('/api/fees');
              if (freshFees.success && freshFees.data?.length > 0) {
                setFeeRecord(freshFees.data[0]);
              }
            } else {
              alert(verifyRes.message || 'Payment verification failed');
            }
          } catch (vErr) {
            alert(vErr.message || 'Payment verification failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || 'Failed to initialize payment');
    } finally {
      setPaying(false);
    }
  };

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
              SRR <span className="text-emerald-600 dark:text-emerald-400">STUDENT PORTAL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400">
              Shri Rajlaxmi Royal Academy of Science Vita
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {studentProfile.name} ({studentProfile.rollNo})
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-slate-950/40 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Overview & Profile
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Syllabus Completed
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'attendance' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <Calendar className="w-4 h-4" /> Daily Attendance
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'marks' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <Award className="w-4 h-4" /> Test Marks & Results
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'fees' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Fee Status & Dues
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'materials' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Study Materials
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-3 space-y-6">

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading student records...</span>
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchDashboardData}
                className="px-3 py-1 bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 text-rose-800 dark:text-rose-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW & PROFILE */}
          {!loading && activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  {studentProfile.targetBatch}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Namaskar, {studentProfile.name}!</h1>
                <p className="text-emerald-100 dark:text-emerald-200 text-sm mt-2 max-w-xl">
                  Welcome to your SRR student dashboard. Track your academic standing, chapter completions by faculty, and attendance logs below.
                </p>
              </div>

              {/* Student Information Card */}
              <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-slate-950/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Student Profile & Enrollment Details
                  </h3>
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    Active Student
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">Student Mobile</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {studentProfile.mobileNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">Parent / Guardian Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{studentProfile.parentName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">Parent Mobile (WhatsApp Alert No)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {studentProfile.parentMobNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">College / Junior College</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {studentProfile.collegeName}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">Residential Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {studentProfile.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-slate-950/40">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Overall Attendance</span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">{attendanceRate}%</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 block">
                    {presentDays}/{totalAttendanceDays} sessions recorded
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-slate-950/40">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Latest Test Average</span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">{testAverage}%</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 block">
                    Across {formattedMarks.length} recorded assessments
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-slate-950/40">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Pending Fee Dues</span>
                  <span className={`text-3xl font-black ${pendingFee > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} mt-2 block`}>
                    ₹{pendingFee.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 block">
                    {pendingFee > 0 ? `Due by ${feeDetails.dueDate}` : 'All dues cleared'}
                  </span>
                </div>
              </div>

              {/* Faculty Remarks Card */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Faculty Academic Feedback</span>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium italic">
                  "Maintain consistency in daily attendance and revise weekly test formulas. Academic heads and subject faculty review test analytics regularly."
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold pt-1">— Academic Directorate, SRR Science Academy</span>
              </div>
            </div>
          )}

          {/* TAB 2: SYLLABUS COMPLETED */}
          {!loading && activeTab === 'syllabus' && (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Curriculum Progress
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Syllabus Completion Status</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Track real-time chapter status as marked completed by academy teachers.</p>
                </div>

                {/* Progress summary badge */}
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Chapters Completed</span>
                </div>
              </div>

              {/* Standard & Subject Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Standard:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSyllabusStandard('11th')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        syllabusStandard === '11th' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      11th Standard
                    </button>
                    <button
                      onClick={() => setSyllabusStandard('12th')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        syllabusStandard === '12th' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      12th Standard
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Subject:</span>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-3 pt-2">
                {filteredSyllabus.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No completed chapters recorded yet for {syllabusStandard} ({selectedSubject}).
                  </div>
                ) : (
                  filteredSyllabus.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          item.subject === 'Biology'
                            ? 'text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80'
                            : item.subject === 'Physics'
                            ? 'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80'
                            : item.subject === 'Chemistry'
                            ? 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80'
                            : 'text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80'
                        }`}>
                          {item.subject}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.chapter}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            Completed on {item.completedDate}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Completed
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY ATTENDANCE */}
          {!loading && activeTab === 'attendance' && (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Attendance Tracker
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Daily Attendance Record</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Review day-to-day presence at Vita campus classes and CBT labs.</p>
              </div>

              {formattedAttendance.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No attendance records logged for your account yet. Daily records will appear here as marked by reception.
                </div>
              ) : (
                <div className="space-y-3">
                  {formattedAttendance.map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-xs">
                          {record.date}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">{record.day}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{record.remarks}</span>
                        </div>
                      </div>
                      <div>
                        {record.status === 'Present' ? (
                          <span className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Present
                          </span>
                        ) : (
                          <span className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Absent
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEST MARKS & RESULTS */}
          {!loading && activeTab === 'marks' && (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Examination Performance
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Weekly Tests, Mock Exams & Scores</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Comprehensive scorecards covering weekly entrance tests and faculty evaluations.</p>
              </div>

              {formattedMarks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No exam scorecards recorded yet. Test marks will display here once evaluated by your faculty.
                </div>
              ) : (
                <div className="space-y-4">
                  {formattedMarks.map((test, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded">
                          {test.type}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{test.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Exam Date: {test.date} | Max: {test.max}</span>
                      </div>
                      <div className="text-right bg-white dark:bg-slate-850 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 px-5 py-3 rounded-xl shadow-sm">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Marks Scored</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{test.scored}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-0.5">{test.percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FEE STATUS & DUES */}
          {!loading && activeTab === 'fees' && (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Financial Ledger
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Fee Status & Academic Dues</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feeDetails.standard}</p>
              </div>

              {paymentSuccessMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{paymentSuccessMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Course Fee</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">₹{feeDetails.totalFee.toLocaleString()}</span>
                </div>
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">Total Paid Amount</span>
                  <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">₹{feeDetails.paidFee.toLocaleString()}</span>
                </div>
                <div className="p-6 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">Pending Balance Due</span>
                  <span className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1 block">₹{feeDetails.pendingFee.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold mt-1 block">
                    {feeDetails.pendingFee > 0 ? `Due by ${feeDetails.dueDate}` : 'Fully Settled'}
                  </span>
                </div>
              </div>

              {/* Online Razorpay Payment Box if dues remain */}
              {feeDetails.pendingFee > 0 && (
                <div className="p-6 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">Pay Pending Fee Online</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 block">Secure instant installment payment via Razorpay (UPI, Google Pay, Cards, Net Banking)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`Max ₹${feeDetails.pendingFee}`}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-36 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handlePayOnline}
                      disabled={paying}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-emerald-600/20"
                    >
                      {paying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                      Pay Now
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Installment Breakdown & Receipt History</h3>
                {feeDetails.installments.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No payment transactions recorded yet. Completed installments will appear here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feeDetails.installments.map((inst) => (
                      <div key={inst.sr} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                            0{inst.sr}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white block">{inst.title}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Recorded Payment Date: {inst.paidDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 dark:text-white block">₹{inst.amount.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 inline-block mt-1">Paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: STUDY MATERIALS */}
          {!loading && activeTab === 'materials' && (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Resource Library
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Study Materials & Formula Sheets</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {materials.map((m, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        m.subject === 'Biology'
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                          : m.subject === 'Physics'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                          : m.subject === 'Chemistry'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                      }`}>
                        {m.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">{m.type}</span>
                    </div>
                    <button
                      onClick={() => alert('Official SRR study module: downloading in progress.')}
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