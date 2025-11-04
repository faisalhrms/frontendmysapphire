import React from "react"

const PrStatTile = ({ label, value, icon }) => (
  <div className="flex flex-1 min-w-[140px] flex-col gap-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-3 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
    </div>
    <div className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50 truncate">{value || "-"}</div>
  </div>
)

export default PrStatTile
