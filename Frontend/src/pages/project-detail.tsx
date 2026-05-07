import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useProject } from '@/hooks/use-projects'
import { StatusBadge, PriorityBadge } from '@/components/ui/badges'
import TaskDetailDrawer from '@/components/tasks/task-detail-drawer'
import TaskFormDialog from '@/components/tasks/task-form-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { ArrowLeft, Plus, Calendar, User2, ListTodo, CheckCircle2 } from 'lucide-react'
import { UserAvatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import type { Task, TaskStatus } from '@/types'

const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const admin = useAuth().user?.role === 'ADMIN'
  const { data: project, isLoading } = useProject(id || '')
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-96" />
      <div className="grid gap-3 sm:grid-cols-4 mt-6">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      <Skeleton className="h-64 w-full rounded-2xl mt-4" />
    </div>
  )

  if (!project) return <EmptyState title="Project not found" description="This project doesn't exist or has been deleted." />

  const tasks = project.tasks || []
  const done = tasks.filter(t => t.status === 'COMPLETED').length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length

  return (
    <div>
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-[#1C3F35] transition-colors mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#1C3F35]">{project.title}</h1>
          {project.description && <p className="mt-1 text-[14px] text-slate-500 max-w-2xl">{project.description}</p>}
          <div className="flex items-center gap-4 mt-2 text-[12px] text-slate-400">
            <span className="flex items-center gap-1"><User2 className="h-3.5 w-3.5" />{project.creator.name}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
        {admin && (
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-[#1C3F35] px-4 py-2.5 text-[13px] font-bold text-[#FFC436] hover:bg-[#153029] transition-colors">
            <Plus className="h-4 w-4" /> Add Task
          </button>
        )}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-6">
        <div className="flex items-center gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8E0F5]"><ListTodo className="h-5 w-5 text-[#7C6CAF]" /></div>
          <div><p className="text-[22px] font-bold text-[#1C3F35]">{tasks.length}</p><p className="text-[11px] font-semibold text-slate-400 uppercase">Total Tasks</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5F0E0]"><CheckCircle2 className="h-5 w-5 text-[#4A8C60]" /></div>
          <div><p className="text-[22px] font-bold text-[#1C3F35]">{done}</p><p className="text-[11px] font-semibold text-slate-400 uppercase">Completed</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50"><Calendar className="h-5 w-5 text-red-500" /></div>
          <div><p className="text-[22px] font-bold text-[#1C3F35]">{overdue}</p><p className="text-[11px] font-semibold text-slate-400 uppercase">Overdue</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Progress</p>
              <p className="text-[14px] font-bold text-[#1C3F35]">{pct}%</p>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-[#1C3F35] transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {tasks.length ? (
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                {['Task', 'Status', 'Priority', 'Assignee', 'Due Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...tasks].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)).map((t) => {
                const late = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
                return (
                  <tr key={t.id} onClick={() => setDetailTask(t)} className="border-b last:border-b-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer" style={{ borderColor: 'var(--border-light)' }}>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-[#1C3F35]">{t.title}</p>
                      {t.description && <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">{t.description}</p>}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3.5"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-3.5">
                      {t.assignee ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={t.assignee.name} className="h-6 w-6 rounded-full text-[10px]" />
                          <span className="text-[13px] text-slate-600">{t.assignee.name}</span>
                        </div>
                      ) : <span className="text-[13px] text-slate-400">—</span>}
                    </td>
                    <td className={`px-5 py-3.5 text-[13px] ${late ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>{t.dueDate ? format(new Date(t.dueDate), 'MMM d, yyyy') : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      ) : <EmptyState title="No tasks yet" description={admin ? 'Add the first task to this project.' : 'No tasks in this project.'} />}

      <TaskDetailDrawer task={detailTask} open={!!detailTask} onClose={() => setDetailTask(null)} />
      <TaskFormDialog open={formOpen} onClose={() => setFormOpen(false)} task={null} defaultProjectId={project.id} />
    </div>
  )
}
