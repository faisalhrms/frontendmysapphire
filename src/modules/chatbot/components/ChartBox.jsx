import React, { useMemo } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js"
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend)

const PALETTE = ["#4f46e5","#06b6d4","#22c55e","#eab308","#ef4444","#8b5cf6","#14b8a6","#f97316","#3b82f6","#10b981"]
const toRGBA = (hex, a=0.9) => {
  const h = hex.replace("#","")
  const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16)
  return `rgba(${r},${g},${b},${a})`
}

export default function ChartBox({ spec }) {
  const data = useMemo(() => {
    const labels = spec?.labels || []
    const base = (spec?.datasets || []).map((d) => ({ label: d.label || "", data: d.data || [] }))

    if (spec?.type === "pie") {
      const ds = base[0] || { label: "", data: [] }
      const colors = labels.map((_, i) => PALETTE[i % PALETTE.length])
      ds.backgroundColor = colors.map(c => toRGBA(c, 0.9))
      ds.borderColor = colors
      ds.borderWidth = 1
      return { labels, datasets: [ds] }
    }

    if (spec?.type === "bar" && base.length === 1) {
      const colors = labels.map((_, i) => PALETTE[i % PALETTE.length])
      base[0].backgroundColor = colors.map(c => toRGBA(c, 0.9))
      base[0].borderColor = colors
      base[0].borderWidth = 1
    } else {
      base.forEach((ds, i) => {
        const c = PALETTE[i % PALETTE.length]
        ds.backgroundColor = toRGBA(c, 0.9)
        ds.borderColor = c
        ds.borderWidth = 1
      })
    }
    return { labels, datasets: base }
  }, [spec])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: spec?.type === "pie" ? {} : { x: { ticks: { maxRotation: 45, minRotation: 0 } }, y: { beginAtZero: true } },
  }), [spec])

  if (!spec) return null
  if (spec.type === "bar") return <div style={{ height: 260 }}><Bar data={data} options={options} /></div>
  if (spec.type === "grouped-bar") return <div style={{ height: 300 }}><Bar data={data} options={options} /></div>
  if (spec.type === "line") return <div style={{ height: 260 }}><Line data={data} options={options} /></div>
  if (spec.type === "pie") return <div style={{ height: 260 }}><Pie data={data} options={options} /></div>
  return null
}
