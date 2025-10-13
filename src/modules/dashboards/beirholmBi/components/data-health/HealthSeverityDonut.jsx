import React, { useMemo } from "react"
import ReactApexChart from "react-apexcharts"

const HealthSeverityDonut = ({ data, title = "Severity Distribution" }) => {
  const labels = (data || []).map(d => d.name)
  const series = (data || []).map(d => d.value)
  const total = useMemo(() => series.reduce((a, b) => a + (b || 0), 0), [series])
  const options = {
    chart: { type: "donut", height: 320, toolbar: { show: false } },
    labels,
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            value: { formatter: v => `${v}` },
            total: { show: true, label: "Total", formatter: () => `${total}` }
          }
        }
      }
    },
    tooltip: { y: { formatter: v => v } }
  }
  return (
    <div className="box">
      <div className="box-header bg-indigo/10"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="donut" height={320} />
      </div>
    </div>
  )
}

export default HealthSeverityDonut
