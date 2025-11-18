export const r2 = (n) => Number((+n || 0).toFixed(2))
export const normalizeDateSeed = (v) => {
  if (!v) return ""
  if (v instanceof Date && !isNaN(v.getTime())) return v
  if (typeof v === "number") {
    const d = new Date(v)
    return isNaN(d.getTime()) ? "" : d
  }
  let s = String(v).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00Z")
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(s)) s = s.replace(" ", "T")
  const d = new Date(s)
  return isNaN(d.getTime()) ? "" : d
}
export const dateToYMD = (d) => {
  if (!d) return null
  const dt = d instanceof Date ? d : new Date(d)
  if (isNaN(dt)) return null
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, "0")
  const dd = String(dt.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}
