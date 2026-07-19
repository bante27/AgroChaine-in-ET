<<<<<<< HEAD
# 🌾 AgroChain Ethiopia - Next-Gen Agricultural Ecosystem

AgroChain Ethiopia is a premium, full-stack decentralized agricultural platform designed to empower Ethiopian farmers and buyers. It integrates real-time weather analytics, a transparent marketplace, secure payment systems, and ultra-modern live support.

---

## 🏗️ Folder Structure

The project is organized into three main pillars: **Client**, **Admin**, and **Backend**.

```text
agrochain-ethiopia/
├── client/                 # User-facing Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI (Chat, Navbar, Product Cards)
│   │   ├── contexts/        # Auth, Language (Amharic/English), Theme
│   │   ├── pages/           # Home, Marketplace, Dashboard, About
│   │   └── utils/           # API configurations, helpers
│   └── public/              # Static assets (logos, sounds)
│
├── Admin/                  # Premium Admin Control Panel
│   ├── src/
│   │   ├── pages/           # ChatDashboard, User Management, Analytics
│   │   ├── components/      # Sidebar, Layout, Stat Cards
│   │   └── context/         # Admin Authentication & Theme
│   └── public/              # Admin-specific assets
│
├── server/                 # Node.js + Express Backend
│   ├── config/              # Database (MongoDB) connection
│   ├── controllers/         # Business logic (User, Product, Order)
│   ├── models/              # Mongoose Schemas (User, Conversation, Message)
│   ├── routes/              # API Endpoints
│   ├── socket/              # Real-time WebSocket (Socket.io) logic
│   └── utils/               # Secure encryption, Email (Resend/Gmail)
│
└── docs/                   # System Documentation & Analysis
```

---

## 💻 Tech Stack & Implementation Languages

| Layer | Technologies | Language |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Framer Motion, Tailwind CSS | JavaScript / JSX |
| **Admin** | React, TypeScript, Lucide Icons | JavaScript / TSX |
| **Backend** | Node.js, Express, Socket.io | JavaScript (ESM) |
| **Database** | MongoDB Atlas, Mongoose | NoSQL |
| **Real-Time** | WebSockets (via Socket.io) | JavaScript |
| **Email/Auth** | Resend API, JWT (JSON Web Tokens) | JavaScript |

---

## ⚙️ How the System Works

### 1. Real-Time Communication (The Heart)
The system uses **Socket.io** to bridge the gap between users and support agents. 
- When a user opens the **Live Chat**, a persistent connection is established.
- **Bi-directional Flow**: Messages travel instantly from the user's browser to the server and are immediately broadcast to the Admin's "Live Chat Room" without page refreshes.

### 2. Marketplace & Transactions
- **Blockchain Ready**: Designed for transparency. Every product has a trackable history.
- **Search & Filters**: Users can filter products by Category, Region, and Price.

### 3. Localization (Bilingual Engine)
The platform features a custom-built **LanguageContext** that translates the entire UI between **English** and **Amharic** instantly. This includes dynamic data like error messages, chat status, and weather suggestions.

### 4. Admin Intelligence
The Admin panel provides a 360-degree view of the platform:
- **Conversation Management**: Claim chats, view user history, and close tickets.
- **Product Verification**: Approve or reject farmer listings.
- **Analytics**: Real-time stats on total users, revenue, and pending verifications.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- NPM or Yarn

### Step 1: Server Setup
```bash
cd server
npm install
# Configure your .env file with MONGO_URI, JWT_SECRET, etc.
npm run dev
```

### Step 2: Client Setup
```bash
cd client
npm install
npm run dev
```

### Step 3: Admin Setup
```bash
cd admin
npm install
npm run dev
```

---

## 🔐 Security & Optimization
- **JWT Authentication**: Secure login for both users and admins.
- **CORS Management**: Strict origin filtering to prevent unauthorized API access.
- **Glassmorphism UI**: High-performance CSS blurs for a premium look without sacrificing speed.
- **Framer Motion**: Hardware-accelerated animations for the mobile-responsive chat widget.

---
*Created by the AgroChain Development Team - 2026*
=======
# AgroChaine-in-ET
>>>>>>> 2cb5feef7a404d7a17dcbdc499a14a3c3345d686
