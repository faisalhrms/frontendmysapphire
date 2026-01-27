import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import { RotateCcw } from "lucide-react";
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

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const formatCompact = (n) => {
    const v = Number(n) || 0;
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return `${v}`;
};

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
            {Icon ? <Icon size={20} /> : null}
            {title}
        </h3>
        {children}
    </div>
);

const SimpleTable = ({ columns, rows }) => (
    <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max">
            <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
            <tr>
                {columns.map((c) => (
                    <th
                        key={c.key}
                        className={`px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300 ${
                            c.align === "right" ? "text-right" : "text-left"
                        }`}
                    >
                        {c.label}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {columns.map((c) => (
                        <td
                            key={c.key}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                c.mono ? "font-mono" : ""
                            } ${c.align === "right" ? "text-right tabular-nums" : "text-left"} ${
                                c.strong ? "font-semibold" : ""
                            } ${c.colorClass || "text-gray-700 dark:text-gray-300"}`}
                        >
                            {typeof c.render === "function" ? c.render(r) : r?.[c.key] ?? "-"}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const TopHabitualReturnsChart = ({ rows = [] }) => {
    const data = useMemo(() => {
        const safe = Array.isArray(rows) ? rows : [];
        return [...safe]
            .map((r) => ({
                name: r.account_name || "-",
                return_percent: Number(r.return_percent) || 0,
                total_orders: Number(r.total_orders) || 0,
                return_orders: Number(r.return_orders) || 0,
                complete_orders: Number(r.complete_orders) || 0,
            }))
            .sort((a, b) => b.return_percent - a.return_percent)
            .slice(0, 10);
    }, [rows]);

    if (!data.length) return null;

    return (
        <div className="h-[500px]">
            <ResponsiveContainer width="100%" height={600}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 70 }}>
                    <defs>
                        {/* % (red) */}
                        <linearGradient id="gPct" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>

                        {/* total (amber) */}
                        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.20} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>

                        {/* returns (indigo) */}
                        <linearGradient id="gReturns" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.20} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>

                        {/* complete (green) */}
                        <linearGradient id="gComplete" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    <XAxis
                        dataKey="name"
                        stroke="#6B7280"
                        fontSize={9}
                        interval={0}
                        tickMargin={6}
                        angle={-30}
                        textAnchor="end"
                        height={90}
                        tickFormatter={(v) => (String(v).length > 14 ? `${String(v).slice(0, 14)}…` : v)}
                    />

                    {/* LEFT = percent */}
                    <YAxis
                        yAxisId="pct"
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
                        domain={[0, 100]}
                    />

                    {/* RIGHT = counts */}
                    <YAxis
                        yAxisId="cnt"
                        orientation="right"
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={formatCompact}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                        }}
                        formatter={(value, name) => {
                            if (name === "Return %") return [`${Number(value).toFixed(2)}%`, name];
                            return [formatCompact(value), name];
                        }}
                        labelFormatter={(label) => `Customer: ${label}`}
                    />

                    <Legend />

                    {/* 1) Return % (red) */}
                    <Area
                        type="monotone"
                        dataKey="return_percent"
                        yAxisId="pct"
                        stroke="#EF4444"
                        fill="url(#gPct)"
                        fillOpacity={1}
                        name="Return %"
                    />

                    {/* 2) Total Orders (amber) */}
                    <Area
                        type="monotone"
                        dataKey="total_orders"
                        yAxisId="cnt"
                        stroke="#F59E0B"
                        fill="url(#gTotal)"
                        fillOpacity={1}
                        name="Total Orders"
                    />

                    {/* 3) Return Orders (indigo) */}
                    <Area
                        type="monotone"
                        dataKey="return_orders"
                        yAxisId="cnt"
                        stroke="#6366F1"
                        fill="url(#gReturns)"
                        fillOpacity={1}
                        name="Return Orders"
                    />

                    {/* 4) Complete Orders (green) */}
                    <Area
                        type="monotone"
                        dataKey="complete_orders"
                        yAxisId="cnt"
                        stroke="#10B981"
                        fill="url(#gComplete)"
                        fillOpacity={1}
                        name="Complete Orders"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};


const TopHabitualReturns = ({
                                rows = [],
                                loading = false,
                                meta = {},
                            }) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    return (
        <SectionCard title="Top Habitual Returns" icon={RotateCcw}>
            {loading ? (
                <LoadingSpinner />
            ) : !isNonEmptyArray(safeRows) ? (
                <EmptyState label="No habitual returners found" />
            ) : (
                <div className="space-y-5">
                    <TopHabitualReturnsChart rows={safeRows} />

                    {/* meta chip */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
              Min Total Orders: <span className="font-semibold">{meta?.min_total_orders ?? "-"}</span>
            </span>
                        <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
              Min Return Orders: <span className="font-semibold">{meta?.min_return_percent ?? "-"}</span>
            </span>
                    </div>

                    <SimpleTable
                        columns={[
                            { key: "account_name", label: "Customer", strong: true },
                            { key: "PersonEmail", label: "Email" },
                            { key: "Phone", label: "Phone", mono: true },
                            {
                                key: "complete_orders",
                                label: "Complete",
                                align: "right",
                                render: (r) => formatCompact(r.complete_orders),
                            },
                            {
                                key: "return_orders",
                                label: "Returns",
                                align: "right",
                                strong: true,
                                render: (r) => formatCompact(r.return_orders),
                            },
                            {
                                key: "total_orders",
                                label: "Total",
                                align: "right",
                                render: (r) => formatCompact(r.total_orders),
                            },
                            {
                                key: "return_percent",
                                label: "Return %",
                                align: "right",
                                strong: true,
                                render: (r) => `${Number(r.return_percent || 0).toFixed(2)}%`,
                            },
                        ]}
                        rows={safeRows}
                    />
                </div>
            )}
        </SectionCard>
    );
};

export default TopHabitualReturns;
