# 🚀 AgroChain Ethiopia: Live Chat Technical Analysis & Guide

This document provides a comprehensive breakdown of the integrated Real-Time Live Chat system. It covers the architecture, the logic behind the real-time communication, and the roadmap followed during implementation.

---

## 🏛️ System Architecture

The Live Chat system is built on a **Full-Stack WebSocket Architecture**, ensuring sub-second message delivery and high reliability.

### 🔧 Tech Stack (Materials Used)
- **Frontend Core**: React.js & Vite
- **Styling**: Vanilla CSS with Glassmorphism & Framer Motion for animations
- **Real-Time Engine**: Socket.io (Universal WebSocket wrapper)
- **Backend API**: Node.js & Express
- **Database**: MongoDB & Mongoose (for persistent history)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast & custom audio triggers

---

## 🧠 Core Logic & Workflow

The system uses a **Bilateral Event-Driven Logic**. Instead of the traditional "send and refresh" (HTTP), it maintains an open "pipe" between the client and server.

### 1. User/Guest Entry
- **Logic**: When the chat window opens, the client checks if a `user` object exists from `AuthContext`. 
- **Guest Support**: If no user is logged in, the system generates a temporary `guest_id` and random `Guest_XYZ` name.
- **Socket Event**: `user:join` is emitted with user details.

### 2. The Server "Brain" (`chatSocket.js`)
- **Conversation Management**: The server looks for an existing "active" or "waiting" conversation in MongoDB. If none exists, it creates one.
- **Rooms**: Every conversation is assigned a unique `conversationId` which acts as a private Socket.io "Room". Only the User and the Assigned Agent can "hear" messages in this room.
- **Agent Notifications**: When a new conversation starts, a notification is broadcast to all online agents in the `agents` administrative room.

### 3. Real-Time Messaging Lifecycle
1. **Emit**: Client emits `message:send` with the payload.
2. **Persist**: Server saves the message to the `Message` collection in MongoDB.
3. **Update**: Server updates the `Conversation` collection (last message, unread count).
4. **Broadcast**: Server emits `message:received` to the specific Room.
5. **UI Update**: Both User and Agent see the message instantly via React state updates.

---

## 🗺️ Implementation Roadmap (What We Built)

### ✅ Phase 1: Backend Foundation
- Created **Mongoose Models** (`Conversation.js`, `Message.js`) for data persistence.
- Refined `server.js` to support HTTP server instances (required for WebSockets).
- Engineered the `chatSocket.js` logic to handle concurrency and agent assignments.

### ✅ Phase 2: Global Integration
- Integrated `LiveChatRealTime.jsx` into the global `Layout.jsx`.
- **Result**: Chat is now available on every page (Home, About, Marketplace, etc.) without code duplication.

### ✅ Phase 3: Admin Empowerment
- Built the **Admin Chat Dashboard**.
- Added a "Live Chat" link to the Sidebar with real-time unread badges.
- Implemented the "Take Conversation" feature so agents can claim chats.

### ✅ Phase 4: UI Modernization (Premium Feel)
- **Glassmorphism**: Implemented semi-transparent, blurred backgrounds for a "Modern SaaS" aesthetic.
- **Tiny & Non-Intrusive**: Reduced the default size and added draggability.
- **Emerald Theme**: Aligned colors with the AgroChain "Nature/Earth" theme (Emerald/Teal gradients).

### ✅ Phase 5: Localization (Amharic/English)
- Added full translation mapping in `LanguageContext.jsx`.
- Fixed "Key Leakage" (ensuring UI shows "Support" instead of `chat.title`).

---

## 🛠️ Tools Used for Development

| Tool | Purpose |
| :--- | :--- |
| **npm** | Dependency management (installed `socket.io`, `socket.io-client`). |
| **Mongoose** | Schema modeling for reliable data storage. |
| **Glassmorphism CSS** | To create the premium blur and transparency effects. |
| **CORS Middleware** | Configured to allow cross-origin communication between ports `5173`, `5174`, and `5175`. |
| **Vite** | Fast HMR (Hot Module Replacement) during live chat UI iteration. |

---

## 📈 Future Roadmap Enhancements

1. **File Attachments**: Allow users to send photos of products or receipts directly in chat.
2. **AI Co-Pilot**: An automated bot that handles the first 30 seconds of a chat while waiting for a human agent.
3. **Chat Ratings**: Allow users to rate the support experience (1-5 stars).
4. **Push Notifications**: Browser notifications so users know when an agent replies even if they are on another tab.

---

### 🚨 Quick Troubleshooting for Admins
- **Stuck on Reconnecting?** Ensure the server is running and your port is allowed in the `chatSocket.js` CORS configuration.
- **Can't see User Text?** Check the "Waiting" tab in the Dashboard. You must "Join/Take" a conversation before you can interact.

---
*Document Created & Updated: February 10, 2026*
