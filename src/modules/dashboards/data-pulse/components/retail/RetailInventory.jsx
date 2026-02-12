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
    Tag,
    BadgePercent,
    Store,
    Layers,
    Barcode,
} from "lucide-react";

const INV_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/inventory/overview/",
    transfers_bgd_table: "/dashboard/data-pulse/retail/inventory/transfers/bgd/datatable/",
    movement_table: "/dashboard/data-pulse/retail/inventory/movement/datatable/",
    ship_aging_table: "/dashboard/data-pulse/retail/inventory/transfers/ship-aging/datatable/",
    receive_aging_table: "/dashboard/data-pulse/retail/inventory/transfers/receive-aging/datatable/",
    itemPricesTable: "/dashboard/data-pulse/retail/inventory/item-prices/datatable/",
    activeDiscountsTable: "/dashboard/data-pulse/retail/inventory/active-discounts/datatable/", // ✅ NEW
};

const fmtInt = (v) => formatRoundedAmountWithCommas(Number(v) || 0);

const withFilterTag = (subtitle, tag) => `${subtitle} • ${tag}`;

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
            { id: "activeDiscounts", label: "Active Discounts", icon: BadgePercent },
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

    const transfersBGDColumns = useMemo(
        () => [
            {
                Header: "Transfer Order #",
                accessor: "transferorderid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "From ID",
                accessor: "fromlocationid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "From Name",
                accessor: "fromlocationname",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left" }),
            },
            {
                Header: "To ID",
                accessor: "tolocationid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "To Name",
                accessor: "tolocationname",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left" }),
            },
            {
                Header: "Status",
                accessor: "transferorderstatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
            },
            {
                Header: "Item ID",
                accessor: "itemid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Qty",
                accessor: "quantity",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
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

    const shipAgingColumns = useMemo(
        () => [
            {
                Header: "Transfer ID",
                accessor: "transferid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 120,
            },
            {
                Header: "From",
                accessor: "fromlocation",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 90,
            },
            {
                Header: "To",
                accessor: "tolocation",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 90,
            },
            {
                Header: "Qty Created",
                accessor: "qtycreated",
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
                width: 110,
            },
            {
                Header: "Created Date",
                accessor: "createddate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "First Ship Date",
                accessor: "shipdate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "TO Status",
                accessor: "transferorderstatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 120,
            },
            {
                Header: "Shipment Status",
                accessor: "shipmentstatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 140,
            },
            {
                Header: "Aging (Create→Ship) Days",
                accessor: "aging_createtoship_days",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 160,
            },
        ],
        []
    );

    const receiveAgingColumns = useMemo(
        () => [
            {
                Header: "Transfer ID",
                accessor: "transferid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 120,
            },
            {
                Header: "From",
                accessor: "fromlocation",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 90,
            },
            {
                Header: "To",
                accessor: "tolocation",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 90,
            },
            {
                Header: "Qty Created",
                accessor: "qtycreated",
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
                width: 110,
            },
            {
                Header: "Created Date",
                accessor: "createddate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "First Ship Date",
                accessor: "shipdate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "First Receive Date",
                accessor: "receivedate",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 130,
            },
            {
                Header: "TO Status",
                accessor: "transferorderstatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 120,
            },
            {
                Header: "Receive Status",
                accessor: "receivestatus",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 140,
            },
            {
                Header: "Aging (Ship→Receive) Days",
                accessor: "aging_shiptoreceive_days",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => fmtInt(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 170,
            },
        ],
        []
    );

    const activeDiscountsColumns = useMemo(
        () => [
            {
                Header: "Offer ID",
                accessor: "offerid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 120,
            },
            {
                Header: "Discount Name",
                accessor: "discountname",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left" }),
                width: 240,
            },
            {
                Header: "Status",
                accessor: "status",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 110,
            },
            {
                Header: "Valid From",
                accessor: "validfrom",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "Valid To",
                accessor: "validto",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "Price Group",
                accessor: "pricegroup",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 120,
            },
            {
                Header: "Store Name",
                accessor: "storename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left" }),
                width: 220,
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={ArrowRightLeft}
                    title="Transfers to BGD"
                    subtitle={withFilterTag("Total Transfer Orders", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_total_to)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Warehouse}
                    title="BGD Shipped"
                    subtitle={withFilterTag("Transfer Orders", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_shipped_to)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={PackageOpen}
                    title="BGD Received"
                    subtitle={withFilterTag("Transfer Orders", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_received_to)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Truck}
                    title="BGD Lines"
                    subtitle={withFilterTag("Total Transfer Lines", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_total_lines)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Tag}
                    title="BGD Items"
                    subtitle={withFilterTag("Distinct Item IDs", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_distinct_items)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Wallet}
                    title="BGD Quantity"
                    subtitle={withFilterTag("Total Qty (Lines)", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.transfers_to_bgd_total_qty)}
                    isLoading={overviewLoading}
                />

                {/* Movement - DATE filter */}
                <StatCard
                    icon={RefreshCcw}
                    title="Movement Journals"
                    subtitle={withFilterTag("Unique Journals", "Date filtered")}
                    value={overviewLoading ? "..." : fmtInt(summary.movement_journals_count)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={PackageOpen}
                    title="Movement Qty"
                    subtitle={withFilterTag("Total Quantity", "Date filtered")}
                    value={overviewLoading ? "..." : fmtInt(summary.movement_qty_total)}
                    isLoading={overviewLoading}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={BadgePercent}
                    title="Active Discounts"
                    subtitle={withFilterTag("Distinct Offer IDs", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.active_discounts_count)}
                    isLoading={overviewLoading}
                    variant="blackIndigo"
                />

                <StatCard
                    icon={Store}
                    title="Discount Stores"
                    subtitle={withFilterTag("Distinct Stores", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.active_discounts_store_count)}
                    isLoading={overviewLoading}
                    variant="blackGreen"
                />

                <StatCard
                    icon={Layers}
                    title="Discount Price Groups"
                    subtitle={withFilterTag("Distinct Price Groups", "No date filter")}
                    value={overviewLoading ? "..." : fmtInt(summary.active_discounts_pricegroup_count)}
                    isLoading={overviewLoading}
                    variant="blackBlue"
                />
            </div>

                {/* Tabs + Tables */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}/>
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

                    {/* Movement journal (date filtered by backend) */}
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
                            columns={shipAgingColumns}
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
                            columns={receiveAgingColumns}
                            title=""
                            apiUrl={INV_ENDPOINTS.receive_aging_table}
                            needHeader={false}
                            enableAdvancedFilters={false}
                            filter={filters}
                            hideUrlParams={true}
                        />
                    )}

                    {/* Active Discounts */}
                    {activeTab === "activeDiscounts" && (
                        <DataTable
                            columns={activeDiscountsColumns}
                            title=""
                            apiUrl={INV_ENDPOINTS.activeDiscountsTable}
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

            export default RetailInventory;
