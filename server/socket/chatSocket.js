import { Server } from 'socket.io';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * REAL-TIME CHAT SOCKET SERVER
 * 
 * Purpose: Handles real-time communication between users and support agents
 * 
 * How it works:
 * 1. Users connect from the chat widget on the website
 * 2. Admins connect from the admin dashboard
 * 3. Messages are broadcast in real-time to all connected parties
 * 4. All messages are saved to the database for history
 * 
 * Socket Events:
 * - 'user:join' - User joins a conversation
 * - 'agent:join' - Agent joins to handle conversations
 * - 'message:send' - Someone sends a message
 * - 'message:read' - Message is marked as read
 * - 'typing:start' - Someone starts typing
 * - 'typing:stop' - Someone stops typing
 * - 'conversation:close' - Conversation is closed
 */

let io; // Socket.io instance
const onlineAgents = new Map(); // Track which agents are online
const userSockets = new Map(); // Map userId to socket ID

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance from Express
 */
export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",
                    "http://localhost:5176",
                    "http://localhost:3000",
                    "http://localhost:5000",
                    process.env.CLIENT_URL,
                    process.env.ADMIN_URL
                ].filter(Boolean); // Remove undefined/null entries

                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);

                if (allowedOrigins.indexOf(origin) !== -1 ||
                    origin.includes(".onrender.com") ||
                    origin.includes(".netlify.app")) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', (socket) => {
        console.log(`✅ Socket connected: ${socket.id.slice(0, 5)}...`);

        /**
         * USER JOINS CONVERSATION
         * When a user opens the chat widget
         */
        socket.on('user:join', async (data) => {
            try {
                const { userId, userName, userEmail } = data;

                // Store user's socket ID for direct messaging
                userSockets.set(userId, socket.id);
                socket.userId = userId;
                socket.userType = 'user';

                // Find or create conversation
                let conversation = await Conversation.findOne({
                    userId,
                    status: { $in: ['active', 'waiting'] }
                });

                if (!conversation) {
                    // Create new conversation
                    const conversationId = `conv_${Date.now()}_${userId}`;
                    conversation = new Conversation({
                        conversationId,
                        userId,
                        userName,
                        userEmail,
                        status: 'waiting'
                    });
                    await conversation.save();

                    // Notify all online agents about new conversation
                    io.to('agents').emit('conversation:new', {
                        conversationId,
                        userId,
                        userName,
                        userEmail,
                        createdAt: conversation.createdAt
                    });
                }

                // Join the conversation room
                socket.join(conversation.conversationId);

                // Load recent messages (last 50)
                const messages = await Message.find({
                    conversationId: conversation.conversationId
                })
                    .sort({ timestamp: 1 })
                    .limit(50);

                // Send conversation data and messages to user
                socket.emit('conversation:joined', {
                    conversation,
                    messages
                });

                console.log(`👤 User joined conversation: ${conversation.conversationId.slice(0, 15)}...`);
            } catch (error) {
                console.error('[Socket] Error in user:join:', error.message);
                socket.emit('error', { message: 'Failed to join conversation' });
            }
        });

        /**
         * AGENT JOINS (Admin Dashboard)
         * When an admin opens the chat dashboard
         */
        socket.on('agent:join', async (data) => {
            try {
                const { agentId, agentName } = data;

                socket.agentId = agentId;
                socket.agentName = agentName;
                socket.userType = 'agent';

                // Add agent to agents room
                socket.join('agents');

                // Track online agents
                onlineAgents.set(agentId, {
                    socketId: socket.id,
                    name: agentName,
                    joinedAt: new Date()
                });

                // Load all active conversations
                const conversations = await Conversation.find({
                    status: { $in: ['active', 'waiting'] }
                })
                    .sort({ lastMessageTime: -1 })
                    .limit(100);

                // Send conversations to agent
                socket.emit('conversations:list', conversations);

                // Notify other agents
                io.to('agents').emit('agent:online', {
                    agentId,
                    agentName
                });

                console.log(`👨‍💼 Agent joined (${onlineAgents.size} online)`);
            } catch (error) {
                console.error('[Socket] Error in agent:join:', error.message);
                socket.emit('error', { message: 'Failed to join as agent' });
            }
        });

        /**
         * AGENT TAKES CONVERSATION
         * When an agent clicks to handle a specific conversation
         */
        socket.on('conversation:take', async (data) => {
            try {
                const { conversationId } = data;
                const agentId = socket.agentId;
                const agentName = socket.agentName;

                // Update conversation
                const conversation = await Conversation.findOneAndUpdate(
                    { conversationId },
                    {
                        assignedAgent: agentId,
                        assignedAgentName: agentName,
                        status: 'active'
                    },
                    { new: true }
                );

                if (conversation) {
                    // Join conversation room
                    socket.join(conversationId);

                    // Load messages
                    const messages = await Message.find({ conversationId })
                        .sort({ timestamp: 1 })
                        .limit(100);

                    // Send to agent
                    socket.emit('conversation:messages', {
                        conversationId,
                        messages
                    });

                    // Notify user that agent joined
                    io.to(conversationId).emit('agent:joined', {
                        agentName,
                        message: `${agentName} has joined the conversation`
                    });

                    // Notify other agents
                    io.to('agents').emit('conversation:updated', conversation);

                    console.log(`👨‍💼 Agent assigned to conversation: ${conversationId.slice(0, 15)}...`);
                }
            } catch (error) {
                console.error('[Socket] Error in conversation:take:', error.message);
                socket.emit('error', { message: 'Failed to take conversation' });
            }
        });

        /**
         * SEND MESSAGE
         * When user or agent sends a message
         */
        socket.on('message:send', async (data) => {
            try {
                const { conversationId, message, sender, senderName, senderId } = data;

                // Save message to database
                const newMessage = new Message({
                    conversationId,
                    sender,
                    senderName,
                    senderId,
                    message,
                    messageType: 'text',
                    timestamp: new Date()
                });
                await newMessage.save();

                // Update conversation's last message
                await Conversation.findOneAndUpdate(
                    { conversationId },
                    {
                        lastMessage: message.substring(0, 100),
                        lastMessageTime: new Date(),
                        $inc: { unreadCount: sender === 'user' ? 1 : 0 }
                    }
                );

                // Broadcast message to everyone in the conversation
                io.to(conversationId).emit('message:received', {
                    ...newMessage.toObject(),
                    _id: newMessage._id
                });

                // If user sent message, notify agents
                if (sender === 'user') {
                    io.to('agents').emit('message:notification', {
                        conversationId,
                        userName: senderName,
                        message: message.substring(0, 50)
                    });
                    
                    // Offline AI Auto-Responder
                    // Only respond if NO agents are currently online
                    if (onlineAgents.size === 0) {
                        io.to(conversationId).emit('typing:start', { userName: 'AI Support' });
                        
                        setTimeout(async () => {
                            try {
                                const aiReplyText = "Thank you for reaching out! Our support agents are currently offline, but we have received your message and will get back to you soon.\n\nእናመሰግናለን! አሁን ላይ የድጋፍ ሰጪዎቻችን መስመር ላይ አይደሉም፣ ነገር ግን መልእክትዎን ተቀብለናል በቅርቡ እንመልስልዎታለን።";
                                const botMessage = new Message({
                                    conversationId,
                                    sender: 'agent',
                                    senderName: 'AI Support',
                                    senderId: 'ai-agent',
                                    message: aiReplyText,
                                    messageType: 'text',
                                    timestamp: new Date()
                                });
                                await botMessage.save();

                                // Update conversation's last message
                                await Conversation.findOneAndUpdate(
                                    { conversationId },
                                    {
                                        lastMessage: aiReplyText.substring(0, 100),
                                        lastMessageTime: new Date()
                                    }
                                );

                                io.to(conversationId).emit('typing:stop');
                                io.to(conversationId).emit('message:received', {
                                    ...botMessage.toObject(),
                                    _id: botMessage._id
                                });
                            } catch (err) {
                                console.error('[Socket] AI Response Error:', err.message);
                            }
                        }, 1500); // 1.5 second delay
                    }
                }

                console.log(`💬 Message activity in: ${conversationId.slice(0, 15)}...`);
            } catch (error) {
                console.error('[Socket] Error in message:send:', error.message);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        /**
         * TYPING INDICATOR
         * When someone starts/stops typing
         */
        socket.on('typing:start', (data) => {
            const { conversationId, userName } = data;
            socket.to(conversationId).emit('typing:start', { userName });
        });

        socket.on('typing:stop', (data) => {
            const { conversationId } = data;
            socket.to(conversationId).emit('typing:stop');
        });

        /**
         * MARK MESSAGES AS READ
         * When agent reads user's messages
         */
        socket.on('messages:read', async (data) => {
            try {
                const { conversationId } = data;

                // Mark all unread messages as read
                await Message.updateMany(
                    { conversationId, read: false, sender: 'user' },
                    { read: true, readAt: new Date() }
                );

                // Reset unread count
                await Conversation.findOneAndUpdate(
                    { conversationId },
                    { unreadCount: 0 }
                );

                // Notify user that messages were read
                io.to(conversationId).emit('messages:read', { conversationId });
            } catch (error) {
                console.error('[Socket] Error in messages:read:', error.message);
            }
        });

        /**
         * CLOSE CONVERSATION
         * When agent or user closes the conversation
         */
        socket.on('conversation:close', async (data) => {
            try {
                const { conversationId, rating, feedback } = data;

                const updateData = { status: 'closed' };
                if (rating) updateData.rating = rating;
                if (feedback) updateData.feedback = feedback;

                await Conversation.findOneAndUpdate(
                    { conversationId },
                    updateData
                );

                // Notify everyone in the conversation
                io.to(conversationId).emit('conversation:closed', {
                    conversationId,
                    message: 'This conversation has been closed'
                });

                // Notify agents
                io.to('agents').emit('conversation:updated', {
                    conversationId,
                    status: 'closed'
                });

                console.log(`🔒 Conversation ${conversationId.slice(0, 15)}... closed`);
            } catch (error) {
                console.error('[Socket] Error in conversation:close:', error.message);
            }
        });

        /**
         * DISCONNECT
         * When user or agent disconnects
         */
        socket.on('disconnect', () => {
            if (socket.userType === 'agent' && socket.agentId) {
                // Remove from online agents
                onlineAgents.delete(socket.agentId);

                // Notify other agents
                io.to('agents').emit('agent:offline', {
                    agentId: socket.agentId,
                    agentName: socket.agentName
                });

                console.log(`👨‍💼 Agent ${socket.agentName} disconnected (${onlineAgents.size} agents online)`);
            } else if (socket.userType === 'user' && socket.userId) {
                userSockets.delete(socket.userId);
                console.log(`👤 User ${socket.userId} disconnected`);
            }

            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    console.log('🚀 Socket.io server initialized');
    return io;
};

/**
 * Get Socket.io instance
 * @returns {Server} Socket.io server instance
 */
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

/**
 * Get online agents count
 * @returns {number} Number of online agents
 */
export const getOnlineAgentsCount = () => {
    return onlineAgents.size;
};

/**
 * Send a real-time notification to a specific user
 * @param {string} userId - Target user ID
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 */
export const sendNotification = (userId, type, data) => {
    if (!io) return;

    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification', {
            type,
            data,
            timestamp: new Date()
        });
        console.log(`📡 Real-time notification sent to user ${userId} (type: ${type})`);
    } else {
        console.log(`⚠️ User ${userId} is offline, real-time notification queued in DB (recentActivity)`);
    }
};

export default io;
