import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, AlertTriangle, Search, Filter, CheckCircle, Trash2 } from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';

// ✅ Add below your imports (right after "import { useAuth } from '../context/AuthContext';")
const getFullURL = (path) => {
  if (!path) return '#';
  if (path.startsWith('http')) {
    // Standardize Cloudinary URLs
    if (path.includes('cloudinary.com')) {
      const isImage = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(path.split('?')[0]);
      const isVideoOrAudio = /\.(mp4|webm|mp3|wav|ogg|m4a)$/i.test(path.split('?')[0]);

      // Only apply fl_attachment to images to force download if required.
      // Raw and Video files should be accessed via their respective types.
      if (path.includes('/image/upload/') && isImage && !path.includes('fl_attachment')) {
        return path.replace('/upload/', '/upload/fl_attachment/');
      }

      // For raw files (PDFs, docs), ensure we use the 'raw' resource type in the URL if not already there
      // But path usually comes correctly from the backend.
      return path;
    }
    return path;
  }
  return `${API_URL}${path}`;
};

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
      const response = await axios.get(`${API_URL}/api/admin/messages`, {
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
        `${API_URL}/api/admin/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedMessage?.id === messageId) setShowMessageModal(false);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message.');
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
        `${API_URL}/api/admin/messages/${selectedMessage.id}/reply`,
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
      high: {
        color:
          'bg-red-100 text-red-600 border-red-500 dark:bg-red-600/20 dark:text-red-400 dark:border-red-600',
        label: 'High',
      },
      medium: {
        color:
          'bg-yellow-100 text-yellow-600 border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500',
        label: 'Medium',
      },
      low: {
        color:
          'bg-green-100 text-green-600 border-green-500 dark:bg-green-600/20 dark:text-green-400 dark:border-green-600',
        label: 'Low',
      },
    }[priority] || {
      color:
        'bg-green-100 text-green-600 border-green-500 dark:bg-green-600/20 dark:text-green-400 dark:border-green-600',
      label: 'Low',
    };

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
      <div className="flex items-center justify-center min-h-[24rem] bg-gray-100 dark:bg-gray-900">
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
              className="w-64 bg-white text-gray-900 border border-gray-300 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300"
            >
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
                className={`bg-white dark:bg-gray-800 border rounded-2xl p-6 transition hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${message.status === 'pending'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
                onClick={() => {
                  setSelectedMessage(message);
                  setShowMessageModal(true);
                  if (message.status === 'pending') handleMarkAsRead(message.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedMessage(message);
                    setShowMessageModal(true);
                    if (message.status === 'pending') handleMarkAsRead(message.id);
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
                      <h3 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                        {message.name}
                        {message.status === 'pending' && (
                          <span
                            className="w-2 h-2 bg-emerald-500 rounded-full"
                            aria-label="Unread message indicator"
                          />
                        )}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(message.priority)}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{message.date}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-gray-900 dark:text-white font-medium mb-2 truncate">
                    {message.subject}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {message.message}
                  </p>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message.id);
                    }}
                    variant="danger"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  {message.priority === 'high' && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Urgent
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6">
              No messages found.
            </div>
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{selectedMessage.email}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(selectedMessage.email);
                        // Optional: Show a small tooltip/toast "Copied!"
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded border border-emerald-100 transition-colors"
                      title="Copy Email"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getPriorityBadge(selectedMessage.priority)}
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {selectedMessage.date}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 truncate">
                {selectedMessage.subject}
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {selectedMessage.attachments?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Attachments ({selectedMessage.attachments.length})
                </h4>
                <div className="space-y-3">
                  {selectedMessage.attachments.map((attachment, index) => {
                    const isAudio =
                      attachment.mimetype?.startsWith("audio/") ||
                      attachment.contentType?.startsWith("audio/") ||
                      (attachment.filename && attachment.filename.endsWith(".webm"));

                    const fileName = attachment.filename || attachment.originalname || `File ${index + 1}`;
                    const fileSize = attachment.size ? `(${(attachment.size / 1024).toFixed(2)} KB)` : "";

                    // Robust URL handling
                    let fileUrl = "#";
                    if (attachment.path) {
                      fileUrl = getFullURL(attachment.path);
                    } else if (attachment.url) { // Fallback for some cloudinary responses
                      fileUrl = attachment.url;
                    }

                    return (
                      <div
                        key={attachment._id || index}
                        className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[70%] flex items-center gap-2">
                            {isAudio ? "🎤 Voice Message" : "📎 Document"}
                            <span className="text-gray-500 font-normal text-xs ml-1">{fileName}</span>
                          </span>
                          <span className="text-xs text-gray-500">{fileSize}</span>
                        </div>

                        {isAudio ? (
                          <audio
                            controls
                            className="w-full mt-1"
                            src={fileUrl}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={fileName}
                            className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 hover:underline text-sm font-medium flex items-center gap-2 mt-1 p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded border border-emerald-100 dark:border-emerald-800 transition-colors"
                            onClick={(e) => {
                              // If it's a raw file (no extension in Cloudinary URL sometimes), browser might download instead of view
                              // Not much we can do if it's 401, but at least we try to open.
                            }}
                          >
                            Download / View Document <span className="text-xs">↗</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
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
              <Button
                onClick={() => handleDelete(selectedMessage.id)}
                variant="danger"
                className="flex-1"
              >
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
              <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-500 dark:bg-red-600/20 dark:text-red-400 dark:border-red-600">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="reply-to"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                To
              </label>
              <Input
                id="reply-to"
                value={selectedMessage.email}
                disabled
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed border border-gray-300 dark:border-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="reply-subject"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Subject
              </label>
              <Input
                id="reply-subject"
                value={replyForm.subject}
                onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="reply-message"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="reply-message"
                value={replyForm.reply}
                onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
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
