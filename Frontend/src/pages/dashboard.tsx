import { useAuth } from '@/contexts/auth-context'
import { useDashboardStats, useRecentActivity } from '@/hooks/use-dashboard'
import { useTasks } from '@/hooks/use-tasks'
import StatCard from '@/components/dashboard/stat-card'
import { StatusBadge, PriorityBadge } from '@/components/ui/badges'
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { ListTodo, CheckCircle2, Clock, AlertTriangle, FolderKanban, Activity, CalendarClock } from 'lucide-react'
import { format } from 'date-fns'

function AdminDashboard() {
  const { data: stats, isLoading: sl } = useDashboardStats()
  const { data: activity, isLoading: al } = useRecentActivity()

  return (
    <>
      {sl ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
      ) : stats && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Tasks" value={stats.totalTasks} variant="purple" icon={<ListTodo className="h-5 w-5 text-purple-600" />} subtitle={`${stats.totalProjects} active projects`} />
          <StatCard label="Completed" value={stats.completedTasks} variant="green" icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} subtitle={`${stats.completionPercentage}% completion rate`} />
          <StatCard label="Pending" value={stats.pendingTasks} variant="coral" icon={<Clock className="h-5 w-5 text-orange-600" />} subtitle="In progress or review" />
          <StatCard label="Overdue" value={stats.overdueTasks} variant="blue" icon={<AlertTriangle className="h-5 w-5 text-blue-600" />} subtitle="Requires attention" />
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-[#1C3F35]" />
          <h2 className="text-[16px] font-bold text-[#1C3F35]">Recent Activity</h2>
        </div>
        {al ? <TableSkeleton rows={5} /> : activity?.length ? (
          <div className="rounded-2xl border bg-white overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]" style={{ borderColor: 'var(--border-color)' }}>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b bg-[#F9FAFB]/50" style={{ borderColor: 'var(--border-light)' }}>
                  {['Task', 'Project', 'Status', 'Priority', 'Assignee', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activity.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0 hover:bg-[#F9FAFB] transition-colors group" style={{ borderColor: 'var(--border-light)' }}>
                    <td className="px-5 py-4 text-[13px] font-bold text-[#1C3F35]">{t.title}</td>
                    <td className="px-5 py-4 text-[13px] font-medium text-slate-500">{t.project.title}</td>
                    <td className="px-5 py-4"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-4">
                      {t.assignee ? (
                        <div className="flex items-center gap-2">
                          <img src={`https://ui-avatars.com/api/?name=${t.assignee.name}&background=1C3F35&color=FFC436&bold=true&size=24`} className="h-6 w-6 rounded-full ring-2 ring-white shadow-sm" alt="" />
                          <span className="text-[13px] font-medium text-slate-600">{t.assignee.name}</span>
                        </div>
                      ) : <span className="text-[13px] font-medium text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-slate-400">{format(new Date(t.createdAt), 'MMM d')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ) : <EmptyState title="No activity yet" description="Tasks will appear here once created." />}
      </div>
    </>
  )
}

function MemberDashboard() {
  const { data: stats, isLoading: sl } = useDashboardStats()
  const { data: tasks, isLoading: tl } = useTasks()

  return (
    <>
      {sl ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">{[0, 1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}</div>
      ) : stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <StatCard label="My Tasks" value={stats.totalTasks} variant="purple" icon={<ListTodo className="h-5 w-5 text-purple-600" />} subtitle="Assigned to you" />
          <StatCard label="Completed" value={stats.completedTasks} variant="green" icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} subtitle={`${stats.completionPercentage}% done`} />
          <StatCard label="Pending" value={stats.pendingTasks} variant="coral" icon={<Clock className="h-5 w-5 text-orange-600" />} subtitle="Needs action" />
          <StatCard label="Overdue" value={stats.overdueTasks} variant="blue" icon={<AlertTriangle className="h-5 w-5 text-blue-600" />} subtitle="Past deadline" />
          <StatCard label="Due This Week" value={stats.dueThisWeek} variant="coral" icon={<CalendarClock className="h-5 w-5 text-orange-600" />} subtitle="Coming up soon" />
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-[#1C3F35]" />
          <h2 className="text-[16px] font-bold text-[#1C3F35]">My Tasks</h2>
        </div>
        {tl ? <TableSkeleton rows={5} /> : tasks?.length ? (
          <div className="space-y-3">
            {tasks.slice(0, 10).map((t) => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#1C3F35] truncate">{t.title}</p>
                  <div className="mt-1.5 flex items-center gap-1.5"><FolderKanban className="h-3.5 w-3.5 text-slate-400" /><span className="text-[12px] font-medium text-slate-500">{t.project.title}</span></div>
                  {t.description && <p className="mt-1 text-[12px] text-slate-400 line-clamp-1 sm:hidden">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  {t.dueDate && <span className={`text-[12px] font-bold ${new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED' ? 'text-red-500' : 'text-slate-400'}`}>{format(new Date(t.dueDate), 'MMM d')}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No tasks assigned" description="You don't have any tasks yet." />}
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div>
      {user?.role === 'ADMIN' ? <AdminDashboard /> : <MemberDashboard />}
    </div>
  )
}
