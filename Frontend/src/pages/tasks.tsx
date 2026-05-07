import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useTasks } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import KanbanBoard from '@/components/tasks/kanban-board'
import TaskFormDialog from '@/components/tasks/task-form-dialog'
import TaskDetailDrawer from '@/components/tasks/task-detail-drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, SlidersHorizontal, Search, X } from 'lucide-react'
import type { Task } from '@/types'

export default function TasksPage() {
  const { user } = useAuth()
  const admin = user?.role === 'ADMIN'
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  
  const [projectFilter, setProjectFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const { data: tasks, isLoading } = useTasks({ 
    projectId: projectFilter || undefined, 
    priority: priorityFilter || undefined,
    search: searchQuery || undefined
  })
  
  const { data: projects } = useProjects()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium text-[#6B6560] hover:bg-[#F0EBE3] transition-colors" style={{ borderColor: 'var(--border-color)' }}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          {admin && (
            <button onClick={() => { setEditingTask(null); setFormOpen(true) }} className="flex items-center gap-1.5 rounded-lg bg-[#1C3F35] px-4 py-2 text-[13px] font-bold text-[#FFC436] transition-colors hover:bg-[#153029]">
              <Plus className="h-3.5 w-3.5" /> New Task
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <label className="block text-[11px] font-medium text-[#9C9590] mb-1">Project</label>
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="h-8 rounded-lg border bg-white px-3 text-[13px] text-[#1a1a1a] outline-none focus:border-[#C4B5F0]" style={{ borderColor: 'var(--border-color)' }}>
              <option value="">All Projects</option>
              {projects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#9C9590] mb-1">Priority</label>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-8 rounded-lg border bg-white px-3 text-[13px] text-[#1a1a1a] outline-none focus:border-[#C4B5F0]" style={{ borderColor: 'var(--border-color)' }}>
              <option value="">All</option>
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          {(projectFilter || priorityFilter || searchQuery) && (
            <button onClick={() => { setProjectFilter(''); setPriorityFilter(''); setSearchParams({}) }} className="text-[12px] text-[#7C6CAF] hover:text-[#5A4A8C] font-medium pb-1">Clear</button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 min-w-[900px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="min-h-[300px]">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="space-y-2"><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-28 w-full rounded-xl" /></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <KanbanBoard tasks={tasks || []} onEditTask={(t) => setDetailTask(t)} />
      )}

      <TaskFormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditingTask(null) }} task={editingTask} />
      <TaskDetailDrawer task={detailTask} open={!!detailTask} onClose={() => setDetailTask(null)} />
    </div>
  )
}
