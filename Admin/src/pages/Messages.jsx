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
    if (token) fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
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
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId, e) => {
    e?.stopPropagation();
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
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
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'Failed to send reply';
      setError(errorMsg);
      console.error('Error sending reply:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority) => {
    const config = {
      high: { color: 'bg-red-600/20 text-red-500 border-red-600', label: 'High' },
      medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', label: 'Medium' },
      low: { color: 'bg-green-600/20 text-green-500 border-green-600', label: 'Low' },
    }[priority] || { color: 'bg-green-600/20 text-green-500 border-green-600', label: 'Low' };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
        aria-label={`${config.label} priority`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[24rem] bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      <Table
        title="Message Center"
        icon={MessageSquare}
        actions={[
          <div key="search" className="flex items-center gap-3">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-64 bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
            />
            <Button variant="ghost" size="icon" className="hover:bg-gray-800 text-gray-300">
              <Filter className="h-4 w-4" />
            </Button>
          </div>,
        ]}
      >
        <div className="space-y-5">
          {filteredMessages.length ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-gray-800 border rounded-2xl p-6 transition hover:bg-gray-700 cursor-pointer ${
                  message.status === 'unread' ? 'border-emerald-500 bg-emerald-900/10' : 'border-gray-700'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  setShowMessageModal(true);
                  if (message.status === 'unread') handleMarkAsRead(message.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedMessage(message);
                    setShowMessageModal(true);
                    if (message.status === 'unread') handleMarkAsRead(message.id);
                  }
                }}
                aria-label={`View message from ${message.name} with subject ${message.subject}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {message.name}
                        {message.status === 'unread' && (
                          <span
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                            aria-label="Unread message indicator"
                          />
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(message.priority)}
                    <span className="text-gray-400 text-sm">{message.date}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-white font-medium mb-2 truncate">{message.subject}</h4>
                  <p className="text-gray-300 leading-relaxed line-clamp-2">{message.message}</p>
                </div>

                <div className="flex gap-3">
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
                    <Button variant="warning" size="sm" className="flex items-center gap-2" disabled>
                      <AlertTriangle className="h-4 w-4" />
                      Urgent
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 p-6">No messages found.</div>
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedMessage.name}</h3>
                  <p className="text-gray-400">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getPriorityBadge(selectedMessage.priority)}
                <span className="text-gray-400 text-sm">{selectedMessage.date}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4 truncate">{selectedMessage.subject}</h4>
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
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
                      className="text-emerald-500 hover:underline block"
                    >
                      {attachment.filename} ({(attachment.size / 1024).toFixed(2)} KB)
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
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
              <Button variant="secondary" className="flex-1">
                Forward
              </Button>
              <Button variant="danger" className="flex-1">
                Delete
              </Button>
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
          <form onSubmit={handleReplySubmit} className="space-y-6">
            {error && (
              <div className="bg-red-600/20 text-red-500 p-3 rounded-lg border border-red-600">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="reply-to" className="block text-sm font-semibold text-gray-300 mb-2">
                To
              </label>
              <Input
                id="reply-to"
                value={selectedMessage.email}
                disabled
                className="bg-gray-800 text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="reply-subject" className="block text-sm font-semibold text-gray-300 mb-2">
                Subject
              </label>
              <Input
                id="reply-subject"
                value={replyForm.subject}
                onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                className="bg-gray-900 text-white"
              />
            </div>

            <div>
              <label htmlFor="reply-message" className="block text-sm font-semibold text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="reply-message"
                value={replyForm.reply}
                onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                rows={8}
                placeholder="Type your reply..."
              />
            </div>

            <div className="flex gap-4">
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
                className="flex-1"
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
