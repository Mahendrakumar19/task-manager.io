# 🧑‍💻 Collaborative Task Manager

A full-stack Task Management application built with modern JavaScript/TypeScript, featuring real-time collaboration, secure authentication, and a responsive UI.

## 🎯 Live Deployment

- **Frontend:** https://task-manager-io-chi.vercel.app/
- **Backend:** https://task-manager-io.onrender.com/
- **Database:** PostgreSQL on Render

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite + TypeScript | Modern, fast UI development |
| Styling | Tailwind CSS | Utility-first responsive design |
| State Management | React Query (@tanstack/react-query) | Server state caching and synchronization |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Backend | Node.js + Express + TypeScript | RESTful API server |
| Real-Time | Socket.io | Live task updates and notifications |
| Database | PostgreSQL | Relational database for data persistence |
| ORM | Prisma | Type-safe database client |
| Authentication | JWT (HttpOnly cookies) | Secure session management |

### Database Choice: PostgreSQL

**Why PostgreSQL?**
- **ACID Compliance:** Ensures data integrity for task assignments and status updates
- **Relational Model:** Perfect for modeling user-task relationships (creator, assignee)
- **Performance:** Efficient indexing for filtering/sorting tasks
- **Production-Ready:** Widely supported on all major cloud platforms (Render, Railway, AWS RDS)

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── services/              # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── repositories/          # Data access layer
│   │   │   └── prisma.task.repository.ts
│   │   ├── dtos/                  # Data Transfer Objects with Zod validation
│   │   │   ├── auth.dto.ts
│   │   │   └── task.dto.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT verification
│   │   ├── utils/
│   │   │   └── jwt.ts             # JWT signing/verification
│   │   ├── tests/
│   │   │   └── task.service.test.ts
│   │   ├── app.ts                 # Express app configuration
│   │   ├── index.ts               # Server entry point
│   │   └── socket.ts              # Socket.io instance management
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Tasks.tsx
│   │   ├── api.ts                 # API client
│   │   ├── hooks.ts               # React Query hooks
│   │   ├── useSocket.ts           # Socket.io integration
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Local Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or use a cloud instance)

### Backend Setup

1. **Install dependencies:**
   ```powershell
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```powershell
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
   JWT_SECRET="your-secret-key-change-in-production"
   PORT=4000
   ```

3. **Run database migrations:**
   ```powershell
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run tests:**
   ```powershell
   npm test
   ```

5. **Start development server:**
   ```powershell
   npm run dev
   ```
   Server runs on `http://localhost:4000`

### Frontend Setup

1. **Install dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```powershell
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```
   App runs on `http://localhost:3000`

## 📡 API Contract

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user
- **Body:** `{ email: string, password: string, name?: string }`
- **Response:** `{ id: string, email: string, name?: string }`
- **Cookie:** Sets `token` (HttpOnly JWT)

#### POST `/api/v1/auth/login`
Login existing user
- **Body:** `{ email: string, password: string }`
- **Response:** `{ id: string, email: string, name?: string }`
- **Cookie:** Sets `token` (HttpOnly JWT)

#### GET `/api/v1/auth/me`
Get current user (requires auth)
- **Headers:** Cookie with JWT token
- **Response:** `{ id: string, email: string, name?: string }`

### Task Endpoints (All require authentication)

#### POST `/api/v1/tasks`
Create a new task
- **Body:**
  ```json
  {
    "title": "string (max 100 chars)",
    "description": "string (optional)",
    "dueDate": "ISO 8601 datetime",
    "priority": "LOW | MEDIUM | HIGH | URGENT",
    "status": "TODO | IN_PROGRESS | REVIEW | COMPLETED",
    "assignedToId": "string (optional)"
  }
  ```
- **Response:** Task object with creator and assignee details

#### GET `/api/v1/tasks`
List all tasks with optional filters
- **Query Params:**
  - `status`: Filter by status
  - `priority`: Filter by priority
  - `creatorId`: Filter by creator
  - `assignedToId`: Filter by assignee
- **Response:** Array of task objects

#### GET `/api/v1/tasks/:id`
Get a single task
- **Response:** Task object

#### PUT `/api/v1/tasks/:id`
Update a task (partial update supported)
- **Body:** Same as POST (all fields optional)
- **Response:** Updated task object

#### DELETE `/api/v1/tasks/:id`
Delete a task
- **Response:** 204 No Content

## ⚡ Real-Time Features (Socket.io)

### Events Emitted by Server

- **`task:created`** - Broadcast when a new task is created
- **`task:updated`** - Broadcast when a task is updated
- **`task:deleted`** - Broadcast when a task is deleted
- **`task:assigned`** - Sent to specific user room when assigned a task

### Client Integration

The frontend automatically:
1. Connects to Socket.io on mount
2. Joins user-specific room for notifications
3. Invalidates React Query cache on events to trigger refetch
4. Shows live updates across all connected clients

## 🧪 Testing

### Backend Unit Tests

Three critical tests cover task service business logic:

1. **Valid task creation** - Ensures tasks with future due dates are created successfully
2. **Past due date rejection** - Validates that tasks cannot be created with past due dates
3. **Update validation** - Prevents updating tasks with invalid due dates

Run tests:
```powershell
cd backend
npm test
```

## 🎨 Frontend Features

### Responsive Design
- Mobile-first Tailwind CSS approach
- Fully responsive on desktop, tablet, and mobile
- Clean, modern UI with proper spacing and typography

### Loading States
- Skeleton loaders during data fetching
- Disabled button states during form submission
- Smooth transitions between states

### Data Management
- React Query handles all server state
- Automatic background refetching
- Optimistic updates for better UX
- Cache invalidation on Socket.io events

## 🔐 Security Considerations

1. **Password Hashing:** bcrypt with salt rounds of 10
2. **JWT Storage:** HttpOnly cookies prevent XSS attacks
3. **CORS:** Configured for specific origins in production
4. **Input Validation:** Zod schemas on all endpoints
5. **Authentication Middleware:** Protects all task endpoints

## 📝 Design Decisions & Trade-offs

### Architecture
- **Service/Repository Pattern:** Clear separation of concerns makes testing easier and code more maintainable
- **DTO Validation:** Zod provides runtime type safety and clear error messages
- **Prisma ORM:** Type-safe queries prevent SQL injection and reduce boilerplate

### Real-Time Implementation
- **Socket.io over WebSockets:** Better browser compatibility and automatic reconnection
- **Room-based notifications:** User-specific rooms for targeted notifications
- **Cache invalidation strategy:** Simple but effective; production could use optimistic updates

### Trade-offs
1. **In-memory socket instance:** Simple but doesn't scale horizontally (could use Redis adapter for multi-server)
2. **Cookie-based auth:** Simpler than separate token management but requires same-domain or proper CORS
3. **Client-side routing:** Better UX but requires server fallback configuration for SPAs

## ✨ Bonus Features Implemented

- ✅ **Comprehensive TypeScript:** Strong typing throughout both FE and BE
- ✅ **Skeleton Loading States:** Smooth UX during data fetching
- ✅ **Clean Architecture:** Service/Repository pattern with clear separation
- ✅ **Real-time Notifications:** Socket.io integration for instant updates
- ✅ **Form Validation:** React Hook Form + Zod for type-safe forms

