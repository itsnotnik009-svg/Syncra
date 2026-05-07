import { cn } from '@/lib/utils'
import type { TaskStatus, Priority } from '@/types'

const statusMap: Record<TaskStatus, { label: string; cls: string; dot: string }> = {
  TODO: { label: 'To Do', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  IN_PROGRESS: { label: 'In Progress', cls: 'bg-[#FEF5E5] text-[#D4981C]', dot: 'bg-[#D4981C]' },
  REVIEW: { label: 'Review', cls: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-500' },
  COMPLETED: { label: 'Completed', cls: 'bg-[#EAF5EF] text-[#246152]', dot: 'bg-[#246152]' },
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const s = statusMap[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide', s.cls)}>
      <span className={cn('mr-2 h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

const priorityMap: Record<Priority, { label: string; cls: string }> = {
  LOW: { label: 'Low', cls: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', cls: 'bg-blue-50 text-blue-700' },
  HIGH: { label: 'High', cls: 'bg-orange-50 text-orange-700' },
  CRITICAL: { label: 'Critical', cls: 'bg-red-50 text-red-700' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priorityMap[priority]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', p.cls)}>
      {p.label}
    </span>
  )
}
