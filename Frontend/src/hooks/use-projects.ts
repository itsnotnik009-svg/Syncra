import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '@/api/projects'
import type { CreateProjectPayload, UpdateProjectPayload } from '@/types'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: getProjects })
}

export function useProject(id: string) {
  return useQuery({ queryKey: ['projects', id], queryFn: () => getProjectById(id), enabled: !!id })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectPayload }) => updateProject(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}
