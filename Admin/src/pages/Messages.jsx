import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Eye, AlertTriangle, Search, Filter, CheckCircle } from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: '', reply: '' });
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const formattedMessages = response.data.messages.map((msg) => ({
          ...msg,
          id: msg._id,
          date: new Date(msg.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          priority: msg.priority || 'low',
        }));
        setMessages(formattedMessages);
      } else {
        console.error('Failed to fetch messages:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId, e) => {
    e?.stopPropagation(); // Prevent card click
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!replyForm.reply.trim()) {
      setError('Reply message is required');
      return;
    }

    setReplyLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/admin/messages/${selectedMessage.id}/reply`,
        { reply: replyForm.reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setShowReplyModal(false);
      setReplyForm({ subject: '', reply: '' });
      fetchMessages();
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Failed to send reply';
      setError(errorMsg);
      console.error('Error sending reply:', error);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      low: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    };

    const config = priorityConfig[priority] || priorityConfig.low;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <>
      <Table
        title="Message Center"
        icon={MessageSquare}
        actions={[
          <div key="search" className="flex items-center gap-2">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-64 bg-gray-700 border border-gray-600 text-white placeholder-gray-500"
            />
            <Button variant="ghost" size="icon" className="hover:bg-gray-700 text-gray-300">
              <Filter className="h-4 w-4" />
            </Button>
          </div>,
        ]}
      >
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 cursor-pointer ${
                  message.status === 'unread' ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  setShowMessageModal(true);
                  if (message.status === 'unread') {
                    handleMarkAsRead(message.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {message.name}
                        {message.status === 'unread' && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-white/60 text-sm">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(message.priority)}
                    <span className="text-white/60 text-sm">{message.date}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">{message.subject}</h4>
                  <p className="text-white/80 leading-relaxed line-clamp-2">{message.message}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(message);
                      setReplyForm({ subject: `Re: ${message.subject}`, reply: '' });
                      setShowReplyModal(true);
                    }}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Reply
                  </Button>
                  <Button
                    onClick={(e) => handleMarkAsRead(message.id, e)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={message.status === 'read'}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Read
                  </Button>
                  {message.priority === 'high' && (
                    <Button variant="warning" size="sm" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Urgent
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white/80 p-4">No messages found.</div>
          )}
        </div>
      </Table>

      {/* Message Details Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                  <p className="text-white/60">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(selectedMessage.priority)}
                <span className="text-white/60 text-sm">{selectedMessage.date}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">{selectedMessage.subject}</h4>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-white/90 leading-relaxed">{selectedMessage.message}</p>
              </div>
            </div>

            {selectedMessage.attachments?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Attachments</h4>
                <div className="space-y-2">
                  {selectedMessage.attachments.map((attachment) => (
                    <a
                      key={attachment._id}
                      href={attachment.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline block"
                    >
                      {attachment.filename} ({(attachment.size / 1024).toFixed(2)} KB)
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowMessageModal(false);
                  setReplyForm({ subject: `Re: ${selectedMessage.subject}`, reply: '' });
                  setShowReplyModal(true);
                }}
                variant="primary"
                className="flex-1"
              >
                Reply to Message
              </Button>
              <Button variant="secondary">Forward</Button>
              <Button variant="danger">Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setError(null);
        }}
        title="Reply to Message"
        size="lg"
      >
        {selectedMessage && (
          <form onSubmit={handleReplySubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">To</label>
              <Input
                value={selectedMessage.email}
                disabled
                className="bg-white/5 text-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Subject</label>
              <Input
                value={replyForm.subject}
                onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                className="bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Message</label>
              <textarea
                value={replyForm.reply}
                onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                rows="8"
                placeholder="Type your reply..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={replyLoading || !replyForm.reply.trim()}
              >
                {replyLoading ? 'Sending...' : 'Send Reply'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowReplyModal(false);
                  setError(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default Messages;