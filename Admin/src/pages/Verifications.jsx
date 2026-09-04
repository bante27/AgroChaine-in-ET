import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Eye, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { API_URL } from '../utils/apiConfig';
import toast from 'react-hot-toast';

const Verifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/verifications/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setVerifications(data.pending || []);
      }
    } catch (error) {
      toast.error('Error fetching verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async () => {
    const targetId = selectedVerification?.userId;
    if (!targetId) return;

    try {
      setIsSubmitting(true);
      const statusValue = actionType === 'approve' ? 'approved' : 'rejected';

      const response = await fetch(`${API_URL}/api/admin/verify/${targetId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusValue }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`User ${statusValue} successfully!`);
        
        // REMOVE FROM UI IMMEDIATELY
        setVerifications(prev => prev.filter(v => v.userId !== targetId));
        
        setShowActionModal(false);
        setShowDetailsModal(false);
        setSelectedVerification(null);
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      toast.error("Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVerifications = verifications.filter(
    (v) => v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
           <UserCheck className="text-emerald-600" /> Pending Verifications
        </h1>
        <div className="relative w-64">
           <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredVerifications.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No pending verifications found.</p>
        ) : (
          filteredVerifications.map((v) => (
            <Card key={v.userId} className="p-5 border bg-white transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{v.fullName}</h3>
                    <p className="text-sm text-gray-500">{v.email}</p>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-indigo-600">ID: {v.userId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedVerification(v); setShowDetailsModal(true); }}>
                    <Eye size={16} className="mr-1" /> Details
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => { setSelectedVerification(v); setActionType('approve'); setShowActionModal(true); }}>
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Audit Document" size="lg">
        {selectedVerification && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">National ID</p>
                <p className="text-xl font-mono font-bold text-emerald-600">{selectedVerification?.nationalIdNumber || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                <p className="text-yellow-600 font-bold capitalize">{selectedVerification?.govIdStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['govIdFront', 'govIdBack', 'govIdSelfie'].map((key) => (
                <div key={key} className="space-y-2 text-center">
                  <p className="text-[10px] font-bold uppercase text-gray-400">{key.replace('govId', '')}</p>
                  <div className="h-40 border rounded-lg bg-gray-100 overflow-hidden shadow-inner">
                    {selectedVerification[key] ? (
                        <img src={selectedVerification[key]} alt={key} className="w-full h-full object-cover cursor-zoom-in" onClick={() => window.open(selectedVerification[key])} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Image</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 bg-emerald-600 text-white" onClick={() => { setActionType('approve'); setShowActionModal(true); }}>Verify User</Button>
              <Button className="flex-1 bg-red-600 text-white" onClick={() => { setActionType('reject'); setShowActionModal(true); }}>Reject</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title="Confirm Action" size="sm">
        <div className="text-center space-y-4 py-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${actionType === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {actionType === 'approve' ? <CheckCircle /> : <XCircle />}
          </div>
          <p className="text-gray-600">
            Confirm <span className="font-bold underline">{actionType}</span> for {selectedVerification?.fullName}?
          </p>
          <div className="flex gap-2">
            <Button 
              className={`flex-1 ${actionType === 'approve' ? 'bg-emerald-600' : 'bg-red-600'} text-white`} 
              onClick={handleVerificationAction}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </Button>
            <Button className="flex-1 bg-gray-100" onClick={() => setShowActionModal(false)} disabled={isSubmitting}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Verifications;