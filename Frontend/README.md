# Syncra — Frontend

React SPA for the Syncra task management platform. Connects to the backend API for auth, project/task CRUD, and dashboard stats.

## Stack

- **React 19** with TypeScript
- **Vite** — dev server and build tool
- **Tailwind CSS v4** — styling
- **React Router v7** — client-side routing
- **TanStack React Query** — server state and caching
- **dnd-kit** — drag-and-drop for the Kanban board
- **react-hook-form** — form handling with validation
- **sonner** — toast notifications
- **lucide-react** — icons
- **axios** — HTTP client

## How it works

### Auth flow

The app wraps everything in an `AuthProvider` (React Context). On load, it checks `localStorage` for a saved JWT token and calls `GET /api/auth/me` to validate it. If the token is expired or missing, the user is redirected to `/login`.

Login and register forms post credentials to the API, store the returned token in `localStorage`, and set the user in context. The `ProtectedRoute` component gates authenticated routes — and optionally checks for a specific role (used to restrict `/members` to admins).

### Pages

| Route             | Component          | Access   | Description                              |
|-------------------|--------------------|----------|------------------------------------------|
| `/login`          | LoginPage          | Public   | Email/password login                     |
| `/register`       | RegisterPage       | Public   | New account signup                       |
| `/dashboard`      | DashboardPage      | Auth     | Stats + recent activity (admin) or personal task list (member) |
| `/projects`       | ProjectsPage       | Auth     | Project list with create/edit dialogs    |
| `/projects/:id`   | ProjectDetailPage  | Auth     | Single project view with its tasks       |
| `/tasks`          | TasksPage          | Auth     | Kanban board with drag-and-drop          |
| `/members`        | MembersPage        | Admin    | User list                                |
| `/settings`       | SettingsPage       | Auth     | Edit profile name, change password       |

### Kanban board

The tasks page renders a 4-column Kanban board (To Do, In Progress, Review, Completed). Tasks are draggable cards powered by `dnd-kit`. Dropping a card into a different column fires a `PUT /api/tasks/:id` call to update its status.

Admins see all tasks across all projects. Members see only tasks assigned to them.

### Data fetching

All API calls go through `src/lib/axios.ts`, which is a pre-configured Axios instance that automatically attaches the JWT token from `localStorage`. The base URL comes from the `VITE_API_URL` environment variable.

Each resource has a dedicated hook in `src/hooks/` (e.g., `use-tasks.ts`, `use-projects.ts`) that wraps React Query mutations and queries. This gives automatic caching, background refetching, and optimistic-ish updates (cache invalidation on mutation success).

### Dashboard

Two views depending on role:

- **Admin** — 4 stat cards (total tasks, completed, pending, overdue) + a table of the 20 most recent tasks across all projects.
- **Member** — 5 stat cards (my tasks, completed, pending, overdue, due this week) + a list of personally assigned tasks.

## Project structure

```
src/
├── App.tsx             # Root component — routes, providers, toaster
├── main.tsx            # Entry point — renders App into #root
├── index.css           # Global styles + Tailwind imports
├── api/                # Axios service functions per resource
│   ├── auth.ts
│   ├── comments.ts
│   ├── dashboard.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── users.ts
├── components/
│   ├── auth/           # ProtectedRoute wrapper
│   ├── dashboard/      # StatCard
│   ├── layout/         # AppLayout, Sidebar, Topbar
│   ├── projects/       # ProjectFormDialog
│   ├── tasks/          # KanbanBoard, TaskCard, TaskDetailDrawer, TaskFormDialog
│   └── ui/             # Badges, EmptyState, Skeleton loaders
├── contexts/
│   └── auth-context.tsx    # AuthProvider + useAuth hook
├── hooks/              # React Query wrappers
│   ├── use-comments.ts
│   ├── use-dashboard.ts
│   ├── use-projects.ts
│   ├── use-tasks.ts
│   └── use-users.ts
├── lib/
│   ├── axios.ts        # Axios instance with auth interceptor
│   └── utils.ts        # cn() class merge helper
├── pages/              # Page-level components (one per route)
└── types/
    └── index.ts        # Shared TypeScript interfaces
```

## Setup

### Prerequisites

- Node.js 18+
- The backend API running (see `Backend/README.md`)

### Install & run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The API URL is configured in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### Build for production

```bash
npm run build
```

Outputs to `dist/`. Serve it from any static host — Vercel, Netlify, Cloudflare Pages, etc.

## Test credentials

Log in with these after running the backend seed:

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Admin  | admin@syncra.com   | admin123456  |
| Member | member@syncra.com  | member123456 |

Admin has full access. Member sees only their assigned tasks and a personal dashboard.
