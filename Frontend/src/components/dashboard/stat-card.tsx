import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const styles: Record<string, { bg: string, iconBg: string }> = {
  purple: { bg: 'bg-white', iconBg: 'bg-purple-100/80' },
  green: { bg: 'bg-white', iconBg: 'bg-emerald-100/80' },
  coral: { bg: 'bg-white', iconBg: 'bg-orange-100/80' },
  blue: { bg: 'bg-white', iconBg: 'bg-blue-100/80' },
}

export default function StatCard({ label, value, icon, subtitle, variant }: {
  label: string; value: number | string; icon: ReactNode; subtitle?: string
  variant: 'purple' | 'coral' | 'blue' | 'green'
}) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 border shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1",
      styles[variant].bg
    )} style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold text-slate-500 tracking-wide">{label}</span>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shadow-sm', styles[variant].iconBg)}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[32px] font-black tracking-tight text-[#1C3F35] leading-none mb-1.5">{value}</p>
        {subtitle && <p className="text-[13px] font-semibold text-slate-400">{subtitle}</p>}
      </div>
    </div>
  )
}
