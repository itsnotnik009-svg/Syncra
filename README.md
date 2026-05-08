# Syncra — Task Management Platform

A full-stack project and task management platform built for teams. Admins create projects, assign tasks, and monitor org-wide progress. Members work through their assigned tasks on a drag-and-drop Kanban board with personal productivity metrics.

## Features

### Authentication & Security
- JWT-based authentication with Bearer tokens
- Passwords hashed with bcrypt
- Role-based route protection (Admin / Member)
- Input validation using Zod schemas
- Helmet and CORS middleware for API hardening

### Project Management
- Create, edit, and delete projects (Admin)
- Project detail view with task table, progress bar, and summary stats
- Per-project metrics: total tasks, completed, overdue count, completion percentage

### Task Management
- Full CRUD for tasks with title, description, priority, status, due date, and assignee
- Drag-and-drop Kanban board with four columns: To Do → In Progress → Review → Completed
- Task detail drawer with inline editing (assignee, priority, due date, project)
- Real-time UI updates — edits reflect instantly without page refresh
- Filtering by project, priority, and search query
- Four priority levels: Low, Medium, High, Critical

### Role-Based Access Control

| Action                        | Admin | Member |
|-------------------------------|-------|--------|
| Create / edit / delete projects | ✓     | —      |
| Create and assign tasks       | ✓     | —      |
| Edit task details (assignee, priority, due date) | ✓ | — |
| Update own task status        | ✓     | ✓      |
| View all tasks                | ✓     | —      |
| View only assigned tasks      | —     | ✓      |
| Dashboard (org-wide stats)    | ✓     | —      |
| Dashboard (personal stats)    | —     | ✓      |
| Manage team members / roles   | ✓     | —      |
| Comment on tasks              | ✓     | ✓      |
| Profile & password settings   | ✓     | ✓      |

### Dashboards
- **Admin Dashboard** — Total tasks, completed count, pending, overdue, completion rate, and a recent activity table with assignee info
- **Member Dashboard** — Personal task count, completed, pending, overdue, due this week, and a list of assigned tasks with status/priority badges

### Team Management
- Member listing with project/task counts per user
- Role switching (Admin can promote/demote users)

### Comments
- Threaded comments on individual tasks
- Any user can comment; admins and comment authors can delete

### Settings
- Profile editing (name update)
- Password change with current password verification

## Tech Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | React 19, TypeScript, Tailwind CSS v4, Vite 8 |
| Backend      | Node.js, Express.js                           |
| Database     | PostgreSQL + Prisma ORM                       |
| Auth         | JWT (Bearer tokens) + bcrypt                  |
| Validation   | Zod                                           |
| State        | TanStack React Query v5                       |
| Drag & Drop  | dnd-kit                                       |
| Forms        | React Hook Form                               |
| Icons        | Lucide React                                  |
| Toasts       | Sonner                                        |
| Date Utils   | date-fns                                      |

## Project Structure

```
Syncra/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database models (User, Project, Task, Comment, ActivityLog)
│   │   ├── migrations/          # Prisma migration history
│   │   ├── seed.js              # Seed script for test data
│   │   └── seed-projects.js     # Project-specific seed data
│   └── src/
│       ├── controllers/         # Route handlers (auth, task, project, dashboard, comment, user)
│       ├── middleware/          # JWT auth & role authorization
│       ├── routes/             # Express route definitions
│       ├── validators/         # Zod validation schemas
│       ├── utils/              # Token helpers, response formatters
│       ├── config/             # Environment config
│       ├── app.js              # Express app setup
│       └── server.js           # Entry point
│
├── Frontend/
│   └── src/
│       ├── api/                # Axios service layer (auth, tasks, projects, dashboard, comments, users)
│       ├── components/
│       │   ├── auth/           # Protected route wrapper
│       │   ├── dashboard/      # Stat cards
│       │   ├── layout/         # Sidebar, header, app shell
│       │   ├── projects/       # Project cards
│       │   ├── tasks/          # Kanban board, columns, task cards, detail drawer, form dialog
│       │   └── ui/             # Logo, avatar, badges, skeleton, empty state
│       ├── contexts/           # Auth context provider
│       ├── hooks/              # React Query hooks (tasks, projects, dashboard, comments, users)
│       ├── lib/                # Axios instance, utility functions
│       ├── pages/              # Route pages (login, register, dashboard, projects, tasks, members, settings)
│       └── types/              # TypeScript interfaces
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local, Neon, Supabase, Railway, etc.)

### 1. Clone the repo

```bash
git clone https://github.com/itsnotnik009-svg/Syncra.git
cd Syncra
```

### 2. Backend setup

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
```

Run migrations and seed data:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

The API starts at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

The app starts at `http://localhost:5173`. It reads `VITE_API_URL` from `Frontend/.env` (defaults to `http://localhost:5000/api`).

### 4. Default credentials

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Admin  | admin@syncra.com   | admin123456  |
| Member | member@syncra.com  | member123456 |

## API Endpoints

All protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint                      | Access  | Description                  |
|--------|-------------------------------|---------|------------------------------|
| POST   | `/api/auth/register`          | Public  | Register new user            |
| POST   | `/api/auth/login`             | Public  | Login, returns JWT           |
| GET    | `/api/auth/profile`           | Auth    | Get current user profile     |
| PUT    | `/api/auth/profile`           | Auth    | Update profile (name)        |
| PUT    | `/api/auth/password`          | Auth    | Change password              |
| GET    | `/api/projects`               | Auth    | List projects                |
| POST   | `/api/projects`               | Admin   | Create project               |
| GET    | `/api/projects/:id`           | Auth    | Get project with tasks       |
| PUT    | `/api/projects/:id`           | Admin   | Update project               |
| DELETE | `/api/projects/:id`           | Admin   | Delete project               |
| GET    | `/api/tasks`                  | Auth    | List tasks (filtered by role)|
| POST   | `/api/tasks`                  | Admin   | Create task                  |
| GET    | `/api/tasks/:id`              | Auth    | Get single task              |
| PUT    | `/api/tasks/:id`              | Auth    | Update task (role-restricted)|
| DELETE | `/api/tasks/:id`              | Admin   | Delete task                  |
| GET    | `/api/tasks/:id/comments`     | Auth    | List task comments           |
| POST   | `/api/tasks/:id/comments`     | Auth    | Add comment                  |
| DELETE | `/api/tasks/:id/comments/:cid`| Auth    | Delete comment               |
| GET    | `/api/dashboard/stats`        | Auth    | Dashboard statistics         |
| GET    | `/api/dashboard/overdue`      | Auth    | Overdue tasks                |
| GET    | `/api/dashboard/recent`       | Auth    | Recent activity              |
| GET    | `/api/users`                  | Admin   | List all users               |
| PUT    | `/api/users/:id/role`         | Admin   | Change user role             |

## Database Schema

Five core models managed by Prisma:

- **User** — id, name, email, password (hashed), role (ADMIN/MEMBER)
- **Project** — id, title, description, createdBy → User
- **Task** — id, title, description, status, priority, dueDate, assignedTo → User, projectId → Project
- **Comment** — id, content, taskId → Task, userId → User
- **ActivityLog** — id, userId, action, resource, resourceId, details (JSON), taskId

## Deployment

Both parts deploy independently:

- **Backend** — Any Node.js host (Railway, Render, etc.). Set `DATABASE_URL`, `JWT_SECRET`, and `PORT` as environment variables. Runs `node src/server.js`.
- **Frontend** — Build with `npm run build`, deploy `dist/` to any static host (Vercel, Netlify, etc.). Set `VITE_API_URL` to your deployed API URL.

## License

ISC
