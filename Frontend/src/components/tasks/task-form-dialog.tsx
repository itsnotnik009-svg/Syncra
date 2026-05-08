import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { useAuth } from '@/contexts/auth-context'
import type { Task, CreateTaskPayload } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'


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

  const inputStyle = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-[14px] text-[#1a1a1a] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/10"

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[#1C3F35]/20 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg rounded-xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-extrabold text-[#1C3F35] tracking-tight">{editing ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
          </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Title</label>
              <input type="text" placeholder="What needs to be done?" className={inputStyle} {...register('title', { required: 'Required' })} />
              {errors.title && <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.title.message}</p>}
            </div>
          )}

          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Description</label>
              <textarea rows={3} placeholder="Add more details..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] text-[#1a1a1a] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/10 resize-none" {...register('description')} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Status</label>
              <select className={inputStyle} {...register('status')}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            {(admin || !editing) && (
              <div>
                <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Priority</label>
                <select className={inputStyle} {...register('priority')}>
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
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Due Date</label>
              <input type="date" className={inputStyle} {...register('dueDate')} />
            </div>
          )}

          {(admin || !editing) && (
            <div>
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Project</label>
              <select className={inputStyle} {...register('projectId', { required: 'Required' })}>
                <option value="">Select a project...</option>
                {projects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {errors.projectId && <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.projectId.message}</p>}
            </div>
          )}

          {admin && (
            <div>
              <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Assignee</label>
              <select className={inputStyle} {...register('assignedTo')}>
                <option value="">Unassigned</option>
                {users?.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#1C3F35] px-6 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-[#153029] hover:shadow-lg disabled:opacity-50 transition-all">
              {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
