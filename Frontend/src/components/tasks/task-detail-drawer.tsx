import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useTaskComments, useAddComment, useDeleteComment } from '@/hooks/use-comments'
import { useUpdateTask } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { useProjects } from '@/hooks/use-projects'
import { StatusBadge, PriorityBadge } from '@/components/ui/badges'
import { X, Send, Trash2, Clock, Pencil, UserRound, CalendarDays, Flag } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import type { Task, TaskStatus } from '@/types'

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const

export default function TaskDetailDrawer({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const admin = user?.role === 'ADMIN'
  const [commentText, setCommentText] = useState('')
  const [editing, setEditing] = useState(false)

  const { data: comments, isLoading: loadingComments } = useTaskComments(task?.id || '')
  const { data: users } = useUsers()
  const { data: projects } = useProjects()
  const addComment = useAddComment()
  const deleteComment = useDeleteComment()
  const updateTask = useUpdateTask()

  const [editAssignee, setEditAssignee] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editProject, setEditProject] = useState('')

  if (!open || !task) return null

  const startEditing = () => {
    setEditAssignee(task.assignedTo || '')
    setEditPriority(task.priority)
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
    setEditProject(task.projectId)
    setEditing(true)
  }

  const saveEdits = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          assignedTo: editAssignee || null,
          priority: editPriority,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
          projectId: editProject,
        },
      })
      toast.success('Task updated')
      setEditing(false)
    } catch { toast.error('Failed to update task') }
  }

  const submitComment = async () => {
    if (!commentText.trim()) return
    try {
      await addComment.mutateAsync({ taskId: task.id, content: commentText.trim() })
      setCommentText('')
    } catch { toast.error('Failed to add comment') }
  }

  const changeStatus = async (status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id: task.id, data: { status } })
      toast.success(`Status changed to ${status.replace('_', ' ')}`)
    } catch { toast.error('Failed to update status') }
  }

  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
  const selectCls = "h-8 rounded-lg border bg-white px-2 text-[13px] text-[#1a1a1a] outline-none focus:border-[#FFC436]"

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[17px] font-bold text-[#1C3F35]">Task Details</h2>
          <div className="flex items-center gap-1">
            {admin && !editing && (
              <button onClick={startEditing} className="rounded-lg p-2 text-slate-400 hover:bg-[#FFF8E8] hover:text-[#1C3F35] transition-colors" title="Edit task">
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => { setEditing(false); onClose() }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-[20px] font-bold text-[#1C3F35] leading-tight mb-3">{task.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {overdue && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                    <Clock className="h-3 w-3" /> Overdue
                  </span>
                )}
              </div>
            </div>

            {task.description && (
              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400 mb-1.5">Description</p>
                <p className="text-[14px] text-slate-600 leading-relaxed">{task.description}</p>
              </div>
            )}

            {editing ? (
              <div className="rounded-2xl border bg-[#FFFCF5] p-4 space-y-3" style={{ borderColor: '#FFC436' }}>
                <p className="text-[12px] font-bold text-[#1C3F35] uppercase tracking-wide">Edit Task Settings</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1"><UserRound className="h-3 w-3" /> Assignee</label>
                    <select value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)} className={selectCls} style={{ borderColor: 'var(--border-color)', width: '100%' }}>
                      <option value="">Unassigned</option>
                      {users?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1"><Flag className="h-3 w-3" /> Priority</label>
                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className={selectCls} style={{ borderColor: 'var(--border-color)', width: '100%' }}>
                      {priorities.map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1"><CalendarDays className="h-3 w-3" /> Due Date</label>
                    <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className={selectCls} style={{ borderColor: 'var(--border-color)', width: '100%' }} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">Project</label>
                    <select value={editProject} onChange={(e) => setEditProject(e.target.value)} className={selectCls} style={{ borderColor: 'var(--border-color)', width: '100%' }}>
                      {projects?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveEdits} className="rounded-lg bg-[#1C3F35] px-4 py-1.5 text-[12px] font-bold text-[#FFC436] hover:bg-[#153029] transition-colors">Save</button>
                  <button onClick={() => setEditing(false)} className="rounded-lg border px-4 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50" style={{ borderColor: 'var(--border-color)' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-[#F9FAFB] p-4" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Project</p>
                  <p className="text-[13px] font-semibold text-[#1C3F35]">{task.project.title}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Assignee</p>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <img src={`https://ui-avatars.com/api/?name=${task.assignee.name}&background=FFC436&color=1C3F35&bold=true&size=24`} className="h-6 w-6 rounded-full" alt="" />
                      <span className="text-[13px] font-medium text-[#1C3F35]">{task.assignee.name}</span>
                    </div>
                  ) : <span className="text-[13px] text-slate-400">Unassigned</span>}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Due Date</p>
                  <p className={`text-[13px] font-semibold ${overdue ? 'text-red-600' : 'text-[#1C3F35]'}`}>
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Created</p>
                  <p className="text-[13px] font-medium text-[#1C3F35]">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}

            {admin && (
            <div>
              <p className="text-[11px] font-semibold uppercase text-slate-400 mb-2">Change Status</p>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                  <button key={s} onClick={() => changeStatus(s)} disabled={task.status === s}
                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${task.status === s ? 'bg-[#1C3F35] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-[#FFC436] hover:text-[#1C3F35]'}`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            )}

            <div>
              <p className="text-[13px] font-semibold text-[#1C3F35] mb-3">Comments {comments?.length ? `(${comments.length})` : ''}</p>
              <div className="space-y-3">
                {loadingComments ? <p className="text-[13px] text-slate-400 text-center py-4">Loading...</p>
                  : comments?.length ? comments.map((c) => (
                    <div key={c.id} className="flex gap-3 group">
                      <img src={`https://ui-avatars.com/api/?name=${c.user.name}&background=1C3F35&color=FFC436&bold=true&size=32`} className="h-8 w-8 rounded-full flex-shrink-0 mt-0.5" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#1C3F35]">{c.user.name}</span>
                          <span className="text-[11px] text-slate-400">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                          {(user?.role === 'ADMIN' || c.userId === user?.id) && (
                            <button onClick={() => deleteComment.mutate({ taskId: task.id, commentId: c.id })} className="opacity-0 group-hover:opacity-100 ml-auto rounded p-1 text-slate-300 hover:text-red-500 transition-all">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  )) : <p className="text-[13px] text-slate-400 text-center py-6">No comments yet. Start the conversation.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex gap-2">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Write a comment..." className="flex-1 h-10 rounded-xl border bg-[#F9FAFB] px-4 text-[13px] text-[#1C3F35] outline-none focus:border-[#FFC436] focus:ring-1 focus:ring-[#FFC436]" style={{ borderColor: 'var(--border-color)' }} />
            <button onClick={submitComment} disabled={!commentText.trim() || addComment.isPending} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C3F35] text-[#FFC436] hover:bg-[#153029] transition-colors disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
