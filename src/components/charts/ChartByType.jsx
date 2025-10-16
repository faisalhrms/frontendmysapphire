import React from "react";
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, LineChart,
    Line, AreaChart, Area
} from "recharts";
import { useSelector } from "react-redux";

export default function ChartByType({
                                        data,
                                        colors = [
                                            "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
                                            "#10b981", "#6366f1", "#f97316", "#06b6d4",
                                            "#14b8a6", "#84cc16", "#a855f7", "#ef4444"
                                        ],
                                        dims
}) {
    const type = useSelector((s) => s.theme.chartType);
    const { CHART_HEIGHT, PIE_RADIUS, XAXIS_HEIGHT, XAXIS_ANGLE } = dims;

    return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            {type === "bar" ? (
                <BarChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} angle={XAXIS_ANGLE} textAnchor="end" height={XAXIS_HEIGHT} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="value" radius={[6,6,0,0]}>
                        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Bar>
                </BarChart>
            ) : type === "pie" ? (
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={PIE_RADIUS} dataKey="value">
                        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                    <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                </PieChart>
            ) : type === "line" ? (
                <LineChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} angle={XAXIS_ANGLE} textAnchor="end" height={XAXIS_HEIGHT} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.75} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
                </LineChart>
            ) : (
                <AreaChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} angle={XAXIS_ANGLE} textAnchor="end" height={XAXIS_HEIGHT} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} activeDot={{ r: 5 }} />
                </AreaChart>
            )}
        </ResponsiveContainer>
    );
}
