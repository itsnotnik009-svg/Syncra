import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { useAuth } from '@/contexts/auth-context'
import type { Task, CreateTaskPayload } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'

const inputCls = "h-10 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#1a1a1a] placeholder:text-[#9C9590] outline-none transition-all focus:border-[#C4B5F0] focus:ring-2 focus:ring-[#E8E0F5]"

export default function TaskFormDialog({ open, onClose, task, defaultStatus, defaultProjectId }: {
  open: boolean; onClose: () => void; task: Task | null; defaultStatus?: string; defaultProjectId?: string
}) {
  const { user } = useAuth()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { data: projects } = useProjects()
  const { data: users } = useUsers()
  const editing = !!task
  const admin = user?.role === 'ADMIN'

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTaskPayload>()

  useEffect(() => {
    if (!open) return
    if (task) {
      reset({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', assignedTo: task.assignedTo || '', projectId: task.projectId })
    } else {
      reset({ title: '', description: '', status: (defaultStatus as CreateTaskPayload['status']) || 'TODO', priority: 'MEDIUM', dueDate: '', assignedTo: '', projectId: defaultProjectId || projects?.[0]?.id || '' })
    }
  }, [open, task, reset, defaultStatus, defaultProjectId, projects])

  const onSubmit = async (data: CreateTaskPayload) => {
    try {
      const payload = { ...data, dueDate: data.dueDate ? new Date(data.dueDate as string).toISOString() : null, assignedTo: data.assignedTo || null }
      if (editing) {
        await (admin ? updateTask.mutateAsync({ id: task.id, data: payload }) : updateTask.mutateAsync({ id: task.id, data: { status: data.status } }))
        toast.success('Task updated')
      } else {
        await createTask.mutateAsync(payload)
        toast.success('Task created')
      }
      onClose()
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">{editing ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#9C9590] hover:bg-[#F0EBE3]"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Title</label>
              <input type="text" placeholder="Task name" className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('title', { required: 'Required' })} />
              {errors.title && <p className="mt-1 text-[11px] text-red-500">{errors.title.message}</p>}
            </div>
          )}

          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Description</label>
              <textarea rows={2} placeholder="Description..." className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#1a1a1a] placeholder:text-[#9C9590] outline-none focus:border-[#C4B5F0] focus:ring-2 focus:ring-[#E8E0F5] resize-none" style={{ borderColor: 'var(--border-color)' }} {...register('description')} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Status</label>
              <select className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('status')}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            {(admin || !editing) && (
              <div>
                <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Priority</label>
                <select className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('priority')}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            )}
          </div>

          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Due Date</label>
              <input type="date" className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('dueDate')} />
            </div>
          )}

          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Project</label>
              <select className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('projectId', { required: 'Required' })}>
                <option value="">Select project</option>
                {projects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {errors.projectId && <p className="mt-1 text-[11px] text-red-500">{errors.projectId.message}</p>}
            </div>
          )}

          {admin && (
            <div>
              <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Assignee</label>
              <select className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('assignedTo')}>
                <option value="">Unassigned</option>
                {users?.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-[13px] font-medium text-[#6B6560] hover:bg-[#F0EBE3]" style={{ borderColor: 'var(--border-color)' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#1C3F35] px-4 py-2 text-[13px] font-bold text-[#FFC436] hover:bg-[#153029] disabled:opacity-50">
              {isSubmitting ? 'Saving...' : editing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
