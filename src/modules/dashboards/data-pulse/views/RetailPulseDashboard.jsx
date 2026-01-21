import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";

import {
    Activity,
    BadgePercent,
    Ban,
    Clock,
    IdCard,
    Receipt,
    RotateCcw,
    TrendingUp,
    PauseCircle,
    BarChart3,
    LayoutGrid,
    ShieldAlert,
    MapPin,
    Calendar,
    Users,
    ArrowUpRight,
    TrendingDown
} from "lucide-react";
import {formatRoundedAmountWithCommas} from "@helpers/formatters.js";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[380px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Activity size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

const Tabs = ({ tabs, activeTab, onChange }) => (
    <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                        active
                            ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                    }`}
                >
                    <Icon size={18} />
                    <span className="font-medium whitespace-nowrap">{tab.label}</span>
                </button>
            );
        })}
    </div>
);

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

const TopItemsList = ({ items = [], valuePrefix = "", valueSuffix = "" }) => (
    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
        {items.slice(0, 10).map((item, idx) => (
            <div
                key={idx}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-200 dark:bg-bodybg"
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-200">
                            {idx + 1}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                                {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.sub || "Top item"}</p>
                        </div>
                    </div>

                    <span className="text-sm font-bold text-blue-600 tabular-nums whitespace-nowrap">
            {valuePrefix}
                        {formatRoundedAmountWithCommas(item.value)}
                        {valueSuffix}
          </span>
                </div>
            </div>
        ))}
    </div>
);

// -------- METRICS (Retail) --------
const METRICS = [
    { key: "sales_by_store", label: "Sales by Store", icon: TrendingUp},
    { key: "returns_by_store", label: "Returns by Store", icon: TrendingDown},
    { key: "discount_coupon_top", label: "Discount Coupons", icon: BadgePercent},
    { key: "employee_card_top", label: "Employee Card", icon: IdCard},
    { key: "credit_memo_top", label: "Credit Memos", icon: Receipt},
    { key: "void_by_store", label: "Voids by Store", icon: Ban},
    { key: "suspended_by_store", label: "Suspended Transactions", icon: PauseCircle},
    { key: "after_close_by_store", label: "After Closing", icon: ShieldAlert},
];

const METRIC_ENDPOINTS = {
    sales_by_store: "/dashboard/data-pulse/retail/top/sales/",
    returns_by_store: "/dashboard/data-pulse/retail/top/returns/",
    discount_coupon_top: "/dashboard/data-pulse/retail/top/discount-coupons/",
    employee_card_top: "/dashboard/data-pulse/retail/top/employee-card/",
    credit_memo_top: "/dashboard/data-pulse/retail/top/credit-memo/",
    void_by_store: "/dashboard/data-pulse/retail/top/void/",
    suspended_by_store: "/dashboard/data-pulse/retail/top/suspended/",
    after_close_by_store: "/dashboard/data-pulse/retail/top/after-closing/",
};

function normalizeMetricRows(metricKey, rows) {
    const safe = Array.isArray(rows) ? rows : [];

    switch (metricKey) {
        case "sales_by_store":
            return safe.map((r) => ({
                name: r.WAREHOUSENAME ?? "Unknown",
                value: Number(r.net_amount) || 0,
                sub: `${r.WAREHOUSE ?? "-"} • ${r.Date ?? "-"}`,
            }));
        case "returns_by_store":
            return safe.map((r) => ({
                name: r.WAREHOUSENAME ?? "Unknown",
                value: Number(r.ReturnQty) || 0,
                sub: `${r.StoreId ?? "-"} • Net Amount: ${formatRoundedAmountWithCommas(r.NET_AMOUNT) ?? "-"}`,
            }));

        case "discount_coupon_top":
            return safe.map((r) => ({
                name: r.DiscountCode ?? "Unknown",
                value: Number(r.EffectiveAmount) || 0,
                sub: `${r.WAREHOUSENAME ?? "-"} • Txn: ${r.TransactionNumber ?? "-"}`,
            }));

        case "employee_card_top":
            return safe.map((r) => ({
                name: r.Name ?? "Unknown",
                value: Number(r.Total_order_Amount) || 0,
                sub: `Eff: ${formatRoundedAmountWithCommas(r.EffectiveAmount)} • ${r.CustomerAccount ?? "-"}`,
            }));

        case "credit_memo_top":
            return safe.map((r) => ({
                name: r.WAREHOUSENAME ?? "Unknown",
                value: Number(r.AppliedAmount) || 0,
                sub: `Entry: ${r.EntryId ?? "-"} • Receipt: ${r.AppliedByReceiptId ?? "-"}`,
            }));

        case "void_by_store":
        case "suspended_by_store":
            return safe.map((r) => ({
                name: r.WAREHOUSENAME ?? "Unknown",
                value: Number(r.transaction_count) || 0,
                sub: `${r.StoreId ?? "-"} • ${r.Date ?? "-"}`,
            }));

        case "after_close_by_store":
            return safe.map((r) => ({
                name: r.WAREHOUSENAME ?? "Unknown",
                value: Math.abs(Number(r.NETAMOUNT) || 0),
                sub: `${r.TransactionTime ?? "-"} • ${r.TRANSACTIONDATE ?? "-"}`,
            }));

        default:
            return [];
    }
}

function getDetailTableConfig(metricKey) {
    switch (metricKey) {
        case "sales_by_store":
            return {
                title: "Detailed Sales by Store",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "WAREHOUSE", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    {
                        key: "net_amount",
                        label: "Net Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.net_amount)}`,
                    },
                ],
            };
        case "returns_by_store":
            return {
                title: "Detailed Returns by Store",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "StoreId", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    {
                        key: "ReturnQty",
                        label: "QTY",
                        align: "right",
                        strong: true,
                        render: (r) => `${formatRoundedAmountWithCommas(r.ReturnQty)}`,
                    },
                    {
                        key: "NET_AMOUNT",
                        label: "Net Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.NET_AMOUNT)}`,
                    },
                ],
            };

        case "discount_coupon_top":
            return {
                title: "Detailed Discount Coupons",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "Warehouse", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    { key: "TransactionNumber", label: "Transaction #", mono: true },
                    {
                        key: "Total_order_Amount",
                        label: "Total Order",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.Total_order_Amount)}`,
                    },
                    { key: "DiscountCode", label: "Discount Code", strong: true },
                    {
                        key: "EffectiveAmount",
                        label: "Effective Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.EffectiveAmount)}`,
                    },
                ],
            };

        case "employee_card_top":
            return {
                title: "Detailed Employee Card",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "CustGroup", label: "Cust Group", mono: true },
                    { key: "CustomerAccount", label: "Customer Account", mono: true, colorClass: "text-blue-600" },
                    { key: "KnownAs", label: "Known As", mono: true },
                    { key: "Name", label: "Name", strong: true },
                    { key: "TransactionNumber", label: "Transaction #", mono: true },
                    {
                        key: "Total_order_Amount",
                        label: "Total Order",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.Total_order_Amount)}`,
                    },
                    {
                        key: "EffectiveAmount",
                        label: "Effective Amount",
                        align: "right",
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.EffectiveAmount)}`,
                    },
                ],
            };

        case "credit_memo_top":
            return {
                title: "Detailed Credit Memos",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "AppliedInStoreId", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    { key: "EntryId", label: "Entry ID", mono: true },
                    { key: "AppliedDate", label: "Applied Date", mono: true },
                    { key: "AppliedByReceiptId", label: "Receipt", mono: true },
                    { key: "AppliedByTransactionId", label: "Transaction #", mono: true },
                    {
                        key: "AppliedAmount",
                        label: "Applied Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.AppliedAmount)}`,
                    },
                    {
                        key: "Total_order_Amount",
                        label: "Order Amount",
                        align: "right",
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.Total_order_Amount)}`,
                    },
                ],
            };

        case "void_by_store":
            return {
                title: "Detailed Voids by Store",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "StoreId", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    {
                        key: "transaction_count",
                        label: "Void Count",
                        align: "right",
                        strong: true,
                        render: (r) => formatRoundedAmountWithCommas(r.transaction_count),
                    },
                ],
            };

        case "suspended_by_store":
            return {
                title: "Detailed Suspended Transactions",
                columns: [
                    { key: "Date", label: "Date", mono: true },
                    { key: "StoreId", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    {
                        key: "transaction_count",
                        label: "Suspended Count",
                        align: "right",
                        strong: true,
                        render: (r) => formatRoundedAmountWithCommas(r.transaction_count),
                    },
                ],
            };

        case "after_close_by_store":
            return {
                title: "Detailed After Closing Transactions",
                columns: [
                    { key: "TRANSACTIONDATE", label: "Date", mono: true },
                    { key: "TransactionTime", label: "Time", mono: true },
                    { key: "WAREHOUSE", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    {
                        key: "GROSSAMOUNT",
                        label: "Gross",
                        align: "right",
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.GROSSAMOUNT)}`,
                    },
                    {
                        key: "NETAMOUNT",
                        label: "Net",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.NETAMOUNT)}`,
                    },
                    {
                        key: "DISCOUNTAMOUNT",
                        label: "Discount",
                        align: "right",
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.DISCOUNTAMOUNT)}`,
                    },
                ],
            };

        default:
            return { title: "Detailed Data", columns: [{ key: "raw", label: "Raw" }] };
    }
}

const RetailPulseDashboard = () => {
    const COLORS = DEFAULT_CHART_COLORS;

    const tabs = useMemo(
        () => [
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "risk", label: "Audit & Risk", icon: ShieldAlert },
        ],
        []
    );

    const [activeTab, setActiveTab] = useState("overview");
    const [selectedMetric, setSelectedMetric] = useState("sales_by_store");

    // ✅ KPIs always fetched
    const { data: kpiResp, isLoading: kpiLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/retail/kpis/",
        {}
    );
    const kpis = kpiResp?.kpis || {};
    const meta = kpiResp?.meta || {};

    const overviewEnabled = activeTab === "overview";
    const analyticsEnabled = activeTab === "analytics";
    const riskEnabled = activeTab === "risk";

    // Overview calls (optional, but safe)
    const { data: salesResp, isLoading: salesLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.sales_by_store,
        {},
        { enabled: overviewEnabled }
    );

    const { data: returnResp, isLoading: returnLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.returns_by_store,
        {},
        { enabled: overviewEnabled }
    );

    const { data: creditResp, isLoading: creditLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.credit_memo_top,
        {},
        { enabled: overviewEnabled }
    );

    // Risk calls
    const { data: acResp, isLoading: acLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.after_close_by_store,
        {},
        { enabled: riskEnabled }
    );

    const { data: voidResp, isLoading: voidLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.void_by_store,
        {},
        { enabled: riskEnabled }
    );

    const { data: suspResp, isLoading: suspLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.suspended_by_store,
        {},
        { enabled: riskEnabled }
    );

    // Analytics selected metric call
    const metricEndpoint = METRIC_ENDPOINTS[selectedMetric];
    const { data: metricResp, isLoading: metricLoading } = useFetchWithFilters(
        metricEndpoint,
        {},
        { enabled: analyticsEnabled && !!metricEndpoint }
    );

    const metricRowsRaw = metricResp?.rows ?? [];
    const metricData = useMemo(
        () => normalizeMetricRows(selectedMetric, metricRowsRaw),
        [selectedMetric, metricRowsRaw]
    );

    const detailCfg = useMemo(
        () => getDetailTableConfig(selectedMetric),
        [selectedMetric]
    );

    const showInitialLoading = false;

    return (
        <div className="space-y-6 pb-8 pt-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2">
                                <BarChart3 size={28} />
                            </div>
                            <div>
                                <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Retail Data Pulse</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Top 10 signals (last 7 days, excluding today)
                                </p>

                                {meta?.date_from && meta?.date_to && (
                                    <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                        <Calendar size={13} /> {meta.date_from} — {meta.date_to}
                                        {meta.timezone ? (
                                            <>
                                                <span className="opacity-40">|</span>
                                                <MapPin size={13} /> {meta.timezone}
                                            </>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {showInitialLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {/* ------------------ OVERVIEW ------------------ */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={TrendingUp}
                                    title="Net Revenue"
                                    value={kpiLoading ? '...' : `PKR ${formatRoundedAmountWithCommas(kpis.sales_net_amount_total)}`}
                                    subtitle="Total net sales"
                                />
                                <StatCard
                                    icon={RotateCcw}
                                    title="Returns Value"
                                    value={kpiLoading ? '...' : `PKR ${formatRoundedAmountWithCommas(kpis.return_net_amount_total)}`}
                                    subtitle="Total returns"
                                />
                                <StatCard
                                    icon={Receipt}
                                    title="Credit Issued"
                                    value={kpiLoading ? '...' : `PKR ${formatRoundedAmountWithCommas(kpis.credit_memo_total)}`}
                                    subtitle="Credit memo total"
                                />
                                <StatCard
                                    icon={BadgePercent}
                                    title="Discounts"
                                    value={kpiLoading ? '...' : `PKR ${formatRoundedAmountWithCommas(kpis.discount_coupon_total)}`}
                                    subtitle="Coupons applied"
                                />
                                <StatCard
                                    icon={IdCard}
                                    title="Staff Card"
                                    value={kpiLoading ? '...' : `PKR ${formatRoundedAmountWithCommas(kpis.employee_card_total)}`}
                                    subtitle="Employee spend"
                                />
                                <StatCard
                                    icon={Clock}
                                    title="POS Shifts"
                                    value={kpiLoading ? '...' : formatRoundedAmountWithCommas(kpis.open_shifts)}
                                    subtitle="Currently open"
                                />
                                <StatCard
                                    icon={ShieldAlert}
                                    title="Late Transactions"
                                    value={kpiLoading ? '...' : formatRoundedAmountWithCommas(kpis.after_close_txn_count)}
                                    subtitle="After closing"
                                />
                                <StatCard
                                    icon={Ban}
                                    title="Void Count"
                                    value={kpiLoading ? '...' : formatRoundedAmountWithCommas(kpis.void_txn_count)}
                                    subtitle="Voids"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Sales Trends */}
                                <div
                                    className="bg-gradient-to-br from-black to-black to-indigo-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-16 -mt-16"/>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <TrendingUp size={20}/>
                                                Sales Trend
                                            </h3>
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <ArrowUpRight className="text-white" size={22}/>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-white/80">Net Revenue</p>
                                                <p className="text-4xl font-bold text-white tabular-nums">
                                                    PKR {formatRoundedAmountWithCommas(kpis.sales_net_amount_total)}
                                                </p>
                                                <p className="text-xs text-white/70">Across selected period</p>
                                            </div>

                                            <div
                                                className="pt-4 border-t border-white/25 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                                <p className="text-sm text-white/80">Discount Impact</p>
                                                <p className="text-2xl font-bold text-white tabular-nums">
                                                    PKR {formatRoundedAmountWithCommas(kpis.discount_coupon_total)}
                                                </p>
                                                <p className="text-xs text-white/70">Coupons applied</p>
                                            </div>

                                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                                                <span className="font-semibold">Tip:</span> Compare stores below for
                                                quick wins.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Snapshot */}
                                <div
                                    className="bg-gradient-to-br from-red to-orange rounded-xl shadow-lg p-6 relative overflow-hidden">
                                    <div
                                        className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16"/>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <ShieldAlert size={20}/>
                                                Risk Snapshot
                                            </h3>
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <ShieldAlert className="text-white" size={22}/>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-white/80">After Close Txns</p>
                                                <p className="text-4xl font-bold text-white tabular-nums">
                                                    {formatRoundedAmountWithCommas(kpis.after_close_txn_count)}
                                                </p>
                                                <p className="text-xs text-white/70">Transactions after closing</p>
                                            </div>

                                            <div className="pt-4 border-t border-white/25 grid grid-cols-2 gap-4">
                                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                                    <p className="text-xs text-white/80">Voids</p>
                                                    <p className="text-2xl font-bold text-white tabular-nums">
                                                        {formatRoundedAmountWithCommas(kpis.void_txn_count)}
                                                    </p>
                                                </div>
                                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                                    <p className="text-xs text-white/80">Suspended</p>
                                                    <p className="text-2xl font-bold text-white tabular-nums">
                                                        {formatRoundedAmountWithCommas(kpis.suspended_txn_count)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className="bg-white/10 p-2 rounded-lg text-white/90 text-sm flex items-center gap-2">
                                                <Ban size={16}/>
                                                Audit these stores first (see Risk tab).
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Returns / Credit Overview */}
                                <div
                                    className="bg-gradient-to-br from-black to-green rounded-xl shadow-lg p-6 relative overflow-hidden">
                                    <div
                                        className="absolute bottom-0 left-0 w-44 h-44 bg-white/10 rounded-full -ml-20 -mb-20"/>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <RotateCcw size={20}/>
                                                Returns & Credits
                                            </h3>
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <Receipt className="text-white" size={22}/>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-white/80">Returns Value</p>
                                                <p className="text-4xl font-bold text-white tabular-nums">
                                                    PKR {formatRoundedAmountWithCommas(kpis.return_net_amount_total)}
                                                </p>
                                                <p className="text-xs text-white/70">Total returns</p>
                                            </div>

                                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                                <p className="text-xs text-white/80">Credit Issued</p>
                                                <p className="text-2xl font-bold text-white tabular-nums">
                                                    PKR {formatRoundedAmountWithCommas(kpis.credit_memo_total)}
                                                </p>
                                            </div>

                                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                                                Focus: high-return stores + repeated credit memo IDs.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional blocks */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SectionCard title="Sales by Store (Top 10)" icon={TrendingUp}>
                                    {salesLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(salesResp?.rows) ? (
                                        <EmptyState/>
                                    ) : (
                                        <div className="h-[420px]">
                                            <ReChart
                                                data={salesResp.rows.map((r) => ({
                                                    name: r.WAREHOUSENAME,
                                                    value: Number(r.net_amount) || 0,
                                                }))}
                                                dimensions={{height: 420, bottom: 0}}
                                                colors={DEFAULT_CHART_COLORS}
                                            />
                                        </div>
                                    )}
                                </SectionCard>

                                <SectionCard title="Return By Store (Top 10)" icon={TrendingDown}>
                                    {returnLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(creditResp?.rows) ? (
                                        <EmptyState/>
                                    ) : (
                                        <ReChart
                                            data={returnResp.rows.map((r) => ({
                                                name: r.WAREHOUSENAME,
                                                value: Number(r.ReturnQty) || 0,
                                            }))}
                                            dimensions={{height: 420, bottom: 0}}
                                            colors={DEFAULT_CHART_COLORS}
                                        />
                                    )}
                                </SectionCard>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                                <SectionCard title="Credit Memos (Top 10)" icon={TrendingDown}>
                                    {creditLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(creditResp?.rows) ? (
                                        <EmptyState/>
                                    ) : (
                                        <ReChart
                                            data={creditResp.rows.map((r) => ({
                                                name: r.WAREHOUSENAME,
                                                value: Number(r.Total_order_Amount) || 0,
                                            }))}
                                            dimensions={{height: 420, bottom: 0}}
                                            colors={DEFAULT_CHART_COLORS}
                                        />
                                    )}
                                </SectionCard>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className="space-y-6">
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                {/* Metric buttons */}
                                <div
                                    className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {METRICS.map((m) => {
                                            const Icon = m.icon;
                                            const active = selectedMetric === m.key;
                                            return (
                                                <button
                                                    key={m.key}
                                                    onClick={() => setSelectedMetric(m.key)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                        active
                                                            ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                                    }`}
                                                >
                                                    <Icon size={18}/>
                                                    {m.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Chart + Top Items */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div
                                            className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:text-gray-200 dark:bg-bodybg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                                {METRICS.find((m) => m.key === selectedMetric)?.label}
                                            </h3>

                                            {metricLoading ? (
                                                <div className="h-[420px] flex items-center justify-center">
                                                    <LoadingSpinner/>
                                                </div>
                                            ) : !isNonEmptyArray(metricData) ? (
                                                <EmptyState/>
                                            ) : (
                                                <div className="h-[420px]">
                                                    <ReChart
                                                        data={metricData}
                                                        dimensions={{height: 420, bottom: 0}}
                                                        colors={COLORS}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:text-gray-200 dark:bg-bodybg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                                <Users size={18}/>
                                                Top Items
                                            </h3>

                                            {metricLoading ? (
                                                <LoadingSpinner/>
                                            ) : !isNonEmptyArray(metricData) ? (
                                                <EmptyState/>
                                            ) : (
                                                <TopItemsList items={metricData}/>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ DIFFERENT detailed table */}
                                <div className="p-6">
                                    <div
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md dark:text-gray-200 dark:bg-bodybg">
                                        <div className="p-5 border-b border-gray-200 dark:border-gray-600">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {detailCfg.title}
                                            </h3>
                                        </div>

                                        {metricLoading ? (
                                            <div className="p-6">
                                                <LoadingSpinner/>
                                            </div>
                                        ) : !isNonEmptyArray(metricRowsRaw) ? (
                                            <div className="p-6">
                                                <EmptyState/>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                <SimpleTable columns={detailCfg.columns} rows={metricRowsRaw}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ------------------ RISK ------------------ */}
                    {activeTab === "risk" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SectionCard title="Voids by Store" icon={Ban}>
                                    {voidLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(voidResp?.rows) ? (
                                        <EmptyState/>
                                    ) : (
                                        <SimpleTable
                                            columns={getDetailTableConfig("void_by_store").columns}
                                            rows={voidResp.rows}
                                        />
                                    )}
                                </SectionCard>

                                <SectionCard title="Suspended Transactions" icon={PauseCircle}>
                                    {suspLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(suspResp?.rows) ? (
                                        <EmptyState/>
                                    ) : (
                                        <SimpleTable
                                            columns={getDetailTableConfig("suspended_by_store").columns}
                                            rows={suspResp.rows}
                                        />
                                    )}
                                </SectionCard>
                            </div>

                            <SectionCard title="After Closing Transactions" icon={ShieldAlert}>
                                {acLoading ? (
                                    <LoadingSpinner/>
                                ) : !isNonEmptyArray(acResp?.rows) ? (
                                    <EmptyState/>
                                ) : (
                                    <SimpleTable
                                        columns={getDetailTableConfig("after_close_by_store").columns}
                                        rows={acResp.rows}
                                    />
                                )}
                            </SectionCard>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RetailPulseDashboard;
