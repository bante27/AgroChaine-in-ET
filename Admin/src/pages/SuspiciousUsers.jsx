import React, { useEffect, useState } from "react";
import { Search, User, Eye, ShieldAlert, Lock, Unlock } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";
import toast from "react-hot-toast";

const SuspiciousUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for loading feedback

  const token = sessionStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const suspicious = res.data.users?.filter(u => 
        u.isRestricted || u.govIdStatus === 'pending' || u.govIdStatus === 'rejected'
      );
      setUsers(suspicious || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchVerificationDetails = async (userId) => {
    try {
      setLoadingDetails(true);
      const res = await axios.get(`${API_URL}/api/admin/verifications/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const details = res.data.pending?.find(u => u.userId === userId);
      setVerificationDetails(details || null);
    } catch (err) {
      console.error("Could not load verification documents");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenModal = async (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    await fetchVerificationDetails(user.userId);
  };

  // MAIN FIX: Optimized handleAction to match Verifications logic
  const handleAction = async (userId, type, payload = null) => {
    try {
      setIsProcessing(true);
      let url = "";
      let method = "post";
      let data = {};

      if (type === 'RESTRICT') {
        url = payload
          ? `${API_URL}/api/admin/users/${userId}/lift-restriction`
          : `${API_URL}/api/admin/users/${userId}/restrict`;
      } else if (type === 'VERIFY') {
        method = "patch";
        // Ensure we use the /verify/:userId endpoint to match Verifications.js
        url = `${API_URL}/api/admin/verify/${userId}`;
        // Use 'action' as the key to match your backend's expected schema
        data = { action: payload }; 
      }

      await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(type === 'RESTRICT'
        ? (payload ? "Restriction lifted" : "User restricted")
        : `User successfully ${payload}`);

      await fetchData();
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Flagged Accounts
          </h2>
          <Input
            placeholder="Search..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">ID Status</th>
                <th className="px-6 py-4">Access</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center">Loading...</td></tr>
              ) : filtered.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                      user.govIdStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      user.govIdStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.govIdStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isRestricted ? (
                      <span className="text-red-500 flex items-center gap-1 text-xs font-bold"><Lock size={12}/> Restricted</span>
                    ) : (
                      <span className="text-green-500 flex items-center gap-1 text-xs font-bold"><Unlock size={12}/> Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenModal(user)}>
                      <Eye size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={user.isRestricted ? "success" : "danger"}
                      onClick={() => handleAction(user.userId, 'RESTRICT', user.isRestricted)}
                      disabled={isProcessing}
                    >
                      {user.isRestricted ? "Unban" : "Ban"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Audit User Identity" size="lg">
        {selectedUser && (
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            {loadingDetails ? (
              <div className="text-center py-8">Loading documents...</div>
            ) : verificationDetails ? (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-center">
                  <p className="text-xs text-gray-400 uppercase">National ID Number</p>
                  <p className="font-mono font-bold text-lg">{verificationDetails.nationalIdNumber}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <img src={verificationDetails.govIdFront} alt="Front" className="rounded border h-32 w-full object-cover" />
                  <img src={verificationDetails.govIdBack} alt="Back" className="rounded border h-32 w-full object-cover" />
                  <img src={verificationDetails.govIdSelfie} alt="Selfie" className="rounded border h-32 w-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">No documents uploaded.</div>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <Button
                className="flex-1"
                variant="success"
                onClick={() => handleAction(selectedUser.userId, 'VERIFY', 'approve')}
                disabled={!verificationDetails || isProcessing}
              >
                {isProcessing ? "Processing..." : "Approve"}
              </Button>
              <Button
                className="flex-1"
                variant="danger"
                onClick={() => handleAction(selectedUser.userId, 'VERIFY', 'reject')}
                disabled={!verificationDetails || isProcessing}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuspiciousUsers;