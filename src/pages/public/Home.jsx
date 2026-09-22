import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, GraduationCap, CheckCircle2, Phone, MapPin, Clock, Calendar, Trophy } from 'lucide-react';

export default function Home() {
  const tracks = [
    {
      title: '11th & 12th Integrated: JEE (Main + Adv)',
      desc: 'Deep analytical problem solving in Physics, Chemistry & Advanced Mathematics. Rigorous mock tests mimicking NTA/JEE Advanced environment.',
      stats: 'Complete NCERT • Advanced Reference Sheets • Weekly Computer Based Test (CBT) Series',
      target: 'Target: IITs, NITs, BITS, IIITs',
      tag: 'Engineering Target',
    },
    {
      title: '11th & 12th Medical: NEET-UG Target',
      desc: 'Line-by-line NCERT encoding in Biology, rigorous numerical workshops in Physics, and organic mechanism mastery for Chemistry.',
      stats: '360/360 Target Biology NCERT Maps • Speed & Accuracy OMR Testing Drills • Target: AIIMS, GMC, KEM, Grant Medical',
      target: 'Target: AIIMS, GMC, KEM, Grant Medical',
      tag: 'Medical Target',
    },
    {
      title: 'Maharashtra Board - MHT-CET (PCM / PCB)',
      desc: 'Synchronized Maharashtra State Board syllabus coverage combined with high-speed formula shortcut training for 99+ percentile in MHT-CET.',
      stats: 'Complete HSC Textbooks & Exemplars • Chapter-wise Past 15-Year CET Papers • Target: COEP, VJTI, SPIT, Government Pharmacy',
      target: 'Target: COEP, VJTI, SPIT, Govt Pharmacy',
      tag: 'State Board & CET',
    },
  ];

  const faculty = [
    { name: 'Prof. K. P. Patil (KP Sir)', role: 'HOD Physics & Director', exp: '16+ Years Experience (Kota Senior Faculty)', detail: 'Mentored 500+ students into IITs and NITs. Specialist in Mechanics, Rotational Dynamics & Electrodynamics.' },
    { name: 'Dr. Sandeep Kulkarni', role: 'HOD Chemistry', exp: '14+ Years Experience (Ph.D. Organic Chemistry, RCI, Pune)', detail: 'Author of 3 entrance prep books. Renowned for visual reaction mechanisms and quick physical chemistry shortcuts.' },
    { name: 'Prof. Vijay Chavan', role: 'HOD Mathematics', exp: '12+ Years Experience (M.Tech, IIT Bombay)', detail: 'Master of Coordinate Geometry and Calculus. Proven track record of 99.9+ percentile scorers in JEE Main & MHT-CET.' },
    { name: 'Dr. Anjali Deshmukh', role: 'HOD Biology & Medical Entrance Cell', exp: '15+ Years Experience (MBBS, M.Sc. Zoology)', detail: 'NCERT line-by-line decoding specialist. Guided over 85 students to Government Medical Colleges (GMC) with 340+ in NEET.' },
  ];

  const facilities = [
    { title: 'Smart Digital Classrooms', desc: 'Acoustically treated, air-conditioned lecture halls equipped with 85-inch 4K interactive display panels and live lecture capture.' },
    { title: 'Dedicated Doubt Solving', desc: 'Daily one-on-one doubt resolution desk manned by experienced faculty from 4:00 PM to 8:30 PM.' },
    { title: 'Royal Library & Reading Hall', desc: 'Quiet, ergonomic 24/7 study desks stocked with comprehensive national competitive entrance libraries.' },
    { title: 'Computer-Based Test (CBT) Lab', desc: '60 high-speed terminals replicating exact NTA JEE/NEET/CET server tests with immediate AI performance analytics.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-600 text-white text-xs py-2 px-6 lg:px-16 flex flex-wrap justify-between items-center font-medium shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-100" />
          <span>Admissions Open for 11th & 12th Integrated Batches (2026–27)</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Counseling Desk: +91 98220 12345</span>
          <span className="hidden sm:inline">Vita & Sangli District</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-6 lg:px-16 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
              SRR
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-600">JEE • NEET • CET</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <a href="#about" className="hover:text-emerald-600 transition">About Academy</a>
          <a href="#courses" className="hover:text-emerald-600 transition">Courses (11th/12th)</a>
          <Link to="/halloffame" className="hover:text-emerald-600 transition cursor-pointer flex items-center gap-1">
            <Trophy className="w-4 h-4 text-emerald-600" /> Hall of Fame
          </Link>
          <Link to="/admissions" className="hover:text-emerald-600 transition cursor-pointer">Contact & Admissions</Link>
        </div>
        <div>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
          >
            Dashboard &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="relative bg-gradient-to-b from-emerald-50/60 to-white px-6 lg:px-16 py-20 lg:py-28 max-w-7xl mx-auto rounded-3xl mt-6 border border-emerald-100 shadow-sm flex flex-col items-center text-center">
        <span className="px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-6 flex items-center gap-2">
          Academic Excellence Redefined
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl leading-[1.15]">
          Shri Rajlaxmi Royal Academy <span className="text-emerald-600">Of Science Vita</span>
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-4 relative z-10">
          <Link
            to="/admissions"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 group text-base cursor-pointer pointer-events-auto"
          >
            <Calendar className="w-5 h-5" /> Book Consultation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            to="/halloffame"
            className="px-8 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-2xl transition shadow-sm flex items-center gap-2 text-base cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-emerald-600" /> View Hall of Fame
          </Link>
        </div>
      </header>

      {/* Featured Programs Section */}
      <section id="courses" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Curriculum & Batches
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">Specialized Programs for 11th & 12th Science</h2>
          <p className="text-slate-600 text-sm mt-2">Meticulously planned curriculum designed by senior academicians to ensure simultaneous mastery of Board examinations and National entrance tests.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track, idx) => (
            <div key={idx} className="bg-white border border-emerald-100 hover:border-emerald-400 transition rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md relative">
              {idx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block mb-4">
                  {track.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{track.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{track.desc}</p>
                
                <div className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                  {track.stats.split('•').map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">{track.target}</span>
                <Link to="/admissions" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
                  View Syllabus &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 lg:px-16 py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200">
              About the Academy
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">Shri Rajlaxmi Royal Academy Of Vita</h2>
            <p className="text-slate-600 text-sm mt-2">Founded with a singular mission: To bring the highest echelon of national entrance coaching to 11th and 12th Science students in Vita and surrounding districts.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">Founder & Managing Director</span>
              <h3 className="text-2xl font-bold text-slate-900">Prof. K. P. Patil (KP Sir)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Guiding thousands of aspirants toward prestigious careers in Medicine and Engineering with uncompromising dedication.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-medium">
                M.Sc. Physics (Gold Medalist), B.Ed.
              </div>
            </div>

            <div className="bg-white border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">Co-Founder & Chief Patron</span>
              <h3 className="text-2xl font-bold text-slate-900">Hon. Smt. Rajlaxmi Patil</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visionary educationalist committed to fostering holistic student welfare, girls in STEM education, and modern academic infrastructure in rural Maharashtra.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-medium">
                M.A., School Education Leader
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Faculty Leadership
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">Taught By Maharashtra's Finest Educators</h2>
          <p className="text-slate-600 text-sm mt-2">At Shri Rajlaxmi Royal Academy, senior HODs personally teach all 11th and 12th batches.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((member, idx) => (
            <div key={idx} className="bg-white border border-emerald-100 hover:border-emerald-300 transition rounded-3xl p-6 text-center shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-800 text-2xl font-bold mb-4 shadow-inner">
                  {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">{member.role}</p>
                <span className="inline-block text-[10px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full mt-2">
                  {member.exp}
                </span>
                <p className="text-slate-600 text-xs mt-3 leading-relaxed">{member.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Infrastructure */}
      <section className="px-6 lg:px-16 py-20 bg-emerald-50/40 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Campus Infrastructure
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">World-Class Facilities in Vita</h2>
            <p className="text-slate-600 text-sm mt-2">Designed to create an immersive, distraction-free environment for intense preparation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <div key={idx} className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-3">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{fac.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-emerald-800 bg-emerald-950 text-emerald-100 px-6 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Shri Rajlaxmi Royal Academy</h4>
            <p className="text-emerald-200/80 leading-relaxed">
              The gold standard in 11th & 12th Science entrance coaching in Sangli district. Preparing students for JEE (Main & Advanced), NEET-UG, and MHT-CET with relentless dedication.
            </p>
            <div className="pt-2 text-emerald-200 font-medium">
              Academic Directorship: Prof. K. Patil (KP Sir)
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Academic Programs</h4>
            <ul className="space-y-2 text-emerald-200/80">
              <li>11th & 12th Integrated (JEE Main + Adv)</li>
              <li>11th & 12th Medical (NEET-UG Target)</li>
              <li>State Board + MHT-CET (PCM & PCB)</li>
              <li>All-India Computer Based Test Series</li>
              <li>Daily Doubt Clearing Cell & Mentorship</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-emerald-200/80">
              <li><a href="#about" className="hover:text-white transition">About Academy & Founders</a></li>
              <li><Link to="/halloffame" className="hover:text-white transition cursor-pointer">Results & Hall of Fame</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition cursor-pointer">Admission Inquiry</Link></li>
              <li><Link to="/login" className="hover:text-white transition font-semibold text-white cursor-pointer">Student / Staff Login Portal &rarr;</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Vita Campus & Contact</h4>
            <p className="text-emerald-200/80 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Rajlaxmi Complex, Shivaji Road, Near Old Bus Stand, Vita, Sangli - 415311</span>
            </p>
            <p className="text-emerald-200/80 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+91 98220 12345 / +91 94230 56789</span>
            </p>
            <p className="text-emerald-200/80 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Office: Mon-Sat 8:00 AM – 8:30 PM</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-emerald-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-emerald-300">
          <p>&copy; {new Date().getFullYear()} Shri Rajlaxmi Royal Academy of Vita. All rights reserved.</p>
          <p>Official Portal • Developed for Royal Academic Excellence</p>
        </div>
      </footer>
    </div>
  );
}