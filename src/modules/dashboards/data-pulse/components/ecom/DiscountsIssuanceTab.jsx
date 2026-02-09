// @modules/dashboards/data-pulse/components/ecom/DiscountsIssuanceTab.jsx
import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { BadgePercent, Wallet, Users, Ticket, Percent, FileText } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const nfMoney0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }); // ✅ no decimals

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

// ✅ keep same currency mapping used in your overview
function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

const GRADIENTS = {
    coupon: "bg-gradient-to-br from-black to-black",
    store: "bg-gradient-to-br from-black to-green",
};

const CardShell = ({ title, icon: Icon, gradient, children }) => (
    <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden ${gradient} h-full`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {Icon ? <Icon size={20} className="text-white" /> : null}
                    {title}
                </h3>

                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    {/* keep this slot like Dispatch */}
                    <FileText size={18} className="text-white" />
                </div>
            </div>

            {children}
        </div>
    </div>
);

function MiniKpiCard({ title, Icon, value, subtitle, loading }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-4 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                {Icon ? <Icon size={18} className="text-white" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="space-y-2">
                    <PulseScan />
                </div>
            ) : (
                <>
                    <p className="text-xl font-bold text-white tabular-nums">{value ?? "-"}</p>
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                        {subtitle ?? "\u00A0"}
                    </p>
                </>
            )}
        </div>
    );
}

const DiscountsIssuanceTab = ({ enabled, filters, cache, formatAmount }) => {
    const { data, isLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/discounts/metrics/",
        { ...filters, key: "all" },
        { enabled, ...(cache || {}) }
    );

    const isPK = String(filters?.country || "PK").toUpperCase() === "PK";
    const fallbackCurrency = useMemo(() => getCurrencyByCountry(filters?.country), [filters?.country]);

    const dmRows = data?.discount_methods?.rows || [];
    const uniqueCustomers = toNum(data?.unique_customers?.summary?.total_unique_customers || 0);

    const storeCreditSummary = data?.store_credit?.summary || {};
    const storeCreditCases = toNum(storeCreditSummary?.case_count || 0);
    const storeCreditCustomers = toNum(storeCreditSummary?.customers_count || 0);
    const storeCreditAmount =
        toNum(storeCreditSummary?.Store_Credit_Amount) || toNum(storeCreditSummary?.store_credit_amount);

    const couponStats = useMemo(() => {
        const rows = Array.isArray(dmRows) ? dmRows : [];
        const norm = (s) => String(s || "").trim().toLowerCase();

        const totalRows = rows.filter((r) => norm(r?.Discount_Method__c) === "total amount");
        const amountRows = rows.filter((r) => norm(r?.Discount_Method__c) === "amount");
        const pctRows = rows.filter((r) => !["amount", "total amount"].includes(norm(r?.Discount_Method__c)));

        const sumBy = (arr, key) => arr.reduce((acc, r) => acc + toNum(r?.[key]), 0);

        const totalAmount = totalRows.length > 0 ? sumBy(totalRows, "total_amount") : sumBy(rows, "total_amount");
        const totalCount = totalRows.length > 0 ? sumBy(totalRows, "total_count") : sumBy(rows, "total_count");

        const amountCount = sumBy(amountRows, "total_count");
        const pctCount = sumBy(pctRows, "total_count");

        const amountPct = totalCount > 0 ? (amountCount / totalCount) * 100 : 0;
        const pctPct = totalCount > 0 ? (pctCount / totalCount) * 100 : 0;

        const currencies = new Set(rows.map((r) => r?.CurrencyIsoCode).filter(Boolean));
        const currencyLabel = currencies.size === 1 ? [...currencies][0] : null;

        return { currencyLabel, totalAmount, totalCount, amountCount, pctCount, amountPct, pctPct };
    }, [dmRows]);

    if (!enabled) return null;

    const currency = couponStats.currencyLabel || fallbackCurrency;

    const money = (n) => `${currency} ${formatAmount ? formatAmount(toNum(n)) : nfMoney0.format(toNum(n))}`;
    const num0 = (n) => nf0.format(toNum(n));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* ✅ Coupon (left) */}
            <div className="lg:col-span-6">
                <CardShell title="Coupon" icon={BadgePercent} gradient={GRADIENTS.coupon}>
                    {/* Top big number like Total Dispatch */}
                    <div className="mb-4">
                        {isLoading ? (
                            <div className="mt-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total Amount</p>
                                <p className="text-4xl font-bold text-white tabular-nums">
                                    {money(couponStats.totalAmount)}
                                </p>
                                {!isPK ? (
                                    <p className="text-xs text-amber-300 mt-2">
                                        Note: This endpoint returns data only for PK.
                                    </p>
                                ) : null}
                            </>
                        )}
                    </div>

                    {/* ✅ sub-cards grid (like Total Dispatch 2x2) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        <MiniKpiCard
                            title="Total Count"
                            Icon={Ticket}
                            value={num0(couponStats.totalCount)}
                            loading={isLoading}
                        />

                        <MiniKpiCard
                            title="Unique Customers"
                            Icon={Users}
                            value={num0(uniqueCustomers)}
                            loading={isLoading}
                        />

                        <MiniKpiCard
                            title="Amount Coupons"
                            Icon={BadgePercent}
                            value={num0(couponStats.amountCount)}
                            loading={isLoading}
                        />

                        <MiniKpiCard
                            title="Percentage Coupons"
                            Icon={Percent}
                            value={num0(couponStats.pctCount)}
                            loading={isLoading}
                        />
                    </div>
                </CardShell>
            </div>

            {/* ✅ Store Credit (right) */}
            <div className="lg:col-span-6">
                <CardShell title="Store Credit" icon={Wallet} gradient={GRADIENTS.store}>
                    {/* Top big number like Total Dispatch */}
                    <div className="mb-4">
                        {isLoading ? (
                            <div className="mt-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Store Credit Amount</p>
                                <p className="text-4xl font-bold text-white tabular-nums">
                                    {money(storeCreditAmount)}
                                </p>
                                {!isPK ? (
                                    <p className="text-xs text-amber-300 mt-2">
                                        Note: This endpoint returns data only for PK.
                                    </p>
                                ) : null}
                            </>
                        )}
                    </div>

                    {/* ✅ sub-cards (2 items like dispatch style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        <MiniKpiCard
                            title="Number of Cases"
                            Icon={FileText}
                            value={num0(storeCreditCases)}
                            loading={isLoading}
                        />

                        <MiniKpiCard
                            title="Number of Customers"
                            Icon={Users}
                            value={num0(storeCreditCustomers)}
                            loading={isLoading}
                        />
                    </div>
                </CardShell>
            </div>
        </div>
    );
};

export default DiscountsIssuanceTab;
