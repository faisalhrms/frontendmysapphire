import React from "react"
import dayjs from "dayjs"
import Avatar from "@components/Avatar.jsx"

const CompactHeader = ({ msg }) => {
  if (!msg) return null
  const sender = msg.from_name || msg.from_address
  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <Avatar full_name={sender} size="sm" parentClasses="profile-timeline-avatar" />
        <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
          <span className="text-[.75rem] rounded-full bg-light/70 dark:bg-white/10  truncate">{sender}</span>
          <span className="px-3 py-1 rounded-fulldark:bg-white/10 text-[.82rem] font-semibold truncate">{msg.subject}</span>
        </div>
        <div className="shrink-0 text-[.75rem] text-[#8c9097]">{dayjs(msg.received_at).format("MMM-DD-YYYY, hh:mm A")}</div>
      </div>
    </div>
  )
}

export default CompactHeader
