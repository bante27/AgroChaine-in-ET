import mongoose from 'mongoose';

/**
 * CHAT CONVERSATION MODEL
 * 
 * Purpose: Stores information about each chat conversation between a user and support agents
 * 
 * Fields:
 * - conversationId: Unique identifier for the conversation
 * - userId: ID of the user who started the chat
 * - userName: Display name of the user
 * - userEmail: Email for follow-up communication
 * - status: Current state of the conversation (active/closed)
 * - assignedAgent: Which admin/agent is handling this chat
 * - lastMessage: Preview of the most recent message
 * - unreadCount: Number of unread messages (for admin dashboard)
 * - createdAt/updatedAt: Timestamps for tracking
 */

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true,
        index: true // Index for faster lookups
    },
    userId: {
        type: String,
        required: true,
        index: true // Index to find all conversations for a user
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'waiting'], // waiting = user waiting for agent
        default: 'waiting'
    },
    assignedAgent: {
        type: String,
        default: null // null means no agent assigned yet
    },
    assignedAgentName: {
        type: String,
        default: null
    },
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageTime: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Number,
        default: 0 // Increments when user sends message, resets when agent reads
    },
    tags: [{
        type: String // e.g., 'payment', 'verification', 'technical'
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null // User can rate the conversation after it's closed
    },
    feedback: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for finding active conversations quickly
conversationSchema.index({ status: 1, createdAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
