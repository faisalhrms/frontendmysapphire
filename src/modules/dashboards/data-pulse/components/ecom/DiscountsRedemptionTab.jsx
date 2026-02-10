// @modules/dashboards/data-pulse/components/ecom/DiscountsRedemptionTab.jsx
import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import ReChart from "@components/charts/ReChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

import { BadgePercent, Landmark, ArrowUpRight, Wallet } from "lucide-react";

const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

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

function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

const GRADIENTS = {
    redemption: "bg-gradient-to-br from-slate-950 to-slate-700",
    coupon: "bg-gradient-to-br from-black to-black",
    employee: "bg-gradient-to-br from-emerald-950 to-emerald-700",
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

const CardShell = ({ gradient, title, Icon, onNav, children }) => (
    <div className={`${gradient} rounded-xl shadow-lg p-6 relative overflow-hidden h-full flex flex-col`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Icon size={20} className="text-white" />
                    {title}
                </h3>
                {onNav ? <ArrowNavButton onClick={onNav} /> : null}
            </div>

            <div className="flex-1">{children}</div>
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
                                    formatAmount,
                                    setActiveTab,
                                }) => {
    const { data: topCouponsResp, isLoading: topCouponsLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/coupons/",
        filters,
        { enabled, ...cache }
    );

    const { data: empResp, isLoading: empLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/orders/amount-orders-customers/",
        filters,
        { enabled, ...cache }
    );

    const { data: topStoreCreditResp, isLoading: topStoreCreditLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/store-credit/",
        filters,
        { enabled, ...cache }
    );

    const couponsPayload = useMemo(() => unwrapPayload(topCouponsResp), [topCouponsResp]);
    const empPayload = useMemo(() => unwrapPayload(empResp), [empResp]);
    const scPayload = useMemo(() => unwrapPayload(topStoreCreditResp), [topStoreCreditResp]);

    const couponRows = useMemo(() => pickRows(couponsPayload), [couponsPayload]);
    const scRows = useMemo(() => pickRows(scPayload), [scPayload]);

    const couponSummary = useMemo(() => pickSummary(couponsPayload), [couponsPayload]);
    const empSummary = useMemo(() => pickSummary(empPayload), [empPayload]);
    const scSummary = useMemo(() => pickSummary(scPayload), [scPayload]);

    const currency = useMemo(() => getCurrencyByCountry(filters?.country), [filters?.country]);
    const money = (n) => `${currency} ${formatAmount ? formatAmount(toNum(n)) : toNum(n).toLocaleString()}`;

    // Coupon
    const totalCouponAmount = toNum(couponSummary?.total_coupon_amount);
    const couponTotalOrders = toNum(couponSummary?.total_orders);
    const couponUniqueCustomers = toNum(couponSummary?.unique_customers);

    // Employee (you are showing discount as amount in card)
    const empTotalDiscountAmount = toNum(empSummary?.total_discount_amount);
    const empTotalOrders = toNum(empSummary?.total_orders);
    const empUniqueCustomers = toNum(empSummary?.unique_customers);

    // Store Credit
    const scTotal = toNum(scSummary?.total_store_credit_amount);
    const scUniqueOrders = toNum(scSummary?.unique_orders);
    const scUniqueCustomers = toNum(scSummary?.unique_customers || scSummary?.unique_accounts);

    // ✅ Redemption totals (sum)
    const redemptionTotalAmount = totalCouponAmount + empTotalDiscountAmount + scTotal;
    const redemptionTotalOrders = couponTotalOrders + empTotalOrders + scUniqueOrders;

    const redemptionLoading = topCouponsLoading || empLoading || topStoreCreditLoading;

    // Charts
    const chartStoreCredit = useMemo(() => {
        const safe = Array.isArray(scRows) ? scRows : [];
        return [...safe]
            .map((r) => ({
                name: r?.OrderNumber || r?.order_number || "-",
                value: toNum(r?.store_credit_amount),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [scRows]);

    const chartCoupons = useMemo(() => {
        const safe = Array.isArray(couponRows) ? couponRows : [];
        return [...safe]
            .map((r) => ({
                name: r?.coupon_code || r?.order_number || r?.OrderNumber || "-",
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
            {/* ✅ SINGLE Redemption card: totals (BIG TEXT) + 3 cards inside */}
            <CardShell
                gradient={GRADIENTS.redemption}
                title="Redemption"
                Icon={BadgePercent}
                onNav={setActiveTab ? () => setActiveTab("promos") : null}
            >
                <div className="space-y-6">
                    {/* ✅ BIG TEXT totals (no extra inner card box) */}
                    {redemptionLoading ? (
                        <div className="space-y-3">
                            <PulseScan />
                            <PulseScan />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-white/70">Total Amount</p>
                                <p className="text-4xl font-bold text-white tabular-nums">{money(redemptionTotalAmount)}</p>
                            </div>

                            <div>
                                <p className="text-xs text-white/70">Total Orders</p>
                                <p className="text-4xl font-bold text-white tabular-nums">{NF0.format(redemptionTotalOrders)}</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ THREE cards row BELOW totals (inside the same Redemption card) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Coupon */}
                        <div className="lg:col-span-4">
                            <CardShell
                                gradient={GRADIENTS.coupon}
                                title="Coupon"
                                Icon={BadgePercent}
                                onNav={setActiveTab ? () => setActiveTab("promos") : null}
                            >
                                <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
                                    {topCouponsLoading ? (
                                        <div className="space-y-2">
                                            <PulseScan />
                                            <PulseScan />
                                        </div>
                                    ) : (
                                        <>
                                            <StatLine label="Total Amount" value={money(totalCouponAmount)} />
                                            <StatLine label="Total Orders" value={NF0.format(couponTotalOrders)} />
                                            <StatLine label="Unique Customers" value={NF0.format(couponUniqueCustomers)} />
                                        </>
                                    )}
                                </div>
                            </CardShell>
                        </div>

                        {/* Employee */}
                        <div className="lg:col-span-4">
                            <CardShell
                                gradient={GRADIENTS.employee}
                                title="Employee Card"
                                Icon={Landmark}
                                onNav={setActiveTab ? () => setActiveTab("promos") : null}
                            >
                                <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
                                    {empLoading ? (
                                        <div className="space-y-2">
                                            <PulseScan />
                                            <PulseScan />
                                        </div>
                                    ) : (
                                        <>
                                            <StatLine label="Total Amount" value={money(empTotalDiscountAmount)} />
                                            <StatLine label="Total Orders" value={NF0.format(empTotalOrders)} />
                                            <StatLine label="Unique Customers" value={NF0.format(empUniqueCustomers)} />
                                        </>
                                    )}
                                </div>
                            </CardShell>
                        </div>

                        {/* Store Credit */}
                        <div className="lg:col-span-4">
                            <CardShell
                                gradient={GRADIENTS.storeCredit}
                                title="Store Credit"
                                Icon={Wallet}
                                onNav={setActiveTab ? () => setActiveTab("promos") : null}
                            >
                                <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
                                    {topStoreCreditLoading ? (
                                        <div className="space-y-2">
                                            <PulseScan />
                                            <PulseScan />
                                        </div>
                                    ) : (
                                        <>
                                            <StatLine label="Total Amount" value={money(scTotal)} />
                                            <StatLine label="Unique Orders" value={NF0.format(scUniqueOrders)} />
                                            <StatLine label="Unique Customers" value={NF0.format(scUniqueCustomers)} />
                                        </>
                                    )}
                                </div>
                            </CardShell>
                        </div>
                    </div>
                </div>
            </CardShell>

            {/* ✅ Coupon graph first */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BadgePercent size={20} />
                        Top Coupons
                    </h3>
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

            {/* ✅ Store Credit graph second */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wallet size={20} />
                        Top Store Credit
                    </h3>
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
        </div>
    );
};

export default DiscountsRedemptionTab;
