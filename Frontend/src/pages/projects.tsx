import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { useProjects, useDeleteProject } from '@/hooks/use-projects'
import { CardSkeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { Plus, FolderKanban, MoreVertical, Pencil, Trash2, ListTodo } from 'lucide-react'
import { format } from 'date-fns'
import ProjectFormDialog from '@/components/projects/project-form-dialog'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const { user } = useAuth()
  const { data: projects, isLoading } = useProjects()
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()
  const admin = user?.role === 'ADMIN'

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await deleteProject.mutateAsync(id)
    setMenuOpen(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1" />
        {admin && (
          <button onClick={() => { setEditingProject(null); setFormOpen(true) }} className="flex items-center gap-1.5 rounded-lg bg-[#1C3F35] px-4 py-2 text-[13px] font-bold text-[#FFC436] hover:bg-[#153029] transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Project
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <CardSkeleton key={i} />)}</div>
      ) : projects?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="group relative rounded-2xl border bg-white p-5 transition-all hover:shadow-md cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>
              {admin && (
                <div className="absolute right-3 top-3">
                  <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id) }} className="rounded-lg p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuOpen === project.id && (
                    <div className="absolute right-0 mt-1 w-32 rounded-xl border bg-white shadow-lg z-10" style={{ borderColor: 'var(--border-color)' }}>
                      <button onClick={(e) => { e.stopPropagation(); setEditingProject(project); setFormOpen(true); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-[#1a1a1a] hover:bg-[#F0EBE3] rounded-t-xl">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }} className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-b-xl">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8E0F5]">
                  <FolderKanban className="h-5 w-5 text-[#7C6CAF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-[#1C3F35] truncate">{project.title}</h3>
                  {project.description && <p className="mt-1 text-[12px] text-[#9C9590] line-clamp-2">{project.description}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-1.5 text-[12px] text-[#9C9590]">
                  <ListTodo className="h-3.5 w-3.5" /> {project._count?.tasks || 0} tasks
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#9C9590]">
                  <img src={`https://ui-avatars.com/api/?name=${project.creator.name}&background=1C3F35&color=FFC436&bold=true&size=20`} className="h-5 w-5 rounded-full" alt="" />
                  {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title="No projects yet" description={admin ? 'Create your first project to get started.' : 'No projects available.'} />}

      <ProjectFormDialog open={formOpen} onClose={() => { setFormOpen(false); setEditingProject(null) }} project={editingProject} />
    </div>
  )
}
