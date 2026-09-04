import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, Calendar, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';

// Custom ETB Icon Component
const ETBIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <text x="7" y="17" fontSize="12" fill="currentColor" fontWeight="bold">E</text>
  </svg>
);

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, verified: 0 },
    products: { total: 0, totalValue: 0 },
    transactions: { total: 0, completed: 0, revenue: 0 },
    messages: { total: 0, unread: 0 },
    platformRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Attempting to fetch with Token:", token ? "Token exists" : "No token found");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // We use Promise.allSettled to ensure that even if one route fails (like fees), 
        // the others (users/products) still load.
        const [usersRes, productsRes, feesRes, messagesRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/users`, config),
          axios.get(`${API_URL}/api/admin/products`, config),
          axios.get(`${API_URL}/api/admin/platform-fees`, config), // Corrected endpoint
          axios.get(`${API_URL}/api/admin/messages`, config)
        ]);

        const users = usersRes.data.users || [];
        const products = productsRes.data.products || [];
        const messages = messagesRes.data.messages || [];
        const feeData = feesRes.data || { totalFees: 0, count: 0 };

        const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

        setStats({
          users: {
            total: users.length,
            verified: users.filter((u) => u.verified || u.govIdStatus === 'approved').length,
          },
          products: {
            total: products.length,
            totalValue: totalValue,
          },
          transactions: {
            total: feeData.count || 0,
            completed: feeData.count || 0,
            revenue: 0, 
          },
          messages: {
            total: messages.length,
            unread: messages.filter((msg) => msg.status === 'pending').length,
          },
          platformRevenue: feeData.totalFees || 0,
        });

        // Map messages to Recent Activity
        const activities = messages.slice(0, 5).map(msg => ({
          id: msg._id,
          type: 'message',
          description: `Message: ${msg.subject}`,
          timestamp: new Date(msg.createdAt).toLocaleString(),
        }));

        setRecentActivity(activities);
        setError(null);
      } catch (err) {
        console.error("Dashboard Error Log:", err.response);
        if (err.response?.status === 403) {
          setError("Access Denied: You are not an Admin. Please log out and log in again.");
        } else {
          setError(err.response?.data?.error || "Connection error to server");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
        fetchDashboardData();
    } else {
        setLoading(false);
        setError("Please login to access the dashboard.");
    }
  }, [token]);

  const downloadReport = () => {
    window.print(); // Simple PDF generation via browser
  };

  const ProgressBar = ({ label, value, total, color = 'cyan' }) => (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{label}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold">{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-400 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-${color}-500/20`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-${color}-500/20`}>
          <Icon className={`h-8 w-8 text-${color}-400`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 lg:p-8">
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/30">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg">
            <Download size={18} /> Print Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard title="Total Users" value={stats.users.total} icon={Users} color="cyan" subtitle={`${stats.users.verified} verified`} />
          <StatCard title="Inventory" value={stats.products.total} icon={Package} color="indigo" subtitle={`ETB ${stats.products.totalValue.toLocaleString()}`} />
          <StatCard title="Orders" value={stats.transactions.total} icon={ShoppingCart} color="purple" subtitle="From fees" />
          <StatCard title="Revenue" value={`ETB ${stats.platformRevenue}`} icon={ETBIcon} color="emerald" subtitle="5% Service Fee" />
          <StatCard title="Support" value={stats.messages.total} icon={MessageSquare} color="pink" subtitle={`${stats.messages.unread} new`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="mb-4 font-bold">Registration Data</h3>
              <ProgressBar label="Verified Accounts" value={stats.users.verified} total={stats.users.total} color="cyan" />
           </div>
           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="mb-4 font-bold">Activity Feed</h3>
              {recentActivity.map(act => (
                <div key={act.id} className="text-sm border-b dark:border-gray-700 py-2">
                  {act.description} <span className="text-gray-400 text-xs">({act.timestamp})</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;