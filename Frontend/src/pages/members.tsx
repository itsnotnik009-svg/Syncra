import { useUsers, useUpdateUserRole } from '@/hooks/use-users'
import { useAuth } from '@/contexts/auth-context'
import { TableSkeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { Mail, FolderKanban, ListTodo, ChevronDown } from 'lucide-react'
import { UserAvatar } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Role } from '@/types'

export default function MembersPage() {
  const { user: me } = useAuth()
  const { data: users, isLoading } = useUsers()
  const updateRole = useUpdateUserRole()

  const changeRole = async (id: string, role: Role) => {
    try { await updateRole.mutateAsync({ id, role }); toast.success('Role updated') }
    catch { toast.error('Failed to update role') }
  }

  return (
    <div>


      {isLoading ? <TableSkeleton rows={5} /> : users?.length ? (
        <div className="rounded-[24px] border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {['Member', 'Role', 'Projects', 'Tasks', 'Joined'].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-left text-[12px] font-extrabold uppercase tracking-widest text-slate-400/80 ${i === 0 ? 'rounded-tl-[24px]' : ''} ${i === 4 ? 'rounded-tr-[24px]' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {users.map((u) => (
                <tr key={u.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3.5">
                      <UserAvatar name={u.name} className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm group-hover:ring-[#FFC436] transition-all text-[13px]" />
                      <div>
                        <p className="text-[14px] font-extrabold text-[#1C3F35] tracking-tight">{u.name}</p>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-0.5"><Mail className="h-3.5 w-3.5" />{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    {(u.id === me?.id || me?.role !== 'ADMIN') ? (
                      <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-sm ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-[#D5F0E0] text-[#4A8C60]'}`}>
                        {u.role}{u.id === me?.id ? ' (You)' : ''}
                      </span>
                    ) : (
                      <div className="relative inline-block group/select">
                        <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value as Role)} className={`appearance-none rounded-full pl-3 pr-8 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-sm outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-all ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-[#D5F0E0] text-[#4A8C60]'}`}>
                          <option value="ADMIN" className="bg-white text-slate-700 font-bold">ADMIN</option>
                          <option value="MEMBER" className="bg-white text-slate-700 font-bold">MEMBER</option>
                        </select>
                        <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-transform group-hover/select:translate-y-[-40%] ${u.role === 'ADMIN' ? 'text-purple-600' : 'text-[#4A8C60]'}`} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4.5"><div className="flex items-center gap-2 text-[13px] font-bold text-slate-500"><FolderKanban className="h-4 w-4 text-slate-300" />{u._count?.projects || 0}</div></td>
                  <td className="px-6 py-4.5"><div className="flex items-center gap-2 text-[13px] font-bold text-slate-500"><ListTodo className="h-4 w-4 text-slate-300" />{u._count?.tasks || 0}</div></td>
                  <td className="px-6 py-4.5 text-[13px] font-bold text-slate-400">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : <EmptyState title="No members" description="No team members found." />}
    </div>
  )
}
