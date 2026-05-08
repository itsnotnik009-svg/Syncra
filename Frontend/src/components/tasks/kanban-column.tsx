import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import TaskCard from './task-card'
import type { Task, TaskStatus } from '@/types'

interface Props {
  id: TaskStatus
  label: string
  tasks: Task[]
  onEditTask: (task: Task) => void
}

const columnColors: Record<TaskStatus, string> = {
  TODO: 'border-t-slate-400',
  IN_PROGRESS: 'border-t-blue-500',
  REVIEW: 'border-t-amber-500',
  COMPLETED: 'border-t-emerald-500',
}

export default function KanbanColumn({ id, label, tasks, onEditTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border-t-2 bg-slate-50/80 p-3 min-h-[300px] transition-colors',
        columnColors[id],
        isOver && 'bg-indigo-50/50 ring-2 ring-indigo-200'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300/60 py-8">
            <p className="text-xs text-slate-400">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}
