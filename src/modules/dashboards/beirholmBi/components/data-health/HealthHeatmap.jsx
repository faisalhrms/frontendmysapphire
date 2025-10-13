import React, { useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"

const normalize = name => name.replace(/\s*\((Blank|Unknown)\)\s*$/i, "")
const pickType = name => (/\(Unknown\)$/i.test(name) ? "Unknown" : "Blank")

const splitSeries = series => {
  const months = []
  const seen = new Set()
  const byType = { Blank: {}, Unknown: {} }
  series.forEach(s => {
    const header = normalize(s.name)
    const t = pickType(s.name)
    if (!byType[t][header]) byType[t][header] = {}
    s.data.forEach(p => {
      if (!seen.has(p.x)) {
        seen.add(p.x)
        months.push(p.x)
      }
      byType[t][header][p.x] = p.y ?? 0
    })
  })
  const build = t =>
    Object.keys(byType[t])
      .sort((a, b) => a.localeCompare(b))
      .map(h => ({ name: h, data: months.map(m => ({ x: m, y: byType[t][h][m] ?? 0 })) }))
  return { months, blanks: build("Blank"), unknowns: build("Unknown") }
}

const HealthHeatmap = ({ series = [], title = "Blanks + Unknowns Heatmap", onPointClick }) => {
  const [active, setActive] = useState("Unknown")
  const { blanks, unknowns } = useMemo(() => splitSeries(series), [series])
  const s = active === "Blanks" ? blanks : unknowns
  const options = {
    chart: {
      type: "heatmap",
      height: 320,
      toolbar: { show: false },
      events: {
        dataPointSelection: (e, ctx, { seriesIndex, dataPointIndex }) => {
          const ss = ctx.w.config.series[seriesIndex]
          const p = ss.data[dataPointIndex]
          onPointClick && onPointClick({ seriesName: ss.name, x: p.x, y: p.y, type: active })
        }
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.7,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#f2f2f2" },
            { from: 1, to: 5, color: "#c7e9b4" },
            { from: 6, to: 20, color: "#7fcdbb" },
            { from: 21, to: 50, color: "#41b6c4" },
            { from: 51, to: 100, color: "#1d91c0" },
            { from: 101, to: 500, color: "#225ea8" },
            { from: 501, to: 1000000, color: "#0c2c84" }
          ]
        }
      }
    },
    xaxis: { type: "category" },
    tooltip: {
      custom: ({ w, seriesIndex, dataPointIndex }) => {
        const ss = w.config.series[seriesIndex]
        const d = ss.data[dataPointIndex]
        return `<div style="padding:6px">${active} • ${ss.name}<br/>${d.x}: <b>${d.y}</b></div>`
      }
    }
  }
  return (
    <div className="box">
      <div className="box-header flex items-center justify-between bg-warning/10">
        <div className="box-title">{title}</div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`ti-btn ${active === "Blanks" ? "ti-btn-primary" : "ti-btn-outline-primary"} !py-1 !px-2`}
            onClick={() => setActive("Blanks")}
          >
            Blanks
          </button>
          <button
            type="button"
            className={`ti-btn ${active === "Unknown" ? "ti-btn-primary" : "ti-btn-outline-primary"} !py-1 !px-2`}
            onClick={() => setActive("Unknown")}
          >
            Unknown
          </button>
        </div>
      </div>
      <div className="box-body h-[355px]">
        <ReactApexChart options={options} series={s} type="heatmap" height={320} />
      </div>
    </div>
  )
}

export default HealthHeatmap
