import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import { RotateCcw } from "lucide-react";

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

const TopHabitualReturns = ({ rows = [], loading = false, meta = {} }) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    return (
        <SectionCard title="Top 10 Habitiual" icon={RotateCcw}>
            {loading ? (
                <LoadingSpinner />
            ) : !isNonEmptyArray(safeRows) ? (
                <EmptyState label="No habitual returners found" />
            ) : (
                <div className="space-y-5">
                    {/* meta chip */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                            Min Total Orders:{" "}
                            <span className="font-semibold">{meta?.min_total_orders ?? "-"}</span>
                        </span>
                        <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                            Min Return Orders:{" "}
                            <span className="font-semibold">{meta?.min_return_percent ?? "-"}</span>
                        </span>
                    </div>

                    <SimpleTable
                        columns={[
                            { key: "account_name", label: "Customer", strong: true },
                            { key: "PersonEmail", label: "Email" },

                            {
                                key: "complete_orders",
                                label: "Accepted",
                                align: "right",
                                render: (r) => formatCompact(r.complete_orders),
                            },
                            {
                                key: "return_orders",
                                label: "Returned",
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
