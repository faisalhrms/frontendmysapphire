import React from "react"
import ReactApexChart from "react-apexcharts"
import { Table, AlertTriangle, Eraser, XCircle } from "lucide-react"

const Spark = ({ series }) => {
  if (!series?.length) return null
  const options = {
    chart: { type: "line", height: 60, sparkline: { enabled: true } },
    stroke: { width: 2, curve: "smooth" },
    tooltip: { enabled: false }
  }
  return (
    <div className="w-24">
      <ReactApexChart options={options} series={[{ data: series }]} type="line" height={60} />
    </div>
  )
}

const Stat = ({ title, value, sub, series, bgClass, Icon, iconColor, circleBg }) => {
  return (
    <div className={`box ${bgClass} !p-4 shadow-xl rounded-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-500 text-xs mb-3">{title}</div>
          <div className="text-2xl font-semibold leading-none">{value}</div>
          {sub != null && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
        </div>

        <div className="flex flex-col items-end">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${circleBg}`}>
            {Icon ? <Icon className={`w-6 h-6 ${iconColor}`} /> : null}
          </div>
          <Spark series={series} />
        </div>
      </div>
    </div>
  )
}

const HealthKpis = ({ kpis, trend, loading }) => {
  const seriesBy = (name) => trend?.series?.find((x) => x.name === name)?.data || []
  const blanks = seriesBy("Blanks")
  const unknowns = seriesBy("Unknowns")
  const dots = seriesBy("Dots")
  const invalids = seriesBy("Invalids")
  const issuesSeries = blanks.map((_, i) => (blanks[i] || 0) + (unknowns[i] || 0) + (dots[i] || 0) + (invalids[i] || 0))

  const v = (n) => (loading ? "…" : n ?? 0)

  const cards = [
    {
      key: "rows",
      title: "Total Rows",
      value: v(kpis?.total_rows),
      sub: null,
      series: null,
      bgClass: "!bg-pink/5",
      Icon: Table,
      iconColor: "text-danger",
      circleBg: "bg-pink/10"
    },
    {
      key: "issues",
      title: "Total Issues",
      value: v(kpis?.total_issues),
      sub: null,
      series: issuesSeries,
      bgClass: "!bg-danger/5",
      Icon: AlertTriangle,
      iconColor: "text-danger",
      circleBg: "bg-danger/10"
    },
    {
      key: "blanks",
      title: "Blanks %",
      value: `${v(kpis?.blanks_pct)}%`,
      sub: `Unknowns ${v(kpis?.unknown_pct)}%`,
      series: blanks,
      bgClass: "!bg-info/5",
      Icon: Eraser,
      iconColor: "text-info",
      circleBg: "bg-info/10"
    },
    {
      key: "invalid",
      title: "Invalid %",
      value: `${v(kpis?.invalid_pct)}%`,
      sub: "Rate over time",
      series: invalids,
      bgClass: "!bg-indigo/5",
      Icon: XCircle,
      iconColor: "text-indigo-500",
      circleBg: "bg-indigo/10"
    }
  ]

  return (
    <div className="grid sm:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <Stat key={c.key} {...c} />
      ))}
    </div>
  )
}

export default HealthKpis
