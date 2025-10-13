import React from "react"
import ReactApexChart from "react-apexcharts"

const HealthTopHeaders = ({ items, title = "Top Headers by Invalids" }) => {
  const labels = (items || []).map(i => i.header?.name || i.header_name || `Header ${i.header?.id ?? i.header_id ?? ""}`)
  const series = [{ name: "Invalids", data: (items || []).map(i => i.invalids) }]
  const options = {
    chart: { type: "bar", height: 300, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "60%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: labels }
  }
  return (
    <div className="box">
      <div className="box-header bg-pink/10"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  )
}

export default HealthTopHeaders
