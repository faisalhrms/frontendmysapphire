import React from "react"

const map = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400",
  invalid: "bg-primary/10 text-primary"
}

const SeverityBadge = ({ value = "Low" }) => {
  const key = String(value || "Low").toLowerCase()
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${map[key] || map.low}`}>{value || "Low"}</span>
}

export default SeverityBadge
