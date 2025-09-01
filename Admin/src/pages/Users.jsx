import React, { useEffect, useState } from "react";
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
  Users as UsersIcon,
  ShieldAlert,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyId = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/verify-id/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error verifying ID:", err);
    }
  };

  const handleRestrictUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${userId}/restrict`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error restricting user:", err);
    }
  };

  const getStatusBadge = (user) => {
    if (user.isRestricted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-600">
          <XCircle className="w-3 h-3 mr-1" /> Restricted
        </span>
      );
    }
    if (user.verified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-600">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-600">
        <Clock className="w-3 h-3 mr-1" /> Unverified
      </span>
    );
  };

  const filteredUsers = users.filter((user) =>
    [user.fullName, user.email, user.phone]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-emerald-500" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            User Management
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="w-48 md:w-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto p-4">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    user.isRestricted ? "bg-red-100 dark:bg-red-900/20" : ""
                  }`}
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {user.phone || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {user.address || "-"}
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(user)}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button
                      onClick={() => handleVerifyId(user.userId)}
                      variant="success"
                      size="icon"
                      title={user.verified ? "Re-verify ID" : "Verify ID"}
                      disabled={user.verified}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleRestrictUser(user.userId)}
                      variant="danger"
                      size="icon"
                      title={user.isRestricted ? "Unrestrict User" : "Restrict User"}
                    >
                      <ShieldAlert className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      variant="secondary"
                      size="icon"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                {selectedUser.profilePic ? (
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="mt-2">{getStatusBadge(selectedUser)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.phone || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.address || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Balance</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.balance} ({selectedUser.pendingBalance} pending)
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Rank</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.rank}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Admin Status</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.isAdmin ? "Admin" : "User"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Posted Products</label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedUser.postedProducts?.length || 0}
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