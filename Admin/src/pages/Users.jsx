import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Users as UsersIcon
} from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 border-green-300 dark:border-green-700', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700', icon: Clock },
      canceled: { color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 border-red-300 dark:border-red-700', icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md min-h-[80vh] flex flex-col">
      
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-emerald-500" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">User Management</h2>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="w-48 md:w-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>

      {/* Table / Card View */}
      <div className="flex-1 overflow-x-auto p-4">
        <table className="hidden md:table w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-medium">User</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-medium">Contact</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-medium">Status</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-medium">Joined</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{user.fullName}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(user.status)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{user.joinDate}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleUserAction(user.id, 'verify')} variant="success" size="icon" title="Verify User">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleUserAction(user.id, 'pending')} variant="warning" size="icon" title="Set Pending">
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleUserAction(user.id, 'cancel')} variant="danger" size="icon" title="Cancel User">
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => { setSelectedUser(user); setShowUserModal(true); }} variant="secondary" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="grid md:hidden gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                {getStatusBadge(user.status)}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1"><Phone className="h-4 w-4" /> {user.phone}</div>
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.location}</div>
                <div className="flex items-center gap-1 col-span-2"><Calendar className="h-4 w-4" /> {user.joinDate}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => handleUserAction(user.id, 'verify')} variant="success" size="sm"><CheckCircle className="h-4 w-4 mr-1"/> Verify</Button>
                <Button onClick={() => handleUserAction(user.id, 'pending')} variant="warning" size="sm"><Clock className="h-4 w-4 mr-1"/> Pending</Button>
                <Button onClick={() => handleUserAction(user.id, 'cancel')} variant="danger" size="sm"><XCircle className="h-4 w-4 mr-1"/> Cancel</Button>
                <Button onClick={() => { setSelectedUser(user); setShowUserModal(true); }} variant="secondary" size="sm"><Eye className="h-4 w-4 mr-1"/> View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedUser.fullName}</h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                <div className="mt-2">{getStatusBadge(selectedUser.status)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Phone</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-gray-100">{selectedUser.phone}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Location</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-gray-100">{selectedUser.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
