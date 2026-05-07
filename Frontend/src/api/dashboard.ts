import api from '@/lib/axios'
import type { ApiResponse, DashboardStats, Task } from '@/types'

export const getDashboardStats = () =>
  api.get<ApiResponse<DashboardStats>>('/dashboard/stats').then(r => r.data.data)

export const getRecentActivity = () =>
  api.get<ApiResponse<Task[]>>('/dashboard/recent').then(r => r.data.data)
