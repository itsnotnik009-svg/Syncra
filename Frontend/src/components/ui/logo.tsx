export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C3F35] to-[#122A23] shadow-inner border border-white/10 relative overflow-hidden">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#FFC436]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21v-5h5" />
        </svg>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-[#1a1a1a]">Syncra</span>
    </div>
  )
}

export function LogoLight({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-inner border border-white/20 relative overflow-hidden">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#FFC436]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21v-5h5" />
        </svg>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-white">Syncra</span>
    </div>
  )
}