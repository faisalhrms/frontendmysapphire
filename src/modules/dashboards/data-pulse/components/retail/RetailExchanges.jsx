import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

import { TrendingUp, RotateCcw, Receipt, ReceiptText, Store, List } from "lucide-react";

const EX_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/exchanges/overview/",
    storewiseTable: "/dashboard/data-pulse/retail/exchanges/storewise/datatable/",
    transactionsTable: "/dashboard/data-pulse/retail/exchanges/transactions/datatable/",
};

const fmtQty = (v) => formatRoundedAmountWithCommas(Number(v) || 0);

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

const RetailExchanges = ({ filters, enabled }) => {
    const [activeSubTab, setActiveSubTab] = useState("storewise");

    const subTabs = useMemo(
        () => [
            { id: "storewise", label: "Store-wise", icon: Store },
            { id: "transactions", label: "Transaction-wise", icon: List },
        ],
        []
    );

    const { data: overviewResp, isLoading: overviewLoading } = useFetchWithFilters(
        EX_ENDPOINTS.overview,
        filters,
        { enabled: !!enabled }
    );

    const cards = overviewResp?.summary || overviewResp?.data || overviewResp || {};

    const storeColumns = useMemo(
        () => [
            {
                Header: "Store Name",
                accessor: "warehousename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
            },
            {
                Header: "Sale Qty",
                accessor: "saleqty",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Return Qty",
                accessor: "returnqty",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "With Receipt",
                accessor: "withref",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Without Receipt",
                accessor: "withoutref",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Txn Count",
                accessor: "txn_count",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
        ],
        []
    );

    const txnColumns = useMemo(
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
                Header: "Store",
                accessor: "warehouse",
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
                Header: "Sale Qty",
                accessor: "saleqty",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Return Qty",
                accessor: "returnqty",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "With Receipt",
                accessor: "withref",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Without Receipt",
                accessor: "withoutref",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtQty(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} title="Total Sale Qty" value={overviewLoading ? "..." : fmtQty(cards.total_sale_qty)} isLoading={overviewLoading} />
                <StatCard icon={RotateCcw} title="Total Return Qty" value={overviewLoading ? "..." : fmtQty(cards.total_return_qty)} isLoading={overviewLoading} />
                <StatCard icon={Receipt} title="With Receipt" value={overviewLoading ? "..." : fmtQty(cards.total_with_ref)} isLoading={overviewLoading} />
                <StatCard icon={ReceiptText} title="Without Receipt" value={overviewLoading ? "..." : fmtQty(cards.total_without_ref)} isLoading={overviewLoading} />
            </div>

            {/* Sub-tabs + table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <Tabs tabs={subTabs} activeTab={activeSubTab} onChange={setActiveSubTab} />
                </div>

                {activeSubTab === "storewise" && (
                    <DataTable
                        columns={storeColumns}
                        title=""
                        apiUrl={EX_ENDPOINTS.storewiseTable}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {activeSubTab === "transactions" && (
                    <DataTable
                        columns={txnColumns}
                        title=""
                        apiUrl={EX_ENDPOINTS.transactionsTable}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}
            </div>
        </div>
    );
};

export default RetailExchanges;
