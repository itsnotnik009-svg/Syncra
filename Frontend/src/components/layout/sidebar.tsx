import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FolderKanban, ListTodo, Users, Settings, LogOut, X, Box } from 'lucide-react'

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/tasks', label: 'Tasks', icon: ListTodo },
    ...(user?.role === 'ADMIN' ? [{ to: '/members', label: 'Members', icon: Users }] : []),
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#1C3F35] transition-transform duration-300 lg:relative lg:translate-x-0 lg:rounded-[24px] lg:my-4 lg:ml-4 shadow-xl h-full lg:h-[calc(100vh-32px)] overflow-hidden", open ? "translate-x-0" : "-translate-x-full")}>
        
        {/* Decorative subtle background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex h-24 items-center px-8 gap-3 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFC436] shadow-sm">
            <Box className="h-5 w-5 text-[#1C3F35]" />
          </div>
          <span className="text-[22px] font-extrabold text-white tracking-tight">Syncra</span>
          <button onClick={onClose} className="ml-auto rounded-md p-2 text-emerald-100/60 hover:bg-white/10 lg:hidden transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 relative z-10">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={onClose}
              className={({ isActive }) => cn('flex items-center gap-4 rounded-xl px-5 py-3.5 text-[15px] font-bold transition-all duration-200', isActive ? 'bg-[#FFC436] text-[#1C3F35] shadow-[0_4px_20px_rgba(255,196,54,0.3)]' : 'text-emerald-100/70 hover:bg-white/5 hover:text-white hover:translate-x-1')}>
              {({ isActive }) => (
                <>
                  <link.icon className={cn("h-5 w-5 stroke-[2.5px]", isActive ? "text-[#1C3F35]" : "text-emerald-100/50")} />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto relative z-10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-3 py-2">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=FFC436&color=1C3F35&bold=true`} alt="" className="h-10 w-10 rounded-full ring-2 ring-white/10" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white truncate">{user?.name}</p>
                <p className="text-[12px] text-emerald-100/60 font-medium truncate capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login') }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold text-emerald-100/70 hover:bg-red-500/10 hover:text-red-400 transition-all mt-1">
              <LogOut className="h-4 w-4 stroke-[2.5px]" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
