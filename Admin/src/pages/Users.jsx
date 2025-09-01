import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Users as UsersIcon,
  ShieldAlert,
  CheckCircle,
  Clock,
  XCircle,
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
  const [verificationData, setVerificationData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationData = async (userId) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get("http://localhost:5000/api/admin/verifications/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verification = res.data.pending.find((v) => v.userId === userId);
      setVerificationData(verification || null);
    } catch (err) {
      console.error("Error fetching verification data:", err);
    }
  };

  const handleRestrictUser = async (userId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        `http://localhost:5000/api/admin/users/${userId}/restrict`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error restricting user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (user, verificationData) => {
    if (user.isRestricted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-red-500/20 text-red-400 border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" /> Restricted
        </span>
      );
    }
    if (user.verified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <Clock className="w-3 h-3 mr-1" /> {verificationData?.govIdStatus || "Unverified"}
      </span>
    );
  };

  const filteredUsers = users.filter((user) =>
    [user.fullName, user.email, user.phone]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-2xl shadow-md min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-800 p-4 border-b border-gray-700 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-emerald-400" />
          <h2 className="text-lg md:text-xl font-semibold text-white">
            User Management
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="w-48 md:w-64 bg-gray-700 border border-gray-600 text-white placeholder-gray-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-700 text-gray-300"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto p-4">
        <table className="w-full bg-gray-800 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-700/50">
              <th className="text-left p-4 text-white/90">User</th>
              <th className="text-left p-4 text-white/90">Contact</th>
              <th className="text-left p-4 text-white/90">Status</th>
              <th className="text-left p-4 text-white/90">Joined</th>
              <th className="text-left p-4 text-white/90">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className={`border-b border-gray-700 hover:bg-gray-700 ${
                    user.isRestricted ? "bg-red-900/20" : ""
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
                      <p className="font-medium text-white">{user.fullName}</p>
                      <p className="text-sm text-white/60">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 space-y-1 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {user.phone || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {user.address || "-"}
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(user, verificationData)}</td>
                  <td className="p-4 flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    {new Date(user.registrationDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button
                      onClick={() => handleRestrictUser(user.userId)}
                      variant="danger"
                      size="icon"
                      title={user.isRestricted ? "Unrestrict User" : "Restrict User"}
                      disabled={actionLoading}
                    >
                      <ShieldAlert className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUser(user);
                        fetchVerificationData(user.userId);
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
                <td colSpan="5" className="text-center p-4 text-white/80">
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
        onClose={() => {
          setShowUserModal(false);
          setVerificationData(null);
        }}
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
                <h3 className="text-xl font-bold text-white">{selectedUser.fullName}</h3>
                <p className="text-white/60">{selectedUser.email}</p>
                <div className="mt-2">{getStatusBadge(selectedUser, verificationData)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-white/90">Phone</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.phone || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90">Address</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.address || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90">Balance</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.balance} ({selectedUser.pendingBalance} pending)
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90">Rank</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.rank || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90">Admin Status</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.isAdmin ? "Admin" : "User"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90">Posted Products</label>
                <div className="bg-gray-700 p-3 rounded-lg text-white/80">
                  {selectedUser.postedProducts?.length || 0}
                </div>
              </div>
            </div>

            {verificationData && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Government ID</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">ID Front</label>
                    <img
                      src={verificationData.govIdFront}
                      alt="Government ID Front"
                      className="w-full h-auto rounded-lg border border-white/20"
                    />
                    <a
                      href={verificationData.govIdFront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline mt-2 block"
                    >
                      View Full Size
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">ID Back</label>
                    <img
                      src={verificationData.govIdBack}
                      alt="Government ID Back"
                      className="w-full h-auto rounded-lg border border-white/20"
                    />
                    <a
                      href={verificationData.govIdBack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline mt-2 block"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => handleRestrictUser(selectedUser.userId)}
                variant="danger"
                className="flex-1"
                disabled={actionLoading}
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                {selectedUser.isRestricted ? "Unrestrict User" : "Restrict User"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;