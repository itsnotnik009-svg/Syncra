# Syncra

A full-stack task management platform built for teams. Admins create projects, assign tasks, and track progress. Members work through their assigned tasks on a drag-and-drop Kanban board.

## What it does

- **Project management** — Create and organize projects, assign team members to tasks within them.
- **Kanban board** — Drag tasks between columns (To Do → In Progress → Review → Completed).
- **Role-based access** — Admins manage everything. Members see only tasks assigned to them.
- **Dashboard** — Admins get org-wide stats (total tasks, overdue count, completion rate). Members get a personal view of their workload.
- **Task comments** — Threaded comments on tasks for context and discussion.
- **Activity tracking** — Logs who did what and when.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend   | Node.js, Express.js                     |
| Database  | PostgreSQL + Prisma ORM                 |
| Auth      | JWT (bearer tokens) + bcrypt            |
| State     | React Query (TanStack Query)            |
| Drag & Drop | dnd-kit                              |

## Project Structure

```
Syncra/
├── Backend/          # Express API, Prisma schema, auth, routes
│   ├── prisma/       # Schema, migrations, seed data
│   └── src/          # Controllers, middleware, routes, validators
├── Frontend/         # React SPA
│   └── src/
│       ├── api/      # Axios service layer
│       ├── components/   # Reusable UI (Kanban, sidebar, task cards)
│       ├── contexts/ # Auth context provider
│       ├── hooks/    # React Query hooks
│       ├── pages/    # Route-level pages
│       └── types/    # TypeScript interfaces
└── README.md
```

## Getting Started

You need **Node.js 18+** and a **PostgreSQL** database (local or hosted — Neon, Supabase, Railway, etc.).

### 1. Clone the repo

```bash
git clone https://github.com/anothercoder-nik/Syncra.git
cd Syncra
```

### 2. Set up the backend

```bash
cd Backend
npm install

# Create your .env from the example
cp .env.example .env
```

Edit `.env` with your actual database URL and a JWT secret:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="pick-something-random-here"
```

Then run migrations and (optionally) seed some sample data:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed     # creates test users + sample project
npm run dev             # starts on port 5000
```

### 3. Set up the frontend

```bash
cd Frontend
npm install
npm run dev             # starts on port 5173
```

The frontend reads `VITE_API_URL` from `Frontend/.env` (defaults to `http://localhost:5000/api`).

### 4. Open the app

Go to `http://localhost:5173`. Log in with the seeded credentials:

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Admin  | admin@syncra.com   | admin123456  |
| Member | member@syncra.com  | member123456 |

## Roles & Permissions

| Action                  | Admin | Member          |
|-------------------------|-------|-----------------|
| Create/edit projects    | ✓     | —               |
| Create/assign tasks     | ✓     | —               |
| Update any task         | ✓     | —               |
| Update own task status  | ✓     | ✓               |
| View dashboard          | Full  | Personal stats  |
| Manage members          | ✓     | —               |

## API Overview

The backend exposes a RESTful API under `/api`. Key route groups:

- `/api/auth` — Register, login, profile
- `/api/projects` — CRUD for projects
- `/api/tasks` — CRUD for tasks, with filters (`?status=TODO&priority=HIGH&projectId=...`)
- `/api/tasks/:id/comments` — Task comments
- `/api/dashboard` — Stats, overdue tasks, recent activity
- `/api/users` — User listing (admin only)

All protected routes require a `Bearer` token in the `Authorization` header.

## Deployment

Both parts can be deployed independently:

- **Backend** — Works on Railway, Render, or any Node.js host. Set environment variables and it runs `node src/server.js`.
- **Frontend** — Build with `npm run build` and serve the `dist/` folder from any static host (Vercel, Netlify, etc.). Point `VITE_API_URL` to your deployed API.

## License

ISC
