import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import Topbar from './topbar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F4F6F2] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 pb-8 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
