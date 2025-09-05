import React from "react"
import ExcelJS from "exceljs"

function toNumber(s) {
  if (!s) return null
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""))
  return isFinite(n) ? n : null
}

function fromSpec(wb, spec) {
  const ws = wb.addWorksheet("Data")
  const t = spec?.type
  const labels = spec?.labels || []
  const dsets = spec?.datasets || []
  if (!t || !labels.length || !dsets.length) return null
  if (t === "pie") {
    ws.addRow(["Label", spec?.metric || "Value", "Percent"])
    const total = (dsets[0]?.data || []).reduce((a, b) => a + (+b || 0), 0) || 0
    labels.forEach((l, i) => {
      const v = +(dsets[0]?.data?.[i] || 0)
      const p = total ? v / total : 0
      ws.addRow([l, v, p])
    })
    ws.getColumn(3).numFmt = "0%"
    return ws
  }
  if (t === "bar" && dsets.length === 1) {
    ws.addRow(["Label", spec?.metric || "Value", "Percent"])
    const total = (dsets[0]?.data || []).reduce((a, b) => a + (+b || 0), 0) || 0
    labels.forEach((l, i) => {
      const v = +(dsets[0]?.data?.[i] || 0)
      const p = total ? v / total : 0
      ws.addRow([l, v, p])
    })
    ws.getColumn(3).numFmt = "0%"
    return ws
  }
  const header = ["Label", ...dsets.map(d => d.label || "Series")]
  ws.addRow(header)
  labels.forEach((l, i) => {
    const row = [l, ...dsets.map(d => +(d?.data?.[i] || 0))]
    ws.addRow(row)
  })
  return ws
}

function fromHtmlTable(wb, html) {
  if (!html) return null
  const div = document.createElement("div")
  div.innerHTML = html
  const table = div.querySelector("table")
  if (!table) return null
  const ws = wb.addWorksheet("Data")
  Array.from(table.rows).forEach(tr => {
    const row = Array.from(tr.cells).map(td => td.innerText.trim())
    ws.addRow(row)
  })
  return ws
}

function fromHtmlList(wb, html) {
  if (!html) return null
  const div = document.createElement("div")
  div.innerHTML = html
  const list = div.querySelector("ol,ul")
  if (!list) return null
  const ws = wb.addWorksheet("Data")
  const items = Array.from(list.children).map(li => li.innerText.trim()).filter(Boolean)
  const rows = []
  const curRe = /(USD|PKR|EUR|GBP|AED|SAR|CNY|JPY|INR|\$|€|£|¥|Rs\.?)/i
  items.forEach((t, idx) => {
    let name = t
    let unit = ""
    let val = null
    const sep = t.split(/—|--|:| - /)
    if (sep.length > 1) name = sep[0].trim()
    const m1 = t.match(/(?:—|--|:)\s*([A-Z]{2,5}|\$|€|£|¥|Rs\.?)\s*([\d,]+(?:\.\d+)?)/i)
    const m2 = t.match(/([\d,]+(?:\.\d+)?)\s*([A-Z]{2,5}|\$|€|£|¥|Rs\.?)/i)
    const m3 = t.match(curRe)
    if (m1) { unit = m1[1].toUpperCase(); val = toNumber(m1[2]) }
    else if (m2) { unit = m2[2].toUpperCase(); val = toNumber(m2[1]) }
    else if (m3) { unit = m3[1].toUpperCase() }
    rows.push([idx + 1, name, val, unit])
  })
  const hasValues = rows.some(r => r[2] != null)
  if (hasValues) {
    ws.addRow(["Rank", "Name", "Value", "Unit"])
    rows.forEach(r => ws.addRow(r))
  } else {
    ws.addRow(["Rank", "Item"])
    rows.forEach(r => ws.addRow([r[0], r[1]]))
  }
  return ws
}

export default function ExportExcelButton({ spec, html, fileName, className }) {
  const onClick = async () => {
    const wb = new ExcelJS.Workbook()
    let ws = null
    if (spec) ws = fromSpec(wb, spec)
    if (!ws) ws = fromHtmlTable(wb, html)
    if (!ws) ws = fromHtmlList(wb, html)
    if (!ws && html) {
      const wsTxt = wb.addWorksheet("Data")
      const text = document.createElement("div")
      text.innerHTML = html
      const plain = text.innerText.trim()
      const lines = plain.split(/\n+/).map(s => s.trim()).filter(Boolean)
      wsTxt.addRow(["Text"])
      lines.forEach(l => wsTxt.addRow([l]))
      ws = wsTxt
    }
    if (!ws) return
    const buf = await wb.xlsx.writeBuffer()
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName || spec?.meta?.metric || spec?.metric || "data"}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  return (
    <button onClick={onClick} className={className || "inline-flex items-center gap-1 h-7 px-2 rounded-sm bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600/20"}>
      <i className="ri-file-excel-2-line"></i>
      <span className="text-xs"></span>
    </button>
  )
}
