export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] bg-slate-50/50 px-6 py-14 text-center">
      <div className="mb-4 h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
        <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
        </svg>
      </div>
      <h3 className="text-[14px] font-extrabold text-[#1a1a1a] tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[13px] font-medium text-slate-400 max-w-[250px]">{description}</p>
    </div>
  )
}
