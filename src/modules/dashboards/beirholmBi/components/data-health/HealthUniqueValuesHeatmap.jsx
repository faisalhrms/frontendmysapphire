import React from "react"
import ReactApexChart from "react-apexcharts"

const HealthUniqueValuesHeatmap = ({ series = [], title = "Unique Values Heatmap", onPointClick }) => {
  const options = {
    chart: {
      type: "heatmap",
      height: 320,
      toolbar: { show: false },
      events: {
        dataPointSelection: (e, ctx, { seriesIndex, dataPointIndex }) => {
          const s = ctx.w.config.series[seriesIndex]
          const p = s.data[dataPointIndex]
          onPointClick && onPointClick({ seriesName: s.name, x: p.x, y: p.y })
        }
      }
    },
    legend: { show: true, position: "bottom", onItemClick: { toggleDataSeries: true } },
    dataLabels: { enabled: false },
    plotOptions: { heatmap: { shadeIntensity: 0.7 } },
    xaxis: { type: "category" },
    tooltip: {
      custom: ({ w, seriesIndex, dataPointIndex }) => {
        const s = w.config.series[seriesIndex]
        const d = s.data[dataPointIndex]
        return `<div style="padding:6px">${s.name}<br/>${d.x}: <b>${d.y}</b></div>`
      }
    }
  }
  return (
    <div className="box">
      <div className="box-header bg-danger/10"><div className="box-title">{title}</div></div>
      <div className="box-body h-[360px]">
        <ReactApexChart options={options} series={series} type="heatmap" height={320} />
      </div>
    </div>
  )
}

export default HealthUniqueValuesHeatmap
