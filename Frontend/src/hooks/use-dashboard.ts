import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentActivity } from '@/api/dashboard'

export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: getDashboardStats })
}

export function useRecentActivity() {
  return useQuery({ queryKey: ['dashboard', 'activity'], queryFn: getRecentActivity })
}
