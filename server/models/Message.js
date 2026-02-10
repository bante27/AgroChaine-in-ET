import mongoose from 'mongoose';

/**
 * CHAT MESSAGE MODEL
 * 
 * Purpose: Stores individual messages within a conversation
 * 
 * Fields:
 * - conversationId: Links message to its conversation
 * - sender: Who sent the message (user/agent/bot)
 * - senderName: Display name of the sender
 * - senderId: User ID or agent ID
 * - message: The actual message content
 * - messageType: Type of message (text/image/file)
 * - attachments: Array of file URLs if user sends files
 * - read: Whether the message has been read by recipient
 * - timestamp: When the message was sent
 */

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true // Index for fast message retrieval by conversation
  },
  sender: {
    type: String,
    enum: ['user', 'agent', 'bot'], // Three types of senders
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000 // Limit message length to prevent abuse
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'], // system = automated messages
    default: 'text'
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String
  }],
  read: {
    type: Boolean,
    default: false // Marks as read when recipient views it
  },
  readAt: {
    type: Date,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting messages by time
  }
}, {
  timestamps: false // We use custom timestamp field
});

// Compound index for efficient querying of conversation messages
messageSchema.index({ conversationId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;