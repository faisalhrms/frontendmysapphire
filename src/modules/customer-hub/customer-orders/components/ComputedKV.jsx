import React, { useEffect, useMemo } from "react"

const ComputedKV = ({
  label,
  compute,
  deps = [],
  precision = "",
  prefix = "",
  suffix = "",
  onValue,
  valueWidth = "w-20 md:w-24",
}) => {
  const num = useMemo(() => {
    const v = compute ? compute() : null
    const n = typeof v === "number" ? v : parseFloat(v)
    if (v === null || v === undefined || Number.isNaN(n) || !Number.isFinite(n)) return null
    return n
  }, deps)

  const val = useMemo(() => {
    if (num == null) return null
    return typeof precision === "number" ? num.toFixed(precision) : String(num)
  }, [num, precision])

  useEffect(() => {
    if (onValue) onValue(num)
  }, [num, onValue])

  return (
    <div className="grid grid-cols-[1fr,auto] items-center py-2 gap-2">
      <span className="text-gray-600 dark:text-white/70 truncate">{label}</span>
      <div className={`relative flex items-center justify-end ${valueWidth} pr-6`}>
        <span className="font-medium text-right tabular-nums truncate">
          {val == null ? "-" : `${prefix}${val}${suffix}`}
        </span>
      </div>
    </div>
  )
}

export default ComputedKV
