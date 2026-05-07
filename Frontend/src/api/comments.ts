import api from '@/lib/axios'
import type { ApiResponse, Comment } from '@/types'

export const getTaskComments = (taskId: string) =>
  api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`).then(r => r.data.data)

export const addTaskComment = (taskId: string, content: string) =>
  api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content }).then(r => r.data.data)

export const deleteTaskComment = (taskId: string, commentId: string) =>
  api.delete(`/tasks/${taskId}/comments/${commentId}`)
