# Syncra — Backend

REST API for the Syncra task management platform. Handles authentication, project/task CRUD, comments, activity logging, and role-based access control.

## Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT tokens + bcrypt password hashing
- **Validation:** Zod schemas
- **Security:** Helmet headers + CORS whitelist

## How it works

The server boots in `src/server.js`, connects to Postgres through Prisma, and exposes an Express app defined in `src/app.js`.

**Request flow:**

```
Request → Helmet → CORS → JSON parser → Route matching → Auth middleware → Validation → Controller → Response
```

- **Auth middleware** (`src/middleware/auth.middleware.js`) — Extracts the JWT from the `Authorization: Bearer <token>` header, verifies it, and attaches the decoded user to `req.user`.
- **Role middleware** — `authorize('ADMIN')` gates routes so only admins can create projects, assign tasks, manage users, etc.
- **Validation middleware** — Zod schemas in `src/validators/` validate request bodies before they reach controllers. Bad payloads get a 400 with field-level errors.
- **Controllers** — Thin handlers in `src/controllers/` that call Prisma directly (no separate service layer — the app is small enough that it's not needed).
- **Error handling** — Centralized in `src/middleware/error.middleware.js`. Unhandled errors return a consistent JSON shape.

**Database schema (Prisma):**

Five models: `User`, `Project`, `Task`, `Comment`, `ActivityLog`. Tasks belong to projects, users are assigned to tasks. Activity logs track who did what.

## Project structure

```
src/
├── app.js              # Express app setup (middleware, routes, error handler)
├── server.js           # Entry point — connects DB, starts listening
├── config/
│   └── env.js          # Validates env vars with Zod
├── controllers/        # Route handlers
│   ├── auth.controller.js
│   ├── comment.controller.js
│   ├── dashboard.controller.js
│   ├── project.controller.js
│   ├── task.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js      # JWT verification + role authorization
│   ├── error.middleware.js     # Global error handler
│   └── validate.middleware.js  # Zod schema validation
├── prisma/
│   └── client.js       # Singleton Prisma client
├── routes/             # Express routers
│   ├── index.js        # Mounts all route groups
│   ├── auth.routes.js
│   ├── comment.routes.js
│   ├── dashboard.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│   └── user.routes.js
├── utils/
│   ├── password.js     # bcrypt hash/compare helpers
│   ├── response.js     # sendSuccess / sendError wrappers
│   └── token.js        # JWT sign/verify helpers
└── validators/
    ├── auth.validator.js
    ├── project.validator.js
    └── task.validator.js
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local, Neon, Supabase, etc.)

### Install & run

```bash
npm install

cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET

npx prisma generate
npx prisma migrate dev

# Seed test data (optional but recommended)
npm run prisma:seed

# Start dev server with hot reload
npm run dev
```

The server starts on `http://localhost:5000` by default.

### Environment variables

| Variable       | What it does                     | Default                 |
|----------------|----------------------------------|-------------------------|
| `DATABASE_URL` | Postgres connection string       | —                       |
| `JWT_SECRET`   | Signing key for JWT tokens       | —                       |
| `JWT_EXPIRES_IN` | Token lifetime                 | `7d`                    |
| `PORT`         | Server port                      | `5000`                  |
| `NODE_ENV`     | `development` / `production`     | `development`           |
| `CORS_ORIGIN`  | Allowed frontend origin          | `http://localhost:3000`  |

## API Reference

### Auth

| Method | Endpoint             | Auth? | Description            |
|--------|----------------------|-------|------------------------|
| POST   | `/api/auth/register` | No    | Create a new account   |
| POST   | `/api/auth/login`    | No    | Get a JWT token        |
| GET    | `/api/auth/me`       | Yes   | Current user profile   |
| PUT    | `/api/auth/profile`  | Yes   | Update name            |
| PUT    | `/api/auth/password` | Yes   | Change password        |

### Projects

| Method | Endpoint            | Auth? | Role  | Description        |
|--------|---------------------|-------|-------|--------------------|
| POST   | `/api/projects`     | Yes   | Admin | Create project     |
| GET    | `/api/projects`     | Yes   | Any   | List all projects  |
| GET    | `/api/projects/:id` | Yes   | Any   | Get one project    |
| PUT    | `/api/projects/:id` | Yes   | Admin | Update project     |
| DELETE | `/api/projects/:id` | Yes   | Admin | Delete project     |

### Tasks

| Method | Endpoint           | Auth? | Role  | Description     |
|--------|--------------------|-------|-------|-----------------|
| POST   | `/api/tasks`       | Yes   | Admin | Create task     |
| GET    | `/api/tasks`       | Yes   | Any   | List tasks      |
| GET    | `/api/tasks/:id`   | Yes   | Any   | Get single task |
| PUT    | `/api/tasks/:id`   | Yes   | *     | Update task     |
| DELETE | `/api/tasks/:id`   | Yes   | Admin | Delete task     |

*Members can only update the status of tasks assigned to them. Admins can update anything.

**Filters on GET /api/tasks:** `?status=TODO&priority=HIGH&projectId=<uuid>`

### Comments

| Method | Endpoint                       | Auth? | Description         |
|--------|--------------------------------|-------|---------------------|
| GET    | `/api/tasks/:taskId/comments`  | Yes   | List task comments  |
| POST   | `/api/tasks/:taskId/comments`  | Yes   | Add a comment       |

### Dashboard

| Method | Endpoint                  | Auth? | Description               |
|--------|---------------------------|-------|---------------------------|
| GET    | `/api/dashboard/stats`    | Yes   | Aggregate counts          |
| GET    | `/api/dashboard/overdue`  | Yes   | Overdue task list         |
| GET    | `/api/dashboard/activity` | Yes   | 20 most recent tasks      |

### Users

| Method | Endpoint      | Auth? | Role  | Description      |
|--------|---------------|-------|-------|------------------|
| GET    | `/api/users`  | Yes   | Admin | List all users   |

## Seed Credentials

Running `npm run prisma:seed` creates two test accounts:

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Admin  | admin@syncra.com   | admin123456  |
| Member | member@syncra.com  | member123456 |

It also creates a sample project ("LLM Evaluation Pipeline") with three tasks in different statuses.

## Production

```bash
npm start
```

Runs `node src/server.js` without nodemon. Set `NODE_ENV=production` for combined logging and stricter error responses.
