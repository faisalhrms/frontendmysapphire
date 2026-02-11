import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

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

import { Info, FileText, ShoppingCart, Wallet } from "lucide-react";

// ---------- helpers ----------
const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nfMoney0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

// ---------- UI bits ----------
const InfoPill = ({ text }) => (
    <div className="relative group">
        <div className="p-2 rounded-lg bg-white/15 border border-white/15 shadow-sm hover:shadow-md transition backdrop-blur-sm">
            <Info size={18} className="text-white" />
        </div>

        {/* tooltip */}
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition absolute right-0 mt-2 w-[320px] z-20">
            <div className="rounded-lg bg-gray-900 text-white text-xs p-3 shadow-lg">
                {text}
            </div>
        </div>
    </div>
);

const GRADIENTS = {
    main: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    cases: "bg-gradient-to-br from-indigo-700 to-indigo-950",
    orders: "bg-gradient-to-br from-emerald-700 to-emerald-950",
    amount: "bg-gradient-to-br from-amber-600 to-amber-950",
};

const CardShell = ({ title, subtitle, right, gradient, children }) => (
    <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden ${gradient}`}>
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-0" />
        <div className="absolute -bottom-14 -left-10 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    {subtitle ? (
                        <p className="text-xs text-white/70 mt-1">{subtitle}</p>
                    ) : null}
                </div>
                {right}
            </div>

            <div className="mt-5">{children}</div>
        </div>
    </div>
);

const MiniKpiCard = ({ title, Icon, value, subtitle, loading, gradient }) => (
    <div className={`rounded-xl shadow-lg p-4 relative overflow-hidden border border-white/10 ${gradient}`}>
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-10 -mt-10" />
        <div className="relative z-10">
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
                    <p className="text-2xl font-bold text-white tabular-nums">{value ?? "-"}</p>
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                        {subtitle ?? "\u00A0"}
                    </p>
                </>
            )}
        </div>
    </div>
);

const ChartTooltip = ({ active, payload, label, currency }) => {
    if (!active || !payload || payload.length === 0) return null;

    const map = Object.fromEntries(payload.map((p) => [p.dataKey, p.value]));
    const amount = toNum(map.total_amount);
    const cases = toNum(map.total_cases);
    const orders = toNum(map.total_orders);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs dark:bg-bodybg dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">{label}</div>

            <div className="text-gray-700 dark:text-gray-200 flex justify-between gap-6">
                <span>Total Amount</span>
                <span className="font-semibold tabular-nums">
                    {currency} {nfMoney0.format(amount)}
                </span>
            </div>

            <div className="text-gray-700 dark:text-gray-200 flex justify-between gap-6">
                <span>Total Cases</span>
                <span className="font-semibold tabular-nums">{nf0.format(cases)}</span>
            </div>

            <div className="text-gray-700 dark:text-gray-200 flex justify-between gap-6">
                <span>Total Orders</span>
                <span className="font-semibold tabular-nums">{nf0.format(orders)}</span>
            </div>
        </div>
    );
};

// ---------- main ----------
const CustomerCareRefunds = ({ data, loading, formatAmount }) => {
    if (loading) return <LoadingSpinner />;

    // response can be {data:{...}} or direct {...}
    const payload = data?.data ?? data ?? {};
    const rows = payload?.rows ?? [];
    const summary = payload?.summary ?? {};
    const meta = payload?.meta ?? {};

    const country = meta?.country || "PK";
    const currency = useMemo(() => getCurrencyByCountry(country), [country]);

    const totalCases = toNum(summary?.total_cases);
    const totalOrders = toNum(summary?.total_orders);
    const totalAmount = toNum(summary?.total_amount);

    const money = (n) =>
        `${currency} ${formatAmount ? formatAmount(toNum(n)) : nfMoney0.format(toNum(n))}`;

    // chart: group by return_event_date (day)
    const chartData = useMemo(() => {
        if (!Array.isArray(rows) || rows.length === 0) return [];

        const byDay = new Map();

        rows.forEach((r) => {
            const raw = String(r?.return_event_date || "");
            const day = raw ? raw.slice(0, 10) : "Unknown";

            if (!byDay.has(day)) {
                byDay.set(day, {
                    day,
                    total_amount: 0,
                    _cases: new Set(),
                    _orders: new Set(),
                });
            }

            const bucket = byDay.get(day);
            bucket.total_amount += toNum(r?.ibft_amount);
            if (r?.case_number) bucket._cases.add(String(r.case_number));
            if (r?.order_number) bucket._orders.add(String(r.order_number));
        });

        const out = [...byDay.values()].map((x) => ({
            day: x.day,
            total_amount: x.total_amount,
            total_cases: x._cases.size,
            total_orders: x._orders.size,
        }));

        out.sort((a, b) => String(a.day).localeCompare(String(b.day)));
        return out;
    }, [rows]);

    const infoText = "All cases where refund processed before reverse pick up punching.";

    return (
        <div className="space-y-6">
            {/* ✅ Main gradient card */}
            <CardShell
                title="Refunds Processed before punching"
                gradient={GRADIENTS.main}
                right={<InfoPill text={infoText} />}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    <MiniKpiCard
                        title="Total Cases"
                        Icon={FileText}
                        value={nf0.format(totalCases)}
                        loading={false}
                        gradient={GRADIENTS.cases}
                    />

                    <MiniKpiCard
                        title="Total Orders"
                        Icon={ShoppingCart}
                        value={nf0.format(totalOrders)}
                        loading={false}
                        gradient={GRADIENTS.orders}
                    />

                    <MiniKpiCard
                        title="Total Amount"
                        Icon={Wallet}
                        value={money(totalAmount)}
                        loading={false}
                        gradient={GRADIENTS.amount}
                    />
                </div>
            </CardShell>

            {/* ✅ Graph card (kept clean) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-bodybg dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            Refund Trend
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Daily totals based on return event date
                        </p>
                    </div>
                </div>

                {!isNonEmptyArray(chartData) ? (
                    <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm italic">
                        No Data Available
                    </div>
                ) : (
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" tickMargin={8} />
                                <YAxis tickMargin={8} tickFormatter={(v) => nf0.format(toNum(v))} />
                                <Tooltip content={(p) => <ChartTooltip {...p} currency={currency} />} />
                                <Legend />

                                {/* Amount */}
                                <Area
                                    type="monotone"
                                    dataKey="total_amount"
                                    name="Total Amount"
                                    strokeWidth={2}
                                    fillOpacity={0.25}
                                />

                                {/* Cases */}
                                <Area
                                    type="monotone"
                                    dataKey="total_cases"
                                    name="Total Cases"
                                    strokeWidth={2}
                                    fillOpacity={0.15}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerCareRefunds;
