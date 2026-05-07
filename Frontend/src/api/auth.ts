import api from '@/lib/axios'
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User, UpdateProfilePayload, ChangePasswordPayload } from '@/types'

export const loginApi = (data: LoginPayload) =>
  api.post<ApiResponse<AuthResponse>>('/auth/login', data).then(r => r.data.data)

export const registerApi = (data: RegisterPayload) =>
  api.post<ApiResponse<AuthResponse>>('/auth/register', data).then(r => r.data.data)

export const getMeApi = () =>
  api.get<ApiResponse<User>>('/auth/me').then(r => r.data.data)

export const updateProfileApi = (data: UpdateProfilePayload) =>
  api.put<ApiResponse<User>>('/auth/profile', data).then(r => r.data.data)

export const changePasswordApi = (data: ChangePasswordPayload) =>
  api.put('/auth/password', data)
