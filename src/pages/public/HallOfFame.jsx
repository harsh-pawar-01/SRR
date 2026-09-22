import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Trophy, Award } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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
        <div>
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 mx-auto mb-3">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" /> Results & Hall of Fame
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Celebrating Our Star Achievers
          </h1>
          <p className="text-slate-600 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Uncompromising dedication, expert faculty mentorship, and rigorous daily testing have once again placed SRR at the pinnacle of engineering and medical entrance results.
          </p>
        </div>

        {/* Achievers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topAchievers.map((achiever, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-3xl p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold tracking-wider px-4 py-1 rounded-bl-2xl uppercase">
                {achiever.exam.split(' ')[0]} Star
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-800 text-xl font-black shadow-inner shrink-0 group-hover:scale-105 transition">
                    {achiever.photoText}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{achiever.name}</h3>
                    <span className="text-xs text-slate-500 block">{achiever.batch}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Exam:</span>
                    <span className="font-bold text-slate-800">{achiever.exam}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Score / Percentile:</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{achiever.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">National / State Rank:</span>
                    <span className="font-bold text-slate-800">{achiever.rank}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate" title={achiever.college}>
                  {achiever.college}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 bg-emerald-900 text-white rounded-3xl p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
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