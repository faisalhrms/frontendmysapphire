import React from "react"
import dayjs from "dayjs"
import Avatar from "@components/Avatar.jsx"

const CompactHeader = ({ msg }) => {
  if (!msg) return null

  const sender = msg.owner || msg.from_name || msg.from_address || ""
  const isEmail = (msg.source || "").toLowerCase() === "email"
  const when = isEmail
    ? (msg.email?.received_at || msg.received_at || msg.created_at || new Date().toISOString())
    : (msg.start_date || msg.created_at || msg.received_at || new Date().toISOString())

  const srcLabel = (s) => (s === "api" ? "API" : s ? s.charAt(0).toUpperCase() + s.slice(1) : "")
  const statusLabel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "-")
  const statusClass = (s) => {
    if (s === "approved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
    if (s === "submitted" || s === "under_approval") return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
    if (s === "rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
    return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
  }
  const containerAccent = (s) => {
    if (s === "approved") return "border-l-2 border-l-emerald-500"
    if (s === "submitted" || s === "under_approval") return "border-l-2 border-l-amber-500"
    if (s === "rejected") return "border-l-2 border-l-rose-500"
    return "border-l-2 border-l-slate-200 dark:border-l-white/10"
  }

  const badge = `${srcLabel(msg.source)}`
  const stageLabel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ") : "-")
  const stageClass = (s) => {
    if (s === "completed") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-300"
    if (s === "pending") return "bg-sky-50 text-sky-700 dark:bg-sky-900/10 dark:text-sky-300"
    return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
  }

  const yarnStatus = msg.yarn_terms_status
  const fabricStatus = msg.fabric_delivery_status

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border dark:border-defaultborder/20 bg-white/80 dark:bg-bodybg/80 shadow-sm px-3 py-1.5 text-[0.78rem] ${containerAccent(
        msg.status
      )}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar full_name={sender} size="sm" parentClasses="profile-timeline-avatar shrink-0" />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate font-medium">{sender}</span>
            {badge && (
              <span
                className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${statusClass(
                  msg.status
                )}`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {badge && (
          <span
            className={`inline-flex sm:hidden items-center rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${statusClass(
              msg.status
            )}`}
          >
            {badge}
          </span>
        )}
        {yarnStatus && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap ${stageClass(
              yarnStatus
            )}`}
          >
            Yarn Rates: {stageLabel(yarnStatus)}
          </span>
        )}
        {fabricStatus && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap ${stageClass(
              fabricStatus
            )}`}
          >
            Fabric delivery: {stageLabel(fabricStatus)}
          </span>
        )}
        <span className="hidden sm:inline-block h-4 w-px bg-slate-200 dark:bg-white/10" />
        <span className="shrink-0 text-[0.7rem] text-[#8c9097]">
          {dayjs(when).format("MMM-DD-YYYY, hh:mm A")}
        </span>
      </div>
    </div>
  )
}

export default CompactHeader
