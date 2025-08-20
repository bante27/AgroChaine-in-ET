import React from 'react';
import { Menu, Bell, RefreshCw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isDark, toggleTheme } = useTheme();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Sidebar toggle button (mobile) */}
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img
              src="/newlogo.png"
              alt="AgroChain Ethiopia Logo"
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AgroChain Ethiopia
              </h1>
              <p className="text-gray-600 dark:text-white/80 text-sm">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20"
            >
              <Bell className="h-6 w-6" />
            </Button>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </div>

          {/* Refresh */}
          <Button 
            onClick={handleRefresh} 
            variant="primary"
            className="flex items-center gap-2 bg-gray-100 dark:bg-white/20 hover:bg-gray-200 dark:hover:bg-white/30 text-gray-800 dark:text-white border border-gray-300 dark:border-white/30"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
