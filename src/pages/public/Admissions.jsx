import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Calendar, User, Mail, Phone, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function Admissions() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    admissionYear: '11th Standard',
    stream: 'JEE (Engineering)',
    contactNumber: '',
    email: '',
    address: '',
    message: ''
  });

  const handlePhoneChange = (e) => {
    // Keep only numbers and strictly slice to a maximum of 10 characters
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    
    setFormData({ ...formData, contactNumber: val });

    if (val.length > 0 && val.length < 10) {
      setPhoneError('Mobile number must be exactly 10 digits.');
    } else if (val.length === 10 && !/^[6-9]\d{9}$/.test(val)) {
      setPhoneError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contactNumber.length !== 10 || !/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setSubmitted(true);
  };

  // Automatically redirect to home page after 10 seconds when success screen is shown
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 px-6 lg:px-16 py-4 flex items-center justify-between shadow-sm dark:shadow-slate-950/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
              SRR
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600 dark:text-emerald-400">JEE • NEET • CET</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Form or Success Container */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {submitted ? (
          <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-6 shadow-sm">
            <div className="text-6xl mx-auto select-none animate-bounce">
              🎉
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                Congratulations!
              </h1>
              <p className="text-xl font-bold text-slate-800">
                {formData.studentName} has successfully booked a consultation at SRR.
              </p>
              <p className="text-sm text-slate-500">
                You will be automatically redirected to the homepage in a few seconds...
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition shadow-md inline-block cursor-pointer"
              >
                Return to Homepage Now &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Admissions & Counseling 2026–27
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">Book Your Academic Consultation</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                Fill out the consultation and admission inquiry form below. Our academic counselors will get in touch with you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Student Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atharva Patil"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  />
                </div>

                {/* Parent / Guardian Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ravindra Patil"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  />
                </div>

                {/* Admission Year (11th or 12th) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Admission Year / Standard *
                  </label>
                  <select
                    value={formData.admissionYear}
                    onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  >
                    <option value="11th Standard" className="dark:bg-slate-800">11th Standard</option>
                    <option value="12th Standard" className="dark:bg-slate-800">12th Standard</option>
                    <option value="12th Passed / Repeater" className="dark:bg-slate-800">12th Passed / Repeater (Target 2026)</option>
                  </select>
                </div>

                {/* Target Stream */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Target Stream / Program *
                  </label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  >
                    <option value="JEE (Engineering)" className="dark:bg-slate-800">11th & 12th Integrated: JEE (Main + Adv)</option>
                    <option value="NEET (Medical)" className="dark:bg-slate-800">11th & 12th Medical: NEET-UG Target</option>
                    <option value="MHT-CET / State Board" className="dark:bg-slate-800">Maharashtra Board - MHT-CET (PCM / PCB)</option>
                  </select>
                </div>

                {/* Contact Number with Strict 10-Digit Enforcement */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Contact Number (10 Digits) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="e.g. 9822012345"
                    value={formData.contactNumber}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition ${
                      phoneError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {phoneError}
                    </p>
                  )}
                </div>

                {/* Email ID */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Residential Address / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivaji Road, Vita, Sangli"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                />
              </div>

              {/* Specific Question / Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Specific Questions or Consultation Notes (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Ask about scholarship tests, hostel accommodation, or batch timings..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={Boolean(phoneError) || formData.contactNumber.length !== 10}
                  className={`px-8 py-4 text-white font-semibold rounded-2xl transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center ${
                    phoneError || formData.contactNumber.length !== 10
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 cursor-pointer'
                  }`}
                >
                  Submit Consultation Request &rarr;
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}