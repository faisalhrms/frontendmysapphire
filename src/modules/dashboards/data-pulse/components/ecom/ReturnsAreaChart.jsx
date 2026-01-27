import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import EmptyState from "@components/EmptyState.jsx";

const formatCompact = (n) => {
    const v = Number(n) || 0;
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return `${v}`;
};

const ReturnsAreaChart = ({ rows = [], loading }) => {
    const data = useMemo(() => {
        const safe = Array.isArray(rows) ? rows : [];
        return safe.map((r) => {
            const total = Number(r.total_orders) || 0;
            const ret = Number(r.return_orders) || 0;
            return {
                bucket: r.bucket || "-",
                total_orders: total,
                return_orders: ret,
                return_rate: total > 0 ? Number(((ret / total) * 100).toFixed(2)) : 0,
            };
        });
    }, [rows]);

    if (loading) {
        return (
            <div className="h-[360px] flex items-center justify-center bg-gray-50/50 dark:bg-white/5 rounded-xl animate-pulse">
                <span className="text-sm text-gray-400 font-medium">Analyzing Pulse...</span>
            </div>
        );
    }

    if (!data.length) return <EmptyState label="No bucket data found" />;

    return (
        <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gReturns" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    <XAxis dataKey="bucket" stroke="#6B7280" fontSize={11} tickMargin={10} />
                    <YAxis
                        yAxisId="left"
                        stroke="#6B7280"
                        fontSize={11}
                        tickFormatter={formatCompact}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6B7280"
                        fontSize={11}
                        tickFormatter={formatCompact}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                        }}
                        formatter={(value, name, props) => {
                            if (name === "Return Orders") {
                                return [`${formatCompact(value)} (${props?.payload?.return_rate ?? 0}%)`, name];
                            }
                            return [formatCompact(value), name];
                        }}
                        labelFormatter={(label) => `Bucket: ${label}`}
                    />

                    <Legend />

                    {/* Total orders first */}
                    <Area
                        type="monotone"
                        dataKey="total_orders"
                        yAxisId="left"
                        stroke="#6366F1"
                        fill="url(#gTotal)"
                        fillOpacity={1}
                        name="Total Orders"
                        animationDuration={1200}
                    />

                    {/* Return orders on top + thicker */}
                    <Area
                        type="monotone"
                        dataKey="return_orders"
                        yAxisId="right"
                        stroke="#EF4444"
                        strokeWidth={3}
                        fill="url(#gReturns)"
                        fillOpacity={1}
                        name="Return Orders"
                        animationDuration={1600}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReturnsAreaChart;
