import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RadialBarChart = ({ value, label, color = "#845adf", height = 250 }) => {
    const options = {
        chart: {
            height,
            type: 'radialBar',
            offsetY: 0,
            sparkline: {
                enabled: true
            },
            events: {
                mounted: chart => chart.windowResizeHandler()
            }
        },
        colors: [color],
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '70%', // donut size
                    background: 'transparent',
                },
                track: {
                    background: '#f2f5f7',
                    strokeWidth: '100%',
                    margin: 0,
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        offsetY: -10,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#495057'
                    },
                    value: {
                        show: true,
                        offsetY: 10,
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#111'
                    },
                    total: {
                        show: false
                    }
                }
            }
        },
        labels: [label],
    };

    return (
        <ReactApexChart
            options={options}
            series={[value]}
            type="radialBar"
            height={height}
        />
    );
};

export default RadialBarChart;
