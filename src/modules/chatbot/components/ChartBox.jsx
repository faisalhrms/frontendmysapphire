import React, { useMemo, useState, useEffect, useCallback } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler, Title } from "chart.js"
import ExportExcelButton from "@modules/chatbot/components/ExportExcelButton.jsx"
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler, Title)

const PALETTE = ["#4f46e5","#06b6d4","#22c55e","#eab308","#ef4444","#8b5cf6","#14b8a6","#f97316","#3b82f6","#10b981"]
const toRGBA = (hex, a=0.9) => {
  const h = hex.replace("#","")
  const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16)
  return `rgba(${r},${g},${b},${a})`
}
const unitFor = m => {
  if (!m) return { style:"decimal" }
  if (/usd/i.test(m)) return { style:"currency", currency:"USD", maximumFractionDigits:0 }
  if (/pkr|rs|rupees?/i.test(m)) return { style:"currency", currency:"PKR", maximumFractionDigits:0 }
  if (/qty|quantity|units?/i.test(m)) return { style:"decimal", maximumFractionDigits:0 }
  if (/%/.test(m)) return { style:"percent", maximumFractionDigits:1 }
  return { style:"decimal" }
}
const compact = (n, opt) => new Intl.NumberFormat(undefined, { notation:"compact", maximumFractionDigits:1, ...opt }).format(n ?? 0)

const wrapLabel = (s, max = 16) => {
  const words = String(s || "").split(/\s+/)
  const lines = []
  let line = ""
  words.forEach(w => {
    const next = line ? line + " " + w : w
    if (next.length > max) { if (line) lines.push(line); line = w }
    else line = next
  })
  if (line) lines.push(line)
  return lines
}

const pickFilter = (val) => {
  if (Array.isArray(val)) return val[0] || ""
  if (val === null || val === undefined) return ""
  return String(val)
}

const ValueLabelPlugin = {
  id: "valueLabel",
  afterDatasetsDraw(chart, _args, pluginOptions) {
    const type = chart.config.type
    if (type !== "bar" && type !== "pie") return
    const dsCount = chart.data.datasets.length
    const len = chart.getDatasetMeta(0)?.data?.length || 0
    const getVal = (di, i) => {
      const meta = chart.getDatasetMeta(di)
      const p = meta._parsed?.[i]
      const y = (p && typeof p === "object" ? p.y : p) ?? 0
      const v = +y || +((chart.data.datasets?.[di]?.data || [])[i] || 0)
      return isFinite(v) ? v : 0
    }
    const totalsByIndex = Array.from({ length: len }, (_, i) =>
      Array.from({ length: dsCount }, (_, di) => getVal(di, i)).reduce((a, b) => a + (+b || 0), 0)
    )
    const totalAll = totalsByIndex.reduce((a, b) => a + b, 0)
    const ctx = chart.ctx
    ctx.save()
    for (let di = 0; di < dsCount; di++) {
      const meta = chart.getDatasetMeta(di)
      if (meta.hidden) continue
      meta.data.forEach((el, i) => {
        const v = getVal(di, i)
        if (!isFinite(v) || v === 0) return
        const base = type === "pie" ? totalAll : (dsCount === 1 ? totalAll : totalsByIndex[i])
        if (!base) return
        const pct = Math.max(0, Math.min(100, (v / base) * 100))
        const { x, y } = el.tooltipPosition()
        ctx.fillStyle = pluginOptions?.color || (chart.options.scales ? "#374151" : "#111827")
        ctx.font = "10px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const dy = type === "bar" ? -8 : 0
        ctx.fillText(`${Math.round(pct * 10) / 10}%`, x, y + dy)
      })
    }
    ctx.restore()
  }
}

export default function ChartBox({ spec, ask }) {
  const [product, setProduct] = useState(pickFilter(spec?.meta?.filters?.product))
  const [country, setCountry] = useState(pickFilter(spec?.meta?.filters?.country))
  const [supplier, setSupplier] = useState(pickFilter(spec?.meta?.filters?.exporter || spec?.meta?.filters?.importer || spec?.meta?.filters?.supplier))
  const [from, setFrom] = useState(pickFilter(spec?.meta?.filters?.date?.from))
  const [to, setTo] = useState(pickFilter(spec?.meta?.filters?.date?.to))
  const nfOpt = unitFor(spec?.metric)

  const labelsWrapped = useMemo(() => (spec?.labels || []).map(l => wrapLabel(l, 16)), [spec?.labels])
  const counterpartyKey = useMemo(() => {
    const gb = spec?.meta?.group_by
    const keys = Array.isArray(gb) ? gb : [gb]
    if (keys.includes("importer") || spec?.meta?.filters?.importer) return "importer"
    return "exporter"
  }, [spec])
  const counterpartyLabel = counterpartyKey === "importer" ? "Importer" : "Exporter"

  useEffect(() => {
    const f = spec?.meta?.filters || {}
    setProduct(pickFilter(f.product))
    setCountry(pickFilter(f.country))
    setSupplier(pickFilter(f.exporter || f.importer || f.supplier))
    setFrom(pickFilter(f.date?.from))
    setTo(pickFilter(f.date?.to))
  }, [spec])

  const data = useMemo(() => {
    const labels = labelsWrapped
    const base = (spec?.datasets || []).map((d) => {
      const ds = { label: d.label || "", data: (d.data || []).map(v => Number(v ?? 0)) }
      if (spec?.type === "line") ds.tension = 0.3
      return ds
    })
    if (spec?.type === "pie") {
      const ds = base[0] || { label: "", data: [] }
      const colors = (spec?.labels || []).map((_, i) => PALETTE[i % PALETTE.length])
      ds.backgroundColor = colors.map(c => toRGBA(c, 0.9))
      ds.borderColor = colors
      ds.borderWidth = 1
      return { labels: spec?.labels || [], datasets: [ds] }
    }
    if ((spec?.type === "bar" || spec?.type === "grouped-bar") && base.length === 1) {
      const colors = (spec?.labels || []).map((_, i) => PALETTE[i % PALETTE.length])
      base[0].backgroundColor = colors.map(c => toRGBA(c, 0.9))
      base[0].borderColor = colors
      base[0].borderWidth = 1
      base[0].borderRadius = 4
    } else {
      base.forEach((ds, i) => {
        const c = PALETTE[i % PALETTE.length]
        ds.backgroundColor = spec?.type === "line" ? toRGBA(c, 0.2) : toRGBA(c, 0.9)
        ds.borderColor = c
        ds.borderWidth = 1
        if (spec?.type === "line") ds.fill = true
        if (spec?.type?.includes("bar")) ds.borderRadius = 4
      })
    }
    return { labels, datasets: base }
  }, [spec, labelsWrapped])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 8 } },
    plugins: {
      legend: { display: true, position: "bottom" },
      title: spec?.metric ? { display: true, text: spec.metric } : { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          title: items => {
            const i = items?.[0]?.dataIndex ?? 0
            const raw = spec?.labels?.[i]
            return String(raw || "")
          },
          label: ctx => {
            const v = ctx.parsed?.y ?? ctx.parsed
            const val = typeof v === "number" ? compact(v, nfOpt) : v
            const name = ctx.dataset?.label ? `${ctx.dataset.label}: ` : ""
            return `${name}${val}`
          }
        }
      },
      valueLabel: { show: true }
    },
    scales: spec?.type === "pie" ? {} : {
      x: {
        offset: true,
        ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, font: { size: 10 }, padding: 6 }
      },
      y: {
        beginAtZero: true,
        ticks: { callback: v => compact(v, nfOpt), font: { size: 10 } },
        title: spec?.metric ? { display: true, text: spec.metric } : { display: false }
      }
    },
    animation: { duration: 500 }
  }), [spec, nfOpt])

  useEffect(() => {
    const existing = Chart.registry.plugins.get("valueLabel")
    if (existing) Chart.unregister(existing)
    Chart.register(ValueLabelPlugin)
  }, [])

  const heightFor = t => t === "grouped-bar" ? 320 : 280

  const applyFilters = useCallback(() => {
    if (!ask) return
    const parts = []
    if (product) parts.push(`product=${product}`)
    if (country) parts.push(`country=${country}`)
    if (supplier) parts.push(`${counterpartyKey}=${supplier}`)
    if (from || to) parts.push(`date from=${from||""} to=${to||""}`)
    const meta = spec?.meta || {}
    const gb = Array.isArray(meta.group_by) ? meta.group_by.join(", ") : (meta.group_by || "")
    const metric = meta.metric || spec?.metric || "value_usd"
    const kind = spec?.type === "grouped-bar" ? "bar" : spec?.type
    const filterLine = parts.length ? `Update filters: ${parts.join(", ")}.` : "Keep existing filters."
    const gbPart = gb ? ` and group_by=${gb}` : ""
    const msg = `${filterLine} Keep metric=${metric}${gbPart}. Return as ${kind} chart.`
    ask(msg)
  }, [ask, product, country, supplier, from, to, spec, counterpartyKey])

  if (!spec) return null

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <input value={product} onChange={e=>setProduct(e.target.value)} placeholder="Product" className="ti-form-control form-control-sm w-36" />
          <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country" className="ti-form-control form-control-sm w-36" />
          <input value={supplier} onChange={e=>setSupplier(e.target.value)} placeholder={counterpartyLabel} className="ti-form-control form-control-sm w-36" />
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="ti-form-control form-control-sm" />
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="ti-form-control form-control-sm" />
          <button onClick={applyFilters} className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"><i className="ri-search-line"></i></button>
          <ExportExcelButton spec={spec} />
        </div>
      </div>
      {spec.type === "bar" && <div style={{ height: heightFor("bar") }}><Bar data={data} options={options} /></div>}
      {spec.type === "grouped-bar" && <div style={{ height: heightFor("grouped-bar") }}><Bar data={data} options={options} /></div>}
      {spec.type === "line" && <div style={{ height: heightFor("line") }}><Line data={data} options={options} /></div>}
      {spec.type === "pie" && <div style={{ height: heightFor("pie") }}><Pie data={data} options={options} /></div>}
    </div>
  )
}
