import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Search, UserCheck, Check } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';

const Verifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'rejected'

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/admin/verifications/pending', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVerifications(data.pending);
      } else {
        console.error('Failed to fetch verifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5000/api/admin/verify/${userId}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchVerifications(); // Refresh verifications list
        setShowActionModal(false);
        setShowDetailsModal(false); // Close details modal after action
      } else {
        console.error(`Failed to ${action} verification:`, response.status);
      }
    } catch (error) {
      console.error(`Error ${action}ing verification:`, error);
    }
  };

  const filteredVerifications = verifications.filter(
    (verification) =>
      verification.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  // Keyboard handler for cards (Enter or Space opens details modal)
  const onCardKeyDown = (e, verification) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedVerification(verification);
      setShowDetailsModal(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Table
        title="Pending Verifications"
        icon={UserCheck}
        actions={[
          <div key="search" className="flex items-center gap-2">
            <Input
              placeholder="Search verifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-64"
              aria-label="Search verifications"
            />
          </div>,
        ]}
      >
        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <Card
              key={verification._id}
              gradient
              className="p-6 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`View verification details for ${verification.fullName}`}
              onClick={() => {
                setSelectedVerification(verification);
                setShowDetailsModal(true);
              }}
              onKeyDown={(e) => onCardKeyDown(e, verification)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{verification.fullName}</h3>
                    <p className="text-white/60 text-sm">{verification.email}</p>
                    <p className="text-white/60 text-sm">User ID: {verification.userId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    aria-label={`Verification status: ${verification.govIdStatus}`}
                  >
                    {verification.govIdStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVerification(verification);
                    setShowDetailsModal(true);
                  }}
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                  aria-label={`View details of ${verification.fullName}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View Details
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVerification(verification);
                    setActionType('approve');
                    setShowActionModal(true);
                  }}
                  variant="success"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                  aria-label={`Approve verification for ${verification.fullName}`}
                >
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  Approve
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVerification(verification);
                    setActionType('rejected');
                    setShowActionModal(true);
                  }}
                  variant="danger"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                  aria-label={`Reject verification for ${verification.fullName}`}
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Table>

      {/* Verification Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Verification Details"
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedVerification.fullName}</h3>
                <p className="text-white/60">Email: {selectedVerification.email}</p>
                <p className="text-white/60">User ID: {selectedVerification.userId}</p>
                <p className="text-white/60">Status: {selectedVerification.govIdStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Government ID (Front)</h4>
                <img
                  src={selectedVerification.govIdFront}
                  alt="Government ID Front"
                  className="w-full h-auto rounded-lg border border-white/20"
                />
                <a
                  href={selectedVerification.govIdFront}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline mt-2 block"
                >
                  View Full Size
                </a>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Government ID (Back)</h4>
                <img
                  src={selectedVerification.govIdBack}
                  alt="Government ID Back"
                  className="w-full h-auto rounded-lg border border-white/20"
                />
                <a
                  href={selectedVerification.govIdBack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline mt-2 block"
                >
                  View Full Size
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setActionType('approve');
                  setShowActionModal(true);
                }}
                variant="success"
                className="flex-1 flex items-center gap-2"
                size="sm"
                aria-label={`Verify ${selectedVerification.fullName}`}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Verify
              </Button>
              <Button
                onClick={() => {
                  setActionType('approve');
                  setShowActionModal(true);
                }}
                variant="success"
                className="flex-1"
                aria-label={`Approve verification for ${selectedVerification.fullName}`}
              >
                Approve Verification
              </Button>
              <Button
                onClick={() => {
                  setActionType('rejected');
                  setShowActionModal(true);
                }}
                variant="danger"
                className="flex-1"
                aria-label={`Reject verification for ${selectedVerification.fullName}`}
              >
                Reject Verification
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Verification`}
        size="sm"
      >
        {selectedVerification && (
          <div className="space-y-4">
            <p className="text-white/90">
              Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} the verification for{' '}
              <span className="font-semibold">{selectedVerification.fullName}</span>?
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleVerificationAction(selectedVerification.userId, actionType)}
                variant={actionType === 'approve' ? 'success' : 'danger'}
                className="flex-1"
                aria-label={`${actionType === 'approve' ? 'Approve' : 'Reject'} verification for ${selectedVerification.fullName}`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
              <Button
                onClick={() => setShowActionModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Verifications;
