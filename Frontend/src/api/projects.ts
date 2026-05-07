import api from '@/lib/axios'
import type { ApiResponse, Project, CreateProjectPayload, UpdateProjectPayload } from '@/types'

export const getProjects = () =>
  api.get<ApiResponse<Project[]>>('/projects').then(r => r.data.data)

export const getProjectById = (id: string) =>
  api.get<ApiResponse<Project>>(`/projects/${id}`).then(r => r.data.data)

export const createProject = (data: CreateProjectPayload) =>
  api.post<ApiResponse<Project>>('/projects', data).then(r => r.data.data)

export const updateProject = (id: string, data: UpdateProjectPayload) =>
  api.put<ApiResponse<Project>>(`/projects/${id}`, data).then(r => r.data.data)

export const deleteProject = (id: string) => api.delete(`/projects/${id}`)
