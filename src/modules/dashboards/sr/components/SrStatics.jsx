
import React from "react"
import Chart from "react-apexcharts"

const SrStatics = ({ categories, series }) => {
  const options = {
    chart: { type: "bar", height: 250, stacked: true },
    plotOptions: { bar: { horizontal: false, columnWidth: "25%" } },
    grid: { borderColor: "#f2f5f7" },
    dataLabels: { enabled: false },
    colors: ["#845adf", "#28d193", "#ffbe14", "#23b7e5"],
    stroke: { show: true, colors: ["transparent"] },
    xaxis: { categories, labels: { style: { colors: "#8c9097", fontSize: "11px", fontWeight: 600 } } },
    yaxis: { labels: { style: { colors: "#8c9097", fontSize: "11px", fontWeight: 600 } } },
    fill: { opacity: 1 }
  }

  return <Chart options={options} series={series} type="bar" height={300} />
}

export default SrStatics
