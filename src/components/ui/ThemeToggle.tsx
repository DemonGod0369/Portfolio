import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      id="theme-mode-toggle-btn"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 ${
        isDark
          ? 'text-[#94A3B8] hover:text-[#00E5FF] bg-[#0B132B] hover:bg-[#0F1B38] border border-[#1E3A5F] hover:border-[#00E5FF]/60 shadow-[0_0_12px_rgba(0,229,255,0.1)]'
          : 'text-[#475569] hover:text-[#00838F] bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#CBD5E1] hover:border-[#00838F]/60 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
          ) : (
            <Moon className="w-4 h-4 text-[#0284C7] group-hover:text-[#0369A1]" />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <span className="text-xs font-mono uppercase tracking-wider font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
