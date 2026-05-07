import api from '@/lib/axios'
import type { ApiResponse, User, Role } from '@/types'

export const getUsers = () =>
  api.get<ApiResponse<User[]>>('/users').then(r => r.data.data)

export const updateUserRole = (id: string, role: Role) =>
  api.put<ApiResponse<User>>(`/users/${id}/role`, { role }).then(r => r.data.data)
