import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumberWithCommas } from '@helpers/formatters.js'; // Optional

const PieEquipmentChart = ({ labels = [], series = [], colors = [], height = 300 }) => {
    const options = {
        chart: {
            type: 'pie',
            height,
        },
        labels: labels,
        colors: colors,
        legend: {
            position: 'bottom',
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return formatNumberWithCommas(val);
                },
                title: {
                    formatter: (seriesName) => seriesName,
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, { seriesIndex, w }) {
                return `${formatNumberWithCommas(w.config.series[seriesIndex])}`;
            },
            style: {
                fontSize: '13px',
                fontWeight: 500,
            }
        },
        stroke: {
            show: true,
            colors: ['#fff'],
            width: 1,
        }
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={height}
        />
    );
};

export default PieEquipmentChart;
