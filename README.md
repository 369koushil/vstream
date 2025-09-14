# 🎵 VStream - Collaborative Music Video Streaming Platform

> **Watch and Listen Together in Real-Time!** - A synchronized video streaming platform where friends can collaborate on music playlists, vote for favorite tracks, and enjoy YouTube videos together in real-time.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🎥 **Synchronized Video Streaming**
- **Real-time playback synchronization** - All users watch videos in perfect sync
- **YouTube integration** - Stream any YouTube video directly
- **Host controls** - Room creators have full control over playback (play/pause/seek)

### 🗳️ **Democratic Queue System**
- **Collaborative playlists** - Anyone can add videos to the queue
- **Voting mechanism** - Users vote to decide what plays next
- **Dynamic reordering** - Most popular videos automatically rise to the top

### 👥 **Multi-User Rooms**
- **Create or join rooms** - Host your own or join existing sessions
- **Real-time user count** - See how many people are currently watching
- **User notifications** - Get notified when people join or leave

### 🔒 **Secure Authentication**
- **Google OAuth integration** - Sign in with your Google account
- **Session management** - Secure user sessions with NextAuth.js
- **User profiles** - Persistent user data with PostgreSQL

### 🎨 **Modern UI/UX**
- **Dark theme design** - Sleek purple gradient aesthetic
- **Responsive layout** - Works perfectly on desktop and mobile
- **Smooth animations** - Framer Motion powered interactions
- **Toast notifications** - Real-time feedback for all actions

## 🏗️ Architecture

### Frontend Architecture
```
Next.js 15 (App Router) + TypeScript
├── 🎨 UI Framework: Tailwind CSS + shadcn/ui
├── 🔄 State Management: React Hooks + Context
├── 🌐 Real-time: Socket.io Client
├── 🔐 Authentication: NextAuth.js
└── 📱 Responsive: Mobile-first design
```

### Backend Architecture
```
Socket.io Server + Express.js
├── 🗄️  Database: PostgreSQL + Prisma ORM
├── 🔴 Cache: Redis (for real-time data)
├── 🔑 Auth: Google OAuth 2.0
├── 🎬 Video API: YouTube Data API v3
└── 🌐 WebSocket: Real-time synchronization
```

## 📁 Project Structure

```
vstream/
├── socket/                     # Socket.io server
│   ├── server.js              # WebSocket server + Express API
│   └── package.json           # Server dependencies
│
└── vstream/                   # Next.js application
    ├── app/                   # App Router (Next.js 13+)
    │   ├── api/              # API routes
    │   │   └── streams/
    │   │       └── videos/
    │   │           └── route.ts    # Video API endpoints
    │   ├── components/       # React components
    │   │   └── VideoPlayer.tsx     # Custom YouTube player
    │   ├── dashboard/        # Dashboard pages
    │   ├── room/            # Dynamic room pages
    │   │   └── [id]/
    │   │       └── page.tsx      # Room interface
    │   ├── utils/           # Utility functions
    │   │   ├── authopt.ts   # NextAuth configuration
    │   │   ├── db.ts        # Prisma client
    │   │   ├── socket.ts    # Socket.io client utils
    │   │   └── Types.ts     # TypeScript definitions
    │   ├── globals.css      # Global styles
    │   └── page.tsx         # Landing page
    │
    ├── components/ui/         # shadcn/ui components
    │   ├── button.tsx
    │   ├── card.tsx
    │   ├── input.tsx
    │   └── ...               # Other UI components
    │
    ├── prisma/
    │   └── schema.prisma     # Database schema
    │
    └── Configuration files
        ├── next.config.ts
        ├── tailwind.config.js
        ├── tsconfig.json
        └── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **PostgreSQL** database
- **Redis** server
- **Google OAuth** credentials
- **YouTube Data API** key

### 1. Clone the Repository
```bash
git clone https://github.com/369koushil/vstream.git
cd vstream
```

### 2. Install Dependencies

**Frontend (Next.js):**
```bash
cd vstream
npm install
```

**Backend (Socket.io):**
```bash
cd socket
npm install
```

### 3. Environment Setup

Create `.env.local` in the `vstream/` directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vstream_db"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# YouTube API
NEXT_API_KEY="your-youtube-api-key"

# Socket Server
WS_PORT=4000
```

Create `.env` in the `socket/` directory:
```env
# Client URL for CORS
clientURL="http://localhost:3000"

# Redis Configuration
REDIS_HOST="your-redis-host"
REDIS_PORT=6379
REDIS_PASSWORD="your-redis-password"

# Server Port
WS_PORT=4000
```

### 4. Database Setup
```bash
cd vstream
npx prisma generate
npx prisma db push
```

### 5. Start Development Servers

**Terminal 1 - Socket.io Server:**
```bash
cd socket
npm start
# Server runs on http://localhost:4000
```

**Terminal 2 - Next.js Frontend:**
```bash
cd vstream
npm run dev
# Frontend runs on http://localhost:3000
```

## 🎮 How to Use

### Creating a Room
1. **Sign in** with your Google account
2. **Navigate to Dashboard** and click "Create Room"
3. **Share the Room ID** with friends
4. **Start adding videos** and control playback as the host

### Joining a Room
1. **Sign in** with your Google account
2. **Enter the Room ID** or use a shared link
3. **Add videos** to the collaborative queue
4. **Vote on videos** to influence what plays next

### Adding Videos
1. **Copy any YouTube URL** (supports all formats)
2. **Paste in the input field** and click "Add Video"
3. **Vote for your favorites** to see them play sooner

## 🛠️ Tech Stack

### Frontend Technologies
- **⚛️ React 19** - Latest React with concurrent features
- **🔄 Next.js 15** - App Router, API routes, and SSR
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 shadcn/ui** - Modern component library
- **🎭 Framer Motion** - Smooth animations
- **🔐 NextAuth.js** - Authentication solution
- **📡 Socket.io Client** - Real-time communication

### Backend Technologies
- **🟢 Node.js** - JavaScript runtime
- **⚡ Express.js** - Web server framework
- **📡 Socket.io** - WebSocket implementation
- **🗄️ PostgreSQL** - Primary database
- **🔴 Redis** - Session storage and real-time data
- **🔍 Prisma ORM** - Database toolkit
- **🎬 YouTube Data API** - Video metadata

### Development Tools
- **📦 npm/yarn** - Package management
- **🔧 ESLint** - Code linting
- **🎯 Zod** - Runtime type validation
- **🧪 TypeScript** - Static type checking

## 🔧 API Endpoints

### REST API Routes
```
POST /api/streams/videos     # Add video to queue
POST /getRoomInfo           # Check room existence
```

### Socket.io Events
```javascript
// Client → Server
emit("create_stream", streamId)
emit("join_room", { streamId, username })
emit("update_vqueue", videoData)
emit("vote", { streamId, videoId, voteType, userId })
emit("video_control", { action, streamId })
emit("videoCompleted", { streamId, videoId })
emit("endRoom", streamId)

// Server → Client
on("init_vqueue", queueData)
on("updated_vqueue", queueData)
on("video_control_user", action)
on("room_cnt", userCount)
on("joining_toast_notification", username)
on("roomClosed")
```

## 🎯 Key Features Implementation

### Real-time Synchronization
- **Socket.io WebSockets** ensure all users see the same content simultaneously
- **Host controls** are instantly propagated to all room members
- **Queue updates** happen in real-time across all connected clients

### Voting System
- **Democratic playlist curation** through user voting
- **Smart scoring algorithm** combines votes with timestamps
- **Redis-backed** vote storage for high performance

### YouTube Integration
- **Flexible URL parsing** supports all YouTube formats
- **YouTube Data API** fetches video metadata and thumbnails
- **Custom player controls** for hosts with fallback for users

## 🔒 Security Features

- **🔐 Google OAuth 2.0** authentication
- **🛡️ JWT-based sessions** with NextAuth.js
- **🔍 Input validation** with Zod schemas
- **🌐 CORS protection** for API endpoints
- **💾 Secure session storage** with Redis

## 📱 Responsive Design

- **📱 Mobile-first** approach with Tailwind CSS
- **💻 Desktop optimized** layouts with grid systems
- **🎨 Consistent theming** across all screen sizes
- **⚡ Performance optimized** with Next.js Image component

## 🚀 Deployment

### Environment Variables for Production
```env
# Production Database
DATABASE_URL="your-production-db-url"

# Production Redis
REDIS_URL="your-redis-cloud-url"

# Production URLs
NEXTAUTH_URL="https://your-domain.com"
clientURL="https://your-domain.com"

# API Keys (same as development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_API_KEY="your-youtube-api-key"
```

### Deployment Options
- **▲ Vercel** (Recommended for Next.js)
- **🚀 Railway/Render** (For full-stack deployment)
- **🐳 Docker** (Container deployment)
- **☁️ AWS/GCP** (Cloud platforms)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Koushil** - [@369koushil](https://github.com/369koushil)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

**🐛 Found a bug?** [Open an issue](https://github.com/369koushil/vstream/issues)

**💡 Have an idea?** [Start a discussion](https://github.com/369koushil/vstream/discussions)

---

*Built with ❤️ using Next.js, Socket.io, and lots of coffee*

</div>
