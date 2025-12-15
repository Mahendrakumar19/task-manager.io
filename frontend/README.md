# Task Manager — Frontend

Modern React + TypeScript frontend with Tailwind CSS, React Query, and Socket.io for real-time updates.

## 🎨 Features

- **Responsive Design:** Mobile-first Tailwind CSS
- **Server State:** React Query for caching and synchronization
- **Real-Time:** Socket.io client for live task updates
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router for SPA navigation
- **Loading States:** Skeleton loaders for better UX

## 🚀 Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Configure environment (copy `.env.example` to `.env`):

```env
VITE_API_URL=http://localhost:4000
```

3. Start development server:

```powershell
npm run dev
```

Opens at `http://localhost:3000`

## 📁 Pages

- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user signup
- **Dashboard** (`/dashboard`) - Overview of user's tasks, overdue items
- **Tasks** (`/tasks`) - Full task list with filtering and CRUD operations

## 🔌 API Integration

The `api.ts` module handles all backend communication with:
- Automatic credential inclusion (cookies)
- Error handling
- Type-safe request/response

## ⚡ Real-Time Updates

Socket.io automatically:
1. Connects on app mount
2. Listens for task events
3. Invalidates React Query cache
4. Triggers UI refetch

## 📦 Build

Build for production:

```powershell
npm run build
```

Preview production build:

```powershell
npm run preview
```

## 🚢 Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` (your backend URL)
5. Deploy!

## 🎯 Next Steps for Production

- Add authentication state management (persist logged-in user)
- Implement route guards for protected pages
- Add error boundaries
- Add toast notifications for user feedback
- Implement optimistic UI updates


