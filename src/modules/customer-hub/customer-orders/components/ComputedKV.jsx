import React, { useEffect, useMemo } from "react"

const ComputedKV = ({ label, compute, deps = [], precision = 2, prefix = "", suffix = "", onValue }) => {
  const val = useMemo(() => {
    const v = compute ? compute() : null
    if (v === null || v === undefined || Number.isNaN(v)) return null
    const n = typeof v === "number" ? v : parseFloat(v)
    if (!Number.isFinite(n)) return null
    return n.toFixed(precision)
  }, deps)

  useEffect(() => {
    if (onValue) onValue(val == null ? null : Number(val))
  }, [val, onValue])

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600 dark:text-white/70 truncate">{label}</span>
      <span className="font-medium">{val == null ? "-" : `${prefix}${val}${suffix}`}</span>
    </div>
  )
}

export default ComputedKV
