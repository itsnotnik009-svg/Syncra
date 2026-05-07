import { useState, useCallback } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { useUpdateTask } from '@/hooks/use-tasks'
import TaskCard from './task-card'
import type { Task, TaskStatus } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const columns = [
  { id: 'TODO' as TaskStatus, label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-100' },
  { id: 'IN_PROGRESS' as TaskStatus, label: 'In Progress', color: 'text-[#D4981C]', bg: 'bg-[#FEF5E5]' },
  { id: 'REVIEW' as TaskStatus, label: 'Review', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'COMPLETED' as TaskStatus, label: 'Completed', color: 'text-[#246152]', bg: 'bg-[#EAF5EF]' },
]

function Column({ column, tasks, onEditTask }: { column: typeof columns[0]; tasks: Task[]; onEditTask: (t: Task) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  return (
    <div className="flex flex-col min-h-[400px] w-[280px] sm:w-[320px] shrink-0">
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className={cn('inline-flex items-center rounded-lg px-3 py-1.5 text-[13px] font-bold', column.bg, column.color)}>{column.label}</span>
        <span className="text-[13px] font-semibold text-slate-400">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className={cn('flex flex-col gap-4 flex-1 rounded-2xl p-2 transition-all duration-200', isOver && 'bg-[#FFC436]/10 ring-2 ring-dashed ring-[#FFC436]/40')}>
        {tasks.map((t) => <TaskCard key={t.id} task={t} onEdit={() => onEditTask(t)} />)}
        {!tasks.length && (
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 flex-1">
            <p className="text-[13px] font-medium text-slate-400">{isOver ? 'Drop here' : 'No tasks'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (t: Task) => void }) {
  const updateTask = useUpdateTask()
  const [dragging, setDragging] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const byStatus = useCallback((s: TaskStatus) => tasks.filter((t) => t.status === s), [tasks])

  const onDragEnd = useCallback(async (e: DragEndEvent) => {
    setDragging(null)
    if (!e.over) return
    const newStatus = e.over.id as TaskStatus
    if (!columns.some((c) => c.id === newStatus)) return
    const task = tasks.find((t) => t.id === e.active.id)
    if (!task || task.status === newStatus) return
    try {
      await updateTask.mutateAsync({ id: task.id as string, data: { status: newStatus } })
      toast.success(`Moved to ${columns.find((c) => c.id === newStatus)?.label}`)
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update')
    }
  }, [tasks, updateTask])

  return (
    <DndContext sensors={sensors} onDragStart={(e: DragStartEvent) => setDragging(e.active.data.current?.task || null)} onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-4 snap-x snap-mandatory">
        <div className="flex gap-4 sm:gap-6 min-w-max px-1">
          {columns.map((col) => (
            <div key={col.id} className="snap-center">
              <Column column={col} tasks={byStatus(col.id)} onEditTask={onEditTask} />
            </div>
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragging && <div className="w-[280px] rotate-2 cursor-grabbing opacity-90"><TaskCard task={dragging} isDragging /></div>}
      </DragOverlay>
    </DndContext>
  )
}
