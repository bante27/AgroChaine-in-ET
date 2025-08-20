import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, verified: 0, pending: 0, canceled: 0 },
    products: { total: 0, forSale: 0, sold: 0, totalValue: 0 },
    orders: { total: 0, pending: 0, completed: 0, canceled: 0, revenue: 0 },
    messages: { total: 0, unread: 0, high: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats'); // later from your server/
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const ProgressBar = ({ label, value, total, color = 'green' }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-700 dark:text-white/80 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
            style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-gray-900 dark:text-white font-semibold text-sm">{value}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            color="from-emerald-500 to-emerald-600"
            subtitle={`${stats.users.verified} verified`}
            trend="12"
          />
          <StatCard
            title="Products"
            value={stats.products.total}
            icon={Package}
            color="from-blue-500 to-blue-600"
            subtitle={`$${stats.products.totalValue.toLocaleString()} value`}
            trend="8"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders.total}
            icon={ShoppingCart}
            color="from-purple-500 to-purple-600"
            subtitle={`$${stats.orders.revenue.toLocaleString()} revenue`}
            trend="15"
          />
          <StatCard
            title="Messages"
            value={stats.messages.total}
            icon={MessageSquare}
            color="from-pink-500 to-pink-600"
            subtitle={`${stats.messages.unread} unread`}
            trend="5"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <Card gradient className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Status Distribution</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar label="Verified Users" value={stats.users.verified} total={stats.users.total} color="green" />
              <ProgressBar label="Pending Users" value={stats.users.pending} total={stats.users.total} color="yellow" />
              <ProgressBar label="Canceled Users" value={stats.users.canceled} total={stats.users.total} color="red" />
            </div>
          </Card>

          {/* Order Status */}
          <Card gradient className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status Overview</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar label="Completed Orders" value={stats.orders.completed} total={stats.orders.total} color="green" />
              <ProgressBar label="Pending Orders" value={stats.orders.pending} total={stats.orders.total} color="yellow" />
              <ProgressBar label="Canceled Orders" value={stats.orders.canceled} total={stats.orders.total} color="red" />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-700 dark:text-white/80 text-sm">Waiting for recent activity data...</span>
              <span className="ml-auto text-gray-500 dark:text-white/60 text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Loading...
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
