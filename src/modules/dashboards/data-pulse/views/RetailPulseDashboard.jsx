import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";

import {
    Activity,
    BadgePercent,
    Ban,
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
    TrendingDown,
    Gift,
    Boxes,
    Repeat, Store, ListChecks
} from "lucide-react";
import {formatRoundedAmountWithCommas} from "@helpers/formatters.js";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import RetailOverview from "@modules/dashboards/data-pulse/components/retail/RetailOverview.jsx";
import EmployeeDiscount from "@modules/dashboards/data-pulse/components/retail/EmployeeDiscount.jsx";
import GiftCards from "@modules/dashboards/data-pulse/components/retail/GiftCards.jsx";
import RetailReturns from "@modules/dashboards/data-pulse/components/retail/RetailReturns.jsx";
import RetailInventory from "@modules/dashboards/data-pulse/components/retail/RetailInventory.jsx";
import RetailExchanges from "@modules/dashboards/data-pulse/components/retail/RetailExchanges.jsx";
import {useSearchParams} from "react-router-dom";
import VoidTransactionsTable from "@modules/dashboards/data-pulse/components/retail/VoidTransactionsTable.jsx";
import SuspendedTransactionsTable
    from "@modules/dashboards/data-pulse/components/retail/SuspendedTransactionsTable.jsx";
import AfterClosingTransactionsTable
    from "@modules/dashboards/data-pulse/components/retail/AfterClosingTransactionsTable.jsx";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[380px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Activity size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);


const formatPKR = (v, formatRoundedAmountWithCommas) =>
    `PKR ${formatRoundedAmountWithCommas ? formatRoundedAmountWithCommas(v) : (Math.round(Number(v) || 0)).toLocaleString("en-US")}`;

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

const METRICS = [
    { key: "sales_by_store", label: "Sales by Store", icon: TrendingUp},
    { key: "returns_by_store", label: "Returns by Store", icon: TrendingDown},
    { key: "discount_coupon_top", label: "Discount Coupons", icon: BadgePercent},
    { key: "employee_card_top", label: "Employee Card", icon: IdCard},
    { key: "credit_memo_top", label: "Credit Memos Issued", icon: Receipt},
    { key: "credit_memo_redeemed_top", label: "Credit Memos Redeemed", icon: Receipt},
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
    credit_memo_redeemed_top: "/dashboard/data-pulse/retail/top/credit-memo-redemption/",
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
                sub: `${r.StoreId ?? "-"} • Net Amount: PKR ${formatRoundedAmountWithCommas(r.NET_AMOUNT) ?? "-"}`,
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
                sub: `Discount: PKR ${formatRoundedAmountWithCommas(r.EffectiveAmount)} • ${r.CustomerAccount ?? "-"}`,
            }));

        case "credit_memo_top":
            return safe.map((r) => ({
                name: r.CREATEDINSTOREID ?? "Unknown",
                value: Number(r.AMOUNT) || 0,
                sub: `Entry: ${r.ENTRYID ?? "-"} • Txn: ${r.CREATEDBYTRANSACTIONID ?? "-"}`,
            }));

        case "credit_memo_redeemed_top":
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
                sub: `${r.txn_count ?? "-"}`,
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
                        label: "Discount Amount",
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
                        label: "Order Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.Total_order_Amount)}`,
                    },
                    {
                        key: "EffectiveAmount",
                        label: "Discounted Amount",
                        align: "right",
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.EffectiveAmount)}`,
                    },
                ],
            };

        case "credit_memo_top":
            return {
                title: "Detailed Credit Memos Issued",
                columns: [
                    { key: "ENTRYID", label: "Entry ID", mono: true },
                    { key: "CREATEDBYTRANSACTIONID", label: "Created By Txn", mono: true },
                    { key: "CREATEDBYSTAFFID", label: "Staff ID", mono: true },
                    { key: "CREATEDINSTOREID", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    {
                        key: "TRANSACTIONDATE",
                        label: "Transaction Date",
                        mono: true,
                        render: (r) => (r.TRANSACTIONDATE ? String(r.TRANSACTIONDATE).slice(0, 10) : "-"),
                    },
                    {
                        key: "AMOUNT",
                        label: "Amount",
                        align: "right",
                        strong: true,
                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.AMOUNT)}`,
                    },
                ],
            };

        case "credit_memo_redeemed_top":
            return {
                title: "Detailed Credit Memos Redeemed",
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
                    }
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
                    { key: "WAREHOUSE", label: "Store ID", mono: true, colorClass: "text-blue-600" },
                    { key: "WAREHOUSENAME", label: "Store Name", strong: true },
                    { key: "txn_count", label: "Transaction Count", strong: true },
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
            { id: "employee", label: "Employee Card", icon: IdCard },
            { id: "gift_card", label: "Gift Card", icon: Gift },
            { id: "returns", label: "Returns", icon: RotateCcw },
            { id: "inventory", label: "Inventory", icon: Boxes },
            { id: "exchanges", label: "Exchanges", icon: Repeat },
            { id: "risk", label: "Audit & Risk", icon: ShieldAlert },
        ],
        []
    );

    const tabIds = useMemo(() => new Set(tabs.map(t => t.id)), [tabs]);

    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = useMemo(() => {
        const urlTab = searchParams.get("tab");
        return urlTab && tabIds.has(urlTab) ? urlTab : "overview";
    }, [searchParams, tabIds]);

    const onTabChange = useCallback((tabId) => {
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            p.set("tab", tabId);
            return p;
        }, { replace: true });
    }, [setSearchParams]);

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date_from',defaultValue: getPastDate(1)},
                    { name: 'date_to',defaultValue: getPastDate(1)},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    const DateInfo = ({  }) => (
        <div className="flex items-center gap-2">
            <Calendar size={13}/>
            <span>
            <span className="opacity-70">From:</span> {filters?.date_from || "-"}</span>
            <span className="opacity-40">—</span>
            <span>
        <span className="opacity-70">To:</span> {filters?.date_to || "-"}</span>
        </div>
    );

    const [selectedMetric, setSelectedMetric] = useState("sales_by_store");

    const analyticsEnabled = activeTab === "analytics";
    const employeeEnabled = activeTab === "employee";
    const giftCardEnabled = activeTab === "gift_card";
    const returnsEnabled = activeTab === "returns";
    const inventoryEnabled = activeTab === "inventory";
    const exchangeEnabled = activeTab === "exchanges";
    const riskEnabled = activeTab === "risk";

    const { data: acResp, isLoading: acLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.after_close_by_store,
        filters,
        { enabled: riskEnabled }
    );

    const { data: voidResp, isLoading: voidLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.void_by_store,
        filters,
        { enabled: riskEnabled }
    );

    const { data: suspResp, isLoading: suspLoading } = useFetchWithFilters(
        METRIC_ENDPOINTS.suspended_by_store,
        filters,
        { enabled: riskEnabled }
    );

    const metricEndpoint = METRIC_ENDPOINTS[selectedMetric];
    const { data: metricResp, isLoading: metricLoading } = useFetchWithFilters(
        metricEndpoint,
        filters,
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

    const riskTabs = useMemo(
        () => [
            { id: "by_store", label: "By Store (Top 10)", icon: Store },
            { id: "by_transactions", label: "By Transactions", icon: ListChecks },
        ],
        []
    );

    const [riskSubTab, setRiskSubTab] = useState("by_store");

    return (
        <div className="space-y-6 pb-8 pt-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Title + meta */}
                    <div className="flex items-start gap-3">
                        <div
                            className="p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-slate-900 dark:border-gray-700">
                            <BarChart3 size={26} className="text-gray-700 dark:text-gray-200"/>
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
                                Retail Data Pulse
                            </h1>

                            {/* Range from filters (no meta) */}
                            <div
                                className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                <DateInfo/>
                                <div className="flex items-center gap-2">
                                    <span className="opacity-40">|</span>
                                    <MapPin size={13}/>
                                    <span>Asia/Karachi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Filters */}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                            <div className="w-full sm:w-[180px]">
                                <FormInput
                                    type="date"
                                    name="date_from"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                />
                            </div>

                            <div className="w-full sm:w-[180px]">
                                <FormInput
                                    type="date"
                                    name="date_to"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                />
                            </div>

                            <div className="sm:pb-[2px]">
                                <FilterButton/>
                            </div>
                        </div>
                    </form>
                </div>
                {/* Tabs */}
                <div className="mt-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange}/>
                </div>
            </div>

            {showInitialLoading ? (
                <LoadingSpinner/>
            ) : (
                <>
                    {/* ------------------ OVERVIEW ------------------ */}
                    {activeTab === "overview" && (
                        <RetailOverview
                            activeTab={activeTab}
                            filters={filters}
                        />
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

                    {activeTab === "employee" && (
                        <EmployeeDiscount
                            filters={filters}
                            enabled={employeeEnabled}
                        />
                    )}

                    {activeTab === "gift_card" && (
                        <GiftCards
                            filters={filters}
                            enabled={giftCardEnabled}
                        />
                    )}

                    {/* ------------------ RETURNS ------------------ */}
                    {activeTab === "returns" && (
                        <RetailReturns
                            filters={filters}
                            enabled={returnsEnabled}
                        />
                    )}

                    {activeTab === "inventory" &&
                        <RetailInventory
                            filters={filters}
                            enabled={inventoryEnabled} />
                    }

                    {activeTab === "exchanges" &&
                        <RetailExchanges
                            filters={filters}
                            enabled={exchangeEnabled} />
                    }


                    {/* ------------------ RISK ------------------ */}
                    {activeTab === "risk" && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    {riskTabs.map((m) => {
                                        const Icon = m.icon;
                                        const active = riskSubTab === m.id;

                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setRiskSubTab(m.id)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                    active
                                                        ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="font-medium whitespace-nowrap">{m.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="p-6">
                                {riskSubTab === "by_store" && (
                                    <div className="space-y-6">
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
                                    </div>
                                )}

                                {riskSubTab === "by_transactions" && (
                                    <div className="grid grid-cols-1 gap-6">
                                        <SectionCard title="Void Transactions (Lines)" icon={Ban}>
                                            <VoidTransactionsTable filters={filters}/>
                                        </SectionCard>

                                        <SectionCard title="Suspended Transactions (Lines)" icon={PauseCircle}>
                                            <SuspendedTransactionsTable filters={filters}/>
                                        </SectionCard>
                                        <SectionCard title="After Closing Transactions (By Transactions)" icon={ShieldAlert}>
                                            <AfterClosingTransactionsTable filters={filters} />
                                        </SectionCard>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RetailPulseDashboard;
