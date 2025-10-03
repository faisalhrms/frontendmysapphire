import React, { useEffect, useMemo, useRef, useState } from "react"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function DateDropdownCalendar({ value = [], onChange, startYear, endYear }) {
  const now = new Date()
  const sy = startYear ?? now.getFullYear() - 5
  const ey = endYear ?? now.getFullYear()
  const data = useMemo(() => {
    const out = []
    for (let y = ey; y >= sy; y--) {
      const children = []
      for (let m = 1; m <= 12; m++) {
        const inFuture = y === now.getFullYear() && m > now.getMonth() + 1
        if (y === ey && inFuture) break
        const v = `${y}-${String(m).padStart(2, "0")}`
        children.push({ value: v, label: `${MONTHS[m - 1]} ${y}` })
      }
      out.push({ value: String(y), label: String(y), children })
    }
    return out
  }, [sy, ey])

  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState([String(ey)])
  const containerRef = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  useEffect(() => {
    if (!value?.length) onChange(data.find(g => g.value === String(ey))?.children ?? [])
  }, [data, ey])

  const hasMonth = v => value.some(x => x.value === v)
  const isYearFull = y => {
    const g = data.find(d => d.value === String(y))
    return g && g.children.every(c => hasMonth(c.value))
  }

  const toggleYear = y => {
    const g = data.find(d => d.value === String(y))
    if (!g) return
    if (isYearFull(y)) {
      onChange(value.filter(v => !g.children.some(c => c.value === v.value)))
    } else {
      const add = g.children.filter(c => !hasMonth(c.value))
      onChange([...value, ...add])
    }
  }

  const toggleMonth = m => {
    if (hasMonth(m.value)) onChange(value.filter(v => v.value !== m.value))
    else onChange([...value, m])
  }

  const { displayLabel, fullLabel } = useMemo(() => {
    const years = data.filter(g => isYearFull(g.value)).map(g => g.label)
    const months = value.filter(v => !years.some(y => v.label.endsWith(y))).map(v => v.label)
    const all = [...years, ...months]
    const full = all.join(", ") || "Select Months"
    const maxVisible = 3
    const display = all.length > maxVisible ? `${all.slice(0, maxVisible).join(", ")} + ${all.length - maxVisible} more` : full
    return { displayLabel: display, fullLabel: full }
  }, [value, data])

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="border rounded px-3 py-2 cursor-pointer flex items-center justify-between" onClick={() => setOpen(o => !o)}>
        <span className="truncate" title={fullLabel}>{displayLabel}</span>
        <span className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}>
          <svg height="20" width="20" viewBox="0 0 20 20"><path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0l3.908 3.747 3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502-.217.223-.502.335-.787.335s-.57-.112-.789-.335c0 0-4.287-4.084-4.695-4.502s-.436-1.17 0-1.615z"/></svg>
        </span>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow-lg max-h-80 overflow-auto divide-y divide-gray-100">
          {data.map(g => {
            const year = g.value
            const full = isYearFull(year)
            const partial = !full && g.children.some(c => hasMonth(c.value))
            return (
              <div key={year} className="p-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-check-input h-4 w-4 text-blue-600"
                    checked={full}
                    ref={el => el && (el.indeterminate = partial)}
                    onChange={() => toggleYear(year)}
                  />
                  <span className="ml-2 font-medium cursor-pointer" onClick={() => toggleYear(year)}>{g.label}</span>
                  <span className="ml-auto mr-2 cursor-pointer select-none" onClick={() => setExpanded(e => e.includes(year) ? e.filter(y => y !== year) : [...e, year])}>
                    {expanded.includes(year) ? "–" : "+"}
                  </span>
                </div>
                {expanded.includes(year) && g.children.map(c => (
                  <div key={c.value} className="flex items-center pl-6 mt-1">
                    <input
                      type="checkbox"
                      className="form-check-input h-4 w-4 text-green-600"
                      checked={hasMonth(c.value)}
                      onChange={() => toggleMonth(c)}
                    />
                    <span className="ml-2 cursor-pointer" onClick={() => toggleMonth(c)}>{c.label}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
