import React, { useMemo } from "react"
import Chart from "react-apexcharts"
import LoadingSpinner from "@components/LoadingSpinner"

function formatNumber(v) {
  const abs = Math.abs(v)
  if (abs >= 1e9) return (v / 1e9).toFixed(2) + "B"
  if (abs >= 1e6) return (v / 1e6).toFixed(2) + "M"
  if (abs >= 1e3) return (v / 1e3).toFixed(2) + "k"
  return v.toString()
}

export default function ExporterImporterChart({
  title,
  data,
  labelKey,
  valueKey,
  isLoading,
  maxItems = 10
}) {
  if (isLoading) {
    return (
      <div className="border border-gray-400 bg-white dark:bg-bodybg dark:text-gray-200 text-black flex items-center justify-center rounded-lg h-[330px]">
        <LoadingSpinner />
      </div>
    )
  }

  const displayData = useMemo(() => data.slice(0, maxItems), [data, maxItems])
  const values = useMemo(() => displayData.map(r => Number(r[valueKey])), [displayData, valueKey])
  const labels = useMemo(() => displayData.map(r => r[labelKey]), [displayData, labelKey])

  const options = {
    chart: {
      type: "bar",
      height: 280,
      events: { mounted: chart => chart.windowResizeHandler() },
      toolbar: { show: false }
    },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: "75%" ,dataLabels: {
          position: "right",
          offsetX: 16
        } }
    },
    colors: ["#E8B502"],
    grid: { borderColor: "#f2f5f7", padding: { left: 30, right: 20 } },
    dataLabels: {
      enabled: true,
      formatter: formatNumber,
      textAnchor: "start",
      offsetX: 12,
      style: { colors: ["#1E3A8A"], fontSize: "13px", fontWeight: 600 }
    },
    xaxis: {
      categories: labels,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: Array(labels.length).fill("#E8B502"), fontSize: "11px", fontWeight: 600 }
      }
    },
    tooltip: { y: { formatter: formatNumber } }
  }

  return (
    <div className="border border-gray-400 bg-white dark:bg-bodybg dark:text-gray-200 text-black rounded-lg h-[330px] p-4">
      <h4 className="text-base font-semibold mb-2 text-[#1E3A8A]">{title}</h4>
      <Chart options={options} series={[{ data: values }]} type="bar" height={280} />
    </div>
  )
}
