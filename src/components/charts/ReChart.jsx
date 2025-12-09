import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
    ScatterChart,
    ZAxis,
    Scatter,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis, Radar, ComposedChart, RadialBarChart, RadialBar, FunnelChart, Funnel
} from "recharts";
import { useSelector } from "react-redux";
import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0]?.payload;
        const displayLabel = dataPoint?.name || label;

        return (
            <div className="bg-white  border border-gray-200  dark:text-gray-200 dark:bg-bodybg rounded-lg shadow-lg p-3 min-w-[150px]">
                <p className="font-semibold text-gray-900 dark:text-white mb-2 border-b pb-1">
                    {displayLabel}
                </p>
                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {entry.dataKey || entry.name}:
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// Scrollbar Styles Component (inline styles)
const ScrollbarStyles = () => (
    <style jsx>{`
        .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
            height: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
        
        /* Dark mode support */
        .dark .scrollbar-thin {
            scrollbar-color: #4a5568 #2d3748;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-track {
            background: #2d3748;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #4a5568;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #718096;
        }
    `}</style>
);

// Default chart configuration
const DEFAULT_CHART_CONFIG = {
    bar: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        barSize: 30,
        radius: [4, 4, 0, 0],
        showLabel: true,
        labelFormatter: (value) => {
            if (typeof value === 'number') {
                if (value >= 1000000) {
                    return (value / 1000000).toFixed(1) + 'M';
                } else if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'K';
                }
                return value.toLocaleString();
            }
            return value;
        }
    },
    line: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        strokeWidth: 2.5,
        dotSize: 5,
        showDot: true
    },
    area: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        strokeWidth: 2,
        fillOpacity: 0.4
    },
    pie: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        innerRadius: 0,
        outerRadius: 130,
        showLabel: true,
        labelFormatter: ({ name, value }) => `${name}: ${value}`
    },
    scatter: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 }
    },
    radar: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 }
    },
    composed: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 }
    },
    radial: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        innerRadius: "10%",
        outerRadius: "80%"
    },
    funnel: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 }
    }
};

// Default dimensions configuration
const DEFAULT_DIMENSIONS = {
    height: 400,
    pieRadius: 130,
    xAxisHeight: 40,
    xAxisAngle: -30
};

export default function ReChart({
                                    data = null,
                                    colors = DEFAULT_CHART_COLORS,
                                    dimensions = DEFAULT_DIMENSIONS,
                                    chartConfig = {},
                                    showGrid = true,
                                    showLegend = false,
                                    showTooltip = true,
                                    animation = true,
                                    chartType
                                }) {
    const reduxChartType = useSelector((state) => state.theme.chartType);
    const currentChartType = chartType || reduxChartType;
    const TooltipComponent = chartConfig.tooltipRenderer || CustomTooltip;

    // Merge default config with user-provided config
    const mergedChartConfig = useMemo(() => {
        const config = { ...DEFAULT_CHART_CONFIG };

        Object.keys(chartConfig).forEach(chartType => {
            if (config[chartType]) {
                config[chartType] = {
                    ...config[chartType],
                    ...chartConfig[chartType],
                    margin: {
                        ...config[chartType].margin,
                        ...(chartConfig[chartType]?.margin || {})
                    }
                };
            }
        });

        return config;
    }, [chartConfig]);

    const processedData = useMemo(() => {
        const chartData = data;
        if (!chartData || !Array.isArray(chartData)) return [];

        return chartData.map((item, index) => ({
            ...item,
            fill: colors[index % colors.length]
        }));
    }, [data, colors]);

    const {
        height = 400,
        pieRadius = 80,
        xAxisHeight = 40,
        xAxisAngle = -25
    } = dimensions;

    const scrollableCharts = ["bar", "line", "area", "composed"];
    const needsScroll = (
        scrollableCharts.includes(currentChartType) &&
        processedData.length > 8
    );

    if (!processedData || processedData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No chart data available</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Please provide data to display the chart</p>
                </div>
            </div>
        );
    }

    const getCommonProps = () => {
        const config = mergedChartConfig[currentChartType] || mergedChartConfig.bar;
        return {
            margin: config.margin,
            data: processedData
        };
    };

    const renderChart = () => {
        const config = mergedChartConfig[currentChartType] || {};

        switch (currentChartType) {
            case "bar":
                return (
                    <BarChart {...getCommonProps()}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            angle={needsScroll ? -45 : xAxisAngle}
                            textAnchor="end"
                            height={needsScroll ? 80 : xAxisHeight}
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        <Bar
                            dataKey="value"
                            radius={config.radius}
                            isAnimationActive={animation}
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                            {config.showLabel && (
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    fill="#374151"
                                    fontSize={11}
                                    fontWeight="medium"
                                    offset={10}
                                    formatter={config.labelFormatter}
                                />
                            )}
                        </Bar>
                        {showLegend && <Legend  />}
                    </BarChart>
                );

            case "pie":
                return (
                    <PieChart {...getCommonProps()}>
                        <Pie
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={config.showLabel ? config.labelFormatter : false}
                            outerRadius={pieRadius}
                            innerRadius={config.innerRadius}
                            dataKey="value"
                            isAnimationActive={animation}
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                        </Pie>
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        {showLegend && <Legend  />}
                    </PieChart>
                );

            case "line":
                return (
                    <LineChart {...getCommonProps()}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            angle={xAxisAngle}
                            textAnchor="end"
                            height={xAxisHeight}
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={colors[0]}
                            strokeWidth={config.strokeWidth}
                            dot={config.showDot ? { r: config.dotSize, fill: colors[0] } : false}
                            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                            isAnimationActive={animation}
                        />
                        {showLegend && <Legend  />}
                    </LineChart>
                );
            case "area":
                return (
                    <AreaChart {...getCommonProps()}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            angle={xAxisAngle}
                            textAnchor="end"
                            height={xAxisHeight}
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={config.fillOpacity}
                            strokeWidth={config.strokeWidth}
                            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                            isAnimationActive={animation}
                        />
                        {showLegend && <Legend  />}
                    </AreaChart>
                );

            case "scatter":
                const scatterData = processedData.map((item, index) => ({
                    x: index * 10,
                    y: item.value,
                    z: item.value * 2,
                    name: item.name
                }));

                return (
                    <ScatterChart {...getCommonProps()}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis type="number" dataKey="x" name="Index" tick={{ fontSize: 9, fill: "#6b7280" }} />
                        <YAxis type="number" dataKey="y" name="Value" tick={{ fontSize: 9, fill: "#6b7280" }} />
                        <ZAxis type="number" dataKey="z" range={[50, 300]} name="Size" />
                        {showTooltip && <Tooltip content={<TooltipComponent />} cursor={{ strokeDasharray: '3 3' }} />}
                        <Scatter name="Data Points" data={scatterData} fill={colors[0]} isAnimationActive={animation}>
                            {scatterData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Scatter>
                        {showLegend && <Legend  />}
                    </ScatterChart>
                );

            case "radar":
                return (
                    <RadarChart {...getCommonProps()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                        <PolarRadiusAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                        <Radar
                            name="Value"
                            dataKey="value"
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={0.3}
                            isAnimationActive={animation}
                        />
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        {showLegend && <Legend  />}
                    </RadarChart>
                );

            case "composed":
                return (
                    <ComposedChart {...getCommonProps()}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fill: "#6b7280" }}
                            angle={xAxisAngle}
                            textAnchor="end"
                            height={xAxisHeight}
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        <Area
                            type="monotone"
                            dataKey="uv"
                            fill={colors[0]}
                            stroke={colors[0]}
                            fillOpacity={0.3}
                            isAnimationActive={animation}
                        />
                        <Bar
                            dataKey="pv"
                            fill={colors[1]}
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={animation}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={colors[2]}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={animation}
                        />
                        {showLegend && <Legend  />}
                    </ComposedChart>
                );

            case "radial":
                const radialData = processedData.map((item, index) => ({
                    name: item.name,
                    value: item.value,
                    fill: item.fill || colors[index % colors.length]
                }));

                return (
                    <RadialBarChart
                        {...getCommonProps()}
                        innerRadius={config.innerRadius}
                        outerRadius={config.outerRadius}
                        data={radialData}
                    >
                        <RadialBar
                            dataKey="value"
                            cornerRadius={10}
                            isAnimationActive={animation}
                        >
                            {radialData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </RadialBar>
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        {showLegend && <Legend  />}
                    </RadialBarChart>
                );

            case "funnel":
                const funnelData = [...processedData]
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => ({
                        ...item,
                        name: item.name
                    }));

                return (
                    <FunnelChart {...getCommonProps()}>
                        <Funnel
                            dataKey="value"
                            data={funnelData}
                            isAnimationActive={animation}
                        >
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                        </Funnel>
                        {showTooltip && <Tooltip content={<TooltipComponent />} />}
                        {showLegend && <Legend  />}
                    </FunnelChart>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="text-gray-400 dark:text-gray-500 text-3xl mb-2">❓</div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Unsupported Chart Type</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                "{currentChartType}" is not supported
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <ScrollbarStyles />
            <div className="w-full h-full">
                {needsScroll ? (
                    <div className="overflow-x-auto scrollbar-thin">
                        <div style={{
                            minWidth: `${Math.max(processedData.length * 80, 800)}px`
                        }}>
                            <ResponsiveContainer width="100%" height={height}>
                                {renderChart()}
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={height}>
                        {renderChart()}
                    </ResponsiveContainer>
                )}
            </div>
        </>
    );
}