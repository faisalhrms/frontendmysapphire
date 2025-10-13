import React from "react"
import ReactApexChart from "react-apexcharts"

const HealthOperatorBar = ({ data, title = "Top Rule Operators" }) => {
  const labels = (data || []).map(d => d.operator)
  const series = [{ name: "Count", data: (data || []).map(d => d.count) }]
  const options = {
    chart: { type: "bar", height: 320, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "60%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: labels },
    tooltip: { y: { formatter: v => v } }
  }
  return (
    <div className="box">
      <div className="box-header bg-primary/10"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="bar" height={320} />
      </div>
    </div>
  )
}

export default HealthOperatorBar
