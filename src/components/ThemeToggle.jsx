import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-md shadow-slate-950/40 hover:scale-105 active:scale-95'
          : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80 shadow-xs hover:scale-105 active:scale-95'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold select-none">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
