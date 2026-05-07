import { useUsers, useUpdateUserRole } from '@/hooks/use-users'
import { useAuth } from '@/contexts/auth-context'
import { TableSkeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { Mail, FolderKanban, ListTodo } from 'lucide-react'
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
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                {['Member', 'Role', 'Projects', 'Tasks', 'Joined'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9C9590]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-b-0 hover:bg-[#FAF8F5] transition-colors" style={{ borderColor: 'var(--border-light)' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${u.name}&background=1C3F35&color=FFC436&bold=true&size=32`} alt="" className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="text-[13px] font-medium text-[#1a1a1a]">{u.name}</p>
                        <div className="flex items-center gap-1 text-[11px] text-[#9C9590]"><Mail className="h-3 w-3" />{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {(u.id === me?.id || me?.role !== 'ADMIN') ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${u.role === 'ADMIN' ? 'bg-[#E8E0F5] text-[#7C6CAF]' : 'bg-[#D5F0E0] text-[#4A8C60]'}`}>{u.role}{u.id === me?.id ? ' (You)' : ''}</span>
                    ) : (
                      <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value as Role)} className={`rounded-full px-3 py-1 text-[11px] font-semibold border-none outline-none cursor-pointer ${u.role === 'ADMIN' ? 'bg-[#E8E0F5] text-[#7C6CAF]' : 'bg-[#D5F0E0] text-[#4A8C60]'}`}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-1.5 text-[13px] text-[#6B6560]"><FolderKanban className="h-3.5 w-3.5 text-[#9C9590]" />{u._count?.projects || 0}</div></td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-1.5 text-[13px] text-[#6B6560]"><ListTodo className="h-3.5 w-3.5 text-[#9C9590]" />{u._count?.tasks || 0}</div></td>
                  <td className="px-5 py-3.5 text-[13px] text-[#9C9590]">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
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
