import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, BookOpen, MessageSquare, 
  User, BarChart2, CheckCircle, Clock, PlusCircle, 
  Send, Trash2, Edit3, Search, Check, X,
  Phone, MapPin, Award, Camera, CalendarCheck, 
  DollarSign, FileText, CheckCircle2, AlertCircle, XCircle,
  Users, Loader2, RefreshCw, Save
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function TeacherDashboard({ 
  fixedSubject = 'Physics', 
  facultyName = 'Prof. R. C. Patil (RC Sir)' 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Enforce teacher's assigned subject if role is teacher, otherwise honor route prop (admin review mode)
  const activeSubject = (user?.role === 'teacher' && user?.subject) ? user.subject : fixedSubject;

  // Faculty defaults tailored to subject
  const facultyDefaults = {
    Physics: {
      name: 'Prof. R. C. Patil (RC Sir)',
      mobileNo: '+91 98220 54321',
      qualification: 'M.Sc. Physics (Gold Medalist), B.Ed. (15+ Yrs Exp)',
      address: 'Shivaji Road, Near Royal Complex, Vita, Dist. Sangli - 415311',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
    Chemistry: {
      name: 'Dr. Sandeep Kulkarni',
      mobileNo: '+91 98220 54322',
      qualification: 'Ph.D. Organic Chemistry, CSIR-NET (18+ Yrs Exp)',
      address: 'Station Road, Opp. Market Yard, Vita, Dist. Sangli - 415311',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    },
    Mathematics: {
      name: 'Prof. Vijay Chavan',
      mobileNo: '+91 98220 54323',
      qualification: 'M.Sc. Mathematics, GATE Scholar (12+ Yrs Exp)',
      address: 'Mayani Road, Near ST Stand, Vita, Dist. Sangli - 415311',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    },
    Biology: {
      name: 'Dr. Anjali Deshmukh',
      mobileNo: '+91 98220 54324',
      qualification: 'M.B.B.S., M.D., NEET Botany/Zoology Specialist (14+ Yrs Exp)',
      address: 'Karad Road, Behind Civil Hospital, Vita, Dist. Sangli - 415311',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
    }
  };

  const defaultMeta = facultyDefaults[activeSubject] || facultyDefaults.Physics;

  // Teacher Profile Information State
  const [teacherProfile, setTeacherProfile] = useState({
    name: user?.name || facultyName || defaultMeta.name,
    mobileNo: user?.phone || defaultMeta.mobileNo,
    qualification: defaultMeta.qualification,
    address: defaultMeta.address,
    photoUrl: defaultMeta.photoUrl
  });

  // Loading & Feedback States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Chapter Input States
  const [newChapter11, setNewChapter11] = useState('');
  const [newChapter12, setNewChapter12] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 11th & 12th Standard Syllabus Data (from live API)
  const [syllabus11th, setSyllabus11th] = useState([]);
  const [syllabus12th, setSyllabus12th] = useState([]);

  // Student Rosters & Subject Marks
  const [students, setStudents] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('All');

  // Marks Entry Form
  const [marksForm, setMarksForm] = useState({
    testName: 'Weekly Unit Test #01',
    studentId: '',
    totalMarks: '100',
    marksObtained: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Student Reviews State
  const [studentReviews, setStudentReviews] = useState([
    { 
      id: 1, 
      studentName: 'Atharva Patil (Roll #JEE-202)', 
      subject: activeSubject, 
      review: `Demonstrating solid conceptual grasp in rotational dynamics and numerical problem-solving.`, 
      date: 'Oct 24, 2026' 
    },
    { 
      id: 2, 
      studentName: 'Snehal More (Roll #NEET-105)', 
      subject: activeSubject, 
      review: `Good understanding of ray optics; requires more formula practice in thermodynamics.`, 
      date: 'Oct 26, 2026' 
    }
  ]);
  const [reviewStudent, setReviewStudent] = useState('');
  const [reviewText, setReviewText] = useState('');

  // Leave Applications State
  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 'l1',
      leaveType: 'Academic / Conference Leave',
      startDate: '2026-11-02',
      endDate: '2026-11-04',
      days: 3,
      reason: `Attending National ${activeSubject} Teachers Conference in Pune.`,
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

  // Salary & Payroll Records State
  const [salaryRecords] = useState([
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

  // Load live data from Supabase backend for active subject
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [s11Res, s12Res, studentsRes, marksRes] = await Promise.allSettled([
        api.get(`/api/syllabus/11th?subject=${encodeURIComponent(activeSubject)}`),
        api.get(`/api/syllabus/12th?subject=${encodeURIComponent(activeSubject)}`),
        api.get('/api/students'),
        api.get(`/api/marks?subject=${encodeURIComponent(activeSubject)}`),
      ]);

      if (s11Res.status === 'fulfilled' && s11Res.value?.success) {
        setSyllabus11th(
          (s11Res.value.data || []).map((ch) => ({
            id: ch.id,
            chapter: ch.chapter_name,
            status: 'Completed',
            completed_at: ch.completed_at,
          }))
        );
      }

      if (s12Res.status === 'fulfilled' && s12Res.value?.success) {
        setSyllabus12th(
          (s12Res.value.data || []).map((ch) => ({
            id: ch.id,
            chapter: ch.chapter_name,
            status: 'Completed',
            completed_at: ch.completed_at,
          }))
        );
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value?.success) {
        const studentList = studentsRes.value.data || [];
        setStudents(studentList);
        if (studentList.length > 0) {
          setMarksForm((prev) => ({
            ...prev,
            studentId: prev.studentId || studentList[0].id,
          }));
          setReviewStudent(
            `${studentList[0].users?.name || studentList[0].name} (${studentList[0].class_grade})`
          );
        }
      }

      if (marksRes.status === 'fulfilled' && marksRes.value?.success) {
        setSubjectMarks(marksRes.value.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load teacher workspace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeSubject]);

  // Update profile if auth user loaded
  useEffect(() => {
    if (user) {
      setTeacherProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        mobileNo: user.phone || prev.mobileNo,
      }));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login?role=teacher');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTeacherProfile((prev) => ({ ...prev, photoUrl: imageUrl }));
    }
  };

  // 11th Syllabus Handlers
  const handleAddChapter11 = async (e) => {
    e.preventDefault();
    if (!newChapter11.trim()) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.post('/api/syllabus', {
        classGrade: '11th',
        subject: activeSubject,
        chapterName: newChapter11.trim(),
      });
      if (res.success && res.data) {
        setSyllabus11th((prev) => [
          ...prev,
          {
            id: res.data.id,
            chapter: res.data.chapter_name,
            status: 'Completed',
            completed_at: res.data.completed_at,
          },
        ]);
        setNewChapter11('');
        setSuccessMsg(`Chapter "${res.data.chapter_name}" added to 11th ${activeSubject} syllabus!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to add 11th chapter');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChapter11 = async (id) => {
    if (!window.confirm(`Are you sure you want to remove this chapter from 11th ${activeSubject} syllabus?`)) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/api/syllabus/${id}`);
      if (res.success) {
        setSyllabus11th((prev) => prev.filter((item) => item.id !== id));
        setSuccessMsg('Chapter removed from 11th syllabus.');
      }
    } catch (err) {
      setError(err.message || 'Failed to remove chapter');
    } finally {
      setActionLoading(false);
    }
  };

  // 12th Syllabus Handlers
  const handleAddChapter12 = async (e) => {
    e.preventDefault();
    if (!newChapter12.trim()) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.post('/api/syllabus', {
        classGrade: '12th',
        subject: activeSubject,
        chapterName: newChapter12.trim(),
      });
      if (res.success && res.data) {
        setSyllabus12th((prev) => [
          ...prev,
          {
            id: res.data.id,
            chapter: res.data.chapter_name,
            status: 'Completed',
            completed_at: res.data.completed_at,
          },
        ]);
        setNewChapter12('');
        setSuccessMsg(`Chapter "${res.data.chapter_name}" added to 12th ${activeSubject} syllabus!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to add 12th chapter');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChapter12 = async (id) => {
    if (!window.confirm(`Are you sure you want to remove this chapter from 12th ${activeSubject} syllabus?`)) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/api/syllabus/${id}`);
      if (res.success) {
        setSyllabus12th((prev) => prev.filter((item) => item.id !== id));
        setSuccessMsg('Chapter removed from 12th syllabus.');
      }
    } catch (err) {
      setError(err.message || 'Failed to remove chapter');
    } finally {
      setActionLoading(false);
    }
  };

  // Marks Entry Handler
  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!marksForm.studentId) {
      setError('Please select a student to enter marks.');
      return;
    }
    if (Number(marksForm.marksObtained) > Number(marksForm.totalMarks)) {
      setError(`Marks obtained (${marksForm.marksObtained}) cannot exceed total marks (${marksForm.totalMarks}).`);
      return;
    }
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.post('/api/marks', {
        testName: marksForm.testName.trim(),
        subject: activeSubject,
        totalMarks: Number(marksForm.totalMarks),
        marksObtained: Number(marksForm.marksObtained),
        studentId: marksForm.studentId,
        date: marksForm.date || new Date().toISOString().split('T')[0],
      });
      if (res.success) {
        const studentObj = students.find((s) => s.id === marksForm.studentId);
        const sName = studentObj?.users?.name || studentObj?.name || 'Student';
        setSuccessMsg(`Marks (${marksForm.marksObtained}/${marksForm.totalMarks}) recorded for ${sName} in ${activeSubject}!`);
        setMarksForm((prev) => ({
          ...prev,
          marksObtained: '',
        }));
        // Reload marks for subject
        const mRes = await api.get(`/api/marks?subject=${encodeURIComponent(activeSubject)}`);
        if (mRes.success) setSubjectMarks(mRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to record marks');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMark = async (markId) => {
    if (!window.confirm(`Are you sure you want to delete this test score entry?`)) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/api/marks/${markId}`);
      if (res.success) {
        setSubjectMarks((prev) => prev.filter((m) => m.id !== markId));
        setSuccessMsg('Test mark entry deleted successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete mark');
    } finally {
      setActionLoading(false);
    }
  };

  // Student Reviews
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const newRev = {
      id: Date.now(),
      studentName: reviewStudent,
      subject: activeSubject,
      review: reviewText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setStudentReviews((prev) => [newRev, ...prev]);
    setReviewText('');
    setSuccessMsg('Academic feedback note posted successfully.');
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
    setSuccessMsg('Leave application submitted to Director successfully!');
    setLeaveForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '' });
  };

  // Calculations
  const completed11th = syllabus11th.length;
  const target11th = Math.max(completed11th, 16);
  const progress11th = target11th > 0 ? Math.round((completed11th / target11th) * 100) : 0;

  const completed12th = syllabus12th.length;
  const target12th = Math.max(completed12th, 16);
  const progress12th = target12th > 0 ? Math.round((completed12th / target12th) * 100) : 0;

  const filtered11th = syllabus11th.filter((item) => 
    item.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filtered12th = syllabus12th.filter((item) => 
    item.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter((s) => {
    const matchesGrade = studentGradeFilter === 'All' || s.class_grade === studentGradeFilter;
    const nameMatch = (s.users?.name || s.name || '').toLowerCase().includes(studentSearch.toLowerCase());
    const rollMatch = (s.users?.username || '').toLowerCase().includes(studentSearch.toLowerCase());
    const collegeMatch = (s.college_name || '').toLowerCase().includes(studentSearch.toLowerCase());
    return matchesGrade && (nameMatch || rollMatch || collegeMatch);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading Department of {activeSubject} Portal...</span>
        </div>
      </div>
    );
  }

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
              SRR <span className="text-emerald-600 dark:text-emerald-400">{activeSubject.toUpperCase()} PORTAL</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400">
              Department of {activeSubject}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            title="Refresh portal records"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <img 
              src={teacherProfile.photoUrl} 
              alt={teacherProfile.name}
              className="w-6 h-6 rounded-full object-cover border border-emerald-400"
            />
            <span>{teacherProfile.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Content */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1.5">
            <button
              onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Faculty Overview
            </button>
            <button
              onClick={() => { setActiveTab('syllabus11'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus11' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> 11th Syllabus
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'syllabus11' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {progress11th}%
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('syllabus12'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus12' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> 12th Syllabus
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'syllabus12' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {progress12th}%
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('reviews'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Students & Marks
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'reviews' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {students.length}
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('leaves'); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'leaves' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <span className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" /> Leave Applications
              </span>
              {leaveHistory.some((l) => l.status === 'Pending') && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('salary'); setSearchTerm(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'salary' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Salary & Payroll
            </button>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-4 text-xs space-y-2 text-emerald-900 dark:text-emerald-200">
            <span className="font-bold uppercase tracking-wider block text-emerald-700 dark:text-emerald-400">Department Overview</span>
            <div className="flex justify-between">
              <span>Total Enrolled Students:</span>
              <span className="font-bold text-slate-900 dark:text-white">{students.length}</span>
            </div>
            <div className="flex justify-between">
              <span>11th {activeSubject} Chapters:</span>
              <span className="font-bold text-slate-900 dark:text-white">{syllabus11th.length}</span>
            </div>
            <div className="flex justify-between">
              <span>12th {activeSubject} Chapters:</span>
              <span className="font-bold text-slate-900 dark:text-white">{syllabus12th.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tests Evaluated:</span>
              <span className="font-bold text-slate-900 dark:text-white">{subjectMarks.length} Records</span>
            </div>
            <div className="flex justify-between">
              <span>October Salary:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Credited (₹75,000)</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">

          {/* Feedback Banners */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-between text-rose-800 dark:text-rose-200 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
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
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Green Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <span className="bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  Department of {activeSubject} Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome, {teacherProfile.name}!</h1>
                <p className="text-emerald-100 text-sm mt-2 max-w-xl">
                  Manage syllabus milestones for {activeSubject}, record student examination marks, review enrolled batch rosters, and oversee leave requests.
                </p>
              </div>

              {/* TEACHER PROFILE & PHOTO CARD */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Faculty Profile Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Official teacher contact and credential details</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full">
                    {activeSubject} Department Head
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar with Upload */}
                  <div className="relative group shrink-0">
                    <img 
                      src={teacherProfile.photoUrl} 
                      alt={teacherProfile.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900 shadow-md"
                    />
                    <label 
                      htmlFor="teacher-photo-upload" 
                      className="absolute bottom-1 right-1 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg cursor-pointer transition border-2 border-white dark:border-slate-900"
                      title="Update Avatar"
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
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Full Name
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{teacherProfile.name}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Mobile Number
                      </span>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{teacherProfile.mobileNo}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Assigned Subject & Degree
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{teacherProfile.qualification}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Academic Campus
                      </span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{teacherProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">11th {activeSubject} Tracker</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      {progress11th}% Completed
                    </span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white block">
                    {completed11th} <span className="text-sm font-medium text-slate-400">Chapters recorded</span>
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progress11th)}%` }}></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('syllabus11')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition cursor-pointer inline-flex items-center gap-1 pt-1"
                  >
                    Manage 11th Syllabus &rarr;
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">12th {activeSubject} Tracker</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      {progress12th}% Completed
                    </span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white block">
                    {completed12th} <span className="text-sm font-medium text-slate-400">Chapters recorded</span>
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, progress12th)}%` }}></div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('syllabus12')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition cursor-pointer inline-flex items-center gap-1 pt-1"
                  >
                    Manage 12th Syllabus &rarr;
                  </button>
                </div>
              </div>

              {/* Quick Status Bar for Salary & Recent Leave */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">Monthly Compensation</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">October 2026: ₹75,000</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Credited on Oct 01, 2026</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('salary')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    View Slip
                  </button>
                </div>

                <div className="p-5 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Pending Leave Application</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">1 Day Casual Leave</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Scheduled for Nov 12 • Under Review</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('leaves')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 11TH SYLLABUS TRACKER */}
          {activeTab === 'syllabus11' && (
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    11th Standard • {activeSubject}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{activeSubject} Syllabus Progress</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                    Add newly taught chapters to live portal syllabus or remove incorrect entries (isolated strictly to {activeSubject}).
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{syllabus11th.length}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Completed Chapters</span>
                </div>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter11} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Add new 11th ${activeSubject} completed chapter title...`}
                  value={newChapter11}
                  onChange={(e) => setNewChapter11(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />} Add Chapter
                </button>
              </form>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter recorded chapters by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Chapters List */}
              <div className="space-y-2.5 pt-2">
                {filtered11th.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No chapters recorded yet for 11th {activeSubject}. Use the form above to record completed units.
                  </div>
                ) : (
                  filtered11th.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        <div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">
                            {item.chapter}
                          </span>
                          {item.completed_at && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                              Recorded on {new Date(item.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 bg-emerald-600 text-white border border-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>

                        <button
                          onClick={() => handleDeleteChapter11(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
                          title="Remove Chapter"
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
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    12th Standard • {activeSubject}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{activeSubject} Syllabus Progress</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                    Track final board and entrance syllabus units completed by the department.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{syllabus12th.length}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Completed Chapters</span>
                </div>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter12} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Add new 12th ${activeSubject} completed chapter title...`}
                  value={newChapter12}
                  onChange={(e) => setNewChapter12(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />} Add Chapter
                </button>
              </form>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter recorded chapters by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Chapters List */}
              <div className="space-y-2.5 pt-2">
                {filtered12th.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                    No chapters recorded yet for 12th {activeSubject}. Use the form above to record completed units.
                  </div>
                ) : (
                  filtered12th.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                        <div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">
                            {item.chapter}
                          </span>
                          {item.completed_at && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                              Recorded on {new Date(item.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 bg-emerald-600 text-white border border-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>

                        <button
                          onClick={() => handleDeleteChapter12(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
                          title="Remove Chapter"
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

          {/* TAB 4: STUDENTS, MARKS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* SECTION 1: MARKS ENTRY FORM (FOR OWN SUBJECT ONLY) */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Subject Marks Evaluation
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {activeSubject} Test Marks Entry
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Enter examination or periodic unit test scores for students in {activeSubject}. Enforced by subject permission.
                  </p>
                </div>

                <form onSubmit={handleSaveMarks} className="space-y-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Test Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Weekly Unit Test #01"
                        value={marksForm.testName}
                        onChange={(e) => setMarksForm({ ...marksForm, testName: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Subject</label>
                      <input
                        type="text"
                        disabled
                        value={`${activeSubject} (Assigned)`}
                        className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Total Marks</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={marksForm.totalMarks}
                        onChange={(e) => setMarksForm({ ...marksForm, totalMarks: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Test Date</label>
                      <input
                        type="date"
                        required
                        value={marksForm.date}
                        onChange={(e) => setMarksForm({ ...marksForm, date: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Select Enrolled Student</label>
                      <select
                        value={marksForm.studentId}
                        onChange={(e) => setMarksForm({ ...marksForm, studentId: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      >
                        {students.length === 0 ? (
                          <option value="">No students enrolled yet</option>
                        ) : (
                          students.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.users?.name || s.name} ({s.class_grade} • Roll #{s.users?.username}) — {s.college_name || 'Academy'}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                        Marks Obtained (Max: {marksForm.totalMarks})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={marksForm.totalMarks}
                        required
                        placeholder="e.g. 88"
                        value={marksForm.marksObtained}
                        onChange={(e) => setMarksForm({ ...marksForm, marksObtained: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={actionLoading || students.length === 0}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Test Marks
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 2: ENROLLED STUDENTS LIST */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      Roster Directory
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Enrolled Student Lists</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                      View all students, their target standard, college affiliation, and quick action to log marks.
                    </p>
                  </div>

                  {/* Standard Filter Pills */}
                  <div className="flex gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['All', '11th', '12th'].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setStudentGradeFilter(grade)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          studentGradeFilter === grade
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                        }`}
                      >
                        {grade === 'All' ? 'All Classes' : `${grade} Standard`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students by name, roll number, or junior college..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Student & Roll No</th>
                        <th className="py-3 px-3">Class</th>
                        <th className="py-3 px-3">College / Institute</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                            No students found matching current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-3">
                              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                                {st.users?.name || st.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                #{st.users?.username || 'ID: ' + st.id.slice(0, 8)}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-md font-bold text-[11px]">
                                {st.class_grade}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                              {st.college_name || 'Shri Rajlaxmi Academy'}
                            </td>
                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                              {st.mobile_no || st.parent_mobile_no || 'N/A'}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  setMarksForm((prev) => ({ ...prev, studentId: st.id }));
                                  setReviewStudent(`${st.users?.name || st.name} (${st.class_grade})`);
                                  window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                Enter Marks
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: RECENT TEST MARKS RECORDED IN OWN SUBJECT */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Recorded {activeSubject} Test Scores ({subjectMarks.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recent evaluations saved in system for {activeSubject}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Subject Isolated
                  </span>
                </div>

                <div className="space-y-2.5">
                  {subjectMarks.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                      No marks recorded yet for {activeSubject}. Use the form above to record test performances.
                    </div>
                  ) : (
                    subjectMarks.map((mk) => {
                      const pct = mk.total_marks > 0 ? Math.round((mk.marks_obtained / mk.total_marks) * 100) : 0;
                      return (
                        <div
                          key={mk.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{mk.test_name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                                {mk.subject}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Student: {mk.students?.users?.name || 'Student'} ({mk.students?.class_grade || '11th/12th'} • #{mk.students?.users?.username || 'Roll'})
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">Date: {mk.date}</p>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            <div className="text-right">
                              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                                {mk.marks_obtained} / {mk.total_marks}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-semibold">{pct}% Score</span>
                            </div>
                            <button
                              onClick={() => handleDeleteMark(mk.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition cursor-pointer"
                              title="Delete Mark Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SECTION 4: STUDENT ACADEMIC FEEDBACK / REVIEWS */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Student Feedback
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{activeSubject} Performance Remarks</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Post individual academic feedback and improvement notes visible to students.</p>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Select Student</label>
                    <select
                      value={reviewStudent}
                      onChange={(e) => setReviewStudent(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={`${st.users?.name || st.name} (${st.class_grade} • #${st.users?.username})`}>
                          {st.users?.name || st.name} ({st.class_grade} • #{st.users?.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">{activeSubject} Performance Review / Remarks</label>
                    <textarea
                      rows="3"
                      required
                      placeholder={`Write detailed feedback for ${reviewStudent || 'student'} in ${activeSubject}...`}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
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
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Evaluations ({studentReviews.length})</h3>
                  <div className="space-y-3">
                    {studentReviews.map((rev) => (
                      <div key={rev.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                            {rev.subject} — {rev.studentName}
                          </span>
                          <span className="text-slate-400 font-medium">{rev.date}</span>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{rev.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: LEAVE APPLICATION & TRACKER */}
          {activeTab === 'leaves' && (
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Staff Leave Portal
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Faculty Leave Application</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Submit planned absence requests directly to Director KP Sir for authorization.</p>
              </div>

              {/* Leave Application Form */}
              <form onSubmit={handleLeaveSubmit} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">New Leave Request</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Leave Category</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    >
                      <option value="Casual Leave">Casual Leave (CL)</option>
                      <option value="Medical Leave">Medical Leave (ML)</option>
                      <option value="Academic / Conference Leave">Academic / Conference Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Start Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">End Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Reason for Leave *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Provide details about the absence (e.g. personal, medical, or academic training)..."
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
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
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Your Leave History & Approvals</h3>
                <div className="space-y-3">
                  {leaveHistory.map((leave) => (
                    <div key={leave.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{leave.leaveType}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                            {leave.days} Day(s)
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Period: {leave.startDate} to {leave.endDate}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{leave.reason}"</p>
                        <p className="text-[11px] text-slate-400 pt-0.5">Applied: {leave.appliedOn} • Note: {leave.adminRemark}</p>
                      </div>

                      <div>
                        {leave.status === 'Approved' ? (
                          <span className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
                          </span>
                        ) : leave.status === 'Pending' ? (
                          <span className="px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Approval
                          </span>
                        ) : (
                          <span className="px-3.5 py-1.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
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

          {/* TAB 6: SALARY & PAYROLL LEDGER */}
          {activeTab === 'salary' && (
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Compensation & Payroll
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Faculty Monthly Salary Record</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Monthly institutional compensation disbursed via Bank Transfer / NEFT.</p>
                </div>

                <div className="text-right bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-5 py-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Gross Package</span>
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300">₹75,000 / mo</span>
                </div>
              </div>

              {/* Monthly Slips Ledger */}
              <div className="space-y-3">
                {salaryRecords.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.month}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Credited' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Basic: ₹{item.basicSalary.toLocaleString()} • Allowance: ₹{item.allowance.toLocaleString()} • Deductions: ₹{item.deductions}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Status Date: {item.creditDate} • Ref: {item.referenceId}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Net Credited</span>
                        <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">₹{item.netSalary.toLocaleString()}</span>
                      </div>

                      {item.slipAvailable ? (
                        <button
                          onClick={() => alert(`Downloading official Salary Slip for ${item.month} for ${teacherProfile.name}...`)}
                          className="px-3.5 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
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