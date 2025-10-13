import React from "react"
import ReactApexChart from "react-apexcharts"

const HealthTrend = ({ trend, title = "Monthly Trend" }) => {
  const options = {
    chart: { type: "line", height: 320, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { width: 3, curve: "smooth" },
    xaxis: { categories: trend?.categories || [] },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true }
  }
  const series = trend?.series || []
  return (
    <div className="box">
      <div className="box-header !bg-warning/20"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="line" height={320} />
      </div>
    </div>
  )
}

export default HealthTrend
