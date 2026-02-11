import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

import {
    Truck,
    RefreshCcw,
    PackageOpen,
    ArrowRightLeft,
    Clock,
    Warehouse,
    Wallet,
    Tag
} from "lucide-react";

const INV_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/inventory/overview/",
    transfers_bgd_table: "/dashboard/data-pulse/retail/inventory/transfers/bgd/datatable/",
    movement_table: "/dashboard/data-pulse/retail/inventory/movement/datatable/",
    ship_aging_table: "/dashboard/data-pulse/retail/inventory/transfers/ship-aging/datatable/",
    receive_aging_table: "/dashboard/data-pulse/retail/inventory/transfers/receive-aging/datatable/",
    itemPricesTable: "/dashboard/data-pulse/retail/inventory/item-prices/datatable/", // ✅ NEW
};

const fmtMoney = (v) => `PKR ${formatRoundedAmountWithCommas(Number(v) || 0)}`;
const fmtInt = (v) => formatRoundedAmountWithCommas(Number(v) || 0);

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

const RetailInventory = ({ filters, enabled }) => {
    const tabs = useMemo(
        () => [
            { id: "bgd", label: "Transfers to B-Grade", icon: Truck },
            { id: "movement", label: "Inventory Movement Journal", icon: RefreshCcw },
            { id: "shipAging", label: "Ship Aging", icon: Clock },
            { id: "receiveAging", label: "Receive Aging", icon: PackageOpen },
            // { id: "prices", label: "Item Prices", icon: Tag },
        ],
        []
    );

    const [activeTab, setActiveTab] = useState("bgd");

    const { data: overviewResp, isLoading: overviewLoading } = useFetchWithFilters(
        INV_ENDPOINTS.overview,
        filters,
        { enabled: !!enabled }
    );

    const summary = overviewResp?.summary || {};

    const itemPricesColumns = useMemo(
        () => [
            {
                Header: "Data Area",
                accessor: "dataareaid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Item #",
                accessor: "itemnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "Barcode",
                accessor: "barcode",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Sales Price (TA)",
                accessor: "salesprice",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(value || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
            },
        ],
        []
    );


    const transfersBGDColumns = useMemo(
        () => [
            {
                Header: "Data Area",
                accessor: "dataareaid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Transfer ID",
                accessor: "transferid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "From",
                accessor: "inventlocationidfrom",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "To",
                accessor: "inventlocationidto",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Status",
                accessor: "transferorderstatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
            },
        ],
        []
    );

    const movementColumns = useMemo(
        () => [
            {
                Header: "Journal #",
                accessor: "journalnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "Warehouse",
                accessor: "inventorywarehouseid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Item Number",
                accessor: "itemnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Txn Date",
                accessor: "transactiondate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
            },
            {
                Header: "Total Qty",
                accessor: "totalinventoryqty",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
            },
        ],
        []
    );

    const agingColumns = useMemo(
        () => [
            {
                Header: "Transfer ID",
                accessor: "transferid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 100,
            },
            {
                Header: "From",
                accessor: "inventlocationidfrom",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "To",
                accessor: "inventlocationidto",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "Qty Transfer",
                accessor: "qtytransfer",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Qty Shipped",
                accessor: "qtyshipped",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Qty Received",
                accessor: "qtyreceived",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Created",
                accessor: "createddate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
            {
                Header: "Ship Date",
                accessor: "shipdate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
            {
                Header: "Receive Date",
                accessor: "receivedate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
            {
                Header: "Ship Aging (Days)",
                accessor: "aging_shipdays",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Receive Aging (Days)",
                accessor: "aging_receivedays",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={ArrowRightLeft}
                    title="Transfers to BGD (Total TO's)"
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_total)}
                    isLoading={overviewLoading}
                />
                <StatCard
                    icon={Warehouse}
                    title="BGD Shipped (Total TO's)"
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_shipped)}
                    isLoading={overviewLoading}
                />
                <StatCard
                    icon={PackageOpen}
                    title="BGD Received (Total TO's)"
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_received)}
                    isLoading={overviewLoading}
                />
                <StatCard
                    icon={RefreshCcw}
                    title="Unique Movement Journals"
                    value={overviewLoading ? "..." : fmtInt(summary.movement_journals_count)}
                    isLoading={overviewLoading}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                {/* Transfers to BGD */}
                {activeTab === "bgd" && (
                    <DataTable
                        columns={transfersBGDColumns}
                        title=""
                        apiUrl={INV_ENDPOINTS.transfers_bgd_table}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {/* Movement journal */}
                {activeTab === "movement" && (
                    <DataTable
                        columns={movementColumns}
                        title=""
                        apiUrl={INV_ENDPOINTS.movement_table}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {/* Ship aging */}
                {activeTab === "shipAging" && (
                    <DataTable
                        columns={agingColumns}
                        title=""
                        apiUrl={INV_ENDPOINTS.ship_aging_table}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {/* Receive aging */}
                {activeTab === "receiveAging" && (
                    <DataTable
                        columns={agingColumns}
                        title=""
                        apiUrl={INV_ENDPOINTS.receive_aging_table}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}
                {/*{activeTab === "prices" && (*/}
                {/*    <DataTable*/}
                {/*        columns={itemPricesColumns}*/}
                {/*        title=""*/}
                {/*        apiUrl={INV_ENDPOINTS.itemPricesTable}*/}
                {/*        needHeader={false}*/}
                {/*        enableAdvancedFilters={false}*/}
                {/*        filter={filters}*/}
                {/*        hideUrlParams={true}*/}
                {/*    />*/}
                {/*)}*/}

            </div>
        </div>
    );
};

export default RetailInventory;
