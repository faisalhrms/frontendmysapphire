import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

/**
 * ApexChart Component
 *
 * Renders an ApexCharts chart with customizable series, categories, colors, and other options.
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element} The rendered chart component
 */
const ApexChart = ({
                       series,
                       categories = [],
                       labels = [],
                       chartType = 'bar',
                       colors = ["#845adf", "#28d193", "#ffbe14", "#23b7e5"],
                       height = 400,
                       stacked = true,
                       columnWidth = "25%",
                       gridBorderColor = "#f2f5f7",
                       labelColor = "#8c9097",
                       fontSize = "11px",
                       fontWeight = 600,
                       fillOpacity = 1,
                       additionalOptions = {},
                       xAxisTitle = '',
                       yAxisTitle = '',
                   }) => {

    const options = useMemo(() => ({
        labels: labels,
        chart: {
            type: chartType,
            height: height,
            stacked: stacked,
            zoom: {
                enabled: true,
                type: 'xy',
            },
            toolbar: {
                show: true,
                tools: {
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    download: true,
                },
            },
            events: {
                mounted: (chart) => {
                    chart.windowResizeHandler();
                },
            },
            ...additionalOptions.chart,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: columnWidth,
                ...additionalOptions.plotOptions?.bar,
            },
            pie: {
                expandOnClick: false,
                donut: {
                    size: '80%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '20px',
                            color: '#495057',
                            offsetY: -4
                        },
                        value: {
                            show: true,
                            fontSize: '18px',
                            color: undefined,
                            offsetY: 8,
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            fontSize: '22px',
                            fontWeight: 600,
                            color: '#495057',
                        }

                    }
                },
                ...additionalOptions.plotOptions?.pie,
            },
            ...additionalOptions.plotOptions,
        },
        grid: {
            borderColor: gridBorderColor,
            ...additionalOptions.grid,
        },
        dataLabels: {
            enabled: false,
            ...additionalOptions.dataLabels,
        },
        colors: colors,
        stroke: {
            show: true,
            colors: ["transparent"],
            ...additionalOptions.stroke,
        },
        xaxis: {
            categories: categories,
            labels: {
                show: true,
                position: 'bottom',
                style: {
                    colors: labelColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    cssClass: "apexcharts-xaxis-label",
                    ...additionalOptions.xaxis?.labels?.style,
                },
                ...additionalOptions.xaxis?.labels,
            },
            title: {
                text: xAxisTitle,
                align: 'center',
                style: {
                    color: labelColor,
                    fontSize: '12px',
                    fontWeight: 600,
                    ...additionalOptions.xaxis?.title?.style,
                },
                ...additionalOptions.xaxis?.title,
            },
            ...additionalOptions.xaxis,
        },
        yaxis: {
            title: {
                text: yAxisTitle,
                style: {
                    color: labelColor,
                    ...additionalOptions.yaxis?.title?.style,
                },
                ...additionalOptions.yaxis?.title,
            },
            labels: {
                show: true,
                style: {
                    colors: labelColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    cssClass: "apexcharts-yaxis-label",
                    ...additionalOptions.yaxis?.labels?.style,
                },
                ...additionalOptions.yaxis?.labels,
            },
            ...additionalOptions.yaxis,
        },
        fill: {
            opacity: fillOpacity,
            ...additionalOptions.fill,
        },
        tooltip: {
            theme: 'light',
            ...additionalOptions.tooltip,
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            ...additionalOptions.legend,
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 400,
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                            style: {
                                fontSize: '10px',
                            },
                        },
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 300,
                    },
                    xaxis: {
                        labels: {
                            rotate: -45,
                            style: {
                                fontSize: '8px',
                            },
                        },
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        ...additionalOptions,
    }), [
        chartType,
        height,
        stacked,
        columnWidth,
        gridBorderColor,
        labelColor,
        fontSize,
        fontWeight,
        fillOpacity,
        colors,
        series,
        categories,
        additionalOptions,
        xAxisTitle,
        yAxisTitle,
    ]);

    return (
        <ReactApexChart
            options={options}
            series={series}
            type={chartType}
            height={height}
        />
    );
};

ApexChart.propTypes = {
    series: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number).isRequired,
            })
        ).isRequired,
        PropTypes.arrayOf(PropTypes.number).isRequired,
        PropTypes.number.isRequired,
    ]).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
    chartType: PropTypes.oneOf(['bar', 'line', 'area', 'pie', 'donut']),
    colors: PropTypes.arrayOf(PropTypes.string),
    height: PropTypes.number,
    stacked: PropTypes.bool,
    columnWidth: PropTypes.string,
    gridBorderColor: PropTypes.string,
    labelColor: PropTypes.string,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.number,
    fillOpacity: PropTypes.number,
    additionalOptions: PropTypes.object,
    xAxisTitle: PropTypes.string,
    yAxisTitle: PropTypes.string,
};

export default ApexChart;
