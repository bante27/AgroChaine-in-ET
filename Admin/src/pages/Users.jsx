import React, { useEffect, useState, useMemo } from "react";
import {
  Search, User, Phone, MapPin, Eye,
  Users as UsersIcon, ShieldAlert, CheckCircle, Clock,
  XCircle, Trash2, X
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";

// --- Sub-component for Status Badge ---
const StatusBadge = ({ user, verificationData }) => {
  if (user.isRestricted) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" /> Restricted
      </span>
    );
  }
  if (user.verified) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
      <Clock className="w-3 h-3 mr-1" /> {verificationData?.govIdStatus || "Unverified"}
    </span>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationData = async (userId) => {
    try {
      setVerificationLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/verifications/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verification = res.data.pending.find((v) => v.userId === userId);
      setVerificationData(verification || null);
    } catch (err) {
      setError("Failed to fetch verification details");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Logic updated to match your new Backend Routes
  const handleRestrictAction = async (userId, currentlyRestricted) => {
    const action = currentlyRestricted ? 'lift-restriction' : 'restrict';
    const confirmMsg = currentlyRestricted 
      ? "Are you sure you want to LIFT restrictions for this user?" 
      : "Are you sure you want to RESTRICT this user?";

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/admin/users/${userId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Update local list state
        setUsers(prev => prev.map(u => 
          u.userId === userId ? { ...u, isRestricted: !currentlyRestricted } : u
        ));

        // Update modal state if open
        if (selectedUser?.userId === userId) {
          setSelectedUser(prev => ({ ...prev, isRestricted: !currentlyRestricted }));
        }

        alert(`Success: User access ${currentlyRestricted ? 'restored' : 'restricted'}.`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("PERMANENTLY delete this user? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.userId !== userId));
      if (selectedUser?.userId === userId) closeModal();
      alert("User deleted successfully.");
    } catch (err) {
      setError("Delete failed. You may not have permission.");
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setVerificationData(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      [user.fullName, user.email, user.phone]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {error && (
          <div className="mb-6 flex justify-between items-center bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X className="w-4 h-4"/></button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <UsersIcon className="h-8 w-8 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
              <p className="text-sm text-gray-500">Manage permissions and verification</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase">
                  <th className="p-4 font-semibold">User Details</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white overflow-hidden">
                          {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1 text-sm">
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-cyan-500" /> {user.phone || "N/A"}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-cyan-500" /> {user.address || "N/A"}</div>
                    </td>
                    <td className="p-4"><StatusBadge user={user} /></td>
                    <td className="p-4 text-sm text-gray-500">{new Date(user.registrationDate).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelectedUser(user); fetchVerificationData(user.userId); setShowUserModal(true); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-gray-500"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleRestrictAction(user.userId, user.isRestricted)} className={`p-2 rounded-lg ${user.isRestricted ? 'text-red-500 bg-red-500/10' : 'text-gray-500 hover:bg-gray-100'}`}><ShieldAlert className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteUser(user.userId)} className="p-2 hover:text-red-500 text-gray-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold">User Profile Details</h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedUser.profilePic ? <img src={selectedUser.profilePic} className="w-full h-full object-cover rounded-2xl" /> : selectedUser.fullName[0]}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-2xl font-bold">{selectedUser.fullName}</h4>
                    <p className="text-gray-500 mb-2">{selectedUser.email}</p>
                    <StatusBadge user={selectedUser} verificationData={verificationData} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Phone</p>
                    <p className="font-medium">{selectedUser.phone || "Not provided"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Balance</p>
                    <p className="font-medium text-green-600">{selectedUser.balance || 0} ETB</p>
                  </div>
                </div>

                <h5 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Documents</h5>
                {verificationLoading ? (
                  <div className="animate-pulse flex space-x-4"><div className="flex-1 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div></div>
                ) : verificationData ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                       <p className="text-xs text-blue-500 font-bold">ID Number</p>
                       <p className="font-mono text-lg">{verificationData.nationalIdNumber}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <img src={verificationData.govIdFront} className="h-24 w-full object-cover rounded-lg border dark:border-gray-600 cursor-zoom-in" alt="Front" onClick={() => window.open(verificationData.govIdFront)} />
                      <img src={verificationData.govIdBack} className="h-24 w-full object-cover rounded-lg border dark:border-gray-600 cursor-zoom-in" alt="Back" onClick={() => window.open(verificationData.govIdBack)} />
                      {verificationData.govIdSelfie && <img src={verificationData.govIdSelfie} className="h-24 w-full object-cover rounded-lg border dark:border-gray-600 cursor-zoom-in" alt="Selfie" onClick={() => window.open(verificationData.govIdSelfie)} />}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">No documents submitted.</p>
                )}
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-900 flex gap-3">
                <button 
                  disabled={actionLoading}
                  onClick={() => handleRestrictAction(selectedUser.userId, selectedUser.isRestricted)}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedUser.isRestricted 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30 hover:bg-green-700' 
                      : 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
                  }`}
                >
                  {actionLoading ? "Processing..." : (
                    <>
                      <ShieldAlert className="w-4 h-4" /> 
                      {selectedUser.isRestricted ? "Lift Restriction" : "Restrict Account"}
                    </>
                  )}
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => handleDeleteUser(selectedUser.userId)}
                  className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;