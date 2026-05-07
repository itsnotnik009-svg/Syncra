import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { format } from 'date-fns'
import { PriorityBadge } from '@/components/ui/badges'
import { Calendar, GripVertical } from 'lucide-react'

export default function TaskCard({ task, onEdit, isDragging }: { task: Task; onEdit?: () => void; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id, data: { task } })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'

  return (
    <div ref={setNodeRef} style={style} onClick={() => onEdit?.()}
      className={cn('group relative rounded-2xl bg-white p-4 shadow-sm transition-all border border-slate-100 hover:shadow-md hover:border-[#FFC436]/40 cursor-pointer', isDragging && 'opacity-60 scale-[1.02] shadow-xl ring-2 ring-[#FFC436]')}>
      <div {...listeners} {...attributes} className="absolute right-2 top-2 rounded-md p-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none" onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-4 w-4" />
      </div>
      <h4 className="text-[14px] font-bold text-[#1C3F35] leading-snug mb-1 pr-6">{task.title}</h4>
      <p className="text-[12px] text-slate-400 font-medium mb-2">{task.project.title}</p>
      {task.description && <p className="text-[12px] text-slate-500 line-clamp-1 sm:line-clamp-2 mb-3 leading-relaxed">{task.description}</p>}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span className={cn('flex items-center gap-1 text-[11px] font-medium', overdue ? 'text-red-500' : 'text-slate-400')}>
              <Calendar className="h-3 w-3" />{format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
        {task.assignee
          ? <img src={`https://ui-avatars.com/api/?name=${task.assignee.name}&background=FFC436&color=1C3F35&bold=true&size=24`} className="h-6 w-6 rounded-full border-2 border-white shadow-sm" alt={task.assignee.name} title={task.assignee.name} />
          : <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 text-[9px] font-bold">?</div>
        }
      </div>
    </div>
  )
}
