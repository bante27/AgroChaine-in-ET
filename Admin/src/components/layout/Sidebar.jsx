import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import Button from '../common/Button';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'users', label: 'Users', icon: Users, path: '/users' },
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'Transactions', label: 'Transactions', icon: ShoppingCart, path: '/orders' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare, path: '/chat' },
    { id: 'Admins', label: 'Admins', icon: User, path: '/profile' },
    { id: 'Verifications', label: 'Verifications', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    try {
      localStorage.clear();
      console.log('Logged out and localStorage cleared');
      navigate('/login');
      window.location.href = '/login'; // fallback
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 
      bg-white/70 dark:bg-black/40 
      backdrop-blur-xl border-r border-gray-200 dark:border-white/10 
      transform transition-transform duration-300 z-40
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="p-6 pt-20">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full flex items-center gap-3 text-gray-800 dark:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
