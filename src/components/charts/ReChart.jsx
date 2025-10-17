import React, { useMemo } from "react";
import {
    // Bar Charts
    BarChart, Bar,
    // Pie Charts
    PieChart, Pie, Cell,
    // Line Charts
    LineChart, Line,
    // Area Charts
    AreaChart, Area,
    // Scatter Charts
    ScatterChart, Scatter, ZAxis,
    // Radar Charts
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    // Composed Charts
    ComposedChart,
    // Radial Charts
    RadialBarChart, RadialBar,
    // Treemap
    Treemap,
    // Funnel
    FunnelChart, Funnel,
    // Common Components
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
    // Additional Components
    ReferenceLine, ReferenceArea, ErrorBar, LabelList
} from "recharts";
import { useSelector } from "react-redux";
import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // For radial charts, payload might have different structure
        const dataPoint = payload[0]?.payload;
        const displayLabel = dataPoint?.name || label;

        return (
            <div className="bg-white  border border-gray-200  rounded-lg shadow-lg p-3 min-w-[150px] dark:text-gray-200 dark:bg-bodybg
">
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

// Custom Legend Component
const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4 px-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:text-gray-200 dark:bg-bodybg rounded-lg">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

// Chart configuration
const CHART_CONFIG = {
    bar: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        barSize: 30,
        radius: [4, 4, 0, 0]
    },
    line: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        strokeWidth: 2.5,
        dotSize: 5
    },
    area: {
        margin: { top: 20, right: 10, left: 10, bottom: 60 },
        strokeWidth: 2,
        fillOpacity: 0.4
    },
    pie: {
        margin: { top: 20, right: 10, left: 10, bottom: 20 },
        innerRadius: 0,
        outerRadius: 130
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
                                    showGrid = true,
                                    showLegend = false,
                                    showTooltip = true,
                                    animation = true,
                                    chartType
                                }) {
    const reduxChartType = useSelector((state) => state.theme.chartType);
    const currentChartType = chartType || reduxChartType;

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

    if (!processedData || processedData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50  rounded-lg border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                <div className="text-center ">
                    <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No chart data available</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Please provide data to display the chart</p>
                </div>
            </div>
        );
    }

    const commonProps = {
        margin: CHART_CONFIG[currentChartType]?.margin || CHART_CONFIG.bar.margin,
        data: processedData
    };

    const renderChart = () => {
        switch (currentChartType) {
            case "bar":
                return (
                    <BarChart {...commonProps}>
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Bar
                            dataKey="value"
                            radius={CHART_CONFIG.bar.radius}
                            isAnimationActive={animation}
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                            <LabelList
                                dataKey="value"
                                position="top"
                                fill="#374151"
                                fontSize={11}
                                fontWeight="medium"
                                offset={10}
                                formatter={(value) => {
                                    if (typeof value === 'number') {
                                        if (value >= 1000000) {
                                            return (value / 1000000).toFixed(1) + 'M';
                                        } else if (value >= 1000) {
                                            return (value / 1000).toFixed(1) + 'K';
                                        }
                                        return value.toLocaleString();
                                    }
                                    return value;
                                }}
                            />
                        </Bar>
                        {showLegend && <Legend content={CustomLegend} />}
                    </BarChart>
                );

            case "pie":
                return (
                    <PieChart {...commonProps}>
                        <Pie
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={pieRadius}
                            innerRadius={pieRadius * 0.01}
                            dataKey="value"
                            isAnimationActive={animation}
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                        </Pie>
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        {showLegend && <Legend content={CustomLegend} />}
                    </PieChart>
                );

            case "line":
                return (
                    <LineChart {...commonProps}>
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={colors[0]}
                            strokeWidth={CHART_CONFIG.line.strokeWidth}
                            dot={{ r: CHART_CONFIG.line.dotSize, fill: colors[0] }}
                            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                            isAnimationActive={animation}
                        />
                        {showLegend && <Legend content={CustomLegend} />}
                    </LineChart>
                );

            case "area":
                return (
                    <AreaChart {...commonProps}>
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={CHART_CONFIG.area.fillOpacity}
                            strokeWidth={CHART_CONFIG.area.strokeWidth}
                            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                            isAnimationActive={animation}
                        />
                        {showLegend && <Legend content={CustomLegend} />}
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
                    <ScatterChart {...commonProps}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                        <XAxis type="number" dataKey="x" name="Index" tick={{ fontSize: 9, fill: "#6b7280" }} />
                        <YAxis type="number" dataKey="y" name="Value" tick={{ fontSize: 9, fill: "#6b7280" }} />
                        <ZAxis type="number" dataKey="z" range={[50, 300]} name="Size" />
                        {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />}
                        <Scatter name="Data Points" data={scatterData} fill={colors[0]} isAnimationActive={animation}>
                            {scatterData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Scatter>
                        {showLegend && <Legend content={CustomLegend} />}
                    </ScatterChart>
                );

            case "radar":
                return (
                    <RadarChart {...commonProps}>
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        {showLegend && <Legend content={CustomLegend} />}
                    </RadarChart>
                );

            case "composed":
                return (
                    <ComposedChart {...commonProps}>
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
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
                        {showLegend && <Legend content={CustomLegend} />}
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
                        {...commonProps}
                        innerRadius="10%"
                        outerRadius="80%"
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
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        {showLegend && <Legend content={CustomLegend} />}
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
                    <FunnelChart {...commonProps}>
                        <Funnel
                            dataKey="value"
                            data={funnelData}
                            isAnimationActive={animation}
                        >
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
                            ))}
                        </Funnel>
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        {showLegend && <Legend content={CustomLegend} />}
                    </FunnelChart>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-full ">
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
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={height}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}