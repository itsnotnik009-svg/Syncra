import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getMeApi, loginApi, registerApi } from '@/api/auth'
import type { User, LoginPayload, RegisterPayload } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginPayload) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      setUser(await getMeApi())
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('token')) { setIsLoading(false); return }
    fetchUser().finally(() => setIsLoading(false))
  }, [fetchUser])

  const login = useCallback(async (data: LoginPayload) => {
    const res = await loginApi(data)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    setToken(res.token)
    setUser(res.user)
    queryClient.clear()
  }, [queryClient])

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await registerApi(data)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    setToken(res.token)
    setUser(res.user)
    queryClient.clear()
  }, [queryClient])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  const refreshUser = useCallback(() => fetchUser(), [fetchUser])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user && !!token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
