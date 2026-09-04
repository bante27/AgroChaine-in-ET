/**
 * ADMIN CHAT DASHBOARD
 * 
 * Purpose: Allows support agents to view and respond to user chats in real-time
 * 
 * Features:
 * - List of all active conversations
 * - Real-time message updates
 * - Assign conversations to agents
 * - Send messages to users
 * - Typing indicators
 * - Unread message counts
 * - Close conversations
 * - Search and filter conversations
 * 
 * How it works:
 * 1. Agent logs into admin dashboard
 * 2. Connects to Socket.io as an agent
 * 3. Sees list of waiting/active conversations
 * 4. Clicks on conversation to view messages
 * 5. Sends real-time responses to users
 */

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import {
    MessageCircle,
    Send,
    User,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Wifi,
    WifiOff
} from 'lucide-react';
import { API_URL } from '../utils/apiConfig';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminChatDashboard() {
    const { user: adminUser } = useAuth();

    // Connection State
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Conversations State
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    // UI State
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, waiting, active, closed

    // Refs
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedConversationRef = useRef(null);

    // Get admin info from AuthContext
    const agentId = adminUser?.userId || 'admin';
    const agentName = adminUser?.fullName || 'Admin';

    /**
     * Initialize Socket.io connection
     */
    useEffect(() => {
        const newSocket = io(API_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        // Connection successful
        newSocket.on('connect', () => {
            console.log('✅ Admin connected to chat server');
            setIsConnected(true);

            // Join as agent
            newSocket.emit('agent:join', {
                agentId,
                agentName
            });
        });

        // Connection error
        newSocket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
            setIsConnected(false);
            toast.error('Failed to connect to chat server');
        });

        // Disconnected
        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from chat server');
            setIsConnected(false);
        });

        // Receive list of conversations
        newSocket.on('conversations:list', (convos) => {
            setConversations(convos);
        });

        // New conversation created
        newSocket.on('conversation:new', (convo) => {
            setConversations(prev => [convo, ...prev]);
            toast.success(`New chat from ${convo.userName}`);
            playNotificationSound();
        });

        // Conversation updated
        newSocket.on('conversation:updated', (convo) => {
            setConversations(prev =>
                prev.map(c => c.conversationId === convo.conversationId ? { ...c, ...convo } : c)
            );
        });

        // Receive messages for a conversation
        newSocket.on('conversation:messages', (data) => {
            setMessages(data.messages);
        });

        // New message received
        newSocket.on('message:received', (message) => {
            // Only add to messages list if it belongs to the currently selected conversation
            if (selectedConversationRef.current === message.conversationId) {
                setMessages(prev => [...prev, message]);
            }

            // Update conversation's last message in the sidebar list
            setConversations(prev =>
                prev.map(c =>
                    c.conversationId === message.conversationId
                        ? { ...c, lastMessage: message.message, lastMessageTime: message.timestamp }
                        : c
                )
            );

            // Play sound if message is from user
            if (message.sender === 'user') {
                playNotificationSound();
            }
        });

        // New message notification
        newSocket.on('message:notification', (data) => {
            // Update unread count and last message in the sidebar list
            setConversations(prev =>
                prev.map(c =>
                    c.conversationId === data.conversationId
                        ? {
                            ...c,
                            unreadCount: selectedConversationRef.current === data.conversationId ? 0 : (c.unreadCount || 0) + 1,
                            lastMessage: data.message,
                            lastMessageTime: new Date()
                        }
                        : c
                )
            );
        });

        // Typing indicator
        newSocket.on('typing:start', (data) => {
            setIsTyping(true);
        });

        newSocket.on('typing:stop', () => {
            setIsTyping(false);
        });

        // Agent status updates
        newSocket.on('agent:online', (data) => {
            toast.success(`${data.agentName} is now online`);
        });

        newSocket.on('agent:offline', (data) => {
            toast.info(`${data.agentName} went offline`);
        });

        setSocket(newSocket);

        // Cleanup
        return () => {
            newSocket.close();
        };
    }, []);

    /**
     * Auto-scroll to bottom when new messages arrive
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /**
     * Take/Open a conversation
     */
    const openConversation = (convo) => {
        if (!socket) return;

        setSelectedConversation(convo);
        selectedConversationRef.current = convo.conversationId;
        setMessages([]);

        // Take the conversation
        socket.emit('conversation:take', {
            conversationId: convo.conversationId
        });

        // Mark messages as read
        socket.emit('messages:read', {
            conversationId: convo.conversationId
        });

        // Reset unread count locally
        setConversations(prev =>
            prev.map(c =>
                c.conversationId === convo.conversationId
                    ? { ...c, unreadCount: 0 }
                    : c
            )
        );
    };

    /**
     * Send message
     */
    const sendMessage = () => {
        const text = input.trim();
        if (!text || !socket || !selectedConversation) return;

        socket.emit('message:send', {
            conversationId: selectedConversation.conversationId,
            message: text,
            sender: 'agent',
            senderName: agentName,
            senderId: agentId
        });

        setInput('');
        socket.emit('typing:stop', { conversationId: selectedConversation.conversationId });
    };

    /**
     * Handle typing
     */
    const handleTyping = (e) => {
        setInput(e.target.value);

        if (!socket || !selectedConversation) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socket.emit('typing:start', {
            conversationId: selectedConversation.conversationId,
            userName: agentName
        });

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId: selectedConversation.conversationId });
        }, 2000);
    };

    /**
     * Close conversation
     */
    const closeConversation = () => {
        if (!socket || !selectedConversation) return;

        socket.emit('conversation:close', {
            conversationId: selectedConversation.conversationId
        });

        setSelectedConversation(null);
        setMessages([]);
        toast.success('Conversation closed');
    };

    /**
     * Play notification sound
     */
    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch (error) { }
    };

    /**
     * Format time
     */
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString();
    };

    /**
     * Filter conversations
     */
    const filteredConversations = conversations.filter(convo => {
        const matchesSearch = convo.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            convo.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || convo.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Live Chat Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage customer conversations in real-time
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Wifi className="w-5 h-5" />
                                <span className="text-sm font-medium">Connected</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-600">
                                <WifiOff className="w-5 h-5" />
                                <span className="text-sm font-medium">Disconnected</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-96 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
                    {/* Search and Filter */}
                    <div className="p-4 border-b dark:border-gray-700 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'waiting', 'active', 'closed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p>No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map(convo => (
                                <div
                                    key={convo.conversationId}
                                    onClick={() => openConversation(convo)}
                                    className={`p-4 border-b dark:border-gray-700 cursor-pointer transition-colors ${selectedConversation?.conversationId === convo.conversationId
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {convo.userName}
                                            </span>
                                        </div>
                                        {convo.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {convo.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                                        {convo.lastMessage || 'No messages yet'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(convo.lastMessageTime || convo.createdAt)}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full font-medium ${convo.status === 'waiting'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : convo.status === 'active'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                                }`}
                                        >
                                            {convo.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {selectedConversation.userName}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedConversation.userEmail}
                                    </p>
                                </div>
                                <button
                                    onClick={closeConversation}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Close Chat
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender === 'agent'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.sender === 'user' && (
                                                <p className="text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400">
                                                    {msg.senderName}
                                                </p>
                                            )}
                                            <p className="break-words">{msg.message}</p>
                                            <p
                                                className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-blue-200' : 'text-gray-400'
                                                    }`}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-4 py-2 rounded-2xl">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
                                <div className="flex gap-3">
                                    <textarea
                                        value={input}
                                        onChange={handleTyping}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        rows={2}
                                        className="flex-1 resize-none border dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                <p className="text-lg font-medium">Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
