import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import ReChart from "@components/charts/ReChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

import { BadgePercent, Landmark, ArrowUpRight, Wallet } from "lucide-react";

const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const unwrapPayload = (resp) => {
    if (!resp) return {};
    if (resp?.data?.summary || resp?.data?.rows || resp?.data?.meta) return resp.data;
    return resp;
};

const pickRows = (payload) => payload?.rows || [];
const pickMeta = (payload) => payload?.meta || {};
const pickSummary = (payload) => payload?.summary || pickMeta(payload)?.summary || {};

// ✅ keep same currency mapping used elsewhere
function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

const GRADIENTS = {
    promo: "bg-gradient-to-br from-black to-black",
    employee: "bg-gradient-to-br from-black to-emerald-700",
    storeCredit: "bg-gradient-to-br from-black to-blue",
};

function ArrowNavButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.();
            }}
            className="bg-white/20 p-2 rounded-lg backdrop-blur-sm hover:bg-white/25 transition"
            aria-label="Open details"
            title="Open details"
        >
            <ArrowUpRight size={22} className="text-white" />
        </button>
    );
}

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <BadgePercent size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

const CardShell = ({
                       gradient,
                       title,
                       Icon,
                       loading,
                       totalLabel,
                       totalValue,
                       subtitle,
                       onNav,
                       children,
                   }) => (
    <div className={`${gradient} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Icon size={20} className="text-white" />
                    {title}
                </h3>
                {onNav ? <ArrowNavButton onClick={onNav} /> : null}
            </div>

            <div className="mb-4">
                {loading ? (
                    <div className="mt-2">
                        <PulseScan />
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-white/70 mt-1 tabular-nums">{totalLabel}</p>
                        <p className="text-4xl font-bold text-white tabular-nums">{totalValue}</p>
                        {subtitle ? (
                            <p className="text-xs text-white/70 mt-1 tabular-nums">{subtitle}</p>
                        ) : null}
                    </>
                )}
            </div>

            {children}
        </div>
    </div>
);

const StatLine = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
        <div className="text-xs text-white/70">{label}</div>
        <div className="text-sm font-semibold text-white tabular-nums">{value}</div>
    </div>
);

const DiscountsRedemptionTab = ({
                                    enabled,
                                    filters,
                                    cache,
                                    colors,
                                    formatAmount, // formatRoundedAmountWithCommas
                                    setActiveTab, // optional, for arrow nav
                                }) => {
    // ✅ Coupons
    const { data: topCouponsResp, isLoading: topCouponsLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/coupons/",
        filters,
        { enabled, ...cache }
    );

    // ✅ NEW: Employee Card endpoint
    const { data: employeeResp, isLoading: employeeLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/orders/amount-orders-customers/",
        filters,
        { enabled, ...cache }
    );

    // ✅ Store Credit (kept as-is)
    const { data: topStoreCreditResp, isLoading: topStoreCreditLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/store-credit/",
        filters,
        { enabled, ...cache }
    );

    const couponsPayload = useMemo(() => unwrapPayload(topCouponsResp), [topCouponsResp]);
    const empPayload = useMemo(() => unwrapPayload(employeeResp), [employeeResp]);
    const scPayload = useMemo(() => unwrapPayload(topStoreCreditResp), [topStoreCreditResp]);

    const couponRows = useMemo(() => pickRows(couponsPayload), [couponsPayload]);
    const scRows = useMemo(() => pickRows(scPayload), [scPayload]);

    const couponSummary = useMemo(() => pickSummary(couponsPayload), [couponsPayload]);
    const empSummary = useMemo(() => pickSummary(empPayload), [empPayload]);
    const scSummary = useMemo(() => pickSummary(scPayload), [scPayload]);

    // -----------------------------
    // Coupon summary (from backend)
    // -----------------------------
    const totalCouponAmount = toNum(couponSummary?.total_coupon_amount);
    const totalPaymentAmount = toNum(couponSummary?.total_payment_amount);
    const totalPaid = toNum(couponSummary?.total_paid);
    const totalOrders = toNum(couponSummary?.total_orders);
    const uniqueCustomers = toNum(couponSummary?.unique_customers);

    // -----------------------------
    // Employee Card summary (NEW endpoint)
    // -----------------------------
    const empTotalAmount = toNum(empSummary?.total_amount);
    const empTotalOrders = toNum(empSummary?.total_orders);
    const empUniqueCustomers = toNum(empSummary?.unique_customers);

    // -----------------------------
    // Store Credit Snapshot (kept from summary)
    // -----------------------------
    const scTotal = toNum(scSummary?.total_store_credit_amount);
    const scTxns = toNum(scSummary?.total_transactions);
    const scUniqueOrders = toNum(scSummary?.unique_orders);
    const scTop10Share = toNum(scSummary?.top10_share_percent_of_store_credit);

    // -----------------------------
    // Currency + formatters
    // -----------------------------
    const currency = useMemo(() => getCurrencyByCountry(filters?.country), [filters?.country]);
    const money = (n) =>
        `${currency} ${formatAmount ? formatAmount(toNum(n)) : toNum(n).toLocaleString()}`;

    // -----------------------------
    // Charts
    // -----------------------------
    const chartStoreCredit = useMemo(() => {
        const safe = Array.isArray(scRows) ? scRows : [];
        return [...safe]
            .map((r) => ({
                name: r?.OrderNumber || "-",
                value: toNum(r?.store_credit_amount),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [scRows]);

    const chartCoupons = useMemo(() => {
        const safe = Array.isArray(couponRows) ? couponRows : [];
        return [...safe]
            .map((r) => ({
                name: r?.coupon_code || r?.OrderNumber || "-",
                value: toNum(r?.coupon_amount),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [couponRows]);

    const anySC = chartStoreCredit.length > 0;
    const anyCoupons = chartCoupons.length > 0;

    if (!enabled) return null;

    return (
        <div className="space-y-6">
            <p className="text-rose-500">In Process</p>

            {/* ✅ Row 1: THREE overview-style cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ✅ Coupon Card */}
                <div className="lg:col-span-4">
                    <CardShell
                        gradient={GRADIENTS.promo}
                        title="Coupon"
                        Icon={BadgePercent}
                        loading={topCouponsLoading}
                        totalLabel="Total Coupon Amount"
                        totalValue={money(totalCouponAmount)}
                        onNav={setActiveTab ? () => setActiveTab("promos") : null}
                    >
                        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm">
                            {topCouponsLoading ? (
                                <div className="space-y-2">
                                    <PulseScan />
                                    <PulseScan />
                                </div>
                            ) : (
                                <>
                                    <StatLine label="Total Payment Amount" value={money(totalPaymentAmount)} />
                                    <StatLine label="Total Paid" value={money(totalPaid)} />
                                    <StatLine label="Total Orders" value={NF0.format(totalOrders)} />
                                    <StatLine label="Unique Customers" value={NF0.format(uniqueCustomers)} />
                                </>
                            )}
                        </div>
                    </CardShell>
                </div>

                {/* ✅ NEW: Employee Card (center) */}
                <div className="lg:col-span-4">
                    <CardShell
                        gradient={GRADIENTS.employee}
                        title="Employee Card"
                        Icon={Landmark}
                        loading={employeeLoading}
                        totalLabel="Total Amount"
                        totalValue={money(empTotalAmount)}
                        onNav={setActiveTab ? () => setActiveTab("promos") : null}
                    >
                        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm">
                            {employeeLoading ? (
                                <div className="space-y-2">
                                    <PulseScan />
                                    <PulseScan />
                                </div>
                            ) : (
                                <>
                                    <StatLine label="Total Orders" value={NF0.format(empTotalOrders)} />
                                    <StatLine label="Unique Customers" value={NF0.format(empUniqueCustomers)} />
                                </>
                            )}
                        </div>
                    </CardShell>
                </div>

                {/* ✅ Store Credit Card (right) */}
                <div className="lg:col-span-4">
                    <CardShell
                        gradient={GRADIENTS.storeCredit}
                        title="Store Credit"
                        Icon={Wallet}
                        loading={topStoreCreditLoading}
                        totalLabel="Total Store Credit"
                        totalValue={money(scTotal)}
                        onNav={setActiveTab ? () => setActiveTab("promos") : null}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                            <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Wallet size={18} className="text-white" />
                                        Transactions
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    {topStoreCreditLoading ? (
                                        <div className="space-y-2">
                                            <PulseScan />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold text-white tabular-nums">
                                                {NF0.format(scTxns)}
                                            </p>
                                            <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                                                {scTop10Share > 0
                                                    ? `Top10 Share: ${NF2.format(scTop10Share)}%`
                                                    : "\u00A0"}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Landmark size={18} className="text-white" />
                                        Unique Orders
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    {topStoreCreditLoading ? (
                                        <div className="space-y-2">
                                            <PulseScan />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold text-white tabular-nums">
                                                {NF0.format(scUniqueOrders)}
                                            </p>
                                            <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                                                Store credit orders
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </div>
            </div>

            {/* Store Credit bar graph */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wallet size={20} />
                        Store Credit (Top 10)
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <ArrowUpRight size={14} />
                        <span>Top 10 by Store Credit Amount</span>
                    </div>
                </div>

                {topStoreCreditLoading ? (
                    <LoadingSpinner />
                ) : !anySC ? (
                    <EmptyState />
                ) : (
                    <div className="h-[380px]">
                        <ReChart
                            data={chartStoreCredit}
                            variant="bar"
                            dimensions={{ height: 380, bottom: 0 }}
                            colors={colors}
                        />
                    </div>
                )}
            </div>

            {/* Coupon bar graph */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BadgePercent size={20} />
                        Coupons (Top 10)
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <ArrowUpRight size={14} />
                        <span>Top 10 by Coupon Amount</span>
                    </div>
                </div>

                {topCouponsLoading ? (
                    <LoadingSpinner />
                ) : !anyCoupons ? (
                    <EmptyState />
                ) : (
                    <div className="h-[380px]">
                        <ReChart
                            data={chartCoupons}
                            variant="bar"
                            dimensions={{ height: 380, bottom: 0 }}
                            colors={colors}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountsRedemptionTab;
