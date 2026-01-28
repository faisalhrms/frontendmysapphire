import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { MapPin } from "lucide-react";

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

const ReturnsLocationWise = ({ rows = [], loading = false, colors }) => {
    const safeRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

    const sortedRows = useMemo(() => {
        return [...safeRows].sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
    }, [safeRows]);

    // data for ReChart (bar)
    const chartData = useMemo(() => {
        return sortedRows.slice(0, 12).map((r) => ({
            name: r.location_name || "-",
            value: Number(r.count) || 0,
        }));
    }, [sortedRows]);

    return (
        <SectionCard title="Returns Location-wise" icon={MapPin}>
            {loading ? (
                <LoadingSpinner />
            ) : !isNonEmptyArray(sortedRows) ? (
                <EmptyState label="No location-wise return data" />
            ) : (
                <div className="space-y-5">
                    <div className="h-[420px]">
                        <ReChart
                            data={chartData}
                            variant="bar"
                            dimensions={{ height: 420, bottom: 0 }}
                            colors={colors}
                        />
                    </div>

                    <SimpleTable
                        columns={[
                            { key: "location_name", label: "Location", strong: true },
                            { key: "Address__c", label: "Address", mono: true, colorClass: "text-blue-600" },
                            {
                                key: "count",
                                label: "Returns",
                                align: "right",
                                strong: true,
                                render: (r) => formatCompact(r.count),
                            },
                        ]}
                        rows={sortedRows}
                    />
                </div>
            )}
        </SectionCard>
    );
};

export default ReturnsLocationWise;
