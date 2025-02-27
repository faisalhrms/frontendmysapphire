import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import {formatNumberWithCommas} from "@helpers/formatters.js";

/**
 * ApexChart Component
 *
 * Renders an ApexCharts chart with customizable series, categories, colors, and other options.
 * Wrapped in a scrollable container for horizontal scrolling.
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
                       onPointClick = () => {},
                       chartWidth = 800,
                       baseWidthPerCategory = 400,
                       children,
                   }) => {

    const dynamicChartWidth = useMemo(() => {
        const numCategories = categories?.length || 1;
        const computedWidth = numCategories * baseWidthPerCategory;
        return Math.max(computedWidth, chartWidth);
    }, [categories]);

    const defaultOptions = useMemo(() => ({
        labels: labels,
        chart: {
            type: chartType,
            height: height,
            stacked: stacked,
            zoom: {
                enabled: true,
                type: 'xy',
                autoScaleYaxis: true,
            },
            pan: {
                enabled: true,
                type: 'x',
            },
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                },
                ...additionalOptions.chart?.toolbar,
            },
            events: {
                dataPointSelection: onPointClick,
                ...additionalOptions.chart?.events,
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
                            formatter: function (w) {
                                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                return formatNumberWithCommas(total)
                            },
                        }

                    }
                },
                ...additionalOptions.plotOptions?.pie,
            },
            ...additionalOptions.plotOptions,
        },
        grid: {
            borderColor: gridBorderColor,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
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
            axisBorder: {
                show: true,
                color: labelColor,
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            },
            axisTicks: {
                show: true,
                borderType: 'solid',
                color: labelColor,
                height: 0,
                offsetX: 0,
                offsetY: 0
            },
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
        chartWidth,
        baseWidthPerCategory,
        children
    ]);

    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ width: dynamicChartWidth, minWidth: '100%' }}>
                <ReactApexChart
                    options={defaultOptions}
                    series={series}
                    type={chartType}
                    height={height}
                />
                {
                    children &&
                     (
                        children
                    )
                }
            </div>
        </div>
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
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    onPointClick: PropTypes.func,
    chartWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    baseWidthPerCategory: PropTypes.number,
    children: PropTypes.node,
};

export default ApexChart;