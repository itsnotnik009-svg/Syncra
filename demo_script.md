# Syncra — Demo Video Script
**Total Duration: ~4 min 40 sec**

> [!TIP]
> **Before recording:** Open two browser tabs — one logged in as Admin, one in incognito for Member login. Keep both servers running. Clear any toast notifications.

---

## 1. INTRO — 30 seconds
**Screen: Login page visible**

> "Hey — this is Syncra, a full-stack task management platform I built from scratch.
>
> It lets teams organize work across projects using a Kanban board, with proper role-based access — so admins manage everything, and members only see what's assigned to them.
>
> Let me show you how it works."

**🎬 Action:** Pause on the login screen for a beat. Let the UI breathe.

---

## 2. AUTH FLOW — 40 seconds
**Screen: Login page → Register page → Login again**

> "So first, authentication. Passwords are hashed with bcrypt, and sessions use JWT tokens stored on the client."

**🎬 Action:** Click "Create account" link

> "If I register a new user — let's say, 'Demo User' — notice the role is always Member. You can't register as an admin. That's hardcoded on the backend for security."

**🎬 Action:** Fill in name, email, password. Submit. *(Don't wait for it — quickly switch to login tab)*

> "Let me log in as the admin account to show the full experience."

**🎬 Action:** Type `admin@syncra.com` / `admin123456`. Hit Login. Dashboard loads.

---

## 3. ADMIN DEMO — 90 seconds
**Screen: Admin Dashboard**

> "This is the admin dashboard. Right off the bat — total tasks, completed, pending, overdue. Everything at a glance."

**🎬 Action:** Hover over stat cards briefly (show the hover animation)

> "And below that, recent activity — every task across the platform, sorted by date."

**🎬 Action:** Scroll down to the activity table, pause briefly

### Projects (20 sec)

**🎬 Action:** Click "Projects" in sidebar

> "On the projects page, I've got multiple active projects. Let me create a new one real quick."

**🎬 Action:** Click "New Project", type a title like "Q3 Sprint Planning", add a short description, submit

> "Done. Now let me click into one of the existing projects."

**🎬 Action:** Click "API Gateway Migration"

> "Inside a project, I can see all tasks, their status, priority, and who's assigned. These stats update in real time."

### Tasks & Kanban (40 sec)

**🎬 Action:** Click "Tasks" in sidebar

> "Here's the Kanban board. Every task is a draggable card."

**🎬 Action:** Drag a task from "To Do" to "In Progress". Let the toast notification show.

> "That status change hits the backend immediately. No save button needed."

**🎬 Action:** Click on any task card to open the detail drawer

> "Clicking a task opens this detail panel — I can see description, assignee, due date, and there's a full comment thread at the bottom."

**🎬 Action:** Scroll to comments, type a quick comment like "Looks good, moving to review", press send

> "As an admin, I can also edit the task inline — change the assignee, priority, due date, or even move it to a different project."

**🎬 Action:** Click the pencil icon, change assignee to "Team Member", save. Close drawer.

### Members (15 sec)

**🎬 Action:** Click "Members" in sidebar

> "On the members page, I can see every user and change their role. So if I want to promote someone to admin — just select from the dropdown. This is admin-only, members see this as read-only."

**🎬 Action:** Hover over the role dropdown on a member row (don't actually change it)

---

## 4. MEMBER DEMO — 60 seconds
**Screen: Switch to incognito tab or log out and log in as member**

> "Now let me switch to the member perspective. This is the same app, same URL — just a different role."

**🎬 Action:** Log in as `member@syncra.com` / `member123456`

> "Notice the dashboard is completely different. A member only sees their own stats — my tasks, my completion rate, what's due this week."

**🎬 Action:** Point out the "Due This Week" card and "My Tasks" list

> "On the tasks page, I only see tasks assigned to me. Not the full backlog."

**🎬 Action:** Click "Tasks" in sidebar. Show the filtered Kanban.

> "I can still drag cards to change status — that's my main workflow. But I can't edit priorities, reassign tasks, or create new ones. Those buttons simply don't exist for me."

**🎬 Action:** Drag a task from one column to another

> "Same with projects — I only see projects where I have assigned tasks. Not the full list."

**🎬 Action:** Click "Projects". Show the filtered view.

> "And on the members page, I can see the team, but I can't change anyone's role. It's view-only."

**🎬 Action:** Click "Members". Show static role badges (no dropdown).

---

## 5. TECH OVERVIEW — 45 seconds
**Screen: Switch to VS Code or show the terminal briefly**

> "Quick look under the hood."

**🎬 Action:** Show the project folder structure in VS Code (Backend + Frontend folders)

> "The backend is Node.js with Express. I'm using Prisma as the ORM, connected to a PostgreSQL database on Neon. All controllers talk directly to Prisma — no unnecessary service layer abstraction."

**🎬 Action:** Briefly flash a controller file (task.controller.js)

> "On the frontend, it's React with TypeScript, styled with Tailwind v4, and I'm using TanStack Query for all server state — so data fetching, caching, and cache invalidation are handled automatically."

**🎬 Action:** Briefly flash a hooks file (use-tasks.ts)

> "The Kanban board uses dnd-kit for drag and drop, and the whole app is fully responsive — works on mobile too."

**🎬 Action:** Optionally resize the browser to show mobile view for 2-3 seconds

> "Auth uses JWT with bcrypt hashing, role checks happen both on the API and the UI layer, and the search bar in the header does live filtering against the backend."

---

## 6. CLOSING — 15 seconds
**Screen: Dashboard (admin view)**

> "That's Syncra — a clean, production-ready task management platform with proper RBAC, real-time updates, and a responsive UI. Thanks for watching."

**🎬 Action:** Hold on the dashboard for 3 seconds. End recording.

---

> [!IMPORTANT]
> ## Recording Tips
> - **Speak at 80% speed.** You'll naturally speed up when nervous — forcing yourself slower sounds more confident.
> - **Don't narrate clicks.** Say what something *does*, not "now I'm clicking this button."
> - **Pause after key moments.** After a drag-drop or a toast notification, give it 1-2 seconds to register visually.
> - **Keep your mouse movements smooth.** No frantic scrolling. Deliberate, slow cursor movements look professional.
> - **Record at 1080p** with your browser at ~90% zoom so everything fits cleanly.
