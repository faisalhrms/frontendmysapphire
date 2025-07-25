import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumberWithCommas } from '@helpers/formatters.js'; // Optional helper

const DonutEquipmentChart = ({ labels = [], series = [], colors = [], height = 300 }) => {
    const totalCount = series.reduce((sum, val) => sum + val, 0);

    const options = {
        chart: {
            type: 'donut',
            height,
        },
        labels: labels,
        colors: colors.length ? colors : ["#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c"],
        stroke: {
            show: true,
            colors: ['#fff'],
            width: 1,
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, { seriesIndex, w }) {
                return `${formatNumberWithCommas(w.config.series[seriesIndex])}`;
            },
            style: {
                fontSize: '13px',
                fontWeight: 500,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => formatNumberWithCommas(val),
                title: {
                    formatter: (seriesName) => seriesName,
                },
            }
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
                donut: {
                    size: '60%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            color: '#666',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            color: '#111',
                            offsetY: 6,
                            formatter: val => formatNumberWithCommas(val)
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#000',
                            formatter: () => formatNumberWithCommas(totalCount),
                        }
                    }
                }
            }
        },
        legend: {
            position: 'bottom',
            formatter: function (val, opts) {
                return `${val} - ${formatNumberWithCommas(opts.w.globals.series[opts.seriesIndex])}`;
            }
        }
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={height}
        />
    );
};

export default DonutEquipmentChart;
