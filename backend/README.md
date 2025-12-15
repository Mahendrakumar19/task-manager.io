# Task Manager — Backend

This backend is a production-ready TypeScript Express app for the Task Manager assessment. It implements a clean architecture with proper separation of concerns.

## 🏗️ Architecture

- **Controllers:** Handle HTTP requests/responses and input validation
- **Services:** Contain business logic and orchestrate operations
- **Repositories:** Abstract database operations (Prisma-based)
- **DTOs:** Zod schemas for type-safe request validation
- **Middleware:** JWT authentication and error handling
- **Socket.io:** Real-time event broadcasting

## 🚀 Quick Start

1. Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your-secret-key"
PORT=4000
```

2. Install dependencies:

```powershell
npm install
```

3. Run Prisma migrations:

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

4. Run tests:

```powershell
npm test
```

5. Start dev server:

```powershell
npm run dev
```

## 📡 API Endpoints

All endpoints return JSON. Task endpoints require authentication via JWT cookie.

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and receive JWT cookie
- `GET /api/v1/auth/me` - Get current user (protected)

### Tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - List tasks (supports filtering)
- `GET /api/v1/tasks/:id` - Get single task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## 🔐 Authentication

JWT tokens are stored in HttpOnly cookies for security. The `authMiddleware` verifies tokens on protected routes.

## ⚡ Real-Time Events

Socket.io broadcasts these events:
- `task:created` - New task created
- `task:updated` - Task modified
- `task:deleted` - Task removed
- `task:assigned` - Task assigned to user (room-specific)

## 🧪 Testing

Unit tests cover critical business logic:
- Task creation validation (due date checks)
- Business rule enforcement
- Error handling

Run with: `npm test`

## 📦 Build & Deploy

Build for production:

```powershell
npm run build
```

Start production server:

```powershell
npm start
```

Deploy to Render/Railway with:
- Build command: `npm run build`
- Start command: `npm start`
- Environment variables: `DATABASE_URL`, `JWT_SECRET`


