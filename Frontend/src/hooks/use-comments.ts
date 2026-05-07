import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTaskComments, addTaskComment, deleteTaskComment } from '@/api/comments'

export function useTaskComments(taskId: string) {
  return useQuery({ queryKey: ['comments', taskId], queryFn: () => getTaskComments(taskId), enabled: !!taskId })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) => addTaskComment(taskId, content),
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.taskId] }),
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) => deleteTaskComment(taskId, commentId),
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ['comments', v.taskId] }),
  })
}
