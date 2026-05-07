import api from '@/lib/axios'
import type { ApiResponse, Task, CreateTaskPayload, UpdateTaskPayload } from '@/types'

export const getTasks = (filters?: { status?: string; priority?: string; projectId?: string; search?: string }) => {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.projectId) params.append('projectId', filters.projectId)
  if (filters?.search) params.append('search', filters.search)
  return api.get<ApiResponse<Task[]>>(`/tasks?${params}`).then(r => r.data.data)
}

export const getTaskById = (id: string) =>
  api.get<ApiResponse<Task>>(`/tasks/${id}`).then(r => r.data.data)

export const createTask = (data: CreateTaskPayload) =>
  api.post<ApiResponse<Task>>('/tasks', data).then(r => r.data.data)

export const updateTask = (id: string, data: UpdateTaskPayload) =>
  api.put<ApiResponse<Task>>(`/tasks/${id}`, data).then(r => r.data.data)

export const deleteTask = (id: string) => api.delete(`/tasks/${id}`)
