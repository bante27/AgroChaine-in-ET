import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Eye, AlertTriangle, Search, Filter, CheckCircle } from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');//change to real api
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/read`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredMessages = messages.filter(message => 
    message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      low: { color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.low;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {priority} priority
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
              className="w-64"
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        ]}
      >
        <div className="space-y-4">
          {filteredMessages.map((message) => (
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
                    handleMarkAsRead(message.id);
                  }}
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
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
          ))}
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
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setShowMessageModal(false);
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
        onClose={() => setShowReplyModal(false)}
        title="Reply to Message"
        size="lg"
      >
        {selectedMessage && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">To</label>
              <Input 
                value={selectedMessage.email} 
                disabled 
                className="bg-white/5" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Subject</label>
              <Input 
                value={`Re: ${selectedMessage.subject}`}
                className="bg-white/10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Message</label>
              <textarea 
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                rows="8"
                placeholder="Type your reply..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="flex-1">Send Reply</Button>
              <Button 
                type="button"
                onClick={() => setShowReplyModal(false)}
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