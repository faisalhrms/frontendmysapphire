import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { UserCheck } from "lucide-react";
import { formatDate } from "@helpers/dateTime.js";

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

const OrdersOnBehalf = ({
                            rows = [],
                            loading = false,
                            colors = [],
                            chartHeight = 420,
                        }) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    const chartData = useMemo(() => {
        return [...safeRows]
            .map((r) => ({
                name: r.orderno || "-",
                value: Number(r.ordertotal) || 0,
            }))
            .sort((a, b) => (b.value || 0) - (a.value || 0));
    }, [safeRows]);

    return (
        <SectionCard title="Orders On Behalf" icon={UserCheck}>
            {loading ? (
                <LoadingSpinner />
            ) : !isNonEmptyArray(safeRows) ? (
                <EmptyState label="No on-behalf orders found" />
            ) : (
                <div className="space-y-5">
                    {/* Chart */}
                    <div className={`h-[${chartHeight}px]`}>
                        <ReChart
                            data={chartData}
                            variant="bar"
                            dimensions={{ height: chartHeight, bottom: 0 }}
                            colors={colors}
                        />
                    </div>

                    {/* Table */}
                    <SimpleTable
                        columns={[
                            { key: "orderno", label: "Order #", mono: true, colorClass: "text-blue-600", strong: true },
                            { key: "customername", label: "Customer", strong: true },
                            { key: "email", label: "Email" },
                            {
                                key: "ordertotal",
                                label: "Order Total",
                                align: "right",
                                strong: true,
                                render: (r) => `PKR ${formatCompact(r.ordertotal)}`,
                            },
                            { key: "paymentstatus", label: "Payment", strong: true },
                            {
                                key: "local_creation_date",
                                label: "Created",
                                render: (r) => formatDate(r.local_creation_date, "MMM dd, yyyy - HH:mm"),
                            },
                            { key: "siteid", label: "Site" },
                        ]}
                        rows={safeRows}
                    />
                </div>
            )}
        </SectionCard>
    );
};

export default OrdersOnBehalf;
