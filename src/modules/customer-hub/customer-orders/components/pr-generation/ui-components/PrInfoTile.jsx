import React from "react"

const PrInfoTile = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 px-3 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
    <div className="text-[0.65rem] font-medium tracking-[0.14em] text-slate-500 dark:text-slate-500 uppercase">
      {label}
    </div>
    <div className="mt-2 text-[0.76rem] font-medium text-gray-800 dark:text-white/70 truncate">
      {value ?? "-"}
    </div>
  </div>
)

export default PrInfoTile
