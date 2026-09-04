/**
 * REAL-TIME LIVECHAT WIDGET
 * 
 * Purpose: Provides a chat interface for users to get instant support
 * 
 * Features:
 * - Real-time messaging with WebSocket (Socket.io)
 * - Draggable and resizable chat window
 * - Typing indicators
 * - Message history
 * - Auto-scroll to latest message
 * - Connection status indicator
 * - Bilingual support (English/Amharic)
 * 
 * How it works:
 * 1. User clicks chat button
 * 2. Widget connects to Socket.io server
 * 3. Creates or joins existing conversation
 * 4. Messages are sent/received in real-time
 * 5. Agent can respond from admin dashboard
 */

import React, { useEffect, useRef, useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import Draggable from 'react-draggable';
import { io } from 'socket.io-client';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveChatRealTime() {
    const { user } = useAuth();
    const { t } = useLanguage();

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');

    useEffect(() => {
        window.openChat = () => setIsOpen(true);
        return () => {
            delete window.openChat;
        };
    }, []);

    // Connection State
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [agentName, setAgentName] = useState(null);

    // Refs
    const listRef = useRef(null);
    const nodeRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && nodeRef.current && !nodeRef.current.contains(event.target)) {
                // Allow a small buffer zone, but generally if they click outside, minimize the chat
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Use timeout to prevent immediate close on the same click that opened it
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchstart', handleClickOutside);
            }, 50);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    /**
     * Initialize Socket.io connection when chat opens
     */
    useEffect(() => {
        if (isOpen && !socket) {
            // Create socket connection
            const newSocket = io(API_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            // Connection successful
            newSocket.on('connect', () => {
                console.log('✅ Connected to chat server');
                setIsConnected(true);

                // Join conversation as user
                // Use logged-in user details OR generate guest details
                const chatUser = user ? {
                    userId: user.userId,
                    userName: user.fullName,
                    userEmail: user.email
                } : {
                    userId: `guest_${Date.now()}`,
                    userName: `Guest_${Math.floor(Math.random() * 1000)}`,
                    userEmail: 'guest@agrochain.com'
                };

                newSocket.emit('user:join', chatUser);
            });

            // Connection failed
            newSocket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                setIsConnected(false);
                toast.error(t('chat.connectionError') || 'Connection failed');
            });

            // Disconnected
            newSocket.on('disconnect', () => {
                console.log('❌ Disconnected from chat server');
                setIsConnected(false);
            });

            // Conversation joined successfully
            newSocket.on('conversation:joined', (data) => {
                setConversationId(data.conversation.conversationId);
                setMessages(data.messages || []);

                if (data.conversation.assignedAgentName) {
                    setAgentName(data.conversation.assignedAgentName);
                }
            });

            // Agent joined the conversation
            newSocket.on('agent:joined', (data) => {
                setAgentName(data.agentName);

                // Add system message
                setMessages(prev => [...prev, {
                    sender: 'system',
                    message: data.message,
                    timestamp: new Date()
                }]);

                toast.success(`${data.agentName} ${t('chat.agentJoined') || 'joined the chat'}`);
            });

            // New message received
            newSocket.on('message:received', (message) => {
                setMessages(prev => [...prev, message]);

                // Play notification sound if message is from agent
                if (message.sender === 'agent') {
                    playNotificationSound();
                }
            });

            // Someone is typing
            newSocket.on('typing:start', (data) => {
                setIsTyping(true);
                setTypingUser(data.userName);
            });

            // Stopped typing
            newSocket.on('typing:stop', () => {
                setIsTyping(false);
                setTypingUser('');
            });

            // Conversation closed
            newSocket.on('conversation:closed', (data) => {
                toast.info(t('chat.conversationClosed') || 'Conversation closed');
                setMessages(prev => [...prev, {
                    sender: 'system',
                    message: data.message,
                    timestamp: new Date()
                }]);
            });

            // Error handling
            newSocket.on('error', (data) => {
                toast.error(data.message);
            });

            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                newSocket.close();
            };
        }
    }, [isOpen]);

    /**
     * Auto-scroll to bottom when new messages arrive
     */
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    /**
     * Send message to server
     */
    const sendMessage = () => {
        const text = input.trim();
        if (!text || !socket || !conversationId) return;

        // Emit message to server
        socket.emit('message:send', {
            conversationId,
            message: text,
            sender: 'user',
            senderName: user ? user.fullName : 'Guest',
            senderId: user ? user.userId : socket.id
        });

        // Clear input
        setInput('');

        // Stop typing indicator
        socket.emit('typing:stop', { conversationId });
    };

    /**
     * Handle typing indicator
     */
    const handleTyping = (e) => {
        setInput(e.target.value);

        if (!socket || !conversationId) return;

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Emit typing start
        socket.emit('typing:start', {
            conversationId,
            userName: user ? user.fullName : 'Guest'
        });

        // Set timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId });
        }, 2000);
    };

    /**
     * Handle Enter key to send
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /**
     * Play notification sound
     */
    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.4;
            audio.play().catch(() => {
                // Ignore if audio fails to play
            });
        } catch (error) {
            // Ignore audio errors
        }
    };

    /**
     * Close chat and cleanup
     */
    const closeChat = () => {
        setIsOpen(false);
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    /**
     * Format timestamp
     */
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white rounded-2xl shadow-[0_8px_30px_rgb(16,185,129,0.3)] flex items-center justify-center relative group overflow-hidden border border-white/20"
                    >
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                        <MessageCircle className="w-7 h-7" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-emerald-600 z-10"></span>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/20 to-transparent pointer-events-none"></div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <Draggable nodeRef={nodeRef} handle=".chat-handle">
                        <motion.div
                            ref={nodeRef}
                            initial={{ y: 50, opacity: 0, scale: 0.9, transformOrigin: 'bottom right' }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute bottom-0 right-0 w-[85vw] max-w-[350px] sm:w-[380px] h-[65dvh] max-h-[480px] sm:h-[520px] bg-white dark:bg-gray-950/95 backdrop-blur-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-200/50 dark:border-white/5 ring-1 ring-black/5 z-[9999]"
                        >
                            {/* Header - Fixed & Premium */}
                            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white px-6 py-5 flex items-center justify-between chat-handle cursor-grab active:cursor-grabbing relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                                            <MessageCircle className="w-7 h-7 text-emerald-50" />
                                        </div>
                                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-emerald-700 ${isConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-400'}`}></span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[15px] leading-none mb-1 shadow-sm">
                                            {t('nav.chat.title') || 'AgroChain Support'}
                                        </h3>
                                        <div className="flex items-center gap-1.5 opacity-90">
                                            <p className="text-[11px] font-medium text-emerald-100/90 whitespace-nowrap">
                                                {agentName ? `${t('nav.chat.chatWith') || 'Chat with'} ${agentName}` : (isConnected ? 'Online & Ready' : 'Connecting...')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeChat}
                                    className="rounded-xl p-2 transition-colors relative z-10"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Messages List */}
                            <div
                                ref={listRef}
                                className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/30 dark:bg-transparent scroll-smooth scrollbar-none"
                            >
                                <AnimatePresence mode="popLayout">
                                    {messages.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-12 px-6"
                                        >
                                            <div className="w-20 h-20 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-5 shadow-inner">
                                                <MessageCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h4 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">
                                                {t('nav.chat.welcomeHeader') || 'Hello! 👋'}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                {t('nav.chat.welcomeMessage') || 'How can we help you succeed today? Our team is live and ready.'}
                                            </p>
                                        </motion.div>
                                    )}

                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            layout
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.sender === 'system' ? (
                                                <div className="w-full text-center py-2">
                                                    <span className="px-4 py-1.5 bg-gray-200/50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-500 dark:text-gray-400 rounded-full backdrop-blur-sm">
                                                        {msg.message}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] group`}>
                                                    <div
                                                        className={`px-4 py-3 rounded-[1.5rem] text-[13px] shadow-sm transform transition-transform group-hover:scale-[1.02] ${msg.sender === 'user'
                                                            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-none shadow-emerald-500/10'
                                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-bl-none shadow-black/5'
                                                            }`}
                                                    >
                                                        {msg.sender === 'agent' && (
                                                            <p className="text-[11px] font-extrabold mb-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                                                {msg.senderName}
                                                            </p>
                                                        )}
                                                        <p className="leading-[1.6] font-medium">{msg.message}</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 mt-2 px-2 font-semibold">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="flex justify-start items-center gap-2"
                                        >
                                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 px-4 py-3 rounded-[1.25rem] rounded-bl-none shadow-sm flex gap-1.5">
                                                <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse uppercase tracking-tight">
                                                {typingUser} is typing...
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area - Floating Experience */}
                            <div className="px-6 py-6 pb-8 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md border-t border-gray-100/50 dark:border-white/5 shrink-0">
                                <div className="relative flex items-end gap-3 bg-gray-100/80 dark:bg-gray-800/80 p-3 rounded-[1.75rem] border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all duration-300 shadow-inner">
                                    <textarea
                                        rows={1}
                                        value={input}
                                        onChange={handleTyping}
                                        onKeyDown={handleKeyDown}
                                        placeholder={t('nav.chat.typePlaceholder') || 'Type your message...'}
                                        disabled={!isConnected}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-gray-800 dark:text-gray-200 py-1.5 px-3 resize-none max-h-32 scrollbar-none font-medium placeholder:text-gray-400"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={sendMessage}
                                        disabled={!isConnected || !input.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white p-3 rounded-2xl transition-colors shadow-lg shadow-emerald-500/30 active:shadow-none shrink-0"
                                    >
                                        <Send className="w-5 h-5 fill-white/10" />
                                    </motion.button>
                                </div>
                                {!isConnected && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center gap-2 mt-3"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></div>
                                        <p className="text-[11px] font-bold text-red-500 tracking-wide uppercase">
                                            {t('nav.chat.reconnecting') || 'Offline • Attempting to Connect'}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </Draggable>
                )}
            </AnimatePresence>
        </div>
    );
}
