import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import type { Project, CreateProjectPayload } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'


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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-[#1C3F35]/20 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md rounded-xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-extrabold text-[#1C3F35] tracking-tight">{editing ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
          </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Title</label>
            <input type="text" placeholder="e.g. Website Redesign" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-[14px] text-[#1a1a1a] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/10" {...register('title', { required: 'Required' })} />
            {errors.title && <p className="mt-1.5 text-[12px] font-medium text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1C3F35] mb-2">Description</label>
            <textarea rows={3} placeholder="What is this project about?" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] text-[#1a1a1a] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/10 resize-none" {...register('description')} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#1C3F35] px-6 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-[#153029] hover:shadow-lg disabled:opacity-50 transition-all">
              {isSubmitting ? 'Saving...' : editing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
