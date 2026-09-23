import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LogOut, BookOpen, MessageSquare, 
  User, BarChart2, CheckCircle, Clock, PlusCircle, Send 
} from 'lucide-react';

export default function TeacherDashboard({ fixedSubject = 'Physics', facultyName = 'Prof. R. C. Patil (RC Sir)' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Manual Chapter Input States
  const [newChapter11, setNewChapter11] = useState('');
  const [newChapter12, setNewChapter12] = useState('');

  // Initial syllabus data locked to the given fixedSubject
  const [syllabus11th, setSyllabus11th] = useState([
    { id: 1, chapter: `Introduction & Fundamental Concepts of ${fixedSubject}`, status: 'Completed' },
    { id: 2, chapter: `Core Principles & Laws in ${fixedSubject}`, status: 'Pending' }
  ]);

  const [syllabus12th, setSyllabus12th] = useState([
    { id: 1, chapter: `Advanced Applications of ${fixedSubject}`, status: 'Completed' },
    { id: 2, chapter: `Board & Entrance Mastery in ${fixedSubject}`, status: 'Pending' }
  ]);

  // Student Reviews State
  const [studentReviews, setStudentReviews] = useState([
    { id: 1, studentName: 'Atharva Patil (Roll #JEE-202)', subject: fixedSubject, review: `Demonstrating solid understanding of ${fixedSubject} numerical concepts.`, date: 'Oct 24, 2026' }
  ]);

  const [reviewStudent, setReviewStudent] = useState('Atharva Patil (Roll #JEE-202)');
  const [reviewText, setReviewText] = useState('');

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleStatus11th = (id) => {
    setSyllabus11th(syllabus11th.map(item => 
      item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
    ));
  };

  const toggleStatus12th = (id) => {
    setSyllabus12th(syllabus12th.map(item => 
      item.id === id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
    ));
  };

  const handleAddChapter11 = (e) => {
    e.preventDefault();
    if (!newChapter11.trim()) return;
    const newEntry = {
      id: syllabus11th.length + 1,
      chapter: newChapter11,
      status: 'Pending' // Default status is Pending
    };
    setSyllabus11th([...syllabus11th, newEntry]);
    setNewChapter11('');
  };

  const handleAddChapter12 = (e) => {
    e.preventDefault();
    if (!newChapter12.trim()) return;
    const newEntry = {
      id: syllabus12th.length + 1,
      chapter: newChapter12,
      status: 'Pending' // Default status is Pending
    };
    setSyllabus12th([...syllabus12th, newEntry]);
    setNewChapter12('');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const newRev = {
      id: studentReviews.length + 1,
      studentName: reviewStudent,
      subject: fixedSubject,
      review: reviewText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setStudentReviews([newRev, ...studentReviews]);
    setReviewText('');
  };

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
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">Department of {fixedSubject}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
            <User className="w-3.5 h-3.5 text-emerald-600" /> {facultyName} ({fixedSubject} HOD)
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
              <BarChart2 className="w-4 h-4" /> Faculty Overview
            </button>
            <button
              onClick={() => setActiveTab('syllabus11')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus11' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 11th Syllabus Tracker
            </button>
            <button
              onClick={() => setActiveTab('syllabus12')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'syllabus12' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 12th Syllabus Tracker
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'reviews' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Student Reviews
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
                  Department of {fixedSubject} Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">Welcome, {facultyName.split(' ')[0]} Sir!</h1>
                <p className="text-emerald-100 text-sm mt-2 max-w-xl">
                  You are logged into the secure {fixedSubject} department portal. Manage your 11th and 12th curriculum chapters and publish student performance reviews.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">11th {fixedSubject} Progress</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">
                    {syllabus11th.filter(s => s.status === 'Completed').length} / {syllabus11th.length} Completed
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Managed by {facultyName}</span>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 block">12th {fixedSubject} Progress</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">
                    {syllabus12th.filter(s => s.status === 'Completed').length} / {syllabus12th.length} Completed
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Managed by {facultyName}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 11TH SYLLABUS TRACKER */}
          {activeTab === 'syllabus11' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {fixedSubject} Curriculum
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">11th Standard {fixedSubject} Chapters</h2>
                <p className="text-slate-600 text-sm">Add chapters manually (default status is Pending) and mark them completed as you finish teaching.</p>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter11} className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder={`Enter new 11th ${fixedSubject} chapter name...`}
                  value={newChapter11}
                  onChange={(e) => setNewChapter11(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Add Chapter
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {syllabus11th.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">{fixedSubject}</span>
                      <span className="text-sm font-bold text-slate-900">{item.chapter}</span>
                    </div>
                    <div>
                      {item.status === 'Completed' ? (
                        <button
                          onClick={() => toggleStatus11th(item.id)}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-emerald-100 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus11th(item.id)}
                          className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-amber-100 transition"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 12TH SYLLABUS TRACKER */}
          {activeTab === 'syllabus12' && (
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {fixedSubject} Curriculum
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">12th Standard {fixedSubject} Chapters</h2>
                <p className="text-slate-600 text-sm">Add chapters manually (default status is Pending) and mark them completed as you finish teaching.</p>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter12} className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder={`Enter new 12th ${fixedSubject} chapter name...`}
                  value={newChapter12}
                  onChange={(e) => setNewChapter12(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Add Chapter
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {syllabus12th.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">{fixedSubject}</span>
                      <span className="text-sm font-bold text-slate-900">{item.chapter}</span>
                    </div>
                    <div>
                      {item.status === 'Completed' ? (
                        <button
                          onClick={() => toggleStatus12th(item.id)}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-emerald-100 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus12th(item.id)}
                          className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-amber-100 transition"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Student Evaluations
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{fixedSubject} Performance Reviews</h2>
                  <p className="text-slate-600 text-sm">Publish qualitative feedback and remarks for specific students in {fixedSubject}.</p>
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
                      <option value="Snehal Patil (Roll #NEET-105)">Snehal Patil (Roll #NEET-105)</option>
                      <option value="Rohan Deshmukh (Roll #CET-310)">Rohan Deshmukh (Roll #CET-310)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-700">{fixedSubject} Performance Review / Remarks</label>
                    <textarea
                      rows="3"
                      required
                      placeholder={`Write detailed ${fixedSubject} feedback for the student...`}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Publish {fixedSubject} Review
                  </button>
                </form>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold text-slate-900">Previously Published {fixedSubject} Reviews</h3>
                  <div className="space-y-3">
                    {studentReviews.map((rev) => (
                      <div key={rev.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">{fixedSubject} — {rev.studentName}</span>
                          <span className="text-slate-400">{rev.date}</span>
                        </div>
                        <p className="text-sm text-slate-800 font-medium">{rev.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}