import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

import {
    AlertTriangle,
    BarChart3,
    RotateCcw,
    Receipt,
    TrendingDown,
    Shuffle,
    Clock,
    Wallet,
} from "lucide-react";

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
import ProgressBar from "@components/ProgressBar.jsx";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

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
                <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
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

const ExchangesArea4Lines = ({ rows = [] }) => {
    const data = useMemo(() => {
        const safe = Array.isArray(rows) ? rows : [];
        const byStore = new Map();

        for (const r of safe) {
            const store = r.Warehouse || "-";
            const prev = byStore.get(store) || {
                store,
                sale_qty: 0,
                return_qty: 0,
                with_receipt: 0,
                without_receipt: 0,
            };

            prev.sale_qty += Number(r.SaleQty) || 0;
            prev.return_qty += Number(r.ReturnQty) || 0;
            prev.with_receipt += Number(r.WithRef) || 0;
            prev.without_receipt += Number(r.WithoutRef) || 0;

            byStore.set(store, prev);
        }

        return Array.from(byStore.values())
            .sort((a, b) => (b.return_qty || 0) - (a.return_qty || 0))
            .slice(0, 10);
    }, [rows]);

    if (!data.length) return null;

    return (
        <div className="h-[420px]">
            <ResponsiveContainer width="100%" height={420}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="gSale" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gReturn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gWith" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gWithout" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    <XAxis
                        dataKey="store"
                        stroke="#6B7280"
                        fontSize={10}
                        interval={0}
                        tickMargin={6}
                        angle={-30}
                        textAnchor="end"
                        height={90}
                    />
                    <YAxis stroke="#6B7280" fontSize={12} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                        }}
                        labelFormatter={(label) => `Store: ${label}`}
                        formatter={(value, name) => {
                            const map = {
                                sale_qty: "Sale Qty",
                                return_qty: "Return Qty",
                                with_receipt: "Return (With Receipt)",
                                without_receipt: "Return (Without Receipt)",
                            };
                            return [formatRoundedAmountWithCommas(value), map[name] || name];
                        }}
                    />
                    <Legend />

                    <Area type="monotone" dataKey="sale_qty" stroke="#6366F1" fill="url(#gSale)" fillOpacity={1} name="Sale Qty" />
                    <Area type="monotone" dataKey="return_qty" stroke="#10B981" fill="url(#gReturn)" fillOpacity={1} name="Return Qty" />
                    <Area type="monotone" dataKey="with_receipt" stroke="#F59E0B" fill="url(#gWith)" fillOpacity={1} name="Return (With Transactions)" />
                    <Area type="monotone" dataKey="without_receipt" stroke="#EF4444" fill="url(#gWithout)" fillOpacity={1} name="Return (Without Transactions)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const toTopReturnsBarData = (rows = []) =>
    (Array.isArray(rows) ? rows : []).map((r) => ({
        name: r.WAREHOUSENAME || r.StoreId || "-",
        value: Number(r.ReturnQty) || 0,
    }));

const RETURNS_ENDPOINTS = {
    summary: "/dashboard/data-pulse/retail/returns/summary/",
    exchanges_top: "/dashboard/data-pulse/retail/returns/top/exchanges-with-without-receipt/",
    returns_total_top: "/dashboard/data-pulse/retail/returns/top/returns-total/",
    returns_with_without_top: "/dashboard/data-pulse/retail/returns/top/returns-with-without-receipt/",
    payment_method_mismatch_table: "/dashboard/data-pulse/retail/returns/payment-method-mismatch/datatable/",
    late_returns_table: "/dashboard/data-pulse/retail/returns/late-returns/datatable/",
    sales_vs_returns_ratio_table: "/dashboard/data-pulse/retail/returns/sales-vs-returns-ratio/datatable/",

};

const Tabs = ({ tabs, activeTab, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                        active
                            ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                    }`}
                >
                    <Icon size={18} />
                    <span className="font-medium whitespace-nowrap">{t.label}</span>
                </button>
            );
        })}
    </div>
);

const RetailReturns = ({ filters, enabled }) => {
    const subTabs = useMemo(
        () => [
            { id: "stores", label: "Store Analytics", icon: BarChart3 },
            { id: "mismatch", label: "Method Mismatch", icon: Shuffle },
            { id: "late", label: "Late Returns", icon: Clock },
            { id: "ratio", label: "Sales vs Returns", icon: AlertTriangle },
        ],
        []
    );

    const [activeSubTab, setActiveSubTab] = useState("stores");

    const wantReturnsCards = enabled && activeSubTab === "stores"
    const wantLateCards = enabled && activeSubTab === "stores";
    const wantStores = enabled && activeSubTab === "stores";

    const { data: returnsCardsResp, isLoading: returnsCardsLoading } = useFetchWithFilters(
        RETURNS_ENDPOINTS.summary,
        { ...filters, key: "returns_cards" },
        { enabled: !!wantReturnsCards }
    );

    const { data: lateCardsResp, isLoading: lateCardsLoading } = useFetchWithFilters(
        RETURNS_ENDPOINTS.summary,
        { ...filters, key: "late_returns_cards" },
        { enabled: !!wantLateCards }
    );

    const returnsCards = returnsCardsResp?.data || returnsCardsResp?.summary || {};
    const lateCards = lateCardsResp?.data || lateCardsResp?.summary || {};

    // store analytics (charts/tables)
    const { data: exchangesResp, isLoading: exchangesLoading } = useFetchWithFilters(
        RETURNS_ENDPOINTS.exchanges_top,
        filters,
        { enabled: !!wantStores }
    );

    const { data: returnsTotalResp, isLoading: returnsTotalLoading } = useFetchWithFilters(
        RETURNS_ENDPOINTS.returns_total_top,
        filters,
        { enabled: !!wantStores }
    );

    const { data: returnsWithWithoutResp, isLoading: returnsWithWithoutLoading } = useFetchWithFilters(
        RETURNS_ENDPOINTS.returns_with_without_top,
        filters,
        { enabled: !!wantStores }
    );

    const salesReturnRatioColumns = useMemo(
        () => [
            {
                Header: "Store Name",
                accessor: "warehousename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
            },
            {
                Header: "Sales",
                accessor: "sales",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(value || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Return",
                accessor: "return_amount",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(value || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Sales %",
                accessor: "salesratio",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ row }) => {
                    return (
                        <ProgressBar
                            value={row.original.salesratio}
                            withStatus={false}
                        />
                    );
                },
                getCellProps: () => ({ className: "!text-right tabular-nums" }),
            },
            {
                Header: "Return %",
                accessor: "returnratio",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ row }) => {
                    return (
                        <ProgressBar
                            value={row.original.returnratio}
                            withStatus={false}
                        />
                    );
                },
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold text-red-600" }),
            },
        ],
        []
    );


    // datatable columns
    const mismatchColumns = useMemo(
        () => [
            {
                Header: "Returned Receipt",
                accessor: "returned_receipt",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "Returned Transaction",
                accessor: "returned_transaction",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "Returned Method",
                accessor: "returned_method",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 100,
            },
            {
                Header: "Original Transaction",
                accessor: "original_transaction",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Original Method",
                accessor: "original_method",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 100,
            },
            {
                Header: "Returned Amount",
                accessor: "returned_amount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(value || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
        ],
        []
    );


    const lateReturnsColumns = useMemo(
        () => [
            {
                Header: "Date",
                accessor: "transdate",
                excelColumnType: "date",
                excelAlignment: "left",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
            {
                Header: "Store Name",
                accessor: "warehousename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "Transaction #",
                accessor: "transactionnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Time",
                accessor: "transaction_time_str",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "Qty",
                accessor: "qty_total",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => formatRoundedAmountWithCommas(value || 0),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Amount (Incl Tax)",
                accessor: "amount_incl_tax",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(value || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
        ],
        []
    );

    const overviewLoading = returnsCardsLoading;
    const lateOverviewLoading = lateCardsLoading;

    return (
        <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Wallet}
                        title="Return Amount (Incl Tax)"
                        value={overviewLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(returnsCards.return_amount_incl_tax_total || 0)}`}
                        subtitle="All returns amount"
                        isLoading={overviewLoading}
                    />
                    <StatCard
                        icon={RotateCcw}
                        title="Return Qty (Total)"
                        value={overviewLoading ? "..." : formatRoundedAmountWithCommas(returnsCards.return_qty_total || 0)}
                        subtitle="All returns"
                        isLoading={overviewLoading}
                    />

                    <StatCard
                        icon={Receipt}
                        title="Returns With Receipt"
                        value={overviewLoading ? "..." : formatRoundedAmountWithCommas(returnsCards.return_qty_with_receipt || 0)}
                        subtitle="Receipt available"
                        isLoading={overviewLoading}
                    />

                    <StatCard
                        icon={Receipt}
                        title="Returns Without Receipt"
                        value={overviewLoading ? "..." : formatRoundedAmountWithCommas(returnsCards.return_qty_without_receipt || 0)}
                        subtitle="No receipt"
                        isLoading={overviewLoading}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={Clock}
                        title="Late Returns (Txns)"
                        value={lateOverviewLoading ? "..." : formatRoundedAmountWithCommas(lateCards.late_returns_txn_count || 0)}
                        subtitle="After 11:00 PM"
                        isLoading={lateOverviewLoading}
                    />

                    <StatCard
                        icon={Clock}
                        title="Late Returns (Qty)"
                        value={lateOverviewLoading ? "..." : formatRoundedAmountWithCommas(lateCards.late_returns_qty_total || 0)}
                        subtitle="After 11:00 PM"
                        isLoading={lateOverviewLoading}
                    />

                    <StatCard
                        icon={Wallet}
                        title="Late Returns Amount"
                        value={lateOverviewLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(lateCards.late_returns_amount_incl_tax_total || 0)}`}
                        subtitle="Incl tax"
                        isLoading={lateOverviewLoading}
                    />
                </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <Tabs tabs={subTabs} activeTab={activeSubTab} onChange={setActiveSubTab}/>
                </div>

                {/* STORE ANALYTICS */}
                {activeSubTab === "stores" && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SectionCard title="Top Returns by Store" icon={TrendingDown}>
                                {returnsTotalLoading ? (
                                    <LoadingSpinner/>
                                ) : !isNonEmptyArray(returnsTotalResp?.rows) ? (
                                    <EmptyState/>
                                ) : (
                                    <>
                                        <div className="h-[420px]">
                                            <ReChart
                                                data={toTopReturnsBarData(returnsTotalResp.rows)}
                                                dimensions={{height: 420, bottom: 0}}
                                                colors={DEFAULT_CHART_COLORS}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <SimpleTable
                                                columns={[
                                                    {key: "Date", label: "Date", mono: true},
                                                    {
                                                        key: "StoreId",
                                                        label: "Store ID",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "WAREHOUSENAME", label: "Store Name", strong: true},
                                                    {
                                                        key: "ReturnQty",
                                                        label: "Return Qty",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => formatRoundedAmountWithCommas(r.ReturnQty),
                                                    },
                                                ]}
                                                rows={returnsTotalResp.rows}
                                            />
                                        </div>
                                    </>
                                )}
                            </SectionCard>

                            <SectionCard title="Top Exchanges (Sale + Return in same Transaction)" icon={RotateCcw}>
                                {exchangesLoading ? (
                                    <LoadingSpinner/>
                                ) : !isNonEmptyArray(exchangesResp?.rows) ? (
                                    <EmptyState label="No exchanges found for this date range"/>
                                ) : (
                                    <>
                                        <ExchangesArea4Lines rows={exchangesResp.rows}/>

                                        <div className="mt-4">
                                            <SimpleTable
                                                columns={[
                                                    {key: "TransDate", label: "Date", mono: true},
                                                    {
                                                        key: "Warehouse",
                                                        label: "Store ID",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "TransactionNumber", label: "Transaction #", mono: true},
                                                    {
                                                        key: "SaleQty",
                                                        label: "Sale Qty",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => formatRoundedAmountWithCommas(r.SaleQty)
                                                    },
                                                    {
                                                        key: "ReturnQty",
                                                        label: "Return Qty",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => formatRoundedAmountWithCommas(r.ReturnQty)
                                                    },
                                                    {
                                                        key: "WithRef",
                                                        label: "Return (With Transactions)",
                                                        align: "right",
                                                        render: (r) => formatRoundedAmountWithCommas(r.WithRef)
                                                    },
                                                    {
                                                        key: "WithoutRef",
                                                        label: "Return (Without Transactions)",
                                                        align: "right",
                                                        render: (r) => formatRoundedAmountWithCommas(r.WithoutRef)
                                                    },
                                                ]}
                                                rows={exchangesResp.rows}
                                            />
                                        </div>
                                    </>
                                )}
                            </SectionCard>
                        </div>

                        <SectionCard title="Returns With vs Without Receipt (By Store)" icon={Receipt}>
                            {returnsWithWithoutLoading ? (
                                <LoadingSpinner/>
                            ) : !isNonEmptyArray(returnsWithWithoutResp?.rows) ? (
                                <EmptyState/>
                            ) : (
                                <SimpleTable
                                    columns={[
                                        {key: "Date", label: "Date", mono: true},
                                        {key: "StoreId", label: "Store ID", mono: true, colorClass: "text-blue-600"},
                                        {key: "WAREHOUSENAME", label: "Store Name", strong: true},
                                        {
                                            key: "WithRef",
                                            label: "With Receipt",
                                            align: "right",
                                            strong: true,
                                            render: (r) => formatRoundedAmountWithCommas(r.WithRef)
                                        },
                                        {
                                            key: "WithoutRef",
                                            label: "Without Receipt",
                                            align: "right",
                                            strong: true,
                                            render: (r) => formatRoundedAmountWithCommas(r.WithoutRef)
                                        },
                                    ]}
                                    rows={returnsWithWithoutResp.rows}
                                />
                            )}
                        </SectionCard>
                    </div>
                )}

                {/* METHOD MISMATCH DATATABLE */}
                {activeSubTab === "mismatch" && (
                    <div className="p-4">
                        <DataTable
                            columns={mismatchColumns}
                            title=""
                            apiUrl={RETURNS_ENDPOINTS.payment_method_mismatch_table}
                            needHeader={false}
                            enableAdvancedFilters={false}
                            filter={filters}
                            hideUrlParams={true}
                        />
                    </div>
                )}

                {/* LATE RETURNS (datatable only) */}
                {activeSubTab === "late" && (
                    <div className="p-4">
                        <DataTable
                            columns={lateReturnsColumns}
                            title=""
                            apiUrl={RETURNS_ENDPOINTS.late_returns_table}
                            needHeader={false}
                            enableAdvancedFilters={false}
                            filter={filters}
                            hideUrlParams={true}
                        />
                    </div>
                )}
                {activeSubTab === "ratio" && (
                    <div className="p-4">
                        <DataTable
                            columns={salesReturnRatioColumns}
                            title=""
                            apiUrl={RETURNS_ENDPOINTS.sales_vs_returns_ratio_table}
                            needHeader={false}
                            enableAdvancedFilters={false}
                            filter={filters}
                            hideUrlParams={true}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default RetailReturns;
