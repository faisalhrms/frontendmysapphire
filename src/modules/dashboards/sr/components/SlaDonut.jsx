import React, { useState } from 'react'
import Chart from 'react-apexcharts'

const SlaDonut = ({ onTime, overDue, onLegendClick }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const total = onTime + overDue
  const percentOnTime = total > 0 ? Math.round((onTime / total) * 100) : 0
  const series = [onTime, overDue]
  const options = {
    chart: {
      type: 'donut',
      events: {
        dataPointSelection: (_e, _c, config) => {
          setSelectedIdx(config.dataPointIndex)
          onLegendClick(config.dataPointIndex)
        }
      }
    },
    labels: ['On Time', 'Overdue'],
    colors: ['#44528f', '#912238'],
    plotOptions: {
      pie: {
        donut: { size: '75%' },
        offsetY: 15
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (_val, opts) => opts.w.config.series[opts.seriesIndex],
      style: { colors: ['#fff'], fontSize: '14px', fontWeight: '600' }
    },
    tooltip: {
      y: { formatter: val => val }
    },
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      onItemClick: {
        toggleDataSeries: false,
        click: (_e, _chart, { seriesIndex }) => {
          setSelectedIdx(seriesIndex)
          onLegendClick(seriesIndex)
        }
      },
      labels: { colors: ['#44528f', '#912238'] }
    }
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Chart options={options} series={series} type="donut" width="100%" height="100%" />
      <div className="absolute flex flex-col items-center pointer-events-none">
        <span className="text-xl font-bold">{percentOnTime}%</span>
        <span className="text-[0.75rem] text-gray-500">On Time</span>
      </div>
    </div>
  )
}

export default SlaDonut
