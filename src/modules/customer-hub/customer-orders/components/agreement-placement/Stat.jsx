import React from "react"
const Stat = ({ Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/5 dark:bg-white/10"><Icon size={16} /></span>
      <span className="text-[.8rem] opacity-70">{label}</span>
    </div>
    <span className="text-lg font-semibold">{value ?? "-"}</span>
  </div>
)
export default Stat
