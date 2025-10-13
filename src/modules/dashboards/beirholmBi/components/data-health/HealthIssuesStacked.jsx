import React, { useMemo } from "react"
import ReactApexChart from "react-apexcharts"

const HealthIssuesStacked = ({ rows, title = "Issue Mix by Period (%)" }) => {
  const categories = useMemo(() => (rows || []).map(r => r.period), [rows])
  const blanks = useMemo(() => (rows || []).map(r => r.blanks_pct || 0), [rows])
  const unknown = useMemo(() => (rows || []).map(r => r.unknown_pct || 0), [rows])
  const dots = useMemo(() => (rows || []).map(r => r.dots_pct || 0), [rows])
  const invalid = useMemo(() => (rows || []).map(r => r.invalid_pct || 0), [rows])
  const series = [
    { name: "Blanks %", data: blanks },
    { name: "Unknown %", data: unknown },
    { name: "Dots %", data: dots },
    { name: "Invalid %", data: invalid }
  ]
  const options = {
    chart: { type: "bar", stacked: true, height: 320, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: { max: 100, labels: { formatter: v => `${v}%` } },
    tooltip: { y: { formatter: v => `${v}%` } },
    legend: { position: "top", horizontalAlign: "left" }
  }
  return (
    <div className="box">
      <div className="box-header !bg-info/10"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="bar" height={320} />
      </div>
    </div>
  )
}

export default HealthIssuesStacked
