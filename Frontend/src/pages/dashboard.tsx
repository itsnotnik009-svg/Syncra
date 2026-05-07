import { useAuth } from '@/contexts/auth-context'
import { useDashboardStats, useRecentActivity } from '@/hooks/use-dashboard'
import { useTasks } from '@/hooks/use-tasks'
import StatCard from '@/components/dashboard/stat-card'
import { StatusBadge, PriorityBadge } from '@/components/ui/badges'
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { ListTodo, CheckCircle2, Clock, AlertTriangle, FolderKanban, Activity, CalendarClock } from 'lucide-react'
import { UserAvatar } from '@/components/ui/avatar'
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
          <div className="rounded-[24px] border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {['Task', 'Project', 'Status', 'Priority', 'Assignee', 'Date'].map((h, i) => (
                    <th key={h} className={`px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-widest text-slate-400/80 ${i === 0 ? 'rounded-tl-[24px]' : ''} ${i === 5 ? 'rounded-tr-[24px]' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {activity.map((t) => (
                  <tr key={t.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4.5">
                      <p className="text-[14px] font-extrabold text-[#1C3F35] tracking-tight">{t.title}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-slate-300" />
                        <span className="text-[13px] font-semibold text-slate-500">{t.project.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="scale-95 origin-left"><StatusBadge status={t.status} /></div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="scale-95 origin-left"><PriorityBadge priority={t.priority} /></div>
                    </td>
                    <td className="px-6 py-4.5">
                      {t.assignee ? (
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={t.assignee.name} className="h-7 w-7 rounded-full ring-2 ring-white shadow-sm group-hover:ring-[#FFC436] transition-all text-[11px]" />
                          <span className="text-[13px] font-bold text-slate-600">{t.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="inline-flex h-7 items-center rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 text-[12px] font-semibold text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-[13px] font-bold text-slate-400">
                      {format(new Date(t.createdAt), 'MMM d')}
                    </td>
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
