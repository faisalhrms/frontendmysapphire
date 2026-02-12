import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import {
    TrendingUp,
    TrendingDown,
    Hash,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
} from "lucide-react";

import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

const GC_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/gift-cards/overview/",
    issuanceTable: "/dashboard/data-pulse/retail/gift-cards/issuance/datatable/",
    redemptionTable: "/dashboard/data-pulse/retail/gift-cards/redemption/datatable/",
    balanceTable: "/dashboard/data-pulse/retail/gift-cards/balance/datatable/",
};


const fmtMoney = (v) => `PKR ${formatRoundedAmountWithCommas(Number(v) || 0)}`;
const fmtInt = (v) => (Number(v) || 0).toLocaleString("en-US");

const GiftCards = ({ filters, enabled }) => {

    const tabs = useMemo(
        () => [
            { id: "issuance", label: "Issuance", icon: ArrowUpRight },
            { id: "redemption", label: "Redemption", icon: ArrowDownLeft },
            { id: "balance", label: "Liability / Balance", icon: CreditCard },
        ],
        []
    );


    const [activeTab, setActiveTab] = useState("issuance");

    const { data: overviewResp, isLoading: overviewLoading } = useFetchWithFilters(
        GC_ENDPOINTS.overview,
        filters,
        { enabled: !!enabled }
    );

    const cards = overviewResp || {};

    const issuanceColumns = useMemo(
        () => [
            {
                Header: "Card #",
                accessor: "cardnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "Amount",
                accessor: "amount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => fmtMoney(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Txn #",
                accessor: "transactionnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,

            },

            // ✅ CORRECT FIELD: t2.RRECEIPTID
            {
                Header: "Receipt ID",
                accessor: "rreceiptid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },

            // ✅ NEW: store info
            {
                Header: "Store ID",
                accessor: "warehouse",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 100,
            },
            {
                Header: "Store Name",
                accessor: "warehousename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 100,
            },

            {
                Header: "Txn Date",
                accessor: "transactiondate",
                disableSortBy: false,
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
        ],
        []
    );

    const redemptionColumns = useMemo(
        () => [
            {
                Header: "Card #",
                accessor: "cardnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },
            {
                Header: "Amount",
                accessor: "amount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => fmtMoney(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 100,
            },
            {
                Header: "Txn #",
                accessor: "transactionnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,

            },

            // ✅ CORRECT FIELD: t2.RRECEIPTID
            {
                Header: "Receipt ID",
                accessor: "rreceiptid",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 100,
            },

            // ✅ NEW: store info
            {
                Header: "Store ID",
                accessor: "warehouse",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 100,
            },
            {
                Header: "Store Name",
                accessor: "warehousename",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-semibold" }),
                width: 100,
            },

            {
                Header: "Txn Date",
                accessor: "transactiondate",
                disableSortBy: false,
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 100,
            },
        ],
        []
    );

    const balanceColumns = useMemo(
        () => [
            {
                Header: "Gift Card #",
                accessor: "giftcardnumber",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 140,
            },
            {
                Header: "Currency",
                accessor: "currency",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 80,
            },
            {
                Header: "Creation Date",
                accessor: "creationdate",
                disableSortBy: false,
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "-"),
                getCellProps: () => ({ className: "!text-left" }),
                width: 120,
            },
            {
                Header: "Net Sales",
                accessor: "netsalesamount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => fmtMoney(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 120,
            },
            {
                Header: "Net Redeemed",
                accessor: "netredeemedamount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => fmtMoney(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 120,
            },
            {
                Header: "Current Balance",
                accessor: "currentbalance",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => fmtMoney(value),
                getCellProps: () => ({ className: "!text-right tabular-nums font-bold" }),
                width: 130,
            },
            {
                Header: "Legal Entity",
                accessor: "legalentity",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 90,
            },
        ],
        []
    );


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={Wallet}
                    title="Total Issuance Amount"
                    value={overviewLoading ? "..." : fmtMoney(cards.total_issuance_amount)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Hash}
                    title="Total Issuance Transactions"
                    value={overviewLoading ? "..." : fmtInt(cards.total_issuance_transactions)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={TrendingDown}
                    title="Total Redemption Amount"
                    value={overviewLoading ? "..." : fmtMoney(cards.total_redemption_amount)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={TrendingUp}
                    title="Total Redemption Transactions"
                    value={overviewLoading ? "..." : fmtInt(cards.total_redemption_transactions)}
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={CreditCard}
                    title="Total Gift Card Liability"
                    subtitle="Current Balance (All Time)"
                    value={overviewLoading ? "..." : fmtMoney(cards.total_giftcard_liability)}
                    isLoading={overviewLoading}
                />

            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((m) => {
                            const Icon = m.icon;
                            const active = activeTab === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveTab(m.id)}
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

                {activeTab === "issuance" && (
                    <DataTable
                        columns={issuanceColumns}
                        title=""
                        apiUrl={GC_ENDPOINTS.issuanceTable}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {activeTab === "redemption" && (
                    <DataTable
                        columns={redemptionColumns}
                        title=""
                        apiUrl={GC_ENDPOINTS.redemptionTable}
                        needHeader={false}
                        enableAdvancedFilters={false}
                        filter={filters}
                        hideUrlParams={true}
                    />
                )}

                {activeTab === "balance" && (
                    <DataTable
                        columns={balanceColumns}
                        title=""
                        apiUrl={GC_ENDPOINTS.balanceTable}
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

export default GiftCards;
