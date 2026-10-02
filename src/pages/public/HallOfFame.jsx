import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Trophy, Award } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function HallOfFame() {
  const topAchievers = [
    {
      name: 'Omkar R. Jadhav',
      exam: 'JEE Advanced 2026',
      score: '99.85 Percentile',
      rank: 'AIR 1,420',
      college: 'IIT Bombay (Computer Science)',
      photoText: 'ORJ',
      batch: '2-Year Integrated JEE'
    },
    {
      name: 'Snehal S. Patil',
      exam: 'NEET-UG 2026',
      score: '710 / 720 Marks',
      rank: 'AIR 2,150',
      college: 'Grant Government Medical College, Mumbai',
      photoText: 'SSP',
      batch: '2-Year Integrated Medical'
    },
    {
      name: 'Atharva V. Deshmukh',
      exam: 'MHT-CET 2026',
      score: '99.92 Percentile',
      rank: 'State Rank 45',
      college: 'COEP Technological University, Pune',
      photoText: 'AVD',
      batch: 'MHT-CET Target Batch'
    },
    {
      name: 'Pooja M. Shinde',
      exam: 'JEE Main 2026',
      score: '99.78 Percentile',
      rank: 'AIR 3,120',
      college: 'NIT Trichy (Electronics)',
      photoText: 'PMS',
      batch: '2-Year Integrated JEE'
    },
    {
      name: 'Rohit K. Shinde',
      exam: 'NEET-UG 2026',
      score: '695 / 720 Marks',
      rank: 'AIR 4,200',
      college: 'BJ Government Medical College, Pune',
      photoText: 'RKS',
      batch: '2-Year Integrated Medical'
    },
    {
      name: 'Rutuja B. Mane',
      exam: 'MHT-CET 2026',
      score: '99.81 Percentile',
      rank: 'State Rank 88',
      college: 'VJTI Mumbai',
      photoText: 'RBM',
      batch: 'MHT-CET Target Batch'
    }
  ];

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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1.5 mx-auto mb-3">
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Results & Hall of Fame
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Celebrating Our Star Achievers
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Uncompromising dedication, expert faculty mentorship, and rigorous daily testing have once again placed SRR at the pinnacle of engineering and medical entrance results.
          </p>
        </div>

        {/* Achievers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topAchievers.map((achiever, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 rounded-3xl p-8 shadow-sm dark:shadow-slate-950/40 hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold tracking-wider px-4 py-1 rounded-bl-2xl uppercase">
                {achiever.exam.split(' ')[0]} Star
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/90 border-2 border-emerald-500 flex items-center justify-center text-emerald-800 dark:text-emerald-300 text-xl font-black shadow-inner shrink-0 group-hover:scale-105 transition">
                    {achiever.photoText}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{achiever.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">{achiever.batch}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Exam:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{achiever.exam}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Score / Percentile:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">{achiever.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">National / State Rank:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{achiever.rank}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={achiever.college}>
                  {achiever.college}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 bg-emerald-900 dark:bg-emerald-950/90 border border-emerald-800 dark:border-emerald-800/50 text-white rounded-3xl p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Want to see your name here next year?
          </h2>
          <p className="text-emerald-200 text-sm max-w-xl mx-auto leading-relaxed">
            Join Vita's most trusted coaching institute for 11th & 12th Science and start your journey toward IITs, AIIMS, and top government colleges.
          </p>
          <div>
            <Link
              to="/admissions"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition shadow-lg inline-block cursor-pointer"
            >
              Book Your Academic Consultation &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}