export type Role = 'ADMIN' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  _count?: { tasks: number; projects: number }
}

export interface Project {
  id: string
  title: string
  description: string | null
  createdBy: string
  createdAt: string
  creator: Pick<User, 'id' | 'name' | 'email' | 'role'>
  tasks?: Task[]
  _count?: { tasks: number }
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  assignedTo: string | null
  projectId: string
  createdAt: string
  project: Pick<Project, 'id' | 'title'>
  assignee: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: string
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>
}



export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  dueThisWeek: number
  completionPercentage: number
}

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; role?: Role }
export interface AuthResponse { user: User; token: string }

export interface CreateProjectPayload { title: string; description?: string }
export interface UpdateProjectPayload { title?: string; description?: string }

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string | null
  assignedTo?: string | null
  projectId: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string | null
  assignedTo?: string | null
  projectId?: string
}

export interface UpdateProfilePayload { name: string }
export interface ChangePasswordPayload { currentPassword: string; newPassword: string }
