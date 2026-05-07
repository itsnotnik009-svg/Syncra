import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import type { Project, CreateProjectPayload } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'

const inputCls = "h-10 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#1a1a1a] placeholder:text-[#9C9590] outline-none transition-all focus:border-[#C4B5F0] focus:ring-2 focus:ring-[#E8E0F5]"

export default function ProjectFormDialog({ open, onClose, project }: { open: boolean; onClose: () => void; project: Project | null }) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const editing = !!project
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateProjectPayload>()

  useEffect(() => {
    if (open) reset({ title: project?.title || '', description: project?.description || '' })
  }, [open, project, reset])

  const onSubmit = async (data: CreateProjectPayload) => {
    try {
      if (editing) { await updateProject.mutateAsync({ id: project.id, data }); toast.success('Project updated') }
      else { await createProject.mutateAsync(data); toast.success('Project created') }
      onClose()
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">{editing ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#9C9590] hover:bg-[#F0EBE3]"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Title</label>
            <input type="text" placeholder="Project name" className={inputCls} style={{ borderColor: 'var(--border-color)' }} {...register('title', { required: 'Required' })} />
            {errors.title && <p className="mt-1 text-[11px] text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Description</label>
            <textarea rows={3} placeholder="Brief description..." className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#1a1a1a] placeholder:text-[#9C9590] outline-none focus:border-[#C4B5F0] focus:ring-2 focus:ring-[#E8E0F5] resize-none" style={{ borderColor: 'var(--border-color)' }} {...register('description')} />
          </div>
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
