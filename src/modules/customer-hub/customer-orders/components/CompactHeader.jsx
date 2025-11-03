import React from "react"
import dayjs from "dayjs"
import Avatar from "@components/Avatar.jsx"

const CompactHeader = ({ msg }) => {
  if (!msg) return null
  const sender = msg.owner || msg.from_name || msg.from_address || ""
  const when = msg.start_date || msg.received_at || msg.created_at || new Date().toISOString()
  const srcLabel = (s) => (s === "api" ? "API" : s ? s.charAt(0).toUpperCase() + s.slice(1) : "")
  const statusLabel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "-")
  const statusClass = (s) => {
    if (s === "approved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
    if (s === "submitted" || s === "under_approval") return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
    if (s === "rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
    return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
  }
  const badge = `${srcLabel(msg.source)} • ${statusLabel(msg.status)}`
  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <Avatar full_name={sender} size="sm" parentClasses="profile-timeline-avatar" />
        <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
          <span className="text-[.75rem] rounded-full bg-light/70 dark:bg-white/10 truncate">{sender}</span>
          <span className={`px-3 py-1 text-[.75rem] font-semibold rounded-full ${statusClass(msg.status)}`}>{badge}</span>
        </div>
        <div className="shrink-0 text-[.75rem] text-[#8c9097]">{dayjs(when).format("MMM-DD-YYYY, hh:mm A")}</div>
      </div>
    </div>
  )
}

export default CompactHeader
