import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, createTask, updateTask, deleteTask } from '@/api/tasks'
import type { CreateTaskPayload, UpdateTaskPayload } from '@/types'

export function useTasks(filters?: { status?: string; priority?: string; projectId?: string; search?: string }) {
  return useQuery({ queryKey: ['tasks', filters], queryFn: () => getTasks(filters) })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => createTask(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) => updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = qc.getQueriesData({ queryKey: ['tasks'] })
      qc.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
        if (!old || !Array.isArray(old)) return old
        return old.map((t: any) => t.id === id ? { ...t, ...data } : t)
      })
      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, oldData]) => {
          qc.setQueryData(queryKey, oldData)
        })
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
