import React from "react"

const PrSectionCard = ({ icon, title, subtitle, children }) => (
  <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-950/80 px-5 py-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
          {icon}
        </div>
        <div>
          <div className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {title}
          </div>
          {subtitle && (
            <div className="text-[0.75rem] text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
    {children}
  </div>
)

export default PrSectionCard
