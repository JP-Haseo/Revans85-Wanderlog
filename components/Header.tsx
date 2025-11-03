
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, PlusCircleIcon, GlobeAltIcon } from './Icons';

interface HeaderProps {
  onNewPostClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewPostClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="h-8 w-8 text-sky-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wanderlog</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={onNewPostClick}
              className="flex items-center space-x-2 bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
