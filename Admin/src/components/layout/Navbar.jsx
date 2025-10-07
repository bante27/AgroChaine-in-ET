import React from 'react';
import { Menu, RefreshCw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isDark, toggleTheme } = useTheme();

  const handleRefresh = () => window.location.reload();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 sm:px-6 lg:px-8">

        {/* Left side: Sidebar toggle + Logo */}
        <div className="flex items-center gap-4">
          {/* Sidebar toggle button (mobile only) */}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className={`lg:hidden transition-colors duration-200
              ${isDark
                ? 'text-gray-200 hover:bg-white/20'
                : 'text-gray-800 hover:bg-gray-200'
              }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img src="/newlogo.png" alt="AgroChain Ethiopia Logo" className="h-8 w-auto" />
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                AgroChain Ethiopia
              </h1>
              <p className="text-gray-600 dark:text-white/80 text-xs sm:text-sm">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Theme toggle + Refresh */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme toggle button */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className={`transition-colors duration-200
              ${isDark
                ? 'text-gray-200 hover:bg-white/20'
                : 'text-gray-800 hover:bg-gray-200'
              }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-800" />}
          </Button>

          {/* Refresh button */}
          <Button
            onClick={handleRefresh}
            variant="primary"
            className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base border transition-colors duration-200
              ${isDark
                ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
              }`}
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
