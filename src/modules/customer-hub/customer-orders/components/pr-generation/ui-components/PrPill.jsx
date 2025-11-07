import React from "react"

const tones = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-800/60",
  amber: "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800/60",
  rose: "bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-900/40 dark:text-rose-100 dark:border-rose-800/60",
  sky: "bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-900/40 dark:text-sky-100 dark:border-sky-800/60",
}

const PrPill = ({ children, tone = "slate" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${tones[tone] || tones.slate}`}>
    {children}
  </span>
)

export default PrPill
