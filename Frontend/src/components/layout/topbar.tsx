import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Menu, Search, Bell } from 'lucide-react'
import { UserAvatar } from '@/components/ui/avatar'
import { format } from 'date-fns'

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const path = location.pathname
  let title = 'Dashboard'
  let subtitle = user?.role === 'ADMIN' ? 'Overview of all team activity' : `Welcome back, ${user?.name}`
  
  if (path.startsWith('/tasks')) { title = user?.role === 'ADMIN' ? 'Tasks' : 'My Tasks'; subtitle = user?.role === 'ADMIN' ? 'Manage and track all team tasks' : 'Track and update your assigned tasks' }
  else if (path.startsWith('/projects')) { title = 'Projects'; subtitle = 'Manage and track all ongoing projects' }
  else if (path.startsWith('/members')) { title = 'Team Members'; subtitle = 'Manage user roles and access' }
  else if (path.startsWith('/settings')) { title = 'Settings'; subtitle = 'Manage your account settings' }
  else if (path.startsWith('/project/')) { title = 'Project Details'; subtitle = 'View project tasks and information' }

  return (
    <header className="sticky top-0 z-30 flex flex-col justify-center px-4 sm:px-8 pb-4 sm:pb-6 pt-4 sm:pt-6 bg-[#F4F6F2]">
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#1C3F35] to-[#2A5C4D] text-white shadow-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* bg */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute right-[20%] bottom-[-20%] w-[200px] h-[200px] bg-gradient-to-tr from-[#FFC436]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={onMenuClick} className="rounded-lg p-2 text-emerald-100/60 hover:bg-white/10 lg:hidden transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[20px] sm:text-[26px] font-extrabold tracking-tight">{title}</h1>
            <p className="mt-1 text-[13px] font-medium text-emerald-100/80">{subtitle}</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="hidden md:block text-[13px] font-medium text-emerald-100/80 mr-2">{format(new Date(), 'EEEE, d MMMM yyyy')}</div>
          
          <form onSubmit={handleSearch} className="relative max-w-[240px] w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-100/60" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." 
              className="h-10 w-full rounded-full bg-white/10 border border-white/20 pl-10 pr-4 text-[13px] text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-[#FFC436] focus:bg-white/20 transition-all backdrop-blur-sm" />
          </form>
          
          <button className="relative rounded-full p-2 text-emerald-100/80 hover:bg-white/10 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 p-0.5 shadow-sm">
            <UserAvatar name={user?.name || 'U'} className="h-full w-full rounded-full text-[14px]" />
          </div>
        </div>
      </div>
    </header>
  )
}
